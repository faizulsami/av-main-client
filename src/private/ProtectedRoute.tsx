"use client";
import Loading from "@/app/loading";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import React from "react";

type Roles = "admin" | "mentor" | "mentee" | "";

const ProtectedRoute = ({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles: Roles[];
}) => {
  const { user, loading } = useAuth();
  const router = useRouter();
  if (loading) return <Loading />;
  if ((!loading && !user) || !user?.role) {
    router.push("/login");
    return null;
  }
  if (user?.role === "mentor" && !user?.adminApproval) router.push("/");
  if (user?.role && !allowedRoles.includes(user.role)) {
    router.push("/");
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
