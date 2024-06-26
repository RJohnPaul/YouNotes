"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from 'next/image';
import { cn } from "../../utils/cn";

type Tab = {
  title: string;
  image: string;
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
      title: "Product",
      image: "/path-to-product-image.png",
    },
    {
      title: "Services",
      image: "/path-to-services-image.png",
    },
    {
      title: "About",
      image: "/path-to-about-image.png",
    },
  ];

  return (
    <div className="flex flex-col items-center">
      <div
        className={cn(
          "relative flex flex-wrap items-center justify-center mb-4",
          containerClassName
        )}
      >
        {tabs.map((tab, index) => (
          <button
            key={tab.title}
            onClick={() => setActiveIdx(index)}
            className={cn(
              "group relative z-[1] rounded-full px-4 py-2",
              { "z-0": activeIdx === index },
              tabClassName
            )}
          >
            {activeIdx === index && (
              <motion.div
                layoutId="clicked-button"
                transition={{ duration: 0.2 }}
                className={cn(
                  "absolute inset-0 rounded-full bg-white",
                  activeTabClassName
                )}
              />
            )}

            <span
              className={cn(
                "relative text-sm block font-medium duration-200",
                activeIdx === index ? "text-black delay-100" : "text-white"
              )}
            >
              {tab.title}
            </span>
          </button>
        ))}
      </div>
      <div className="mt-4 rounded-lg overflow-hidden relative w-[300px] h-[300px]">
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
              className="rounded-lg"
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}