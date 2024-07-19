'use client';
import React, { useState, useEffect } from "react";
import { Session } from '@supabase/supabase-js';
import { supabase } from './supabaseClient';
import { Spotlight } from "@/components/Spotlight";
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import ReactMarkdown from 'react-markdown';
import { AnimatedTabs } from "@/components/ui/animated-tabs";
import { Textarea } from "@/components/ui/textarea";
import remarkGfm from 'remark-gfm';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Highlight } from "@/components/ui/hero-highlight";
import { motion } from "framer-motion";
const { GoogleGenerativeAI } = require("@google/generative-ai");
import { BentoGrid, BentoGridItem } from "../components/ui/bento-grid";
import { footer } from "../components/component/footer"
import AuthForm from "./AuthForm";
import {
  IconClipboardCopy,
  IconFileBroken,
  IconSignature,
  IconTableColumn,
  IconArrowWaveRightUp,
  IconBoxAlignTopLeft,
  IconBoxAlignRightFilled,
  IconNote,
  IconBrain,
  IconBook2,
  IconClock,
  IconFileText,
  IconSettings,
  IconApps
} from '@tabler/icons-react';

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GOOGLE_API_KEY);

const MAX_TOKENS = 1000;
const MAX_FREE_USES = 2;

export default function Home() {
  const [transcript, setTranscript] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [remainingTokens, setRemainingTokens] = useState(MAX_TOKENS);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();
  const [session, setSession] = useState<Session | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [useCount, setUseCount] = useState(0);
  const [showAuthForm, setShowAuthForm] = useState(false);

  useEffect(() => {
    const storedCount = localStorage.getItem('useCount');
    if (storedCount) {
      setUseCount(parseInt(storedCount, 10));
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        setUserName(session.user.email || session.user.user_metadata.full_name || 'User');
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        setUserName(session.user.email || session.user.user_metadata.full_name || 'User');
      } else {
        setUserName(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (loading) {
      const timer = setInterval(() => {
        setProgress((prevProgress) => {
          if (prevProgress >= 100) {
            clearInterval(timer);
            return 100;
          }
          return prevProgress + 1;
        });
      }, 50);

      return () => {
        clearInterval(timer);
      };
    }
  }, [loading]);

  const incrementUseCount = () => {
    const newCount = useCount + 1;
    setUseCount(newCount);
    localStorage.setItem('useCount', newCount.toString());
  };

  const handleTranscriptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setTranscript(value);
    const tokens = value.split(/\s+/).length;
    setRemainingTokens(MAX_TOKENS - tokens);
  };

  const handleYoutubeUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setYoutubeUrl(e.target.value);
  };

  const handleGenerateNotes = async (source: 'transcript' | 'youtube') => {
    if (!session && useCount >= MAX_FREE_USES) {
      toast({
        title: 'Free use limit exceeded',
        description: 'Please register to continue using the service.',
        variant: 'destructive',
      });
      setShowAuthForm(true);
      return;
    }

    if (source === 'transcript' && remainingTokens < 0) {
      toast({
        title: 'Token limit exceeded',
        description: 'You have exceeded the maximum token limit. Please reduce the transcript length.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);
      setProgress(0);

      let textToProcess = '';

      if (source === 'youtube') {
        // Fetch transcript from YouTube URL
        const url = 'https://youtubetranscriptdownloader.p.rapidapi.com/dev';
        const options = {
          method: 'POST',
          headers: {
            'x-rapidapi-key': process.env.NEXT_PUBLIC_RAPID_API_KEY || '',
            'x-rapidapi-host': 'youtubetranscriptdownloader.p.rapidapi.com',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ url: youtubeUrl }),
        };

        const rapidApiResponse = await fetch(url, options);

        if (rapidApiResponse.ok) {
          const rapidApiResult = await rapidApiResponse.json();
          const transcriptUrl = rapidApiResult.body.match(/"Transcript URL: (.*?)"/)[1];

          const transcriptResponse = await fetch(transcriptUrl);
          textToProcess = await transcriptResponse.text();
        } else {
          throw new Error('Failed to fetch YouTube transcript');
        }
      } else {
        textToProcess = transcript;
      }

      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `Please generate notes from the following transcript:\n\n${textToProcess}`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = await response.text();

      incrementUseCount();
      setNotes(text.trim());
      setTranscript('');
      setYoutubeUrl('');
      setRemainingTokens(MAX_TOKENS);
      setLoading(false);
      toast({
        title: 'Notes generated successfully!',
        description: 'The notes have been generated based on the provided input.',
        variant: 'default',
      });
    } catch (error) {
      setNotes('An error occurred while generating notes. Please check the input and try again.');
      setLoading(false);
      toast({
        title: 'Error generating notes',
        description: 'An error occurred while generating notes. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(notes);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: 'Notes copied to clipboard!',
      description: 'The generated notes have been copied to your clipboard.',
      variant: 'default',
    });
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setUserName(null);
  };

  const items = [
    {
      title: "Effortless Note-Taking",
      description: "Transform YouTube videos and transcripts into concise notes with ease.",
      header: <IconNote className="h-8 w-8 text-blue-500" />,
      icon: <IconClipboardCopy className="h-4 w-4 text-neutral-500" />,
    },
    {
      title: "AI-Powered Goodness",
      description: "Harness the power of AI to create accurate and meaningful summaries.",
      header: <IconBrain className="h-8 w-8 text-purple-500" />,
      icon: <IconFileBroken className="h-4 w-4 text-neutral-500" />,
    },
    {
      title: "Streamlined Learning",
      description: "Enhance your study process with organized and accessible notes.",
      header: <IconBook2 className="h-8 w-8 text-green-500" />,
      icon: <IconSignature className="h-4 w-4 text-neutral-500" />,
    },
    {
      title: "Time-Saving",
      description: "Save hours of manual note-taking with our automated system.",
      header: <IconClock className="h-8 w-8 text-red-500" />,
      icon: <IconTableColumn className="h-4 w-4 text-neutral-500" />,
    },
    {
      title: "Versatile Content Processing",
      description: "Handle various input formats, from text transcripts to YouTube URLs.",
      header: <IconFileText className="h-8 w-8 text-yellow-500" />,
      icon: <IconArrowWaveRightUp className="h-4 w-4 text-neutral-500" />,
    },
    {
      title: "Customizable Output",
      description: "Tailor your notes to your specific needs and preferences.",
      header: <IconSettings className="h-8 w-8 text-indigo-500" />,
      icon: <IconBoxAlignTopLeft className="h-4 w-4 text-neutral-500" />,
    },
    {
      title: "Seamless Integration",
      description: "Easily incorporate YouNotes into your existing workflow and tools.",
      header: <IconApps className="h-8 w-8 text-pink-500" />,
      icon: <IconBoxAlignRightFilled className="h-4 w-4 text-neutral-500" />,
    },
  ];

  const testimonials = [
    {
      quote: "YouNotes has transformed my study habits. I can now quickly generate concise notes from lengthy lecture videos on YouTube. It's a game-changer for online learning!",
      name: "Emily Wong",
      title: "University Student",
    },
    {
      quote: "As a researcher, I often work with long interview transcripts. YouNotes helps me distill key points effortlessly, saving me hours of manual note-taking.",
      name: "Dr.James Wilson",
      title: "Academic Researcher",
    },
    {
      quote: "YouNotes has been invaluable for our content team. We can quickly summarize webinars and podcasts, making it easier to create derivative content. It's boosted our productivity significantly!",
      name: "Sofia Rodriguez",
      title: "Content Marketing Manager",
    },
    {
      quote: "I use YouNotes to keep up with industry talks and conferences. It allows me to extract the most important information from hours of video content. An essential tool for continuous learning!",
      name: "James Patel",
      title: "Software Engineer",
    },
    {
      quote: "As a journalist, I often need to review long interviews. YouNotes helps me quickly generate summaries, allowing me to focus on crafting compelling stories. It's become an indispensable part of my workflow.",
      name: "Laurel Thompson",
      title: "Investigative Journalist",
    },
  ];

  if (showAuthForm) {
    return <AuthForm />;
  }

  return (
    <>
      <div className="bg-black min-h-screen">
        {session && (
          <div className="fixed top-0 right-0 m-4 z-50">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-300">
                {userName}
              </span>
              <button
                onClick={handleSignOut}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        )}

        <div className="pt-20 pb-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: [20, -5, 0] }}
            transition={{ duration: 0.2, ease: [0.4, 0.0, 0.2, 1] }}
            className="text-2xl px-4 md:text-4xl lg:text-5xl font-bold text-white max-w-4xl leading-relaxed lg:leading-snug text-center mx-auto"
          >
            With YouNotes, Everything is possible. Everything is{" "}
            <Highlight className="text-white">
              A&nbsp;Click&nbsp;Away.
            </Highlight>
          </motion.h1>
        </div>

        <div className="flex justify-center items-center py-12 px-4 md:px-6 lg:px-8">
          <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="green" />
          <Card className="w-full max-w-3xl shadow-lg rounded-lg">
            <CardHeader className="bg-gray-900 text-white py-6 rounded-t-lg md:px-8 items-center justify-center border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl font-bold">YouNotes</CardTitle>
              </div>
              <CardDescription className="text-gray-400 mt-2">
                Generate notes from a transcript or YouTube video.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 md:p-8 lg:p-10 space-y-6 bg-black shadow-2xl shadow-emerald-500/40">
              <Tabs defaultValue="transcript" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="transcript">Transcript</TabsTrigger>
                  <TabsTrigger value="youtube">YouTube</TabsTrigger>
                </TabsList>
                <TabsContent value="transcript">
                  <Textarea
                    value={transcript}
                    onChange={handleTranscriptChange}
                    placeholder="Enter the transcript text here..."
                    className="w-full border border-gray-800 bg-gray-950/50 text-gray-200 rounded-md p-4 focus:outline-none focus:ring-2 focus:ring-gray-800/50 focus:border-transparent"
                  />
                  <div className="flex justify-between items-center mt-4">
                    <p className="text-sm text-gray-500">
                      Remaining Tokens: {remainingTokens} / {MAX_TOKENS}</p>
                    <button onClick={() => handleGenerateNotes('transcript')} className="bg-slate-800 no-underline group cursor-pointer relative shadow-2xl shadow-zinc-900 rounded-lg p-px text-xs font-semibold leading-6  text-white inline-block">
                      <span className="absolute inset-0 overflow-hidden rounded-lg">
                        <span className="absolute inset-0 rounded-lg bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(56,189,248,0.6)_0%,rgba(56,189,248,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                      </span>
                      <div className="relative flex space-x-2 items-center z-10 rounded-lg bg-zinc-950 py-0.5 px-4 ring-1 ring-white/10 ">
                        <span>
                          Generate
                        </span>
                        <svg
                          fill="none"
                          height="16"
                          viewBox="0 0 24 24"
                          width="16"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M10.75 8.75L14.25 12L10.75 15.25"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.5"
                          />
                        </svg>
                      </div>
                      <span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-emerald-400/0 via-emerald-400/90 to-emerald-400/0 transition-opacity duration-500 group-hover:opacity-40" />
                    </button>
                  </div>
                </TabsContent>
                <TabsContent value="youtube">
                  <input
                    value={youtubeUrl}
                    onChange={handleYoutubeUrlChange}
                    placeholder="Enter the YouTube URL here..."
                    className="w-full bg-gray-950/50 text-gray-200 rounded-md p-4 focus:outline-none focus:ring-2 focus:ring-gray-800/50 focus:border-transparent"
                  />
                  <div className="flex justify-end mt-4">
                    <button onClick={() => handleGenerateNotes('youtube')} className="bg-slate-800 no-underline group cursor-pointer relative shadow-2xl shadow-zinc-900 rounded-lg p-px text-xs font-semibold leading-6  text-white inline-block">
                      <span className="absolute inset-0 overflow-hidden rounded-lg">
                        <span className="absolute inset-0 rounded-lg bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(56,189,248,0.6)_0%,rgba(56,189,248,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                      </span>
                      <div className="relative flex space-x-2 items-center z-10 rounded-lg bg-zinc-950 py-0.5 px-4 ring-1 ring-white/10 ">
                        <span>
                          Generate
                        </span>
                        <svg
                          fill="none"
                          height="16"
                          viewBox="0 0 24 24"
                          width="16"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M10.75 8.75L14.25 12L10.75 15.25"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.5"
                          />
                        </svg>
                      </div>
                      <span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-emerald-400/0 via-emerald-400/90 to-emerald-400/0 transition-opacity duration-500 group-hover:opacity-40" />
                    </button>
                  </div>
                </TabsContent>
              </Tabs>
              {loading && (
                <div className="mt-4">
                  <Progress value={progress} />
                </div>
              )}
              {notes && (
                <div className="mt-8 p-6 md:p-8 lg:p-6 space-y-6 animate-shimmer items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Generated Notes</h3>
                    <button onClick={copyToClipboard} className="bg-slate-800 no-underline group cursor-pointer relative shadow-2xl shadow-zinc-900 rounded-full p-px text-xs font-semibold leading-6 text-white inline-block">
                      <span className="absolute inset-0 overflow-hidden rounded-full">
                        <span className="absolute inset-0 rounded-full bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(56,189,248,0.6)_0%,rgba(56,189,248,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                      </span>
                      <div className="relative flex space-x-2 items-center z-10 rounded-full bg-zinc-950 py-0.5 px-4 ring-1 ring-white/10">
                        <span>
                          {copied ? 'Copied!' : 'Copy'}
                        </span>
                        <svg
                          fill="none"
                          height="16"
                          viewBox="0 0 24 24"
                          width="16"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M10.75 8.75L14.25 12L10.75 15.25"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.5"
                          />
                        </svg>
                      </div>
                      <span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-emerald-400/0 via-emerald-400/90 to-emerald-400/0 transition-opacity duration-500 group-hover:opacity-40" />
                    </button>
                  </div>
                  <ReactMarkdown remarkPlugins={[remarkGfm]} className="prose prose-invert max-w-none">
                    {notes}
                  </ReactMarkdown>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <AnimatedTabs />

        <BentoGrid className="max-w-7xl mx-auto mt-20 px-4">
          {items.map((item, i) => (
            <BentoGridItem
              key={i}
              title={item.title}
              description={item.description}
              header={item.header}
              icon={item.icon}
              className={i === 3 || i === 6 ? "md:col-span-2" : ""}
            />
          ))}
        </BentoGrid>

        <div className="mt-20 rounded-md flex flex-col antialiased bg-black items-center justify-center relative overflow-hidden">
          <InfiniteMovingCards
            items={testimonials}
            direction="right"
            speed="slow"
          />
        </div>
      </div>
      <div className="mt-40">
        {footer()}
      </div>
    </>
  );
}