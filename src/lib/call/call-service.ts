import { Socket } from "socket.io-client";
import { CallInvitation } from "./types";
import Peer from "simple-peer";
import { CallInvitationExtends } from "@/types/call";
export class CallService {
  private static peerConnection: Peer.Instance | null = null;
  static localStream: MediaStream | null = null;

  static generateRoomId(): string {
    return `${Math.random().toString(36).substring(2, 9)}${Date.now()}`;
  }

  static async initializeCall(socket: Socket, roomId: string) {
    if (!this.localStream) return;
    this.peerConnection = new Peer({
      initiator: false,
      trickle: false,
      stream: this.localStream,
    });

    this.peerConnection.on("signal", (data: Peer.SignalData) => {
      socket.emit("call_to_user", { name: user, signal: data, from: me });
    });

    // Handle ICE  candidates
    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ice-candidate", {
          candidate: event.candidate,
          roomId,
        });
      }
    };

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
    this.peerConnection?.close();
    this.peerConnection = null;
    this.localStream = null;
  }

  static sendCallInvitation(socket: Socket, invitation: CallInvitation) {
    socket.emit("call:invite", invitation);
  }

  static acceptCall(
    socket: Socket,
    { username, me }: { username: string; me: string },
  ) {
    if (!this.localStream) return;
    this.peerConnection = new Peer({
      initiator: false,
      trickle: false,
      stream: this.localStream,
    });

    this.peerConnection.on("signal", (data: Peer.SignalData) => {
      socket.emit("call:accept", { username, signal: data, from: me });
    });

    // socket.emit("call:accept", { roomId });
  }

  static rejectCall(socket: Socket, roomId: string) {
    socket.emit("call:reject", { roomId });
  }

  static listenForCallInvitations(
    socket: Socket,
    callback: (invitation: CallInvitationExtends) => void,
  ) {
    socket.on("call:invite", callback);
  }
}
