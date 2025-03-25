import * as React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { CalendarDays } from "lucide-react";
import { ChatContact } from "@/types/chat.types";
import { Badge } from "@/components/ui/badge";

interface UserInfoProps {
  selectedUser: ChatContact;
}

const OneToOneUserInfo: React.FC<UserInfoProps> = ({ selectedUser }) => {
  return (
    <div className="flex flex-col items-center p-6 text-center">
      <Avatar className="w-20 h-20 rounded-full mb-4">
        <AvatarImage
          src={selectedUser?.Avatar}
          alt={selectedUser.menteeUserName}
        />
        <AvatarFallback className="capitalize text-white bg-soft-paste-hover/50 font-bold">
          {selectedUser?.menteeUserName?.charAt(0)}
        </AvatarFallback>
      </Avatar>
      <h2 className="text-xl font-semibold">{selectedUser.menteeUserName}</h2>
      {/* <div className="flex items-center gap-1 mt-1">
        <span className="h-2 w-2 rounded-full bg-green-500" />
        <span className="text-sm text-green-500">Active Now</span>
      </div> */}

      <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground font-semibold">
        {/* <span className="flex items-center gap-1">
          <Clock size={16} />
          {selectedUser.duration || "N/A"} min Call
        </span>
        <span>•</span> */}
        <span className=""></span>
        <Badge
          variant="secondary"
          className="font-semibold flex items-center gap-1"
        >
          <CalendarDays size={16} />
          {selectedUser.selectedSlot?.[0]?.time
            ? selectedUser.selectedSlot[0].time
            : "Time not available"}
        </Badge>
      </div>
    </div>
  );
};

export default OneToOneUserInfo;
