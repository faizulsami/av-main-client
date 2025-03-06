"use client";

import { useState, useCallback } from "react";
import { useMentorRequests } from "@/hooks/useMentorRequests";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { DialogState } from "@/types/mentor.types";
import { MentorTable } from "./_components/MentorTable";
import { MentorDialog } from "./_components/MentorDialog";
import { MentorDetailsDialog } from "./_components/MentorDetailsDialog";
import { UsersRound } from "lucide-react";

export default function MentorRequests() {
  const {
    mentorRequests,
    isLoading,
    error,
    approveMentor,
    rejectMentor,
    refetch,
  } = useMentorRequests();
  const [dialogState, setDialogState] = useState<DialogState>({
    type: null,
    mentor: null,
  });
  console.log("listener Requests:", mentorRequests);

  const handleAction = useCallback(
    async (type: "approve" | "reject") => {
      if (!dialogState.mentor) return;

      try {
        if (type === "approve") {
          await approveMentor(dialogState.mentor.userName);
        } else {
          await rejectMentor(dialogState.mentor.id);
        }
        await refetch();
      } catch (error) {
        console.error(`Failed to ${type} mentor:`, error);
      } finally {
        setDialogState({ type: null, mentor: null });
      }
    },
    [dialogState, approveMentor, rejectMentor, refetch],
  );

  if (error) {
    return (
      <Alert variant="destructive" className="max-w-2xl mx-auto mt-4">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-bold flex items-center gap-2 text-muted-foreground text-sm">
          <UsersRound
            size={22}
            className="text-soft-paste-dark bg-soft-paste-light-active rounded-full p-1"
          />
          {isLoading ? <Skeleton className="h-8 w-48" /> : "Listener Requests"}
        </h1>
      </div>

      <div className="border rounded-sm">
        <MentorTable
          mentorRequests={mentorRequests}
          isLoading={isLoading}
          onApprove={(mentor) => setDialogState({ type: "approve", mentor })}
          onReject={(mentor) => setDialogState({ type: "reject", mentor })}
          onViewDetails={(mentor) =>
            setDialogState({ type: "details", mentor })
          }
        />
      </div>

      {dialogState.type === "details" ? (
        <MentorDetailsDialog
          mentor={dialogState.mentor}
          open={dialogState.type === "details"}
          onOpenChange={(open) =>
            !open && setDialogState({ type: null, mentor: null })
          }
        />
      ) : (
        <MentorDialog
          open={Boolean(dialogState.type)}
          onOpenChange={(open) =>
            !open && setDialogState({ type: null, mentor: null })
          }
          title={`${dialogState.type === "approve" ? "Approve" : "Reject"} listener Request`}
          description={
            dialogState.type === "approve" && dialogState.mentor
              ? `Are you sure you want to approve ${dialogState.mentor.name} as a listener? They will gain access to mentor features on the platform.`
              : dialogState.type === "reject" && dialogState.mentor
                ? `Are you sure you want to reject ${dialogState.mentor.name}'s listener request? This action cannot be undone.`
                : ""
          }
          onConfirm={() =>
            handleAction(dialogState.type as "approve" | "reject")
          }
          confirmLabel={dialogState.type === "approve" ? "Approve" : "Reject"}
          confirmVariant={
            dialogState.type === "approve" ? "default" : "destructive"
          }
        />
      )}
    </div>
  );
}
