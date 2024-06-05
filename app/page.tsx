'use client';
import React, { useState, useCallback } from "react";
import Image from "next/image";
import { FlipWords } from "@/components/ui/flip-words";
import { Spotlight } from "@/components/Spotlight";
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Timeline, TimelineItem, TimelineSeparator, TimelineConnector, TimelineContent, TimelineDot } from '@mui/lab';

export default function Home() {
  const [qrCodeImage, setQRCodeImage] = useState("");
  const [inputText, setInputText] = useState('');

  const generateQRCode = useCallback((inputTextValue: string) => {
    const encodedText = encodeURIComponent(inputTextValue);
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodedText}&size=200x200`;
    setQRCodeImage(qrCodeUrl);
  }, []);

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

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
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
    <div className="relative flex min-h-screen flex-col bg-black">
      <div className="flex-1 px-5 py-24">
        <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="blue" />
        <div className="mb-20">
          <div className="flex justify-center items-center px-4">
            <div className="pt-10 mx-auto font-normal text-neutral-600">
              <h1 className="text-6xl font-bold mb-4">Generate QR codes for your</h1>
              <div className="hidden lg:block">
                <FlipWords words={words} className="text-5xl" />
                <br />
              </div>
              <div className="lg:hidden text-4xl">using QRGen-v1</div>
            </div>
          </div>
        </div>
        <PlaceholdersAndVanishInput 
          placeholders={placeholders}
          onChange={handleChange}
          onSubmit={onSubmit}
        />
        {qrCodeImage && (
          <div className="mt-8 pb-10 items-center justify-center rounded-md border border-gray-800 bg-gradient-to-b from-gray-950 to-black">
            <div className="mt-8 flex flex-col items-center justify-center">
              <div className="mb-4">
                <Image src={qrCodeImage} alt="QR Code" width={200} height={200} />
              </div>
              <button
                onClick={downloadQRCode}
                className="px-6 py-3 group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-md font-medium text-neutral-200 duration-500"
              >
                <div className="p-5 translate-y-0 opacity-100 group-hover:-translate-y-[150%] group-hover:opacity-0 animate-shimmer items-center justify-center rounded-full border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] text-slate-400 px-6 py-3 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400 focus:ring-offset-slate-50">
                  Download
                </div>
                <div className="animate-shimmer items-center justify-center rounded-full border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] text-slate-400 px-6 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400 focus:ring-offset-slate-50 absolute translate-y-[150%] opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100">
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
                      fillRule="evenodd"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </div>
              </button>

              <span className="mt-4 text-neutral-400">
                Made&nbsp;with&nbsp;❤️&nbsp;by&nbsp;<a className="cursor-pointer hover:underline transition-all hover:text-blue-400" target="_blank" href="https://john-porfolio.vercel.app">John&nbsp;Paul</a>
              </span>
            </div>
          </div>
        )}

        <div className="mt-20 rounded-md flex flex-col antialiased bg-black items-center justify-center relative overflow-hidden">
          <InfiniteMovingCards
            items={testimonials}
            direction="right"
            speed="slow"
            className="w-full"
          />
        </div>

        <div className="mt-10 rounded-md shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4 text-neutral-400">Updates</h2>
          <Timeline>
            <TimelineItem>
              <TimelineSeparator>
                <TimelineDot />
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent>
                <p className="text-neutral-500">RapidAPI implementation for generating QR codes.</p>
              </TimelineContent>
            </TimelineItem>
            <TimelineItem>
              <TimelineSeparator>
                <TimelineDot />
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent>
                <p className="text-neutral-500">Removed toasts, alerts, and Dark Mode Toggle.</p>
              </TimelineContent>
            </TimelineItem>
            <TimelineItem>
              <TimelineSeparator>
                <TimelineDot />
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent>
                <p className="text-neutral-500">Unlimited QR API implemented.</p>
              </TimelineContent>
            </TimelineItem>
            <TimelineItem>
              <TimelineSeparator>
                <TimelineDot />
              </TimelineSeparator>
              <TimelineContent>
                <p className="text-neutral-500">Changes in font styles.</p>  
              </TimelineContent>
            </TimelineItem>
          </Timeline>
        </div>
      </div>
    </div>
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
      "As a small business owner, QRGen has helped me streamline my operations. I can now quickly generate QR codes for my products and promotions!",
    name: "Sarah Davis",
    title: "Entrepreneur",
  },
  {
    quote:
      "QRGen is an essential tool for anyone looking to enhance their digital presence. The ability to create custom QR codes has opened up new possibilities!",
    name: "Michael Brown",
    title: "Digital Marketer",
  },
];