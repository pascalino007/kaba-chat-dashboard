import { io } from "socket.io-client";

export const socket = io("https://kaba-chat-api.kabatitude.com/", {
  transports: ["websocket"],
  reconnection: true,
});