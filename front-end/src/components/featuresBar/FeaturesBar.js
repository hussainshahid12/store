"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const features = [
  {
    id: 1,
    title: "Free Shipping",
    description: "On orders over 5000",
    iconColor: "text-indigo-600",
    bgColor: "bg-indigo-50",
    icon: (
      <svg
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.2}
        stroke="currentColor"
        className="w-5 h-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.129-1.125V11.25c0-4.446-3.542-7.125-7.125-7.125H9.147L5.23 10.5M15 11.25V5.25l4.317 6H15Z"
        />
      </svg>
    ),
  },
  {
    id: 2,
    title: "Easy Returns",
    description: "30 days return policy",
    iconColor: "text-emerald-600",
    bgColor: "bg-emerald-50",
    icon: (
      <svg
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.2}
        stroke="currentColor"
        className="w-5 h-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3"
        />
      </svg>
    ),
  },
  {
    id: 3,
    title: "Secure Payment",
    description: "100% Protected",
    iconColor: "text-amber-600",
    bgColor: "bg-amber-50",
    icon: (
      <svg
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.2}
        stroke="currentColor"
        className="w-5 h-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
        />
      </svg>
    ),
  },
  {
    id: 4,
    title: "24/7 Support",
    description: "Always here to help",
    iconColor: "text-rose-600",
    bgColor: "bg-rose-50",
    icon: (
      <svg
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.303.025-.607.045-.911.059m-16.5 0a48.108 48.108 0 0 0-3.478-.397m-1.22-1.234A48.334 48.334 0 0 1 4.5 10.511m0 0c.9-2.783 3.503-4.473 6.473-4.473 2.97 0 5.572 1.69 6.473 4.473m-12.946 0c.284-.884 1.128-1.5 2.097-1.5h4.286c1.136 0 2.1.847 2.193 1.98.025.303.045.607.059.911m-9.446 0c0 .852.174 1.667.486 2.412m0 0L12 21.485l1.307-2.512m0 0a8.962 8.962 0 0 1 4.332-4.332M12 15.75a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
        />
      </svg>
    ),
  },
];

const FeaturesBar = () => {
  const [isClient, setIsClient] = useState(false);

  // Prevents hydration error by ensuring animations only run on client
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <section className="w-full bg-white border-y border-gray-100 py-10">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16">
        {/* - justify-center: centers the grid container if columns don't fill width
          - justify-items-center: centers the content inside each individual grid cell
        */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-12 justify-center justify-items-center">
          {features.map((feature) => (
            <motion.div
              key={feature.id}
              whileHover={{ y: -3 }}
              // w-fit ensures the div only takes up as much space as the content needs, keeping it centered
              className="flex flex-col items-center text-center lg:flex-row lg:text-left lg:items-center gap-4 group w-fit"
            >
              {/* Icon */}
              <div
                className={`flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 group-hover:scale-110 ${feature.bgColor} ${feature.iconColor}`}
              >
                {feature.icon}
              </div>

              {/* Text */}
              <div className="flex flex-col space-y-0.5">
                <span className="text-[12px] font-bold text-gray-900 uppercase tracking-widest leading-tight">
                  {feature.title}
                </span>
                <span className="text-[11px] text-gray-500 font-medium leading-tight">
                  {feature.description}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesBar;
