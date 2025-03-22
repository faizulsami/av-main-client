"use client";

import { useAuth } from "@/hooks/useAuth";
import { get_socket } from "@/utils/get-socket";
import { useEffect } from "react";

const SocketCom = () => {
  const { user } = useAuth();

  useEffect(() => {
    const socket = get_socket();

    if (!socket || !user) return;
    socket.emit("join", { fromUsername: user.userName });
  }, [user]);

  return <div></div>;
};

export default SocketCom;
