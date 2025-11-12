import React, { useEffect, useState, useRef } from "react";
import Layout from "../../components/layout/Layout";
import { useRouter } from "next/router";
import { Send, Image as ImageIcon, Loader2, ChevronLeft, ArrowDown } from "lucide-react";
import io from "socket.io-client";
import axios from "axios";

interface Message {
  id?: number;
  senderId: number;
  receiverId: number;
  text: string;
  createdAt?: string;
}

const CUSTOMER_SERVICE_ID = 92109474;
const SOCKET_URL = "https://kaba-chat-api.kabatitude.com";
const API_URL = "https://kaba-chat-api.kabatitude.com";

const ChatPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const userId = id ? Number(id) : null;

  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedImageName, setSelectedImageName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasNewBelow, setHasNewBelow] = useState(false);

  const socketRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Scroll helper
  const scrollToBottom = (smooth = true) => {
    messagesEndRef.current?.scrollIntoView({ behavior: smooth ? "smooth" : "auto" });
    setHasNewBelow(false);
  };

  // show "new messages" indicator if user scrolled up
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onScroll = () => {
      const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 120;
      if (!atBottom) setHasNewBelow(true);
    };
    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!userId) return;
    // show loading whenever userId changes (e.g. clicking a label -> open chat)
    setLoading(true);

    const socket = io(SOCKET_URL, { transports: ["websocket"] });
    socketRef.current = socket;

    socket.on("connect", () => {
      socket.emit("/register", CUSTOMER_SERVICE_ID);
    });

    // Request previous messages
    socket.emit("/getMessages", {
      userId: CUSTOMER_SERVICE_ID,
      otherId: userId,
    });

    // When we receive all messages
    socket.on("messages", (data: Message[]) => {
      // ensure sorted by createdAt ascending
      const sorted = (data || []).slice().sort((a, b) => {
        const ta = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const tb = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return ta - tb;
      });
      setMessages(sorted);
      // finished loading messages for this conversation
      setLoading(false);
      // scroll after small delay to allow layout
      setTimeout(() => scrollToBottom(false), 60);
    });

    // When we receive new individual message
    socket.on("message", (msg: Message) => {
      // filter to keep only messages for this conversation
      const otherId = userId;
      const belongsToConversation =
        otherId &&
        ((msg.senderId === otherId && msg.receiverId === CUSTOMER_SERVICE_ID) ||
          (msg.receiverId === otherId && msg.senderId === CUSTOMER_SERVICE_ID));

      if (!belongsToConversation) {
        // not for this open chat -> ignore here; sidebar will handle notification
        return;
      }

      setMessages((prev) => {
        const exists = prev.some((m) => m.id === msg.id);
        const next = exists ? prev : [...prev, msg];
        // keep ascending order
        next.sort((a, b) => {
          const ta = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const tb = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return ta - tb;
        });
        return next;
      });
      // if window not visible, notify and play sound
      if (document.hidden) {
        const title = `Message from ${msg.senderId === CUSTOMER_SERVICE_ID ? "Service" : `User ${msg.senderId}`}`;
        const body = msg.text && (msg.text.length > 120 ? msg.text.slice(0, 120) + "…" : msg.text);
        showBrowserNotification(title, body);
        playSound();
      }

      // if user is near bottom, auto-scroll
      const el = containerRef.current;
      const atBottom = !el || el.scrollHeight - el.scrollTop - el.clientHeight < 160;
      if (atBottom) scrollToBottom();
      else setHasNewBelow(true);
    });

    return () => {
      socket.disconnect();
    };
  }, [userId]);

  useEffect(() => {
    // whenever messages update and user is at bottom, keep it scrolled
    const el = containerRef.current;
    const atBottom = !el || el.scrollHeight - el.scrollTop - el.clientHeight < 160;
    if (atBottom) scrollToBottom(false);
  }, [messages.length]);

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
      setSelectedImageName(file.name);
      const response = await axios.post(`${API_URL}/upload-image`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const imageUrl = response.data.url;

      socketRef.current.emit("/message", {
        senderId: CUSTOMER_SERVICE_ID,
        receiverId: userId,
        text: imageUrl,
      });

      // clear preview name shortly after successful send
      setTimeout(() => setSelectedImageName(null), 1200);
    } catch (error: any) {
      setSelectedImageName(null);
      console.error("❌ Upload failed:", error.response?.data || error.message);
    }
  };

  const formatTime = (iso?: string) => {
    if (!iso) return "";
    try {
      const d = new Date(iso);
      return d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
    } catch {
      return iso;
    }
  };

  const formatDateHeader = (iso?: string) => {
    if (!iso) return "";
    try {
      const d = new Date(iso);
      return d.toLocaleDateString("fr-FR", { weekday: "short", day: "2-digit", month: "short" });
    } catch {
      return iso;
    }
  };

  // group messages by day for separators
  const groupedByDay = messages.reduce<Record<string, Message[]>>((acc, msg) => {
    const key = msg.createdAt ? new Date(msg.createdAt).toDateString() : "unknown";
    (acc[key] = acc[key] || []).push(msg);
    return acc;
  }, {});

  return (
    <Layout>
      {/* ensure main content is pushed right when Sidebar is fixed (w-80 / 20rem) */}
      <div className="sm:ml-10 flex items-stretch h-screen">
        {/* Chat panel - wider (more left/right space) */}
        <div className="relative flex flex-col flex-1 max-w-7xl w-full mx-auto my-2 bg-white rounded-2xl shadow-lg overflow-hidden px-6">
          {/* Loading overlay when opening a chat (e.g. from label click) */}
          {loading && (
            <div className="absolute inset-0 z-40 flex items-center justify-center bg-white/60 backdrop-blur-sm">
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="w-8 h-8 animate-spin text-[#CD1F45]" />
                <div className="text-sm text-gray-700">Chargement de la conversation…</div>
              </div>
            </div>
          )}

          {/* Header */}
          <div className="flex items-center gap-4 px-6 py-4 border-b">
            <button
              onClick={() => router.back()}
              className="p-2 rounded-md hover:bg-gray-100"
              aria-label="back"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full flex items-center justify-center font-semibold text-white"
                   style={{ background: "linear-gradient(135deg,#CD1F45,#FF7A8A)" }}>
                U{userId ?? "?"}
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-900">
                  Utilisateur {userId ?? "—"}
                </div>
                <div className="text-xs text-gray-500">Discussion • {messages.length} messages</div>
              </div>
            </div>

            <div className="ml-auto text-xs text-gray-400">
              Service client
            </div>
          </div>

          {/* Messages area */}
          <div
            ref={containerRef}
            className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-gray-50 to-white"
            style={{ scrollbarGutter: "stable" }}
          >
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="w-8 h-8 animate-spin text-[#CD1F45]" />
                  <div className="text-sm text-gray-600">Chargement des messages…</div>
                </div>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 mt-12 text-gray-500">
                <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                  <ImageIcon className="w-6 h-6" />
                </div>
                <div className="text-sm">Aucun message pour le moment</div>
                <div className="text-xs text-gray-400">Envoyez un message pour démarrer la discussion</div>
              </div>
            ) : (
              <>
                {Object.keys(groupedByDay).map((dayKey) => (
                  <div key={dayKey}>
                    <div className="flex justify-center mb-4">
                      <div className="text-[12px] text-gray-400 bg-white/60 px-3 py-1 rounded-full border">
                        {formatDateHeader(groupedByDay[dayKey][0].createdAt)}
                      </div>
                    </div>

                    {groupedByDay[dayKey].map((msg, index) => {
                      const isCS = msg.senderId === CUSTOMER_SERVICE_ID;
                      const isImage = msg.text.startsWith("http");
                      const time = formatTime(msg.createdAt);
                      return (
                        <div
                          key={msg.id ?? `${dayKey}-${index}`}
                          className={`flex mb-3 ${isCS ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[90%] px-4 py-2 rounded-2xl shadow-sm break-words ${
                              isCS
                                ? "bg-gradient-to-br from-[#CD1F45] to-[#FF7A8A] text-white rounded-br-none"
                                : "bg-white border text-gray-800 rounded-bl-none"
                            }`}
                          >
                            {isImage ? (
                              <img
                                src={msg.text}
                                alt="Image"
                                className="max-w-full rounded-md border"
                              />
                            ) : (
                              <p className="text-sm" style={{ color: isCS ? "white" : "black" }}>
                                {msg.text}
                              </p>
                            )}
                            <div className="flex items-center justify-end mt-1">
                              <span className="text-[11px] opacity-70">{time}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* New message indicator */}
          {hasNewBelow && (
            <div className="absolute right-8 bottom-28">
              <button
                onClick={() => scrollToBottom()}
                className="flex items-center gap-2 bg-[#CD1F45] text-white px-3 py-2 rounded-full shadow-lg hover:scale-105 transition"
                aria-label="scroll to bottom"
              >
                <ArrowDown className="w-4 h-4" />
                Nouveau
              </button>
            </div>
          )}

          {/* Input section */}
          <div className="px-6 py-4 border-t bg-white">
                        <div className="flex items-center gap-3">
                          {/* Image picker */}
                          <label className="relative inline-flex items-center justify-center p-2 rounded-lg cursor-pointer hover:bg-gray-100">
                            <ImageIcon className="w-5 h-5 text-gray-600" />
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.currentTarget.files?.[0];
                                if (file) {
                                  handleImageUpload(file);
                                  // reset input so the same file can be selected again if needed
                                  e.currentTarget.value = "";
                                }
                              }}
                            />
                          </label>
            
                          <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleSend();
                            }}
                            placeholder="Écrire un message..."
                            className="flex-1 px-4 py-2 border rounded-full focus:outline-none"
                          />
            
                          <button
                            onClick={handleSend}
                            className="p-2 rounded-full bg-[#CD1F45] text-white hover:opacity-90"
                            aria-label="send"
                          >
                            <Send className="w-4 h-4" />
                          </button>
            
                          {selectedImageName && (
                            <div className="text-xs text-gray-500 ml-2">{selectedImageName}</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Layout>
              );
            };
            
            export default ChatPage;
function showBrowserNotification(title: string, body: string) {
  throw new Error("Function not implemented.");
}

function playSound() {
  throw new Error("Function not implemented.");
}

