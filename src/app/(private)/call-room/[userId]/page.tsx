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
  console.log('debug flag 2');

  const [isMuted, setIsMuted] = useState(false);
  const [audioReady, setAudioReady] = useState(false);
  const webRTCRef = useRef<WebRTCService | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  const handleEndCall = useCallback(() => {
    webRTCRef.current?.endCall();
    socket.emit(SOCKET_EVENTS.CALL_END, { roomId: params.roomId });
    router.push("/chat");
  }, [params.roomId, router]);

  // Safari/iOS specific: Initialize audio context after user gesture
  const initializeAudioForIOS = useCallback(() => {
    if (!audioReady) {
      // Create AudioContext - iOS requires this after user interaction
      try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContext && !audioContextRef.current) {
          audioContextRef.current = new AudioContext();
        }
        
        // Force speaker output if possible
        if (audioRef.current) {
          // Set audio element attributes for iOS compatibility
          audioRef.current.setAttribute('playsinline', 'true');
          audioRef.current.setAttribute('webkit-playsinline', 'true');
          audioRef.current.muted = false;
          
          // iOS needs play() to be called from a user gesture
          audioRef.current.play()
            .then(() => {
              console.log('Audio playback started successfully');
              setAudioReady(true);
            })
            .catch(err => {
              console.error('Error starting audio playback:', err);
              // Try again with user interaction
              toast({
                title: "Audio Permission Required",
                description: "Please tap anywhere to enable audio",
                duration: 5000,
              });
            });
        }
      } catch (err) {
        console.error('Audio initialization error:', err);
      }
    }
  }, [audioReady, toast]);

  useEffect(() => {
    // Configure WebRTC with specific audio constraints for iOS
    webRTCRef.current = new WebRTCService({
      socket,
onRemoteStream: (stream) => {
          if (audioRef.current) {
            webRTCRef.current?.handleRemoteStream(stream, audioRef.current);
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
      // Add specific audio constraints for iOS
      mediaConstraints: {
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          // Prefer using the speaker on mobile devices
          sampleRate: 48000,
        },
        video: false
      }
    });

    socket.on(SOCKET_EVENTS.CALL_END, handleEndCall);

    // Add click listener to the entire page to initiate audio on iOS
    const handlePageClick = () => {
      initializeAudioForIOS();
    };
    
    document.addEventListener('click', handlePageClick);

    return () => {
      webRTCRef.current?.endCall();
      socket.off(SOCKET_EVENTS.CALL_END);
      document.removeEventListener('click', handlePageClick);
      
      // Clean up audio context
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(console.error);
      }
    };
  }, [handleEndCall, toast, initializeAudioForIOS, audioReady]);

  const toggleMute = () => {
    const tracks = webRTCRef.current?.localStream?.getAudioTracks();
    if (tracks?.length) {
      tracks[0].enabled = isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center" onClick={initializeAudioForIOS}>
      <Card className="w-[300px] p-6">
        <div className="flex flex-col items-center space-y-6">
          <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center">
            <Mic className="w-12 h-12 text-primary-foreground" />
          </div>

          <div className="text-center">
            <h2 className="text-xl font-semibold">Voice Call</h2>
            <p className="text-sm text-muted-foreground">Connected</p>
            {!audioReady && (
              <p className="text-sm text-amber-500 mt-2">
                Tap anywhere to enable audio
              </p>
            )}
          </div>

          <audio 
            ref={audioRef} 
            autoPlay 
            playsInline 
            controls={false}
          />

          <div className="flex space-x-4">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full h-12 w-12"
              onClick={(e) => {
                e.stopPropagation();
                toggleMute();
              }}
            >
              {isMuted ? (
                <MicOff className="h-6 w-6" />
              ) : (
                <Mic className="h-6 w-6" />
              )}
            </Button>

            <Button
              variant="destructive"
              size="icon"
              className="rounded-full h-12 w-12"
              onClick={(e) => {
                e.stopPropagation();
                handleEndCall();
              }}
            >
              <PhoneOff className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
