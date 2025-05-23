import { Socket } from "socket.io-client";
import { MediaStreamConstraints } from "./constants";

export interface WebRTCConfig {
  socket: Socket;
  onRemoteStream: (stream: MediaStream, parentElement: HTMLElement | null) => void;
  onError?: (error: Error) => void;
  mediaConstraints?: MediaStreamConstraints;
}

export interface CallPayload {
  from: string;
  to: string;
  fromName?: string;
  roomId: string;
}
