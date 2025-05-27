"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { socket } from "@/lib/webrtc/socket";
import { WebRTCService } from "@/lib/webrtc/webrtc-service";
import { SOCKET_EVENTS } from "@/lib/webrtc/constants";
import { Mic, MicOff, PhoneOff } from "lucide-react";

interface CallRoomProps {
  params: {
    roomId: string;
  };
}

export default function CallRoom({ params }: CallRoomProps) {
  const [isMuted, setIsMuted] = useState(false);
  const [audioUnlocked, setAudioUnlocked] = useState(false);
  const webRTCRef = useRef<WebRTCService | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const router = useRouter();
  const { toast } = useToast();

  const logDebug = (msg: string) => {
    console.log(`[CallRoom] ${msg}`);
  };

  // Called when the iOS user taps "Unlock Audio"
  const handleUnlockAudio = () => {
    if (!audioRef.current) return;
    // Even though no srcObject is set yet, calling play() inside a user gesture “unlocks” iOS audio.
    audioRef.current
      .play()
      .then(() => {
        logDebug("🟢 Audio unlocked on iOS");
        setAudioUnlocked(true);
      })
      .catch((err) => {
        console.warn("🔴 Failed to unlock audio on iOS:", err);
      });
  };

  const handleEndCall = useCallback(() => {
    webRTCRef.current?.endCall();
    socket.emit(SOCKET_EVENTS.CALL_END, { roomId: params.roomId });
    router.push("/chat");
  }, [params.roomId, router]);

  useEffect(() => {
    webRTCRef.current = new WebRTCService({
      socket,
      onRemoteStream: (stream) => {
        logDebug("📥 Remote stream arrived");
        if (!audioRef.current) return;

        audioRef.current.srcObject = stream;
        logDebug(`🎧 Remote audio tracks count: ${stream.getAudioTracks().length}`);

        // Only call play() if we have already “unlocked” the audio with a user tap
        if (audioUnlocked) {
          const playPromise = audioRef.current.play();
          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                logDebug("🟢 Remote audio.play() succeeded");
              })
              .catch((error) => {
                console.warn("🔴 iOS autoplay error on remote stream:", error);
              });
          }
        } else {
          logDebug("⚠️ Skipping play() because audio is not unlocked yet");
        }
      },
      onError: (error) => {
        toast({
          title: "Call Error",
          description: error.message,
          variant: "destructive",
        });
        handleEndCall();
      },
    });

    socket.on(SOCKET_EVENTS.CALL_END, handleEndCall);

    return () => {
      webRTCRef.current?.endCall();
      socket.off(SOCKET_EVENTS.CALL_END);
    };
  }, [handleEndCall, toast, audioUnlocked]);

  const toggleMute = () => {
    const tracks = webRTCRef.current?.getLocalAudioTracks();
    if (tracks?.length) {
      // If currently muted, unmute; otherwise mute
      tracks[0].enabled = !isMuted;
      logDebug(`🎙️ Microphone ${isMuted ? "unmuted" : "muted"}`);
      setIsMuted(!isMuted);
    } else {
      logDebug("⚠️ No local audio tracks found to mute/unmute");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 space-y-4">
      <Card className="w-full max-w-md p-6">
        <div className="flex flex-col items-center space-y-6">
          <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center">
            <Mic className="w-12 h-12 text-primary-foreground" />
          </div>

          <div className="text-center">
            <h2 className="text-xl font-semibold">Voice Call</h2>
            <p className="text-sm text-muted-foreground">Connected</p>
          </div>

          {/* Always render the audio element (hidden by default). */}
          <audio ref={audioRef} autoPlay playsInline style={{ display: "none" }} />

          <div className="flex space-x-4">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full h-12 w-12"
              onClick={toggleMute}
            >
              {isMuted ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
            </Button>

            <Button
              variant="destructive"
              size="icon"
              className="rounded-full h-12 w-12"
              onClick={handleEndCall}
            >
              <PhoneOff className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </Card>

      {/* If audio hasn’t been unlocked yet, show a button for iOS users to tap */}
      {!audioUnlocked && (
        <Button onClick={handleUnlockAudio} className="max-w-xs">
          Unlock Audio (Tap Here First)
        </Button>
      )}
    </div>
  );
}
