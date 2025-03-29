"use client";
import { useEffect } from "react";
import DashboardHeader from "./_components/DashboardHeader";
import DashboardSidebar from "./_components/DashboardSidebar";
import { socketService } from "@/services/socket.service";
import ProtectedRoute from "@/private/ProtectedRoute";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    socketService.on("adminNotification", (data) => {
      console.log("New mentor request received", data);
      alert(`New mentor request received: ${data.message}`);
    });

    return () => {
      socketService.off("adminNotification", () => {});
    };
  });

  return (
    <ProtectedRoute allowedRoles={["admin", "mentor"]}>
      <div className="flex flex-row flex-1 gap-4 min-h-screen">
        <div className="sticky top-0 left-0 hidden w-60 flex-col border-r bg-white md:flex">
          <DashboardSidebar />
        </div>
        <div className="flex-1 px-4">
          <DashboardHeader />
          <main className="mt-4">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
