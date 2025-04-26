import { io, Socket } from "socket.io-client";

let socket: Socket;

export const get_socket = () => {
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
      transports: ["polling", "websocket"],
      reconnection: true,
      reconnectionAttempts: 3,
      reconnectionDelay: 5000,
    });
  }
  return socket;
};
