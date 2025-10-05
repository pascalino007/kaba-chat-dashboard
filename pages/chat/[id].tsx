import React, { useEffect, useState, useRef } from "react";
import Layout from "../../components/layout/Layout";
import { useRouter } from "next/router";
import { Send, Image as ImageIcon } from "lucide-react";
import io from "socket.io-client";
import axios from "axios";

interface Message {
  id?: number;
  senderId: number;
  receiverId: number;
  text: string;
  createdAt?: string;
}

const CUSTOMER_SERVICE_ID =  92109474;
const SOCKET_URL = "http://168.231.101.119:5000";
const API_URL = "http://168.231.101.119:5000";

const ChatPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const userId = id ? Number(id) : null;

  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const socketRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll helper
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!userId) return;

    const socket = io(SOCKET_URL, { transports: ["websocket"] });
    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("✅ Connected:", socket.id);
      socket.emit("/register", CUSTOMER_SERVICE_ID);
    });

    socket.emit("/getMessages", {
      userId: CUSTOMER_SERVICE_ID,
      otherId: userId,
    });

    socket.on("messages", (data: Message[]) => {
      setMessages(data);
    });

    socket.on("message", (msg: Message) => {
      setMessages((prev) => {
        const exists = prev.some((m) => m.id === msg.id);
        return exists ? prev : [...prev, msg];
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [userId]);

  useEffect(scrollToBottom, [messages]);

  // Send text message
  const handleSend = () => {
    if (!newMessage.trim() || !userId) return;

    const msg = {
      senderId: CUSTOMER_SERVICE_ID,
      receiverId: userId,
      text: newMessage.trim(),
    };

    socketRef.current.emit("/message", msg);
    setNewMessage("");
  };

  // Upload and send image
  const handleImageUpload = async (file: File) => {
    if (!file || !userId) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      console.log("📤 Uploading:", file.name);
      const response = await axios.post(`${API_URL}/upload-image`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const imageUrl = response.data.url;
      console.log("✅ Uploaded:", imageUrl);

      socketRef.current.emit("/message", {
        senderId: CUSTOMER_SERVICE_ID,
        receiverId: userId,
        text: imageUrl,
      });
    } catch (error: any) {
      console.error("❌ Upload failed:", error.response?.data || error.message);
    }
  };

  return (
    <Layout>
      <div className="flex flex-col h-screen ml-5">
        {/* Header */}
        <div className="flex w-full px-6 py-4 border-b bg-white shadow-sm">
          <h1 className="text-lg font-semibold text-gray-800">
            Discussion avec{" "}
            <span className="text-[#CD1F45]">Utilisateur {userId}</span>
          </h1>
        </div>

        {/* Chat messages */}
        <div className="flex-1 overflow-y-auto p-6 text-black bg-gray-50">
          {messages.length === 0 ? (
            <p className="text-gray-500">Aucun message pour le moment.</p>
          ) : (
            messages.map((msg, index) => {
              const isCS = msg.senderId === CUSTOMER_SERVICE_ID;
              const isImage = msg.text.startsWith("http");
              const formattedDate = msg.createdAt
                ? new Date(msg.createdAt).toLocaleString("fr-FR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "";

              return (
                <div
                  key={index}
                  className={`flex mb-3 ${isCS ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`px-4 py-2 rounded-2xl shadow ${
                      isCS
                        ? "bg-[#CD1F45] text-white rounded-br-none"
                        : "bg-white text-gray-800 border rounded-bl-none"
                    }`}
                  >
                    {isImage ? (
                      <img
                        src={msg.text}
                        alt="Image"
                        className="max-w-xs rounded-lg border"
                      />
                    ) : (
                      <p>{msg.text}</p>
                    )}
                    <span className="text-xs opacity-70 block mt-1">
                      {formattedDate}
                    </span>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input section */}
        <div className="p-4 border-t bg-white">
          <div className="flex items-center space-x-2">
            {/* Image picker */}
            <label className="cursor-pointer">
              <ImageIcon className="w-6 h-6 text-gray-500 hover:text-[#CD1F45]" />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImageUpload(file);
                }}
              />
            </label>

            {/* Text input */}
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Écrire un message..."
              className="flex-1 px-4 py-2 border rounded-full focus:ring-2 focus:ring-[#CD1F45] focus:outline-none"
            />

            <button
              onClick={handleSend}
              className="bg-[#CD1F45] text-white p-3 rounded-full hover:bg-[#b01a3a] transition"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ChatPage;
