import React from "react";
import { Footer } from "@/components/layout";
import Header from "@/components/layout/header/Header";
import { Toaster } from "sonner";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col justify-center items-center">
      <Toaster />
      <Header />
      {children}
      <Footer />
    </div>
  );
}
