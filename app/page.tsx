'use client';
import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { FlipWords } from "@/components/ui/flip-words";
import { Spotlight } from "@/components/Spotlight";
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import { Progress } from "@/components/ui/progress";
import { Toast, ToastAction, ToastProvider } from "@/components/ui/toast";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const fetch = require('node-fetch');

export default function Home() {
  const [qrCodeImage, setQRCodeImage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState({ title: '', description: '' });
  const [mode, setMode] = useState('dark');
  const [inputText, setInputText] = useState('');

  useEffect(() => {
    let timer: string | number | NodeJS.Timeout | undefined;
    if (isLoading) {
      setProgress(0);
      timer = setInterval(() => {
        setProgress((prevProgress) => {
          if (prevProgress >= 100) {
            clearInterval(timer);
            return 100;
          }
          return prevProgress + 1;
        });
      }, 50);
    }
    return () => {
      clearInterval(timer);
    };
  }, [isLoading]);

  const generateQRCode = useCallback(async (inputTextValue: string) => {
    setIsLoading(true);

    const url = 'https://qrcode3.p.rapidapi.com/qrcode/text';
    const options = {
      method: 'POST',
      headers: {
        'x-rapidapi-key': process.env.NEXT_PUBLIC_RAPID_API_KEY,
        'x-rapidapi-host': process.env.NEXT_PUBLIC_RAPID_API_HOST,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        data: inputTextValue,
        style: {
          module: {
            color: mode === 'dark' ? 'white' : 'black',
            shape: 'default'
          },
          inner_eye: { shape: 'default' },
          outer_eye: { shape: 'default' },
          background: {}
        },
        size: {
          width: 200,
          quiet_zone: 4,
          error_correction: 'M'
        },
        output: {
          filename: 'qrcode',
          format: 'png'
        }
      })
    };

    try {
      const response = await fetch(url, options);
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      setQRCodeImage(objectUrl);
      setToastMessage({ title: 'QR Code Generated', description: 'Your QR code has been successfully generated.' });
      setShowToast(true);
    } catch (error) {
      console.error(error);
      setToastMessage({ title: 'Error', description: 'Failed to generate QR code. Please try again.' });
      setShowToast(true);
    } finally {
      setIsLoading(false);
    }
  }, [mode]);

  const placeholders = [
    "Enter your website URL",
    "Enter your product link",
    "Enter your github link",
    "Enter your social media handle",
    "Enter your facebook page",
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const inputTextValue = (e.currentTarget.elements[0] as HTMLInputElement).value;
    setInputText(inputTextValue);
    generateQRCode(inputTextValue);
  };

  const downloadQRCode = () => {
    if (qrCodeImage) {
      const link = document.createElement("a");
      link.href = qrCodeImage;
      link.download = "qrcode.png";
      link.click();
    }
  };

  const words = ["Websites", "Products", "Contacts", "Events"];

  return (
    <ToastProvider>
      <div className={`relative flex min-h-screen flex-col ${mode === 'dark' ? 'bg-black' : 'bg-white'}`}>
        <div className="flex-1 px-5 py-24">
          <Alert className="mb-4 py-4">
            <AlertTitle>Notice</AlertTitle>
            <AlertDescription>
              If the API limit is exceeded, QR codes won&apos;t be generated. Please try again later.
            </AlertDescription>
          </Alert>

          <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill={mode === 'dark' ? 'blue' : 'black'} />
          <div className="mb-20">
            <div className="flex justify-center items-center px-4">
              <div className={`pt-10 text-5xl mx-auto font-normal ${mode === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}`}>
                Generate QR codes for your
                <div className="hidden lg:block">
                  <FlipWords words={words} />
                  <br />
                </div>
                <div className="lg:hidden">using QRGen-v1</div>
              </div>
            </div>
          </div>
          <PlaceholdersAndVanishInput
            placeholders={placeholders}
            onChange={handleChange}
            onSubmit={onSubmit}
          />
          {isLoading && (
            <div className="mt-4">
              <Progress value={progress} className="h-2 w-1/2 mx-auto" />
            </div>
          )}
          {qrCodeImage && (
            <div className={`mt-8 pb-10 items-center justify-center rounded-md border ${mode === 'dark' ? 'border-gray-800 bg-gradient-to-b from-gray-950 to-black' : 'border-gray-200 bg-white'} px-3 py-2`}>
              <div className="mt-8 flex flex-col items-center justify-center">
                <Image src={qrCodeImage} alt="QR Code" width={200} height={200} />
                <button
                  onClick={downloadQRCode}
                  className={`px-6 py-3 group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-md font-medium ${mode === 'dark' ? 'text-neutral-200' : 'text-neutral-600'} duration-500`}
                >
                  <div className={`translate-y-0 opacity-100 group-hover:-translate-y-[150%] group-hover:opacity-0 animate-shimmer items-center justify-center rounded-full ${mode === 'dark' ? 'border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] text-slate-400' : 'border-gray-300 bg-[linear-gradient(110deg,#ffffff,45%,#f0f0f0,55%,#ffffff)] bg-[length:200%_100%] text-gray-600'} px-6 py-3 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${mode === 'dark' ? 'focus:ring-slate-400 focus:ring-offset-slate-50' : 'focus:ring-gray-400 focus:ring-offset-white'}`}>
                    Download
                  </div>
                  <div className={`animate-shimmer items-center justify-center rounded-full ${mode === 'dark' ? 'border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] text-slate-400' : 'border-gray-300 bg-[linear-gradient(110deg,#ffffff,45%,#f0f0f0,55%,#ffffff)] bg-[length:200%_100%] text-gray-600'} px-6 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 ${mode === 'dark' ? 'focus:ring-slate-400 focus:ring-offset-slate-50' : 'focus:ring-gray-400 focus:ring-offset-white'} absolute translate-y-[150%] opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100`}>
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 15 15"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                    >
                      <path
                        d="M7.5 2C7.77614 2 8 2.22386 8 2.5L8 11.2929L11.1464 8.14645C11.3417 7.95118 11.6583 7.95118 11.8536 8.14645C12.0488 8.34171 12.0488 8.65829 11.8536 8.85355L7.85355 12.8536C7.75979 12.9473 7.63261 13 7.5 13C7.36739 13 7.24021 12.9473 7.14645 12.8536L3.14645 8.85355C2.95118 8.65829 2.95118 8.34171 3.14645 8.14645C3.34171 7.95118 3.65829 7.95118 3.85355 8.14645L7 11.2929L7 2.5C7 2.22386 7.22386 2 7.5 2Z"
                        fill="currentColor"
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                  </div>
                </button>

                <span className={`mt-4 ${mode === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}`}>
                  Made&nbsp;with&nbsp;❤️&nbsp;by&nbsp;<a className="cursor-pointer hover:underline transition-all hover:text-blue-400" target="_blank" href="https://john-porfolio.vercel.app">John&nbsp;Paul</a>
                </span>
              </div>
            </div>
          )}

          <div className={`mt-20 rounded-md flex flex-col antialiased ${mode === 'dark' ? 'bg-black bg-grid-white/[0.05]' : 'bg-white'} items-center justify-center relative overflow-hidden`}>
            <InfiniteMovingCards
              items={testimonials}
              direction="right"
              speed="slow"
              className="w-full"
            />
          </div>
        </div>
        <Toast
          open={showToast}
          onOpenChange={setShowToast}
          variant="default"
          {...toastMessage}
          duration={5000}
        />
        <div className="fixed bottom-4 right-4">
          <Switch
            id="mode-toggle"
            checked={mode === 'dark'}
            onCheckedChange={(checked) => {
              setMode(checked ? 'dark' : 'light');
              generateQRCode(inputText);
            }}
          />
        </div>
      </div>
    </ToastProvider>
  );
}

const testimonials = [
  {
    quote:
      "QRGen has revolutionized the way we share information. It's so easy to create QR codes for our website and products. Our customers love it!",
    name: "John Miller",
    title: "Marketing Manager",
  },
  {
    quote:
      "I've been using QRGen for my personal brand, and it has made sharing my contact information and social media profiles a breeze. Highly recommended!",
    name: "Jane Smith",
    title: "Influencer",
  },
  {
    quote: "QRGen has been a game-changer for our events. We can now easily share event details and registrations with our attendees. It's a must-have tool!",
    name: "Mark Johnson",
    title: "Event Organizer",
  },
  {
    quote:
      "As a small business owner, QRGen has helped me streamline my operations. I can now quickly generate QR codes for my products and promotions!.",
    name: "Sarah Davis",
    title: "Entrepreneur",
  },
  {
    quote:
      "QRGen is an essential tool for anyone looking to enhance their digital presence. The ability to create custom QR codes has opened up new possibilities!.",
    name: "Michael Brown",
    title: "Digital Marketer",
  },
];