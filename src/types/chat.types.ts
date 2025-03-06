export interface ChatUser {
  id: string;
  name: string;
  avatar: string;
  status: string;
  lastActive?: string;
  email?: string;
  role?: string;
}

export interface ChatMessage {
  id: string;
  content: string;
  senderId: string;
  timestamp: string;
}

export interface Message {
  id: string;
  content: string;
  senderId: string;
  timestamp: number;
}

export interface AppointmentSlot {
  time: string;
  isAvailable: boolean;
  _id: string;
}

export interface ChatContact {
  id: string;
  username: string;
  avatar: string;
  lastMessage: string;
  timestamp?: string;
  isActive?: boolean;
  hasHeart?: boolean;
  mentorName?: string;
  mentorUserName: string;
  duration: number;
  selectedSlot?: AppointmentSlot[];
}
