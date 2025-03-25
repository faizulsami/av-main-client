import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Undo2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { cn } from "@/lib/utils";
import { useChatContactsStore } from "@/store/chat-contacts.store";
import { useRouter, useSearchParams } from "next/navigation";
import { useChatStore } from "@/store/useChatStore";
import { AuthService } from "@/services/auth.service";
import Link from "next/link";
import { ChatContact } from "@/types/chat.types";
import { getMatchedContacts } from "@/utils/getMatchedContacts";
import { OneToOneChatHeader } from "./OneToOneChatHeader";

interface currentMentorUser {
  username: string;
  role: string;
}

interface Message {
  id: string;
  sentBy: string;
  sentTo: string;
  message: string;
  isSeen: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ChatMessagesProps {
  selectedUser: ChatContact | null;
  setSelectedUser: React.Dispatch<React.SetStateAction<ChatContact | null>>;
  isSidebarOpen: boolean;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isProfileOpen: boolean;
  setIsProfileOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading: boolean;
  messages: Message[];
  currentUser: currentMentorUser;
  currentActiveUser: { userName: string; role: "mentor" | "mentee" };
  handleSendMessage: (e: React.FormEvent) => void;
  messageInput: string;
  setMessageInput: React.Dispatch<React.SetStateAction<string>>;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  onPhoneClick: () => void;
}

const formatDate = (date: Date) => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return date.toLocaleDateString(undefined, options);
};

const isSameDay = (date1: Date, date2: Date) => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

const OneToOneChatMessages = ({
  selectedUser,
  setSelectedUser,
  isSidebarOpen,
  setIsSidebarOpen,
  isProfileOpen,
  setIsProfileOpen,
  isLoading,
  messages,

  handleSendMessage,
  messageInput,
  setMessageInput,
  messagesEndRef,
  onPhoneClick,
}: ChatMessagesProps) => {
  const { filteredContacts } = useChatContactsStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setSession, setChatSelectedUser } = useChatStore();

  const currentActiveUser = React.useMemo(() => {
    try {
      return AuthService.getStoredUser();
    } catch {
      return null;
    }
  }, []);

  const matchedContacts = React.useMemo(() => {
    return getMatchedContacts(
      filteredContacts,
      currentActiveUser?.role === "mentor" ? currentActiveUser.userName : null,
    );
  }, [filteredContacts, currentActiveUser]);

  const handleContactSelect = (contact: ChatContact) => {
    const currentActiveUser = AuthService.getStoredUser();
    if (!currentActiveUser) {
      router.push("/login");
      return;
    }

    setSelectedUser(contact);
    const params = new URLSearchParams(searchParams);
    const isMentor = currentActiveUser?.role === "mentor";

    params.set(
      "mentee",
      isMentor ? contact.username : currentActiveUser?.userName,
    );
    params.set(
      "mentor",
      isMentor ? currentActiveUser?.userName : contact.username,
    );
    router.push(`/chat?${params.toString()}`);

    setSession(
      isMentor ? currentActiveUser.userName : contact.username,
      isMentor ? contact.username : currentActiveUser.userName,
    );
    setChatSelectedUser(contact);
  };

  const renderChatView = () => {
    if (!selectedUser) return null;

    let lastMessageDate: Date | null = null;

    return (
      <div className="flex flex-col h-full bg-gradient-to-b from-background to-muted/20">
        <OneToOneChatHeader
          selectedUser={selectedUser}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          onPhoneClick={onPhoneClick}
        />

        <ScrollArea className="flex-1 px-4 py-6 overflow-y-auto">
          {isLoading ? (
            <Skeleton className="w-full h-full" />
          ) : (
            <AnimatePresence initial={false}>
              {messages?.map((message) => {
                const messageDate = new Date(message.createdAt);
                const showDateDivider =
                  !lastMessageDate || !isSameDay(lastMessageDate, messageDate);
                lastMessageDate = messageDate;

                return (
                  <React.Fragment key={message.id}>
                    {showDateDivider && (
                      <div className="text-center my-4">
                        <span className="px-4 py-1 bg-muted font-semibold text-muted-foreground rounded-full text-xs">
                          {formatDate(messageDate)}
                        </span>
                      </div>
                    )}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={cn(
                        "flex mb-4 items-end gap-2",
                        message.sentBy === currentActiveUser?.userName
                          ? "justify-end"
                          : "justify-start",
                      )}
                    >
                      <div
                        className={cn(
                          "max-w-[80%] rounded-2xl px-4 py-2 shadow-sm",
                          message.sentBy === currentActiveUser?.userName
                            ? "bg-primary text-primary-foreground rounded-br-none"
                            : "bg-muted rounded-bl-none",
                        )}
                      >
                        <p className="text-sm leading-relaxed">
                          {message.message}
                        </p>
                        <span className="text-[9px] font-semibold opacity-50 block">
                          {new Date(message.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </motion.div>
                  </React.Fragment>
                );
              })}
              <div ref={messagesEndRef} />
            </AnimatePresence>
          )}
        </ScrollArea>

        <footer className="p-4 border-t bg-background/80 backdrop-blur-sm">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <Input
              placeholder="Type a message..."
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              className="flex-1 rounded-full bg-muted border-none"
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage(e)}
            />
            <Button type="submit" size="icon" className="rounded-full">
              <Send className="h-5 w-5" />
              <span className="sr-only">Send message</span>
            </Button>
          </form>
        </footer>
      </div>
    );
  };

  return <main className="flex-1 flex flex-col">{renderChatView()}</main>;
};

export default OneToOneChatMessages;
