/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Loading from "@/app/loading";
import CallInviteDialog from "@/components/chat/CallInviteDialog";
import ChatMessages from "@/components/chat/ChatMessages";
import { VoiceCall } from "@/components/chat/VoiceCall";
import UserProfile from "@/components/chat/chat-user-profile/ChatUserProfile";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useAppointments } from "@/hooks/useAppointments";
import { AppointmentService } from "@/services/appointment.service";
import { AuthService } from "@/services/auth.service";
import { socketService } from "@/services/socket.service";
import { useChatContactsStore } from "@/store/chat-contacts.store";
import { useChatStore } from "@/store/useChatStore";
import { ChatContact } from "@/types/chat.types";
import crypto from "crypto";
import { Star } from "lucide-react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import * as React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import Peer from "simple-peer";
import { io, Socket } from "socket.io-client";
import OneToOneChatMessages from "./_components/OneToOneChatMessages";
import OneToOneChatUserProfile from "./_components/OneToOneChatUserProfile";
import { useAuth } from "@/hooks/useAuth";

interface Message {
  id: string;
  sentBy: string;
  sentTo: string;
  message: string;
  isSeen: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ReceivedMessage {
  from: string;
  fromUsername: string;
  to: string;
  toUsername: string;
  message: string;
}

export default function OneToOneChatInterface() {
  const { toast, dismiss } = useToast();
  const params = useParams();
  const { user } = useAuth();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [socket, setSocket] = useState<Socket | null>(null);
  // const [users, setUsers] = useState<ChatContact[]>([]);
  const user_audio = useRef<HTMLVideoElement>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedUser, setSelectedUser] = useState<ChatContact | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [stream, setStream] = useState<MediaStream>();
  const [callEndedUsername, setCallEndedUsername] = useState("");
  const [callRejectUsername, setCallRejectUsername] = useState("");

  const [appointmentLoading, setAppointmentLoading] = useState(false);
  const [incomingCall, setIncomingCall] = useState<{
    signal: any;
    receiverSocketId: string;
    callerUsername: string;
    callerSocketId: string;
  } | null>(null);
  const { addMessage } = useChatStore();
  const [showCallScreen, setShowCallScreen] = useState<{
    isCaller: boolean;
  } | null>(null);
  const [me, setMe] = useState("");
  const [callerSocketId, setCallerSocketId] = useState("");
  const connectionRef = useRef<any>(null);

  const currentActiveUser = useMemo(() => AuthService.getStoredUser(), []);

  useEffect(() => {
    const getApplication = async () => {
      setAppointmentLoading(true);
      const res = await AppointmentService.getSingleAppointment(
        params.appointmentId! as string,
      );

      setAppointmentLoading(false);
      setSelectedUser(res.data?.data);
    };
    if (params?.appointmentId) getApplication();
  }, [params]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!socket || !selectedUser || !messageInput.trim()) return;

    const newMessage = {
      id: `${Date.now()}`,
      sentBy: currentActiveUser?.userName || "",
      sentTo: selectedUser?.menteeUserName,
      message: messageInput,
      isSeen: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    socket.emit("private message", {
      to: selectedUser?.menteeUserName,
      message: messageInput,
    });

    setMessages((prev) => [...prev, newMessage]);
    addMessage(newMessage);

    try {
      await socketService.saveMessage({
        sentBy: currentActiveUser?.userName || "",
        sentTo: selectedUser.menteeUserName,
        message: messageInput,
        isSeen: false,
      });
    } catch (error) {
      console.error("Error saving message:", error);
    }

    setMessageInput("");
    scrollToBottom();
  };

  useEffect(() => {
    if (!currentActiveUser?.userName) return;

    const newSocket = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
      auth: { username: currentActiveUser?.userName },
    });
    setSocket(newSocket);

