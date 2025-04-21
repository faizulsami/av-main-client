import { io } from "socket.io-client";

const socket = io(process.env.NEXT_PUBLIC_API_URL, {
  auth: {
    username: "TestUser1",
  },
  path: "/socket.io",
  transports: ["websocket"],
});

export default socket;
