import { ChatContact } from "@/types/chat.types";

export const getMatchedContacts = (
  contacts: ChatContact[],
  mentorUserName: string | null,
) => {
  if (mentorUserName) {
    return contacts.filter(
      (contact) => contact.mentorUserName === mentorUserName,
    );
  }
  return contacts;
};
