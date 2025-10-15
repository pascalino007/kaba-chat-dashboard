import { io } from "socket.io-client";

export const socket = io("http://148.230.85.247:7000/", {
  transports: ["websocket"],
  reconnection: true,
});