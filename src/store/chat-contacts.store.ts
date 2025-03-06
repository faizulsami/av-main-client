import { ChatContact } from "@/types/chat.types";
import { create } from "zustand";

interface ChatContactsStore {
  filteredContacts: ChatContact[];
  setFilteredContacts: (contacts: ChatContact[]) => void;
}

export const useChatContactsStore = create<ChatContactsStore>((set) => ({
  filteredContacts: [],
  setFilteredContacts: (contacts) => set({ filteredContacts: contacts }),
}));
