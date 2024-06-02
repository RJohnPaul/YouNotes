'use client';
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { FlipWords } from "@/components/ui/flip-words";
import { Spotlight } from "@/components/Spotlight";
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";

const fetch = require('node-fetch');

export default function Home() {
  const [qrCodeImage, setQRCodeImage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    if (isLoading) {
      const timer = setInterval(() => {
        setProgress((prevProgress) => {
          if (prevProgress >= 100) {
            clearInterval(timer);
            return 100;
          }
          return prevProgress + 10;
        });
      }, 500);

      return () => {
        clearInterval(timer);
      };
    }
  }, [isLoading]);

  const placeholders = [
    "Enter your website URL",
    "Enter your product link",
    "Enter your github link",
    "Enter your social media handle",
    "Enter your facebook page",
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const inputText = (e.currentTarget.elements[0] as HTMLInputElement).value;

    setIsLoading(true);
    setProgress(0);

    const url = 'https://qrcode3.p.rapidapi.com/qrcode/text';
    const options = {
      method: 'POST',
      headers: {
        'x-rapidapi-key': process.env.NEXT_PUBLIC_RAPID_API_KEY,
        'x-rapidapi-host': process.env.NEXT_PUBLIC_RAPID_API_HOST,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        data: inputText,
        style: {
          module: {
            color: 'white',
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
      toast({
        variant: "default",
        title: "QR Code Generated",
        description: "Your QR code has been successfully generated.",
        action: <ToastAction altText="View QR Code" onClick={() => window.open(objectUrl, "_blank")}>View</ToastAction>,
        duration: 5000,
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: "default",
        title: "Error",
        description: "Failed to generate QR code. Please try again.",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
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
    <div className="absolute inset-0 -z-10 h-full w-full items-center px-5 py-24">
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="blue"
      />
      <div className="mb-20">
        <div className="flex justify-center items-center px-4">
          <div className="text-5xl mx-auto font-normal text-neutral-600 dark:text-neutral-400">
            Generate QR codes for your
            <FlipWords words={words} /><br />
            using QRGen
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
        <div className="mt-8 pb-10 items-center justify-center rounded-md border border-gray-800 bg-gradient-to-b from-gray-950 to-black px-3 py-2">
          <div className="mt-8 flex flex-col items-center justify-center">
            <Image src={qrCodeImage} alt="QR Code" width={200} height={200} />
            <Button onClick={downloadQRCode} className="mt-4">Download QR Code</Button>
          </div>
        </div>
      )}

      <div className="mt-20 rounded-md flex flex-col antialiased bg-white dark:bg-black dark:bg-grid-white/[0.05] items-center justify-center relative overflow-hidden">
        <InfiniteMovingCards
          items={testimonials}
          direction="right"
          speed="slow"
          className="w-full md:w-2/3 lg:w-1/2 xl:w-full"
        />
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
      "As a small business owner, QRGen has helped me streamline my operations. I can now quickly generate QR codes for my products and promotions. It's saved me so much time!",
    name: "Sarah Davis",
    title: "Entrepreneur",
  },
  {
    quote:
      "QRGen is an essential tool for anyone looking to enhance their digital presence. The ability to create custom QR codes has opened up new possibilities for our marketing campaigns.",
    name: "Michael Brown",
    title: "Digital Marketer",
  },
];