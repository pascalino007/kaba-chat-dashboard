"use client";

import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { MoreVertical, Users, Tag, Plus, X } from "lucide-react";
import { socket } from "@/lib/socket";

const Sidebar: React.FC = () => {
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLabelModalOpen, setIsLabelModalOpen] = useState(false);
  const [currentUserForLabel, setCurrentUserForLabel] = useState<number | null>(null);
  const [labelInput, setLabelInput] = useState("");
  const [senders, setSenders] = useState<{ id: number; name: string; label?: string; color?: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeUserId, setActiveUserId] = useState<number | null>(null);
  const [labels, setLabels] = useState<{ id: number; name: string }[]>([]);
  const [showLabels, setShowLabels] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [groupRecipients, setGroupRecipients] = useState("");
  const [groupMessage, setGroupMessage] = useState("");

  // 🆕 State for unread message counts
  const [unreadCounts, setUnreadCounts] = useState<Record<number, number>>({});

  const CUSTOMER_SERVICE_ID = 92109474;

  useEffect(() => {
    socket.emit("/register", CUSTOMER_SERVICE_ID);

    const fetchUsers = async () => {
      try {
        const res = await fetch("https://kaba-chat-api.kabatitude.com/users");
        const data = await res.json();
        const formatted = data.map((item: any) => ({
          id: item.id,
          name: item.senderName || `User ${item.id}`,
          label: "",
          color: getRandomColor(),
        }));
        setSenders(formatted);
      } catch (err) {
        console.error("❌ Failed to load users:", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchLabels = async () => {
      try {
        const res = await fetch("https://kaba-chat-api.kabatitude.com/labels");
        const data = await res.json();
        setLabels(data);
      } catch (err) {
        console.error("❌ Failed to load labels:", err);
      }
    };

    fetchUsers();
    fetchLabels();

    // 🆕 Handle incoming messages to update unread counts
    socket.on("message", (message: any) => {
      if (message.receiverId === CUSTOMER_SERVICE_ID) {
        setSenders((prev) => {
          if (!prev.find((s) => s.id === message.senderId)) {
            return [
              ...prev,
              {
                id: message.senderId,
                name: message.senderName || `User ${message.senderId}`,
                color: getRandomColor(),
              },
            ];
          }
          return prev;
        });

        // Increment unread count for that user
        setUnreadCounts((prev) => ({
          ...prev,
          [message.senderId]: (prev[message.senderId] || 0) + 1,
        }));
      }
    });

    return () => {
      socket.off("message");
    };
  }, []);

  const getRandomColor = () => {
    const colors = ["#FFB6C1", "#FFD700", "#ADD8E6", "#FFA07A", "#9370DB"];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const handleSelectUser = (id: number) => {
    setActiveUserId(id);
    router.push(`/chat/${id}?name=User%20${id}`);

    // 🆕 Reset unread count when opening a conversation
    setUnreadCounts((prev) => ({ ...prev, [id]: 0 }));
  };

  const handleCreateLabel = async () => {
    if (!newLabel.trim()) return;
    try {
      const res = await fetch("https://kaba-chat-api.kabatitude.com/labels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newLabel }),
      });
      const data = await res.json();
      setLabels((prev) => [...prev, data]);
      setNewLabel("");
    } catch (err) {
      console.error("❌ Failed to create label:", err);
    }
  };

  const handleSendGroupMessage = () => {
    const ids = groupRecipients.split(",").map((id) => id.trim());
    console.log("Sending message to:", ids, "Message:", groupMessage);
    setGroupRecipients("");
    setGroupMessage("");
    setIsModalOpen(false);
  };

  const openLabelModal = (userId: number) => {
    setCurrentUserForLabel(userId);
    setLabelInput("");
    setIsLabelModalOpen(true);
  };

  const saveLabel = () => {
    if (!labelInput.trim() || currentUserForLabel === null) return;
    setSenders((prev) =>
      prev.map((s) =>
        s.id === currentUserForLabel ? { ...s, label: labelInput } : s
      )
    );
    setIsLabelModalOpen(false);
  };

  return (
    <>
      {/* SIDEBAR */}
      <aside className="w-72 bg-white/95 backdrop-blur-md border-r border-gray-200 h-screen fixed left-0 top-0 z-40 flex flex-col shadow-sm">
        <div className="p-4 border-b border-gray-200 bg-white/80">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold text-gray-900 tracking-tight">
              Discussions
            </h2>

            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 transition"
              >
                <MoreVertical className="w-5 h-5 text-gray-600" />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-xl z-50 overflow-hidden animate-fade-in">
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      setIsModalOpen(true);
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                  >
                    <Users className="w-4 h-4 mr-2 text-[#CD1F45]" />
                    Create a group
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* USERS LIST */}
        <div className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          {loading ? (
            <p className="text-gray-500 text-sm animate-pulse">Loading...</p>
          ) : senders.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-6">
              No messages yet.
            </p>
          ) : (
            <ul className="space-y-2">
              {senders.map((user) => (
                <li
                  key={user.id}
                  onClick={() => handleSelectUser(user.id)}
                  className={`flex items-center space-x-3 p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                    activeUserId === user.id
                      ? "bg-gray-100 ring-1 ring-[#CD1F45]/20"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <div className="relative">
                    <div
                      className="w-10 h-10 flex items-center justify-center rounded-full font-semibold text-gray-800"
                      style={{ backgroundColor: user.color || "#f3f3f3" }}
                    >
                      {user.id.toString().slice(-2)}
                    </div>

                    {/* 🆕 Unread badge */}
                    {unreadCounts[user.id] > 0 && (
                      <span className="absolute -top-1 -right-1 bg-[#CD1F45] text-white text-[10px] font-semibold px-1.5 py-0.5 rounded-full shadow-md">
                        {unreadCounts[user.id]}
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {user.name}
                    </p>
                    {user.label ? (
                      <span
                        style={{ backgroundColor: user.color }}
                        className="text-[10px] px-2 py-0.5 rounded-full text-white inline-block mt-1"
                      >
                        {user.label}
                      </span>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openLabelModal(user.id);
                        }}
                        className="text-xs text-gray-500 hover:text-[#CD1F45] mt-1"
                      >
                        + Label
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* LABELS + MODALS */}
        {/* (unchanged code for labels + modals below) */}
        {/* ... */}
      </aside>

      {/* CENTERED MODALS (unchanged) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white w-96 rounded-2xl p-6 shadow-2xl relative animate-scale-in">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-[#CD1F45]"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-semibold mb-4 text-gray-900">
              Send Group Message
            </h3>
            <input
              value={groupRecipients}
              onChange={(e) => setGroupRecipients(e.target.value)}
              placeholder="Enter user IDs separated by commas"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-3 focus:ring-1 focus:ring-[#CD1F45] outline-none"
            />
            <textarea
              value={groupMessage}
              onChange={(e) => setGroupMessage(e.target.value)}
              placeholder="Enter your message"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm h-24 mb-4 focus:ring-1 focus:ring-[#CD1F45] outline-none"
            />
            <button
              onClick={handleSendGroupMessage}
              className="bg-[#CD1F45] text-white w-full py-2 rounded-lg text-sm hover:bg-[#b01a3a] transition"
            >
              Send Message
            </button>
          </div>
        </div>
      )}

      {isLabelModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white w-80 rounded-2xl p-6 shadow-xl relative animate-scale-in">
            <button
              onClick={() => setIsLabelModalOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-[#CD1F45]"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-semibold mb-4 text-gray-900">
              Add Label
            </h3>
            <input
              value={labelInput}
              onChange={(e) => setLabelInput(e.target.value)}
              placeholder="Enter label title"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-4 focus:ring-1 focus:ring-[#CD1F45] outline-none"
            />
            <button
              onClick={saveLabel}
              className="bg-[#CD1F45] text-white w-full py-2 rounded-lg text-sm hover:bg-[#b01a3a] transition"
            >
              Save Label
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
