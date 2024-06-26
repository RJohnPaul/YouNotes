"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from 'next/image';
import { cn } from "../../utils/cn";

import productImage from '../../app/images/how.png';
import servicesImage from '../../app/images/whom.png';
import aboutImage from '../../app/images/why.png';

type Tab = {
  title: string;
  image: any;
};

type AnimatedTabsProps = {
  containerClassName?: string;
  activeTabClassName?: string;
  tabClassName?: string;
};

export function AnimatedTabs({
  containerClassName,
  activeTabClassName,
  tabClassName,
}: AnimatedTabsProps) {
  const [activeIdx, setActiveIdx] = useState<number>(0);

  const tabs: Tab[] = [
    {
      title: "How",
      image: productImage,
    },
    {
      title: "Whom",
      image: servicesImage,
    },
    {
      title: "Why",
      image: aboutImage,
    },
  ];

  return (
    <div className="flex flex-col items-center w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div
        className={cn(
          "relative flex flex-wrap items-center justify-center mb-4 space-x-2",
          containerClassName
        )}
      >
        {tabs.map((tab, index) => (
          <button
            key={tab.title}
            onClick={() => setActiveIdx(index)}
            className={cn(
              "group relative z-[1] rounded-full px-3 py-1.5 text-sm font-medium transition-colors duration-200",
              activeIdx === index 
                ? "text-white" 
                : "text-gray-400 hover:text-gray-300",
              tabClassName
            )}
          >
            {activeIdx === index && (
              <motion.div
                layoutId="active-pill"
                transition={{ duration: 0.3 }}
                className={cn(
                  "absolute inset-0 rounded-full bg-gray-800",
                  activeTabClassName
                )}
              />
            )}
            <span className="relative z-10">{tab.title}</span>
          </button>
        ))}
      </div>
      <div className="mt-4 rounded-xl overflow-hidden relative w-full aspect-video border border-gray-700/50">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIdx}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0"
          >
            <Image
              src={tabs[activeIdx].image}
              alt={tabs[activeIdx].title}
              layout="fill"
              objectFit="cover"
              className="rounded-xl"
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}