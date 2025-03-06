"use client";

import type React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

export default function ComingSoonPage() {
  //   const [email, setEmail] = useState("");

  //   const handleSubmit = (e: React.FormEvent) => {
  //     e.preventDefault();
  //     // Handle email submission here
  //     console.log("Submitted email:", email);
  //     setEmail("");
  //   };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <div className="opacity-80">
          <Image
            src="/images/flowers.png"
            alt="Flowers"
            width={200}
            height={200}
            className="mx-auto"
          />
        </div>
        <h2 className="text-4xl md:text-5xl font-bold text-violet mb-4">
          Coming Soon
        </h2>
        <p className="text-soft-paste mb-8 max-w-md mx-auto text-lg">
          We&apos;re working hard to bring you something amazing. Stay tuned!
        </p>
        {/* <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto"
        >
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-grow"
          />
          <Button type="submit">Notify Me</Button>
        </form> */}
      </motion.div>
    </div>
  );
}
