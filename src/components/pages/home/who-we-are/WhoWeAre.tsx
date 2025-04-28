"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import ArrowHand from "@/components/buttons/ArrowHand";
import Link from "next/link";

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
  image: "/images/why choose us.svg",
  altImg: "why choose us?",
  title: "Why choose us?",
  subtitle: "Committed to Your Mental Wellness with Compassionate Care",
  description:
    "At Anonymous Voices, we believe that every voice deserves to be heard, especially when it comes to mental health. We are dedicated to creating a safe, supportive space where individuals can seek guidance, share their experiences, and find solace without judgment.",
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
    <section className="relative w-full mx-auto xl:py-8 space-y-10 px-4 overflow-hidden">
      {/* Chat Icon - Only visible on larger screens */}
      <motion.div
        className="absolute top-1 right-1 before:p-1 rounded-full"
        initial="initial"
        animate="animate"
        variants={fadeIn}
        transition={{ delay: 0.8, duration: 0.5, ease: "easeInOut" }}
      ></motion.div>

      {/* Main Content Container */}
      <div>
        <motion.h2
          className="text-2xl md:text-4xl font-bold text-violet mb-4 lg:mb-8 text-center"
          {...fadeIn}
          transition={{ delay: 0.2 }}
        >
          {title}
        </motion.h2>

        <div className="flex flex-col lg:flex-row items-start lg:space-x-12 gap-4">
          {/* Image Container */}
          <motion.div
            className="relative w-full lg:w-1/3 aspect-[4/2] lg:aspect-[9/9] max-w-2xl rounded-2xl overflow-hidden bg-violet-200 p-2"
            {...fadeIn}
          >
            <Image
              src={image}
              alt={altImg}
              className="object-cover md:block hidden"
              fill
              priority
            />
            <img
              src={image}
              alt={altImg}
              className="w-full h-40 md:hidden block"
            />
          </motion.div>

          {/* Text Content Container */}
          <div className="flex-1 space-y-4 ">
            <div className="">
              <div className="space-y-6 text-center lg:text-start w-full ">
                <h2 className="text-xl md:text-2xl font-bold text-soft-paste leading-tight">
                  Absolute Anonymity
                </h2>
                <p className="text-md opacity-60 leading-relaxed">
                  We place the utmost importance on your privacy. We don't store
                  phone calls, and chat history is automatically erased after
                  each session, ensuring a safe space.
                </p>
              </div>

              <div className="space-y-6 text-center lg:text-start w-full  mt-4">
                <h2 className="text-xl md:text-2xl font-bold text-soft-paste leading-tight">
                  Empathetic Listening
                </h2>
                <p className="text-md opacity-60 leading-relaxed">
                  Our trained volunteers are truly here to listen to what you
                  want to say and support you in finding comfort, clarity, and a
                  sense of understanding.
                </p>
              </div>

              <div className="space-y-6 text-center lg:text-start w-full  mt-4">
                <h2 className="text-xl md:text-2xl font-bold text-soft-paste leading-tight">
                  Non-judgmental Environment
                </h2>
                <p className="text-md opacity-60 leading-relaxed">
                  It’s a space where every expression is valued and respected,
                  allowing you to share your thoughts without fear or judgment.
                </p>
              </div>

              <div className="space-y-6 text-center lg:text-start w-full  mt-4">
                <h2 className="text-xl md:text-2xl font-bold text-soft-paste leading-tight">
                  Inclusive and Accessible
                </h2>
                <p className="text-md opacity-60 leading-relaxed">
                  Our platform is designed to be easy to use and accessible to
                  everyone, making it simple for anyone to reach out, regardless
                  of their situation.
                </p>
              </div>

              <div className="space-y-6 text-center lg:text-start w-full  mt-4">
                <h2 className="text-xl md:text-2xl font-bold text-soft-paste leading-tight">
                  Preventive Approach
                </h2>
                <p className="text-md opacity-60 leading-relaxed">
                  We provide people with a space to express their emotions
                  early, aiming to prevent escalating mental health challenges
                  down the road.
                </p>

                <div className="mt-4">
                  <Link href="/about">
                    <Button className="bg-soft-paste rounded-md">
                      Learn More
                      <ArrowHand />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
