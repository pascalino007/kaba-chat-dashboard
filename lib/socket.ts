import { io } from "socket.io-client";

export const socket = io("http://192.168.1.67:5000", {
  transports: ["websocket"],
  reconnection: true,
});