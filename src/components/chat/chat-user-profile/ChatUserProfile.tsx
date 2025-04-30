import * as React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "../../ui/button";
import { AppointmentService } from "@/services/appointment.service";
import { useToast } from "@/hooks/use-toast";
import { useAppointments } from "@/hooks/useAppointments";
import { ChatContact } from "@/types/chat.types";
import UserInfo from "./UserInfo";
import CompleteDialog from "./CompleteDialog";
import CancelDialog from "./CancelDialog";
import { get_socket } from "@/utils/get-socket";

interface UserProfileProps {
  selectedUser: ChatContact;
  onStatusUpdate?: () => void;
}
// eslint-disable-next-line react/prop-types
const UserProfile: React.FC<UserProfileProps> = ({
  selectedUser,
  onStatusUpdate,
}) => {
  const [showCompleteDialog, setShowCompleteDialog] = React.useState(false);
  const [showCancelDialog, setShowCancelDialog] = React.useState(false);
  const { refetch } = useAppointments();
  const { toast } = useToast();

  const handleComplete = async () => {
    try {
      await AppointmentService.updateAppointment(selectedUser.id, {
        status: "completed",
      });
      const socket = get_socket();
      socket.emit("appointment-completed", {
        menteeUserName: selectedUser.username,
      });
      toast({
        title: "Success",
        description: "Appointment marked as completed",
      });
      await refetch();
      // onStatusUpdate?.();
      setShowCompleteDialog(false);
    } catch (error) {
      console.error("Failed to complete appointment", error);
      toast({
        title: "Error",
        description: "Failed to complete appointment",
        variant: "destructive",
      });
    }
  };

  const handleCancel = async () => {
    try {
      await AppointmentService.updateAppointment(selectedUser.id, {
        status: "cancelled",
      });

      const socket = get_socket();
      socket.emit("appointment-completed", {
        menteeUserName: selectedUser.username,
      });

      toast({
        title: "Success",
        description: "Appointment cancelled successfully",
      });
      await refetch();
      // onStatusUpdate?.();
      setShowCancelDialog(false);
    } catch (error) {
      console.error("Failed to cancel appointment", error);
      toast({
        title: "Error",
        description: "Failed to cancel appointment",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <Card className="h-full rounded-none border-0">
        <UserInfo selectedUser={selectedUser} />

        <div className="flex flex-col gap-4 mt-6">
          <Button
            size="sm"
            variant="default"
            className="bg-green-500 hover:bg-green-600"
            onClick={() => setShowCompleteDialog(true)}
          >
            Complete
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => setShowCancelDialog(true)}
          >
            Reject
          </Button>
        </div>
      </Card>

      <CompleteDialog
        isOpen={showCompleteDialog}
        onClose={() => setShowCompleteDialog(false)}
        onComplete={handleComplete}
      />

      <CancelDialog
        isOpen={showCancelDialog}
        onClose={() => setShowCancelDialog(false)}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default UserProfile;
