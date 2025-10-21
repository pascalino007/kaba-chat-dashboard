"use client";

import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { MoreVertical, Users, Tag, Plus } from "lucide-react";
import { socket } from "@/lib/socket";

const Sidebar: React.FC = () => {
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [senders, setSenders] = useState<{ id: number; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeUserId, setActiveUserId] = useState<number | null>(null);

  const [labels, setLabels] = useState<{ id: number; name: string }[]>([]);
  const [showLabels, setShowLabels] = useState(false);
  const [newLabel, setNewLabel] = useState("");

  const CUSTOMER_SERVICE_ID = 92109474;

  useEffect(() => {
    socket.emit("/register", CUSTOMER_SERVICE_ID);

    const fetchUsers = async () => {
      try {
        const res = await fetch("http://148.230.85.247:7000/users");
        const data = await res.json();

        // ✅ Convert senderName → name (keep same variable naming)
        const formatted = data.map((item: any) => ({
          id: item.id,
          name: item.senderName || `User ${item.id}`,
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
        const res = await fetch("http://148.230.85.247:7000/labels");
        const data = await res.json();
        setLabels(data);
      } catch (err) {
        console.error("❌ Failed to load labels:", err);
      }
    };

    fetchUsers();
    fetchLabels();

    // 🔄 Listen for new messages
    socket.on("message", (message: any) => {
      if (message.receiverId === CUSTOMER_SERVICE_ID) {
        setSenders((prev) => {
          if (!prev.find((s) => s.id === message.senderId)) {
            return [
              ...prev,
              { id: message.senderId, name: message.senderName || `User ${message.senderId}` },
            ];
          }
          return prev;
        });
      }
    });

    return () => {
      socket.off("message");
    };
  }, []);

  const handleSelectUser = (id: number) => {
    setActiveUserId(id);
    router.push(`/chat/${id}?name=User%20${id}`);
  };

  const handleCreateLabel = async () => {
    if (!newLabel.trim()) return;
    try {
      const res = await fetch("http://148.230.85.247:7000/labels", {
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

  return (
    <aside className="w-72 bg-white border-r border-gray-200 h-screen fixed left-0 top-0 z-50 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg text-black font-bold">Discussions</h2>

          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="p-1 rounded-lg hover:bg-gray-100"
            >
              <MoreVertical className="w-5 h-5 text-gray-600" />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <button
                  onClick={() => alert("Create group clicked")}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Create a group
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* User list */}
      <div className="flex-1 overflow-y-auto p-4">
        {loading ? (
          <p className="text-gray-500 text-sm">Loading...</p>
        ) : senders.length === 0 ? (
          <p className="text-gray-400 text-sm">No messages yet.</p>
        ) : (
          <ul className="space-y-2">
            {senders.map((user) => (
              <li
                key={user.id}
                onClick={() => handleSelectUser(user.id)}
                className={`flex items-center space-x-3 p-3 cursor-pointer rounded-lg transition ${
                  activeUserId === user.id
                    ? "bg-gray-200 font-semibold"
                    : "hover:bg-gray-100"
                }`}
              >
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-300 text-gray-700 font-bold">
                  {user.id.toString().slice(-2)}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm text-black font-medium truncate">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">ID: {user.id}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Labels section */}
      <div className="border-t border-gray-200 p-4">
        <button
          onClick={() => setShowLabels(!showLabels)}
          className="flex items-center justify-between w-full text-sm font-semibold text-gray-700 hover:text-black"
        >
          <span className="flex items-center gap-2">
            <Tag className="w-4 h-4" /> Étiquettes
          </span>
          <Plus className="w-4 h-4" />
        </button>

        {showLabels && (
          <div className="mt-3 space-y-2">
            {labels.map((label) => (
              <div
                key={label.id}
                className="px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-lg"
              >
                {label.name}
              </div>
            ))}

            {/* Create new label */}
            <div className="flex mt-3">
              <input
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                placeholder="Nouvelle étiquette"
                className="flex-1 border border-gray-300 rounded-l-lg px-2 py-1 text-sm"
              />
              <button
                onClick={handleCreateLabel}
                className="bg-blue-600 text-white px-3 rounded-r-lg text-sm"
              >
                +
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
