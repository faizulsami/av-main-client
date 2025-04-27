/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Loading from "@/app/loading";
import CallInviteDialog from "@/components/chat/CallInviteDialog";
import ChatMessages from "@/components/chat/ChatMessages";
import ChatSidebar from "@/components/chat/ChatSidebar";
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
import { useAuth } from "@/hooks/useAuth";
import { AuthService } from "@/services/auth.service";
import { socketService } from "@/services/socket.service";
import { useChatContactsStore } from "@/store/chat-contacts.store";
import { useChatStore } from "@/store/useChatStore";
import { ChatContact } from "@/types/chat.types";
import { Star } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
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
  const router = useRouter();
  const { toast, dismiss } = useToast();
  const { appointments, refetch } = useAppointments();
  const { setFilteredContacts } = useChatContactsStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
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
  const [isCompleted, setIsCompleted] = useState(false);
  const { user } = useAuth();
  const [callingToastId, setCallingToastId] = useState("");

  const [incomingCall, setIncomingCall] = useState<{
    signal: any;
    receiverSocketId: string;
    callerUsername: string;
    callerSocketId: string;
  } | null>(null);
  const { addMessage } = useChatStore();
  const [showCallScreen, setShowCallScreen] = useState<boolean>(false);
  const [me, setMe] = useState("");

  const connectionRef = useRef<any>(null);

  // Inside the ChatInterface component, add these state variables
  const [callTimer, setCallTimer] = useState<number>(0);

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
    return () => {
      sessionStorage.removeItem("caller");
      if (stream) {
        stream.getTracks().forEach((track) => {
          track.stop();
        });
      }
    };
  }, []);
  useEffect(() => {
    setFilteredContacts(filteredContacts);
  }, [filteredContacts, setFilteredContacts]);

  useEffect(() => {
    if (!currentUser.username) return;

    const newSocket = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
      auth: { username: currentUser.username },
      transports: ["polling", "websocket"],
      reconnection: true,
      reconnectionAttempts: 3,
      reconnectionDelay: 5000,
    });
    setSocket(newSocket);

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

  useEffect(() => {
    if (!socket) return;

    socket.on("appointment-completed", () => {
      setIsCompleted(true);
    });
    return () => {
      socket.off("appointment-completed");
    };
  }, [socket]);

  //#region calling
  useEffect(() => {
    if (!socket) return;

    socket.emit("join", { fromUsername: currentUser.username });

    const handleMe = (me: string) => {
      setMe(me);
    };

    const handleCallInvite = (invitation: {
      signal: any;
      receiverSocketId: string;
      callerSocketId: string;
      callerUsername: string;
    }) => {
      setIncomingCall(invitation);
      sessionStorage.setItem("caller", invitation.callerSocketId);
    };

    const handleReceiverSocketId = (data: { receiverSocketId: string }) => {
      sessionStorage.setItem("caller", data.receiverSocketId);
    };

    const handleCallAccept = () => {
      setShowCallScreen(true);
    };

    const handleCallEnded = (username: string) => {
      setShowCallScreen(false);
      setCallEndedUsername(username);
      connectionRef.current?.destroy();
      if (user_audio.current) user_audio.current.srcObject = null;
      if (typeof window !== "undefined") {
        alert("call ended");
      }
    };

    const handleUserDisconnected = (data: { disconnectedSocketId: string }) => {
      const callerSocketId = sessionStorage.getItem("caller");
      if (callerSocketId === data.disconnectedSocketId) {
        if (typeof window !== "undefined") {
          window.location.reload();
        } else handleEndCall();
      }
    };

    const handleCallReject = () => {
      setIncomingCall(null);
    };

    const handleCallRejected = (data: { receiverUsername: string }) => {
      setIncomingCall(null);
      setCallRejectUsername(data.receiverUsername);
    };

    // Register listeners
    socket.on("me", handleMe);
    socket.on("call:invite", handleCallInvite);
    socket.on("call:receiver-socket-id", handleReceiverSocketId);
    socket.on("call:accept", handleCallAccept);
    socket.on("call:ended", handleCallEnded);
    socket.on("user:disconnected", handleUserDisconnected);
    socket.on("call:reject", handleCallReject);
    socket.on("call:rejected", handleCallRejected);

    return () => {
      socket.off("me", handleMe);
      socket.off("call:invite", handleCallInvite);
      socket.off("call:receiver-socket-id", handleReceiverSocketId);
      socket.off("call:accept", handleCallAccept);
      socket.off("call:ended", handleCallEnded);
      socket.off("user:disconnected", handleUserDisconnected);
      socket.off("call:reject", handleCallReject);
      socket.off("call:rejected", handleCallRejected);
    };
  }, [socket, currentUser.username, incomingCall?.callerSocketId]);

  const handleAcceptCall = () => {
    if (!incomingCall || !socket || !currentUser.username || !me) return;

    navigator.mediaDevices
      .getUserMedia({ audio: { deviceId: "default" } })
      .then((stream) => {
        stream.getAudioTracks().forEach((track) => {
          track.enabled = true;
        });
        let peer = new Peer({
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
                username: process.env.NEXT_PUBLIC_TURN_SERVER_USERNAME,
                credential: process.env.NEXT_PUBLIC_TURN_SERVER_PASSWORD,
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
        setShowCallScreen(true);
        peer.on("close", () => {
          peer = null;
          connectionRef.current = null;
        });

        if (connectionRef.current) connectionRef.current = peer;
      })
      .catch((err) => {
        if (String(err).includes("NotAllowedError")) {
          toast({
            title: "Unable to access microphone",
            description: "please allow access",
            duration: 3000,
            variant: "destructive",
          });
          return;
        } else {
          toast({
            title: "Something went wrong",
            description: "please try again",
            duration: 3000,
            variant: "destructive",
          });
          return;
        }
      });
  };

  const handleRejectCall = () => {
    const callerSocketId = sessionStorage.getItem("caller");
    if (!callerSocketId || !socket) return;
    socket.emit("call:rejected", {
      receiverUsername: currentUser.username,
      callerSocketId: callerSocketId,
    });
    dismiss(callingToastId);
    setIncomingCall(null);
  };
  // #region call function
  const handlePhoneClick = () => {
    if (!socket || !selectedUser) return;

    navigator.mediaDevices
      .getUserMedia({ audio: { deviceId: "default" } })
      .then((stream) => {
        stream.getAudioTracks().forEach((track) => {
          track.enabled = true;
        });
        setStream(stream);
        const toastId = toast({
          title: "Calling...",
          description: `Calling ${selectedUser.username}`,
        });
        setCallingToastId(toastId.id);
        let peer = new Peer({
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
                username: process.env.NEXT_PUBLIC_TURN_SERVER_USERNAME,
                credential: process.env.NEXT_PUBLIC_TURN_SERVER_PASSWORD,
              },
            ],
          },
        });

        peer.on("signal", (signal) => {
          socket.emit("call:invite", {
            signal,
            receiverUsername: selectedUser.username,
            callerUsername: currentUser.username,
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

        socket.on("call:accept", (data) => {
          setShowCallScreen(true);
          if (data.signal) peer.signal(data.signal);
        });

        peer.on("close", () => {
          peer = null;
          connectionRef.current = null;
        });

        if (connectionRef.current) connectionRef.current = peer;
      })
      .catch((err) => {
        if (String(err).includes("NotAllowedError")) {
          toast({
            title: "Unable to access microphone",
            description: "please allow access",
            duration: 3000,
            variant: "destructive",
          });
          return;
        } else {
          toast({
            title: "Something went wrong",
            description: "please try again",
            duration: 3000,
            variant: "destructive",
          });
          return;
        }
      });
  };

  //#endregion

  const handleEndCall = () => {
    if (
      !socket ||
      (user?.role === "mentee" && !searchParams.get("mentor")) ||
      (user?.role === "mentor" && !searchParams.get("mentee"))
    )
      return;

    setShowCallScreen(false);
    connectionRef.current?.destroy();
    if (user_audio.current) user_audio.current.srcObject = null;

    if (user?.role === "mentor") {
      socket.emit("call:ended", {
        needToEndCallUsername: searchParams.get("mentee"),
        callEndedUsername: currentUser.username,
        callEndUserType: "mentor",
      });
    } else {
      socket.emit("call:ended", {
        needToEndCallUsername: searchParams.get("mentor"),
        callEndedUsername: currentUser.username,
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
      <aside className="hidden md:flex w-full max-w-[16vw]  flex-col border-r">
        <ChatSidebar
          setSelectedUser={setSelectedUser}
          selectedUser={selectedUser}
          {...(currentUser.role === "mentor" && {
            username: currentUser.username,
          })}
          {...(currentUser.role === "mentee" && {
            mentee: currentUser.username,
          })}
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
              handleEndCall();
              refetch();
            }}
          />
        </aside>
      )}
      {incomingCall && (
        <CallInviteDialog
          isOpen={true}
          setShowCallScreen={setShowCallScreen}
          onOpenChange={() => {}}
          caller={incomingCall.callerUsername}
          onAccept={handleAcceptCall}
          onReject={handleRejectCall}
        />
      )}
      {showCallScreen ? (
        <>
          <audio ref={user_audio} autoPlay muted={false} playsInline />
          <VoiceCall onEndCall={handleEndCall} isOpen={showCallScreen} />
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

      {isCompleted &&
        !!searchParams.get("mentee") &&
        !!searchParams.get("mentor") && (
          <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50">
            <div className="border p-10 fixed text-center top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-background rounded-2xl shadow-2xl flex flex-col gap-3">
              <h2 className="text-2xl font-bold ">
                Thank you for sharing with us.
              </h2>
              <p className="text-center my-2">
                We appreciate your trust in Anonymous Voices. Remember, you are
                not alone, and your feelings are valid. Take a deep breath, be
                kind to yourself, and reach out whenever you need support. Your
                Voice is Safe Here: Let It Flow
              </p>
              <div className="flex items-center gap-2 justify-center">
                <Star fill="#FFD700" className="text-[#FFD700]" />
                <Star fill="#FFD700" className="text-[#FFD700]" />
                <Star fill="#FFD700" className="text-[#FFD700]" />
                <Star fill="#FFD700" className="text-[#FFD700]" />
                <Star fill="#FFD700" className="text-[#FFD700]" />
              </div>
              <p className="text-lg">
                Please share feedback on your experience in the following link.
              </p>
              <a
                className="text-[#78bfc8]"
                href="https://docs.google.com/forms/d/e/1FAIpQLScgqy892yA1RfQynR07tC2w1DL85AG3RfnIRAmsTA8ktTqxvA/viewform?usp=sharing"
                target="_blank"
              >
                https://docs.google.com/forms/d/e/1FAIpQLScgqy892yA1RfQynR07tC2w1DL85AG3RfnIRAmsTA8ktTqxvA/viewform?usp=sharing
              </a>
              <Link className="mt-5" href="/">
                <Button className="rounded-xl px-6 py-2 text-white bg-[#78bec6]">
                  Back to Homepage
                </Button>
              </Link>
            </div>
          </div>
        )}
    </div>
  );
}