    newSocket.on("private message", (data: ReceivedMessage) => {
      if (
        selectedUser &&
        (data.fromUsername === selectedUser.menteeUserName ||
          data.toUsername === selectedUser.menteeUserName)
      ) {
        setMessages((prev) => [
          ...prev,
          {
            id: `${Date.now()}`,
            sentBy: data.fromUsername,
            sentTo: data.toUsername,
            message: data.message,
            isSeen: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ]);
        scrollToBottom();
      }
    });

    newSocket.on("private message error", (error: Error) => {
      console.error("Private message error:", error);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [currentActiveUser?.userName, selectedUser]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedUser) return;

      setIsLoading(true);
      try {
        const response = await socketService.getMessagesByUsername(
          selectedUser.menteeUserName,
        );
        const filteredMessages = response.data.filter(
          (message) =>
            (message.sentBy === currentActiveUser?.userName &&
              message.sentTo === selectedUser?.menteeUserName) ||
            (message.sentBy === selectedUser?.menteeUserName &&
              message.sentTo === currentActiveUser?.userName),
        );
        setMessages(filteredMessages.reverse());
        scrollToBottom();
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();
  }, [selectedUser, currentActiveUser?.userName]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  //#region calling
  useEffect(() => {
    if (!socket) return;

    navigator.mediaDevices
      .getUserMedia({ audio: { deviceId: "default" } })
      .then((stream) => {
        stream.getAudioTracks().forEach((track) => {
          track.enabled = true;
        });
        setStream(stream);
      })
      .catch((err) => {
        console.error("Error getting user media:", err);
      });
    socket.emit("join", { fromUsername: currentActiveUser?.userName });
    socket.on("me", (me: string) => {
      setMe(me);
    });

    socket.on(
      "call:invite",
      (invitation: {
        signal: any;
        receiverSocketId: string;
        callerSocketId: string;
        callerUsername: string;
      }) => {
        setIncomingCall(invitation);
        setCallerSocketId(invitation.callerSocketId);
      },
    );

    socket.once("call:accept", () => {
      setShowCallScreen({ isCaller: true });
    });

    socket.once("call:ended", (username) => {
      setShowCallScreen(null);
      setCallEndedUsername(username);
      connectionRef.current?.destroy();
      if (user_audio.current) user_audio.current.srcObject = null;
    });

    socket.on("user:disconnected", (data) => {
      if (incomingCall?.callerSocketId === data.disconnectedSocketId) {
        handleEndCall();
      }
    });

    socket.on("call:reject", () => {
      setIncomingCall(null);
    });
    socket.on("call:rejected", (data) => {
      setIncomingCall(null);
      setCallRejectUsername(data.receiverUsername);
    });

    return () => {
      if (socket) {
        socket.off("call:accept");
        socket.off("call:reject");
        socket.off("call:invite");
        socket.off("call:ended");
        socket.off("user:disconnected");
        socket.off("me");
      }
    };
  }, [socket, currentActiveUser?.userName, incomingCall?.callerSocketId]);

  const handleAcceptCall = () => {
    if (
      !incomingCall ||
      !socket ||
      !currentActiveUser?.userName ||
      !stream ||
      !me
    )
      return;
    const secret = process.env.NEXT_PUBLIC_TURN_SECRET!; // Your static-auth-secret
    const timestamp = Math.floor(Date.now() / 1000) + 3600; // Valid for 1 hour (can adjust duration)
    const username = `${timestamp}`; // The username is the timestamp
    const password = crypto
      .createHmac("sha1", secret)
      .update(username.toString())
      .digest("base64");
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
      config: {
        iceServers: [
          {
            urls: `stun:stun.anonymousvoicesav.com`,
          },
          {
            urls: `turn:stun.anonymousvoicesav.com`,
            // username: username.toString(),
            // credential: password,
            username: "guest",
            credential: "somepassword",
          },
        ],
      },
    });

    peer.on("signal", (signal) => {
      socket.emit("call:accept", {
        receiverSocketId: incomingCall.callerSocketId,
        callerSocketId: me,
        signal,
      });
    });

    peer.on("stream", (remoteStream) => {
      const audioCtx = new AudioContext();
      const analyser = audioCtx.createAnalyser();
      const source = audioCtx.createMediaStreamSource(remoteStream);
      source.connect(analyser);
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(dataArray);

      if (user_audio.current) {
        user_audio.current.srcObject = remoteStream;
        user_audio.current.volume = 1.0;
        user_audio.current.muted = false;
        user_audio.current.play().catch(console.error);
      }
    });

    if (!incomingCall?.signal) return;
    peer.signal(incomingCall.signal as any);

    setIncomingCall(null);
    setShowCallScreen({ isCaller: false });
    peer.on("close", () => {
      peer.destroy();
    });

    if (connectionRef.current) connectionRef.current = peer;
  };

