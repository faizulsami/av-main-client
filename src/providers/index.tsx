import { ReactNode } from "react";
import { Toaster } from "@/components/ui/toaster";
// import { SmoothScrollProvider } from "@/context/smooth-scroll";
import { TimerProvider } from "@/context/TimerContext";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <TimerProvider>
      <div>
        {/* <SmoothScrollProvider>{children}</SmoothScrollProvider> */}
        {children}
        <Toaster />
      </div>
    </TimerProvider>
  );
}
