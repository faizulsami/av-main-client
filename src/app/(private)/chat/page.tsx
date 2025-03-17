/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import crypto from "crypto";
import Loading from "@/app/loading";
import CallInviteDialog from "@/components/chat/CallInviteDialog";
import ChatMessages from "@/components/chat/ChatMessages";
import ChatSidebar from "@/components/chat/ChatSidebar";
import { VoiceCall } from "@/components/chat/VoiceCall";
import UserProfile from "@/components/chat/chat-user-profile/ChatUserProfile";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useAppointments } from "@/hooks/useAppointments";
import { AuthService } from "@/services/auth.service";
import { socketService } from "@/services/socket.service";
import { useChatContactsStore } from "@/store/chat-contacts.store";
import { useChatStore } from "@/store/useChatStore";
import { ChatContact } from "@/types/chat.types";
import * as React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import Peer from "simple-peer";
import { io, Socket } from "socket.io-client";

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

export default function ChatInterface() {
  const { toast, dismiss } = useToast();
  const { appointments, refetch } = useAppointments();
  const { setFilteredContacts } = useChatContactsStore();
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

  // { roomId: "some-room", isCaller: true }

  const currentActiveUser = useMemo(() => AuthService.getStoredUser(), []);
  const currentUser = useMemo(
    () => ({
      username: currentActiveUser?.userName || "",
      role: currentActiveUser?.role || "",
    }),
    [currentActiveUser],
  );

  const filteredContacts = useMemo(() => {
    if (!currentActiveUser?.userName) return [];

    const confirmedAppointments = appointments
      .filter((appointment) => appointment.status === "confirmed")
      .map((appointment) => ({
        id: appointment._id,
        username:
          currentUser.role === "mentor"
            ? appointment.menteeUserName
            : appointment.mentorUserName,
        avatar: "/images/avatar/male-avatar.png",
        lastMessage: "",
        mentorUserName: appointment.mentorUserName,
        duration: appointment.durationMinutes ?? 10,
        selectedSlot: appointment.selectedSlot,
      }));

    const uniqueConfirmedAppointments = Array.from(
      new Set(confirmedAppointments.map((a) => a.username)),
    )
      .map((username) =>
        confirmedAppointments.find((a) => a.username === username),
      )
      .filter((contact): contact is ChatContact => contact !== undefined);

    return currentUser.role === "mentee"
      ? uniqueConfirmedAppointments.filter(
          (contact): contact is ChatContact =>
            contact !== undefined &&
            contact.username ===
              appointments.find(
                (appointment) =>
                  appointment.menteeUserName === currentUser.username,
              )?.mentorUserName,
        )
      : uniqueConfirmedAppointments;
  }, [appointments, currentUser.role, currentUser.username, currentActiveUser]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!socket || !selectedUser || !messageInput.trim()) return;

    const newMessage = {
      id: `${Date.now()}`,
      sentBy: currentUser.username,
      sentTo: selectedUser.username,
      message: messageInput,
      isSeen: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    socket.emit("private message", {
      to: selectedUser.username,
      message: messageInput,
    });

    setMessages((prev) => [...prev, newMessage]);
    addMessage(newMessage);

    try {
      await socketService.saveMessage({
        sentBy: currentUser.username,
        sentTo: selectedUser.username,
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
    setFilteredContacts(filteredContacts);
  }, [filteredContacts, setFilteredContacts]);

  useEffect(() => {
    if (!currentUser.username) return;

    const newSocket = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
      auth: { username: currentUser.username },
    });
    setSocket(newSocket);

    // newSocket.on("users", (userList: ChatContact[]) => {
    //   setUsers(userList);
    //   setIsLoading(false);
    // });

    newSocket.on("private message", (data: ReceivedMessage) => {
      if (
        selectedUser &&
        (data.fromUsername === selectedUser.username ||
          data.toUsername === selectedUser.username)
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
  }, [currentUser.username, selectedUser]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedUser) return;

      setIsLoading(true);
      try {
        const response = await socketService.getMessagesByUsername(
          selectedUser.username,
        );
        const filteredMessages = response.data.filter(
          (message) =>
            (message.sentBy === currentUser.username &&
              message.sentTo === selectedUser.username) ||
            (message.sentBy === selectedUser.username &&
              message.sentTo === currentUser.username),
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
  }, [selectedUser, currentUser.username]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  //#region testing
  useEffect(() => {
    (async () => {
      const secret = process.env.NEXT_PUBLIC_TURN_SECRET!; // Your static-auth-secret
      const timestamp = Math.floor(Date.now() / 1000) + 3600; // Valid for 1 hour (can adjust duration)
      const username = `${timestamp}`; // The username is the timestamp
      const password = crypto
        .createHmac("sha1", secret)
        .update(username)
        .digest("base64");
      let config = {
        iceServers: [
          {
            urls: "stun:198.23.217.44:3478",
            username: username,
            credential: password,
          },
        ],
      };
      let conn = new RTCPeerConnection(config);
      conn.createDataChannel("test");
      conn.onicecandidate = (e) => console.log("ICE Candidate:", e.candidate);
      await conn.createOffer().then((o) => conn.setLocalDescription(o));
    })();
  }, []);
  // #endregion

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
    socket.emit("join", { fromUsername: currentUser.username });
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
  }, [socket, currentUser.username, incomingCall?.callerSocketId]);

  const handleAcceptCall = () => {
    if (!incomingCall || !socket || !currentUser.username || !stream || !me)
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
          { urls: "stun:stun1.l.google.com:19302" },
          { urls: "stun:stun2.l.google.com:19302" },
          { urls: "stun:stun3.l.google.com:19302" },
          { urls: "stun:stun4.l.google.com:19302" },
          { urls: "stun:stun.sipgate.net" },
          { urls: "stun:stun.ekiga.net" },
          { urls: "stun:stunserver.org" },
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

    //#region testing
    peer.on("icecandidate", (event) => {
      if (event.candidate) {
        console.log("ICE candidate:", event.candidate);
      } else {
        console.log("All ICE candidates sent.");
      }
    });
    peer.on("connectionstatechange", () => {
      console.log("Connection state:", peer.connectionState);
    });
    //#endregion

    peer.on("stream", (remoteStream) => {
      console.log({ remoteStream });
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
      receiverUsername: currentUser.username,
      callerSocketId: incomingCall.callerSocketId,
    });
    setIncomingCall(null);
  };
  // #region call function
  const handlePhoneClick = () => {
    if (!socket || !selectedUser || !stream) return;

    const toastId = toast({
      title: "Calling...",
      description: `Calling ${selectedUser.username}`,
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
          { urls: "stun:stun1.l.google.com:19302" },
          { urls: "stun:stun2.l.google.com:19302" },
          { urls: "stun:stun3.l.google.com:19302" },
          { urls: "stun:stun4.l.google.com:19302" },
          { urls: "stun:stun.sipgate.net" },
          { urls: "stun:stun.ekiga.net" },
          { urls: "stun:stunserver.org" },
        ],
      },
    });

    console.log("host id = ", process.env.NEXT_PUBLIC_HOST);

    peer.on("signal", (signal) => {
      socket.emit("call:invite", {
        signal,
        receiverUsername: selectedUser.username,
        callerUsername: currentUser.username,
        callerSocketId: me,
      });
    });

    //#region testing
    peer.on("icecandidate", (event) => {
      if (event.candidate) {
        console.log("ICE candidate:", event.candidate);
      } else {
        console.log("All ICE candidates sent.");
      }
    });
    peer.on("connectionstatechange", () => {
      console.log("Connection state:", peer.connectionState);
    });
    //#endregion
    peer.on("stream", (remoteStream) => {
      console.log({ remoteStream });

      const audioCtx = new AudioContext();
      const analyser = audioCtx.createAnalyser();
      const source = audioCtx.createMediaStreamSource(remoteStream);
      source.connect(analyser);
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(dataArray);
      // new code
      if (user_audio.current) {
        user_audio.current.onloadedmetadata = () => {
          console.log("Remote audio is loaded");
          user_audio
            .current!.play()
            .then(() => {
              console.log("Remote audio is playing");
            })
            .catch((error) => {
              console.error("Error playing remote audio:", error);
            });
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
    if (!socket || !callerSocketId) return;
    setShowCallScreen(null);
    connectionRef.current?.destroy();
    if (user_audio.current) user_audio.current.srcObject = null;

    socket.emit("call:ended", {
      callerSocketId: callerSocketId,
      callEndedUsername: currentUser.username,
    });
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
      <aside className="hidden md:flex w-full max-w-[16vw] flex-col border-r">
        {/* {isLoading ? (
          <Skeleton className="w-full h-full" />
        ) : (
          <ChatSidebar
            setSelectedUser={setSelectedUser}
            selectedUser={selectedUser}
          />
        )} */}
        <ChatSidebar
          setSelectedUser={setSelectedUser}
          selectedUser={selectedUser}
        />
      </aside>
      <ChatMessages
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        isProfileOpen={isProfileOpen}
        setIsProfileOpen={setIsProfileOpen}
        isLoading={isLoading}
        messages={messages}
        currentActiveUser={currentActiveUser}
        handleSendMessage={handleSendMessage}
        messageInput={messageInput}
        setMessageInput={setMessageInput}
        messagesEndRef={messagesEndRef}
        currentUser={currentUser}
        onPhoneClick={handlePhoneClick}
      />
      {selectedUser && currentUser.role === "mentor" && (
        <aside className="hidden lg:block w-80 xl:w-96 border-l">
          <UserProfile
            selectedUser={selectedUser}
            onStatusUpdate={() => {
              setSelectedUser(null);
              refetch();
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