  const handleRejectCall = () => {
    if (!incomingCall || !socket) return;

    socket.emit("call:rejected", {
      receiverUsername: currentActiveUser?.userName,
      callerSocketId: incomingCall.callerSocketId,
    });
    setIncomingCall(null);
  };
  // #region call function
  const handlePhoneClick = () => {
    if (!socket || !selectedUser || !stream) return;

    const toastId = toast({
      title: "Calling...",
      description: `Calling ${selectedUser?.menteeUserName}`,
    });
    const secret = process.env.NEXT_PUBLIC_TURN_SECRET!; // Your static-auth-secret
    const timestamp = Math.floor(Date.now() / 1000) + 3600; // Valid for 1 hour (can adjust duration)
    const username = `${timestamp}`; // The username is the timestamp
    const password = crypto
      .createHmac("sha1", secret)
      .update(username.toString())
      .digest("base64");
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
      config: {
        iceServers: [
          {
            urls: `stun:stun.anonymousvoicesav.com`,
          },
          {
            urls: `turn:stun.anonymousvoicesav.com`,
            // username: username.toString(),
            // credential: password,
            username: "guest",
            credential: "somepassword",
          },
        ],
      },
    });

    peer.on("signal", (signal) => {
      socket.emit("call:invite", {
        signal,
        receiverUsername: selectedUser?.menteeUserName,
        callerUsername: currentActiveUser?.userName,
        callerSocketId: me,
      });
    });

    peer.on("stream", (remoteStream) => {
      const audioCtx = new AudioContext();
      const analyser = audioCtx.createAnalyser();
      const source = audioCtx.createMediaStreamSource(remoteStream);
      source.connect(analyser);
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(dataArray);
      // new code
      if (user_audio.current) {
        user_audio.current.onloadedmetadata = () => {
          user_audio
            .current!.play()
            .then(() => {})
            .catch((error) => {});
        };

        dismiss(toastId.id);
        user_audio.current.srcObject = remoteStream;
        user_audio.current.volume = 1.0;
        user_audio.current.muted = false;
        user_audio.current.play().catch(console.error);
      }
    });

    socket.once("call:accept", (data) => {
      setShowCallScreen({ isCaller: true });
      if (data.signal) peer.signal(data.signal);
    });

    peer.on("close", () => {
      peer.destroy();
    });

    if (connectionRef.current) connectionRef.current = peer;
  };

  //#endregion

  const handleEndCall = () => {
    if (!socket || (user?.role === "mentee" && !callerSocketId)) return;
    setShowCallScreen(null);
    connectionRef.current?.destroy();
    if (user_audio.current) user_audio.current.srcObject = null;
    console.log({ role: user?.role });
    if (user?.role === "mentor") {
      socket.emit("call:ended", {
        needToEndCallUsername: selectedUser?.menteeUserName,
        callEndedUsername: user?.userName,
        callEndUserType: "mentor",
      });
    } else {
      socket.emit("call:ended", {
        needToEndCallUsername: selectedUser?.mentorUserName,
        callEndedUsername: user?.userName,
        callEndUserType: "mentee",
      });
    }
  };

  if (!currentActiveUser?.userName) {
    return <Loading />;
  }

  return (
    <div className="flex h-screen bg-background">
      {!!callEndedUsername ||
        (!!callRejectUsername && (
          <Dialog
            open={!!callEndedUsername || !!callRejectUsername}
            onOpenChange={() => {
              setCallEndedUsername("");
              setCallRejectUsername("");
            }}
          >
            <DialogContent>
              <DialogHeader>
                {!!callEndedUsername && (
                  <DialogTitle>Call ended by {callEndedUsername} </DialogTitle>
                )}
                {!!callRejectUsername && (
                  <DialogTitle>
                    Call rejected by {callRejectUsername}{" "}
                  </DialogTitle>
                )}
              </DialogHeader>
            </DialogContent>
          </Dialog>
        ))}

      {!appointmentLoading && (
        <OneToOneChatMessages
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          isProfileOpen={isProfileOpen}
          setIsProfileOpen={setIsProfileOpen}
          isLoading={isLoading}
          messages={messages}
          handleSendMessage={handleSendMessage}
          messageInput={messageInput}
          setMessageInput={setMessageInput}
          messagesEndRef={messagesEndRef}
          onPhoneClick={handlePhoneClick}
        />
      )}
      {selectedUser && (
        <aside className="hidden  lg:block w-80 xl:w-96 border-l">
          <OneToOneChatUserProfile
            selectedUser={selectedUser}
            onStatusUpdate={() => {
              setSelectedUser(null);
            }}
          />
        </aside>
      )}
      {incomingCall && (
        <CallInviteDialog
          isOpen={!!incomingCall}
          onOpenChange={(open) => !open && setIncomingCall(null)}
          caller={incomingCall.callerUsername}
          onAccept={handleAcceptCall}
          onReject={handleRejectCall}
        />
      )}
      {showCallScreen && socket ? (
        <>
          <audio ref={user_audio} autoPlay muted={false} playsInline />
          <VoiceCall onEndCall={handleEndCall} />
        </>
      ) : (
        <>
          {!socket && (
            <div className="fixed bottom-10 right-4 bg-background p-4 rounded-lg shadow-lg">
              connection failed.
            </div>
          )}
        </>
      )}
    </div>
  );
}
