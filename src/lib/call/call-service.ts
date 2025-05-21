import { Socket } from "socket.io-client";
import { CallInvitation } from "./types";
import Peer from "simple-peer";
import { CallInvitation as CallInvitationType } from "@/types/call";

export class CallService {
  private static peerConnection: Peer.Instance | null = null;
  static localStream: MediaStream | null = null;

  static generateRoomId(): string {
    return `${Math.random().toString(36).substring(2, 9)}${Date.now()}`;
  }

  // Added user and me as parameters
  static async initializeCall(
    socket: Socket,
    roomId: string,
    user: string,
    me: string
  ) {
    if (!this.localStream) return;
    this.peerConnection = new Peer({
      initiator: false,
      trickle: false,
      stream: this.localStream,
      config: {
        iceServers: [
          {
            urls: `stun:stun.anonymousvoicesav.com`,
          },
          {
            urls: `turn:stun.anonymousvoicesav.com`,
            username: process.env.NEXT_PUBLIC_TURN_SERVER_USERNAME,
            credential: process.env.NEXT_PUBLIC_TURN_SERVER_PASSWORD,
          },
        ],
      },
    });

    console.log('flag33');

    this.peerConnection.on("signal", (data: Peer.SignalData) => {
      socket.emit("call_to_user", { name: user, signal: data, from: me });
    });

    // Removed onicecandidate block (not needed for simple-peer)

    // Set up audio track
    try {
      this.localStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      // this.localStream.getTracks().forEach((track) => {
      //   this.peerConnection?.addTrack(track, this.localStream!);
      // });
      // const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // stream.getTracks().forEach((track) => {
      //   this.peerConnection?.addTrack(track, stream);
      // });
    } catch (err) {
      console.error("Error accessing microphone:", err);
      throw err;
    }

    return this.peerConnection;
  }

  static async createOffer(
    peerConnection: RTCPeerConnection,
    socket: Socket,
    roomId: string,
  ) {
    try {
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);
      socket.emit("call-offer", { offer, roomId });
    } catch (err) {
      console.error("Error creating offer:", err);
      throw err;
    }
  }

  static async handleOffer(
    peerConnection: RTCPeerConnection,
    socket: Socket,
    offer: RTCSessionDescriptionInit,
    roomId: string,
  ) {
    try {
      await peerConnection.setRemoteDescription(
        new RTCSessionDescription(offer),
      );
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);
      socket.emit("call-answer", { answer, roomId });
    } catch (err) {
      console.error("Error handling offer:", err);
      throw err;
    }
  }

  static endCall() {
    this.localStream?.getTracks().forEach((track) => track.stop());
    this.peerConnection?.destroy(); // Use destroy() for simple-peer
    this.peerConnection = null;
    this.localStream = null;
  }

  static sendCallInvitation(socket: Socket, invitation: CallInvitation) {
    socket.emit("call:invite", invitation);
  }

  static async acceptCall(
    socket: Socket,
    { username, me }: { username: string; me: string },
  ) {
    try {
      // Request audio permissions and get the stream
      this.localStream = await navigator.mediaDevices.getUserMedia({ audio: true });

      this.peerConnection = new Peer({
        initiator: false,
        trickle: false,
        stream: this.localStream,
        config: {
          iceServers: [
            {
              urls: `stun:stun.anonymousvoicesav.com`,
            },
            {
              urls: `turn:stun.anonymousvoicesav.com`,
              username: process.env.NEXT_PUBLIC_TURN_SERVER_USERNAME,
              credential: process.env.NEXT_PUBLIC_TURN_SERVER_PASSWORD,
            },
          ],
        }
      });

      console.log('flag44');

      this.peerConnection.on("signal", (data: Peer.SignalData) => {
        socket.emit("call:accept", { username, signal: data, from: me });
      });

      // socket.emit("call:accept", { roomId });
    } catch (err) {
      console.error("Error accessing microphone:", err);
      throw err;
    }
  }

  static rejectCall(socket: Socket, roomId: string) {
    socket.emit("call:reject", { roomId });
  }

  static listenForCallInvitations(
    socket: Socket,
    callback: (invitation: CallInvitationType) => void,
  ) {
    socket.on("call:invite", callback);
  }
}
