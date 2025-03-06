import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface CompleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

const CompleteDialog: React.FC<CompleteDialogProps> = ({
  isOpen,
  onClose,
  onComplete,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Complete Appointment</DialogTitle>
          <DialogDescription>
            Are you sure you want to mark this appointment as completed?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            No, keep it
          </Button>
          <Button
            className="bg-green-500 hover:bg-green-600"
            onClick={onComplete}
          >
            Yes, complete it
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CompleteDialog;
