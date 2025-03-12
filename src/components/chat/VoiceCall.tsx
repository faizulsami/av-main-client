/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";

import { PhoneOff } from "lucide-react";
import React from "react";

interface VoiceCallProps {
  onEndCall: () => void;
}

export const VoiceCall: React.FC<VoiceCallProps> = ({ onEndCall }) => {
  return (
    <div className="fixed bottom-4 right-4 bg-background p-4 rounded-lg shadow-lg">
      <div className="flex items-center gap-4">
        <div className="flex flex-col">
          <span className="text-sm font-medium">Connected</span>
        </div>
        <Button
          variant="destructive"
          size="icon"
          onClick={onEndCall}
          className="rounded-full"
        >
          <PhoneOff className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
