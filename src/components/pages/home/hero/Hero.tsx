"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, MessageCircleMore, X } from "lucide-react";
import { SocialBar } from "./SocialBar";
import { motion } from "framer-motion";
// import { useRouter } from "next/navigation";

const buttonVariants = {
  hover: {
    scale: 1.05,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20,
    },
  },
  tap: {
    scale: 0.95,
  },
};

const textVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export type ActionType = "chat" | "quick-call" | "booking" | null;

interface ActionButtonProps {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  variant?: string;
  onClick?: () => void;
  actionType: ActionType;
  className?: string;
}

export default function Hero() {
  // const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Restore handleAction for chat button
  const handleAction = (actionType: ActionType) => {
    if (actionType === "chat") {
      // Uncomment and use router if needed
      // router.push(`/sessions?action=${actionType}`);
      window.location.href = `/sessions?action=${actionType}`;
    } else {
      setShowModal(true);
    }
  };

  // Simple Modal component
  const Modal = ({ open, onClose }: { open: boolean; onClose: () => void }) =>
    open ? (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
        <div className="bg-white rounded-lg shadow-lg p-8 relative max-w-xs w-full text-center">
          <button
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            onClick={onClose}
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
          <h2 className="text-lg font-bold mb-2 text-gray-800">
            Something new is coming
          </h2>
          <p className="text-gray-600">Stay tuned for updates!</p>
        </div>
      </div>
    ) : null;

  const ActionButton: React.FC<ActionButtonProps> = ({
    label,
    icon: Icon,
    variant = "bg-soft-paste",
    actionType,
    className,
  }) => (
    <motion.div
      variants={buttonVariants}
      whileHover="hover"
      whileTap="tap"
      className={`${className}`}
    >
      <Button
        className={`w-full ${variant} text-white font-bold`}
        onClick={() => handleAction(actionType)}
      >
        <Icon className="w-4 h-4 mr-2" />
        {label}
      </Button>
    </motion.div>
  );

  return (
    <>
      <section className="relative xl:min-h-[90vh] w-[calc(100vw)] lg:w-[calc(98.5vw)] xl:w-[calc(99vw)]  overflow-x-hidden flex justify-center items-center overflow-hidden bg-gradient-to-b from-purple-400 via-purple-300 to-blue-300 border">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/home-banner.webp"
            alt="A serene landscape representing mental health support"
            fill
            // width={1920}
            // height={1080}
            className="object-center w-full h-full overflow-hidden"
            loading="lazy"
          />
        </div>

        <div className="relative container mx-auto z-10 flex flex-col items-center justify-center text-center text-white py-20 px-4 w-full">
          <motion.h1
            variants={textVariants}
            initial="initial"
            animate="animate"
            className="mb-4 text-3xl font-bold md:text-5xl lg:text-6xl leading-relaxed"
          >
            Free your mind, Find your peace <br /> Welcome to a safe space
          </motion.h1>
          <motion.p
            variants={textVariants}
            initial="initial"
            animate="animate"
            className="mb-8 text-sm lg:max-w-3xl font-semibold"
          >
            {/* Take a step towards mental clarity and well-being in a supportive,
          peaceful environment.{" "}
          <span className="hidden lg:block">
            Start your journey with compassionate care, tailored to your unique
            needs.
          </span> */}
          </motion.p>

          <div className="flex items-center w-full gap-4 flex-row justify-center">
            <ActionButton
              label="Chat Now"
              icon={MessageCircleMore}
              actionType="chat"
            />
            <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
              <DropdownMenuTrigger asChild>
                <motion.div
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <Button className="w-full md:w-auto bg-violet text-white font-bold">
                    Make A Call
                    <ChevronDown className="w-4 h-4 ml-2" />
                  </Button>
                </motion.div>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-full md:w-auto space-y-2 py-3 px-2 font-bold bg-violet">
                <DropdownMenuItem className="p-0">
                  <ActionButton
                    label="Call Now"
                    icon={MessageCircleMore}
                    actionType="quick-call"
                    className="w-full"
                  />
                </DropdownMenuItem>

                <DropdownMenuItem className="p-0">
                  <ActionButton
                    label="Book A Call"
                    icon={MessageCircleMore}
                    actionType="booking"
                  />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="hidden lg:block mt-4">
            <p className="text-3xl">“Every story deserves a listener”</p>
          </div>
        </div>
        <SocialBar />
      </section>
      <Modal open={showModal} onClose={() => setShowModal(false)} />
    </>
  );
}
