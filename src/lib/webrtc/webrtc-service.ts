import { Socket } from "socket.io-client";
import { ICE_SERVERS, SOCKET_EVENTS } from "./constants";
import { WebRTCConfig } from "./types";

export class WebRTCService {
  private peerConnection: RTCPeerConnection | null = null;
  public localStream: MediaStream | null = null;
  private readonly socket: Socket;
  private readonly onRemoteStream?: (stream: MediaStream, parentElement: HTMLElement | null) => void;
  private readonly onError?: (error: Error) => void;

  constructor(config: WebRTCConfig) {
    this.socket = config.socket;
    this.onRemoteStream = config.onRemoteStream;
    this.onError = config.onError;
    this.setupPeerConnection();
  }

  private setupPeerConnection() {
    console.log("Setting up PeerConnection...");
    try {
      this.peerConnection = new RTCPeerConnection({ iceServers: ICE_SERVERS });
    } catch (error) {
      this.handleError(new Error("Failed to create PeerConnection: " + error));
      return;
    }

    this.peerConnection.onicecandidate = (event) => {
      console.log("ICE candidate:", event.candidate);
      if (event.candidate) {
        this.socket.emit(SOCKET_EVENTS.WEBRTC_ICE, {
          candidate: event.candidate,
        });
      }
    };

    this.peerConnection.ontrack = (event) => {
      console.log("Received remote track:", event.streams[0]);
      if (event.streams[0] && this.onRemoteStream) {
        this.onRemoteStream(event.streams[0], null);
      }
    };

    this.peerConnection.oniceconnectionstatechange = () => {
      console.log("ICE connection state changed:", this.peerConnection?.iceConnectionState);
    };

    this.peerConnection.onconnectionstatechange = () => {
      console.log("Connection state changed:", this.peerConnection?.connectionState);
    };
  }

  private async createAndSendOffer() {
    console.log("Creating and sending offer...");
    if (!this.peerConnection) {
      throw new Error("PeerConnection not initialized");
    }
    const offer = await this.peerConnection.createOffer();
    await this.peerConnection.setLocalDescription(offer);
    this.socket.emit(SOCKET_EVENTS.WEBRTC_OFFER, {
      offer,
    });
  }

  async startCall(targetUserId: string) {
    console.log("Starting call with:", targetUserId);
    try {
      await this.initializeLocalStream();
      if (!this.peerConnection) {
        throw new Error("PeerConnection not initialized");
      }
      this.createAndSendOffer();
    } catch (error) {
      this.handleError(error);
    }
  }

  private async initializeLocalStream() {
    try {
      const constraints: MediaStreamConstraints = {
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 48000,
          channelCount: 2, // Stereo audio
        },
      };
      this.localStream = await navigator.mediaDevices.getUserMedia(constraints);
      this.localStream.getTracks().forEach((track) => {
        this.peerConnection?.addTrack(track, this.localStream);
      });
    } catch (error) {
      this.handleError(new Error("Failed to get user media: " + error));
    }
  }

  private handleError(error: unknown) {
    console.error("WebRTC Error:", error);
    if (this.onError) {
      this.onError(error instanceof Error ? error : new Error(String(error)));
    }
  }

  endCall() {
    this.localStream?.getTracks().forEach((track) => track.stop());
    this.peerConnection?.close();
    this.peerConnection = null;
    this.localStream = null;
  }
}
