import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Phone } from "lucide-react";
import React from "react";

interface CallInviteDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  caller: string;

  onAccept: () => void;
  onReject: () => void;
}

const CallInviteDialog: React.FC<CallInviteDialogProps> = ({
  isOpen,
  onOpenChange,
  caller,
  onAccept,
  onReject,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Incoming audio Call</DialogTitle>
          <DialogDescription className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            {caller} is calling you
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex gap-2">
          <Button variant="destructive" onClick={onReject}>
            Decline
          </Button>
          <Button onClick={onAccept}>Accept</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CallInviteDialog;
