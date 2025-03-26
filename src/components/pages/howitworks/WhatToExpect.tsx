"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface ExpectationCard {
  id: number;
  title: string;
  image: string;
}

const expectations: ExpectationCard[] = [
  {
    id: 1,
    title: "Confidentiality & Privacy",
    image: "/images/HowItWorks/secret-file.png",
  },
  {
    id: 2,
    title: "Empathy & Compassion",
    image: "/images/HowItWorks/empathy.png",
  },
  {
    id: 3,
    title: "Expert Guidance",
    image: "/images/HowItWorks/expert.png",
  },
  {
    id: 4,
    title: "Flexible Support",
    image: "/images/HowItWorks/responsibility.png",
  },
  {
    id: 5,
    title: "Resources & Referrals",
    image: "/images/HowItWorks/resources.png",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

export default function WhatToExpect() {
  return (
    <section className="w-full py-12 md:py-24">
      <div className="container px-4 md:px-6 mx-auto">
        <h2 className="text-2xl font-bold text-center text-violet mb-12">
          What to Expect From Us
        </h2>

        <motion.div
          className="grid grid-cols-2 md:grid-cols-5 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          viewport={{ once: true }}
        >
          {expectations.map((card) => (
            <motion.div
              key={card.id}
              className="flex flex-col items-center"
              variants={itemVariants}
            >
              <div className="rounded-2xl p-1 mb-4 w-full">
                <div className="relative w-full rounded-xl flex items-center justify-center">
                  <Image
                    src={card.image}
                    alt={card.title}
                    className="object-cover w-fit"
                    width={50}
                    height={50}
                  />
                </div>
              </div>
              <h3 className="text-center text-sm font-medium text-muted-foreground">
                {card.title}
              </h3>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
