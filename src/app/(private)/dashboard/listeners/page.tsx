"use client";

import { useState } from "react";
import { useApprovedMentors } from "@/hooks/useApprovedMentors";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Trash2, Eye, UserCheck } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MentorRequest } from "@/types/mentor.types";
import { MentorDetailsDialog } from "../listener-requests/_components/MentorDetailsDialog";
import { getAvatarUrl } from "@/utils/getAvatarUrl";

interface MentorPermissions {
  canCreateCourses: boolean;
  canReviewSubmissions: boolean;
  canMentorStudents: boolean;
  isFeatured: boolean;
  isOnline: boolean;
}

const LoadingTableRow = () => (
  <TableRow>
    <TableCell>
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div>
          <Skeleton className="h-4 w-[150px] mb-2" />
          <Skeleton className="h-3 w-[120px]" />
        </div>
      </div>
    </TableCell>
    <TableCell>
      <Skeleton className="h-4 w-[120px]" />
    </TableCell>
    <TableCell>
      <Skeleton className="h-8 w-[100px]" />
    </TableCell>
  </TableRow>
);

export default function ApprovedMentors() {
  const { approvedMentors, isLoading, deleteMentor } = useApprovedMentors();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState<MentorRequest | null>(
    null,
  );
  const [permissions, setPermissions] = useState<MentorPermissions>({
    canCreateCourses: false,
    canReviewSubmissions: false,
    canMentorStudents: false,
    isFeatured: false,
    isOnline: false,
  });

  const handlePermissionUpdate = async () => {
    try {
      // await updateMentorPermissions(selectedMentor?.id, permissions)
      setEditDialogOpen(false);
      setSelectedMentor(null);
    } catch (error) {
      console.error("Error updating mentor permissions:", error);
    }
  };

  const handleDeleteClick = (mentor: MentorRequest) => {
    setSelectedMentor(mentor);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedMentor) {
      try {
        // await deleteMentor(selectedMentor?.id)
        await deleteMentor(selectedMentor.id);
        setDeleteDialogOpen(false);
        setSelectedMentor(null);
      } catch (error) {
        console.error("Error deleting mentor:", error);
      }
    }
  };

  const handleViewDetails = (mentor: MentorRequest) => {
    setSelectedMentor(mentor);
    setDetailsDialogOpen(true);
  };

  return (
    <div className="h-full pb-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-bold flex items-center gap-2 text-muted-foreground text-sm">
          <UserCheck
            size={22}
            className="text-soft-paste-dark bg-soft-paste-light-active rounded-full p-1"
          />
          {isLoading ? <Skeleton className="h-8 w-48" /> : "Approved Listeners"}
        </h1>
      </div>

      <div className="border rounded-sm overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Designation</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <LoadingTableRow key={index} />
              ))
            ) : !approvedMentors.length ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center text-gray-500 py-8"
                >
                  No approved listeners found
                </TableCell>
              </TableRow>
            ) : (
              approvedMentors.map((mentor) => (
                <TableRow key={mentor?.id}>
                  <TableCell className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage
                        src={getAvatarUrl(mentor?.gender)}
                        alt={mentor?.name}
                      />
                      <AvatarFallback>{mentor?.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{mentor?.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {mentor?.email}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>{mentor?.designation}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-blue-500 hover:text-blue-600 hover:bg-blue-50"
                        onClick={() => handleViewDetails(mentor)}
                      >
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">View Details</span>
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() => handleDeleteClick(mentor)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <MentorDetailsDialog
        mentor={selectedMentor}
        open={detailsDialogOpen}
        onOpenChange={setDetailsDialogOpen}
      />

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-md font-bold">
              Mentor Permissions
            </DialogTitle>
            <DialogDescription className="text-xs">
              Configure mentor permissions and access levels
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-sm">Review Submissions</h4>
                  <p className="text-xs text-muted-foreground">
                    Review and grade student work
                  </p>
                </div>
                <Button
                  size="sm"
                  variant={
                    permissions.canReviewSubmissions ? "default" : "outline"
                  }
                  onClick={() =>
                    setPermissions((prev) => ({
                      ...prev,
                      canReviewSubmissions: !prev.canReviewSubmissions,
                    }))
                  }
                  className="text-xs"
                >
                  {permissions.canReviewSubmissions ? "Enabled" : "Disabled"}
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-sm">Student Mentoring</h4>
                  <p className="text-xs text-muted-foreground">
                    Mentor and guide students
                  </p>
                </div>
                <Button
                  size="sm"
                  variant={
                    permissions.canMentorStudents ? "default" : "outline"
                  }
                  onClick={() =>
                    setPermissions((prev) => ({
                      ...prev,
                      canMentorStudents: !prev.canMentorStudents,
                    }))
                  }
                  className="text-xs"
                >
                  {permissions.canMentorStudents ? "Enabled" : "Disabled"}
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-sm">Featured Status</h4>
                  <p className="text-xs text-muted-foreground">
                    Highlight on platform
                  </p>
                </div>
                <Button
                  size="sm"
                  variant={permissions.isFeatured ? "default" : "outline"}
                  onClick={() =>
                    setPermissions((prev) => ({
                      ...prev,
                      isFeatured: !prev.isFeatured,
                    }))
                  }
                  className="text-xs"
                >
                  {permissions.isFeatured ? "Featured" : "Regular"}
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-sm">Account Status</h4>
                  <p className="text-xs text-muted-foreground">
                    Active or inactive state
                  </p>
                </div>
                <Button
                  size="sm"
                  variant={permissions.isOnline ? "default" : "outline"}
                  onClick={() =>
                    setPermissions((prev) => ({
                      ...prev,
                      isOnline: !prev.isOnline,
                    }))
                  }
                  className="text-xs"
                >
                  {permissions.isOnline ? "Active" : "Inactive"}
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setEditDialogOpen(false)}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handlePermissionUpdate}
              className="text-xs"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Mentor</DialogTitle>
            <DialogDescription className="text-sm">
              Are you sure you want to delete this mentor? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
