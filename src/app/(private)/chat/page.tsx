/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as React from "react";
import { useState, useEffect, useRef, useMemo } from "react";
import { io, Socket } from "socket.io-client";
import { AuthService } from "@/services/auth.service";
import { socketService } from "@/services/socket.service";
import Loading from "@/app/loading";
import { useAppointments } from "@/hooks/useAppointments";
import ChatSidebar from "@/components/chat/ChatSidebar";
import ChatMessages from "@/components/chat/ChatMessages";
import UserProfile from "@/components/chat/chat-user-profile/ChatUserProfile";
import { CallInvitation, CallInvitationExtends } from "@/types/call";
import CallInviteDialog from "@/components/chat/CallInviteDialog";
import { CallService } from "@/lib/call/call-service";
import { useChatContactsStore } from "@/store/chat-contacts.store";
import { useChatStore } from "@/store/useChatStore";
import { ChatContact } from "@/types/chat.types";
import { VoiceCall } from "@/components/chat/VoiceCall";
import { useToast } from "@/hooks/use-toast";
import Peer from "simple-peer";

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
  const { toast } = useToast();
  const { appointments, refetch } = useAppointments();
  const { setFilteredContacts } = useChatContactsStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [socket, setSocket] = useState<Socket | null>(null);
  // const [users, setUsers] = useState<ChatContact[]>([]);
  const user_video = useRef<HTMLVideoElement>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedUser, setSelectedUser] = useState<ChatContact | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [stream, setStream] = useState<MediaStream>();
  const [incomingCall, setIncomingCall] = useState<{
    signal: any;
    receiverSocketId: string;
    callerSocketId: string;
  } | null>(null);
  const { addMessage } = useChatStore();
  const [showCallScreen, setShowCallScreen] = useState<{
    isCaller: boolean;
  } | null>(null);
  const [me, setMe] = useState("");

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

  //#region calling
  useEffect(() => {
    if (!socket) return;

    navigator.mediaDevices
      .getUserMedia({ audio: true, video: true }) // Request only audio
      .then((stream) => {
        setStream(stream);
      });

    socket.emit("join", { fromUsername: currentUser.username });
    socket.on("me", (me: string) => setMe(me));

    socket.on(
      "call:invite",
      (invitation: {
        signal: any;
        receiverSocketId: string;
        callerSocketId: string;
      }) => {
        setIncomingCall(invitation);
      },
    );

    socket.on("call:accept", () => {
      setShowCallScreen({ isCaller: true });
    });

    socket.on("call:reject", () => {
      setIncomingCall(null);
    });

    return () => {
      if (socket) {
        socket.off("call:accept");
        socket.off("call:reject");
      }
    };
  }, [socket, currentUser.username]);

  const handleAcceptCall = () => {
    if (!incomingCall || !socket || !currentUser.username || !stream) return;

    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });

    peer.on("signal", (signal) => {
      socket.emit("call:accept", {
        receiverSocketId: incomingCall.callerSocketId,
        callerSocketId: me,
        signal,
      });
    });

    peer.on("stream", (stream) => {
      if (user_video.current) user_video.current.srcObject = stream;
    });

    if (!incomingCall?.signal) return;
    peer.signal(incomingCall.signal as any);

    setIncomingCall(null);
    setShowCallScreen({ isCaller: false });
  };

  const handleRejectCall = () => {
    if (!incomingCall || !socket) return;

    CallService.rejectCall(socket, incomingCall.roomId);
    setIncomingCall(null);
  };
  // #region call function
  const handlePhoneClick = () => {
    if (!socket || !selectedUser || !stream) return;

    toast({
      title: "Calling...",
      description: `Calling ${selectedUser.username}`,
    });

    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
    });

    peer.on("signal", (signal) => {
      socket.emit("call:invite", {
        signal,
        receiverUsername: selectedUser.username,
        callerSocketId: me,
      });
    });

    peer.on("stream", (stream) => {
      if (user_video.current) user_video.current.srcObject = stream;
    });

    socket.once("call:accept", (data) => {
      setShowCallScreen({ isCaller: true });
      if (data.signal) peer.signal(data.signal);
    });
  };

  //#endregion

  const handleEndCall = () => {
    setShowCallScreen(null);
  };

  if (!currentActiveUser?.userName) {
    return <Loading />;
  }

  return (
    <div className="flex h-screen bg-background">
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
          caller={incomingCall.from}
          callType={incomingCall.type}
          onAccept={handleAcceptCall}
          onReject={handleRejectCall}
        />
      )}
      {showCallScreen && socket ? (
        <>
          <video
            width={500}
            // src=""
            height={300}
            ref={user_video}
            autoPlay
            // hidden
          ></video>
          <VoiceCall
            socket={socket}
            roomId={showCallScreen.roomId}
            username={selectedUser!.username}
            invitation={incomingCall!}
            me={me}
            isCaller={showCallScreen.isCaller}
            onEndCall={handleEndCall}
          />
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
