/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";
import { CallService } from "@/lib/call/call-service";
import { Button } from "@/components/ui/button";
import { PhoneOff } from "lucide-react";
import Peer from "simple-peer";
import { CallInvitationExtends } from "@/types/call";

interface VoiceCallProps {
  socket: Socket;
  roomId: string;
  isCaller: boolean;
  onEndCall: () => void;
  username: string;
  me: string;
  invitation: CallInvitationExtends;
}

export const VoiceCall: React.FC<VoiceCallProps> = ({
  socket,
  roomId,
  isCaller,
  onEndCall,
  username,
  me,
  invitation,
}) => {
  // const [isConnected, setIsConnected] = useState(false);
  // const [error, setError] = useState<string>("");
  // const [stream, setStream] = useState<MediaStream>();
  // const audioRef = useRef<HTMLAudioElement>(null);

  // useEffect(() => {
  //   navigator.mediaDevices
  //     .getUserMedia({ audio: true }) // Request only audio
  //     .then((stream) => {
  //       setStream(stream);
  //     });
  //   const peer = new Peer({
  //     initiator: false,
  //     trickle: false,
  //     stream: stream,
  //   });
  //   peer.on("signal", (signal) => {
  //     socket.emit("call:started", { signal, to: invitation.fromId, me: me });
  //   });

  //   socket.once("call:started", (data) => {
  //     peer.signal(data.signal);
  //   });

  //   peer.on("stream", (stream) => {
  //     const audio = new Audio();
  //     audio.srcObject = stream;
  //     audio.play();
  //   });

  //   const initializeCall = async () => {
  //     // #region Initialize call past
  //     // try {
  //     //   peerConnection = await CallService.initializeCall(socket, roomId);
  //     //   setIsConnected(true);
  //     //   if (isCaller) {
  //     //     await CallService.createOffer(peerConnection, socket, roomId);
  //     //   }
  //     //   peerConnection.ontrack = (event) => {
  //     //     if (event.streams[0] && audioRef.current) {
  //     //       audioRef.current.srcObject = event.streams[0];
  //     //     }
  //     //   };
  //     //   // Handle incoming offer
  //     //   socket.on("call-offer", async ({ offer, roomId: incomingRoomId }) => {
  //     //     if (roomId === incomingRoomId && !isCaller) {
  //     //       await CallService.handleOffer(
  //     //         peerConnection,
  //     //         socket,
  //     //         offer,
  //     //         roomId,
  //     //       );
  //     //     }
  //     //   });
  //     //   // Handle answer
  //     //   socket.on("call-answer", async ({ answer }) => {
  //     //     if (peerConnection.currentRemoteDescription === null) {
  //     //       await peerConnection.setRemoteDescription(
  //     //         new RTCSessionDescription(answer),
  //     //       );
  //     //     }
  //     //   });
  //     //   // Handle ICE candidates
  //     //   socket.on("ice-candidate", async ({ candidate }) => {
  //     //     try {
  //     //       await peerConnection.addIceCandidate(
  //     //         new RTCIceCandidate(candidate),
  //     //       );
  //     //     } catch (e) {
  //     //       console.error("Error adding ICE candidate:", e);
  //     //     }
  //     //   });
  //     //   socket.on("call:end", async () => {
  //     //     onEndCall();
  //     //     CallService.endCall();
  //     //   });
  //     // } catch (err) {
  //     //   setError("Failed to initialize call");
  //     //   console.error(err);
  //     // }
  //     //#endregion
  //   };

  //   initializeCall();

  //   return () => {
  //     socket.off("call-offer");
  //     socket.off("call-answer");
  //     socket.off("ice-candidate");
  //     CallService.endCall();
  //   };
  // }, [isCaller, onEndCall, roomId, socket]);
  // }, [socket, roomId, isCaller]);

  const handleEndCall = () => {
    socket.emit("call:end", { roomId });
    onEndCall();
    CallService.endCall();
  };

  return (
    <div className="fixed bottom-4 right-4 bg-background p-4 rounded-lg shadow-lg">
      <div className="flex items-center gap-4">
        <div className="flex flex-col">
          <span className="text-sm font-medium">
            {/* {isConnected ? "Connected" : "Connecting..."} */}
            Connected
          </span>
          {/* {error && <span className="text-destructive text-sm">{error}</span>} */}
        </div>
        <Button
          variant="destructive"
          size="icon"
          onClick={handleEndCall}
          className="rounded-full"
        >
          <PhoneOff className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
