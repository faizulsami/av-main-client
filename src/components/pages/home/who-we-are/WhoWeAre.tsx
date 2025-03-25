"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import ArrowHand from "@/components/buttons/ArrowHand";

interface WhoWeAreProps {
  image: string;
  altImg: string;
  title: string;
  subtitle: string;
  description: string;
  extendedDescription?: string;
  buttonText: string;
  onLearnMore?: () => void;
}

const whoWeAreData: WhoWeAreProps = {
  image: "/images/who-we-are.png",
  altImg: "why choose us?",
  title: "why choose us?",
  subtitle: "Committed to Your Mental Wellness with Compassionate Care",
  description:
    "At Anonymous Voice, we believe that every voice deserves to be heard, especially when it comes to mental health. We are dedicated to creating a safe, supportive space where individuals can seek guidance, share their experiences, and find solace without judgment.",
  extendedDescription:
    "Our team of compassionate professionals is committed to providing personalized mental health services that prioritize your unique journey. We understand that reaching out for help can be daunting, which is why we focus on creating a comfortable and confidential environment.",
  buttonText: "Learn More",
  onLearnMore: () => {},
};

export default function WhoWeAre() {
  const {
    image,
    altImg,
    title,
    description,
    extendedDescription,
    buttonText,
    onLearnMore,
  } = whoWeAreData;

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  return (
    <section className="relative w-full mx-auto mt-10 py-12 space-y-10 px-4 overflow-hidden">
      {/* Chat Icon - Only visible on larger screens */}
      <motion.div
        className="absolute top-1 right-1 before:p-1 rounded-full"
        initial="initial"
        animate="animate"
        variants={fadeIn}
        transition={{ delay: 0.8, duration: 0.5, ease: "easeInOut" }}
      >
        <Image
          src={"/images/icons/chat-bubble-icon.png"}
          alt="Chat Bubble Icon"
          width={36}
          height={36}
        />
      </motion.div>

      {/* Main Content Container */}
      <div className="flex flex-col lg:flex-row items-end lg:space-x-12 gap-4">
        {/* Image Container */}
        <motion.div
          className="relative w-full lg:w-1/3 aspect-[4/2] lg:aspect-[9/9] max-w-2xl rounded-2xl overflow-hidden bg-violet-200 p-2"
          {...fadeIn}
        >
          <Image
            src={image}
            alt={altImg}
            className="object-cover"
            fill
            priority
          />
        </motion.div>

        {/* Text Content Container */}
        <div className="flex-1 space-y-4 lg:w-2/3">
          <motion.h2
            className="text-xl sm:text-2xl font-bold text-violet text-center lg:text-left"
            {...fadeIn}
            transition={{ delay: 0.2 }}
          >
            {title}
          </motion.h2>

          <motion.h3
            className="text-xl sm:text-2xl font-bold text-soft-paste-dark text-center lg:text-left"
            {...fadeIn}
            transition={{ delay: 0.3 }}
          >
            {/* {subtitle} */}
            <p>
              Committed to Your Mental <br /> Wellness with Compassionate Care
            </p>
          </motion.h3>

          <motion.p
            className="text-sm text-center lg:text-left text-muted-foreground font-normal"
            {...fadeIn}
            transition={{ delay: 0.4 }}
          >
            {description}
          </motion.p>

          <motion.p
            className="text-sm text-center lg:text-left text-muted-foreground font-normal"
            {...fadeIn}
            transition={{ delay: 0.5 }}
          >
            {extendedDescription}
          </motion.p>

          <motion.div
            className="flex justify-center lg:justify-start"
            {...fadeIn}
            transition={{ delay: 0.6 }}
          >
            <Button
              onClick={onLearnMore}
              className="bg-soft-paste text-white px-8 py-2 rounded-lg transition-colors"
            >
              {buttonText}
              <ArrowHand />
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
