import ProtectedRoute from "@/private/ProtectedRoute";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return <ProtectedRoute allowedRoles={["admin"]}>{children}</ProtectedRoute>;
};

export default Layout;
