"use client";

import { useAuth } from "@/hooks/useAuth";
import { get_socket } from "@/utils/get-socket";
import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";

const SocketCom = () => {
  const { user } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    setSocket(get_socket());
  }, []);
  useEffect(() => {
    if (!socket || !user) return;
    socket.emit("join", { fromUsername: user.userName });
  }, [user, socket]);

  return <div></div>;
};

export default SocketCom;
