/* eslint-disable prettier/prettier */
"use client";

import Loading from "@/app/loading";
import { useAuth } from "@/hooks/useAuth";
import { redirect } from "next/navigation";

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();

  if (!loading) {
    if (!user) {
      redirect("/login");
      return null;
    } else if (user.role !== "mentor") {
      redirect("/");
      return null;
    } else if (!user?.adminApproval) {
      redirect("/");
      return null;
    }
  }

  if (loading) {
    return <Loading />;
  }

  return <div className="bg-soft-paste-light">{children}</div>;
}
