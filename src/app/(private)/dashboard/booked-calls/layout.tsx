/* eslint-disable prettier/prettier */
"use client";

import Loading from "@/app/loading";
import { useAuth } from "@/hooks/useAuth";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  if (!loading) {
    if (!user) {
      redirect("/login");
      return null;
    }
    console.log("here1");
    if (user.role !== "mentor") {
      redirect("/");
      return null;
    }
    console.log("here2");
    if (!user?.adminApproval) {
      redirect("/");
      return null;
    }

    setIsLoading(false);
  }

  if (loading || isLoading) {
    return <Loading />;
  }

  return <div className="bg-soft-paste-light">{children}</div>;
}
