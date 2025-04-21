import { io, Socket } from "socket.io-client";

let socket: Socket;

export const get_socket = () => {
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
      path: "/socket.io",
    });
  }
  return socket;
};
