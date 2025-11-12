"use client";

import { useRouter } from "next/navigation";
import React, { useState, useEffect, useMemo, useRef } from "react";
import { MoreVertical, Users, Tag, Plus, X, Search } from "lucide-react";
import { socket } from "@/lib/socket";

type Sender = {
  id: number;
  name: string;
  label?: string;
  color?: string;
  lastMessage?: string;
  lastMessageDate?: string; // ISO string
};

type LabelItem = {
  id: number;
  name: string;
  createdAt?: string;
};

const Sidebar: React.FC = () => {
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLabelModalOpen, setIsLabelModalOpen] = useState(false);
  const [currentUserForLabel, setCurrentUserForLabel] = useState<number | null>(null);
  const [labelInput, setLabelInput] = useState("");
  const [senders, setSenders] = useState<Sender[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeUserId, setActiveUserId] = useState<number | null>(null);
  const [labels, setLabels] = useState<LabelItem[]>([]);
  const [showLabels, setShowLabels] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [groupRecipients, setGroupRecipients] = useState("");
  const [groupMessage, setGroupMessage] = useState("");
  const [query, setQuery] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Unread message counts
  const [unreadCounts, setUnreadCounts] = useState<Record<number, number>>({});
  const activeUserRef = useRef<number | null>(null);
  useEffect(() => {
    activeUserRef.current = activeUserId;
  }, [activeUserId]);

  // total unread count (memoized)
  const totalUnread = useMemo(() => {
    return Object.values(unreadCounts).reduce((acc, v) => acc + (Number(v) || 0), 0);
  }, [unreadCounts]);

  const openFirstUnread = () => {
    const firstEntry = Object.entries(unreadCounts).find(([, count]) => Number(count) > 0);
    if (firstEntry) handleSelectUser(Number(firstEntry[0]));
  };

  const CUSTOMER_SERVICE_ID = 92109474;
  // use fixed backend URL directly
  const BACKEND_USERS_URL = "https://kaba-chat-api.kabatitude.com/users";

  // deterministic avatar color from id
  const colorFromId = (id: number) => {
    const palette = ["#FFB6C1", "#FFD700", "#ADD8E6", "#FFA07A", "#9370DB", "#7DD3FC", "#FBCFE8"];
    return palette[id % palette.length];
  };

  const capitalize = (s?: string) => {
    if (!s) return "";
    const clean = String(s).trim();
    return clean.charAt(0).toUpperCase() + clean.slice(1).toLowerCase();
  };

  useEffect(() => {
    setError(null);

    // ensure we register only after socket connects
    const onConnect = () => {
      try {
        socket.emit("/register", CUSTOMER_SERVICE_ID);
      } catch (e) {
        console.error("Socket register error:", e);
      }
    };

    const onConnectError = (err: any) => {
      console.error("Socket connect error:", err);
      setError("Realtime connection failed");
    };

    socket.on("connect", onConnect);
    socket.on("connect_error", onConnectError);

    const fetchUsers = async () => {
      try {
        setLoading(true);
        // direct call to backend users endpoint
        const res = await fetch(BACKEND_USERS_URL);
        if (!res.ok) {
          const body = await res.text().catch(() => "");
          throw new Error(`users fetch failed: ${res.status} ${res.statusText} ${body}`);
        }
        const data = await res.json();
        const formatted: Sender[] = (data || []).map((item: any) => ({
          id: item.id,
          name: capitalize(item.senderName || item.name || `User ${item.id}`),
          label: item.label || "",
          color: item.color || colorFromId(item.id),
          lastMessage: item.lastMessage || item.text || "",
          lastMessageDate: item.lastMessageDate || item.createdAt || undefined,
        }));

        formatted.sort((a, b) => {
          const da = a.lastMessageDate ? new Date(a.lastMessageDate).getTime() : 0;
          const db = b.lastMessageDate ? new Date(b.lastMessageDate).getTime() : 0;
          return db - da;
        });
        setSenders(formatted);
      } catch (err: any) {
        console.error("❌ Failed to load users:", err);
        setError(`Failed to load conversations: ${err?.message || err}`);
      } finally {
        setLoading(false);
      }
    };

    // fetch only users (do not fetch labels)
    fetchUsers();

    const handleMessage = (message: any) => {
      const senderId = Number(message.senderId);
      const receiverId = Number(message.receiverId);
      const nowIso = new Date().toISOString();
      const participantId = receiverId === CUSTOMER_SERVICE_ID ? senderId : receiverId;

      setSenders((prev) => {
        let found = false;
        const mapped = prev.map((s) => {
          if (s.id === participantId) {
            found = true;
            return {
              ...s,
              lastMessage: message.text || message.body || message.message || "New message",
              lastMessageDate: message.createdAt || message.sentAt || nowIso,
              color: s.color || colorFromId(participantId),
              name: capitalize(message.senderName || s.name),
            };
          }
          return s;
        });
        if (!found) {
          mapped.push({
            id: participantId,
            name: capitalize(message.senderName || `User ${participantId}`),
            color: colorFromId(participantId),
            lastMessage: message.text || message.body || "New message",
            lastMessageDate: message.createdAt || message.sentAt || nowIso,
          });
        }
        mapped.sort((a, b) => {
          const da = a.lastMessageDate ? new Date(a.lastMessageDate).getTime() : 0;
          const db = b.lastMessageDate ? new Date(b.lastMessageDate).getTime() : 0;
          return db - da;
        });
        return mapped;
      });

      // increment unread when message is directed to CS (i.e. from a user)
      if (receiverId === CUSTOMER_SERVICE_ID) {
        setUnreadCounts((prev) => {
          const id = senderId;
          // if this conversation is currently open, clear unread for it
          const isActive = activeUserRef.current === id;
          const prevCount = Number(prev[id]) || 0;
          return { ...prev, [id]: isActive ? 0 : prevCount + 1 };
        });
      }

      // If message belongs to another conversation (not currently open) and sidebar is visible,
      // you might want to play a sound or add a desktop notification here.
    };

    socket.on("message", handleMessage);

    return () => {
      socket.off("connect", onConnect);
      socket.off("connect_error", onConnectError);
      socket.off("message", handleMessage);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formatDate = (iso?: string) => {
    if (!iso) return "";
    try {
      const d = new Date(iso);
      const today = new Date();
      const sameDay =
        d.getFullYear() === today.getFullYear() &&
        d.getMonth() === today.getMonth() &&
        d.getDate() === today.getDate();
      if (sameDay) {
        return d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
      }
      return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
    } catch {
      return iso;
    }
  };

  const handleSelectUser = (id: number) => {
    setActiveUserId(id);
    router.push(`/chat/${id}?name=${encodeURIComponent(`User ${id}`)}`);
    setUnreadCounts((prev) => ({ ...prev, [id]: 0 }));
  };

  const handleCreateLabel = async () => {
    if (!newLabel.trim()) return;
    try {
      const url = API ? `${API}/labels` : "/labels";
      const res = await fetch(url, {
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

  const handleDeleteConversation = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (!confirm("Delete this conversation? This cannot be undone.")) return;
    try {
      const url = API ? `${API}/conversations/${id}` : `/conversations/${id}`;
      const res = await fetch(url, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setSenders((prev) => prev.filter((s) => s.id !== id));
      setUnreadCounts((prev) => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
      if (activeUserId === id) setActiveUserId(null);
    } catch (err) {
      console.error("❌ Failed to delete conversation:", err);
      // fallback: still remove locally
      setSenders((prev) => prev.filter((s) => s.id !== id));
    }
  };

  const handleSendGroupMessage = () => {
    const ids = groupRecipients.split(",").map((id) => id.trim()).filter(Boolean);
    if (ids.length === 0 || !groupMessage.trim()) return;
    // send through socket for now
    ids.forEach((idStr) => {
      const id = Number(idStr);
      if (!Number.isFinite(id)) return;
      socket.emit("/message", {
        senderId: CUSTOMER_SERVICE_ID,
        receiverId: id,
        text: groupMessage.trim(),
        senderName: "Customer Service",
      });
    });
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
      prev.map((s) => (s.id === currentUserForLabel ? { ...s, label: labelInput } : s))
    );
    setIsLabelModalOpen(false);
  };

  const handleDeleteLabel = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    try {
      const url = API ? `${API}/labels/${id}` : `/labels/${id}`;
      await fetch(url, { method: "DELETE" });
      setLabels((prev) => prev.filter((l) => l.id !== id));
    } catch (err) {
      console.error("❌ Failed to delete label:", err);
    }
  };

  const filteredSenders = useMemo(() => {
    if (!query.trim()) return senders;
    const q = query.toLowerCase();
    return senders.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        (s.lastMessage || "").toLowerCase().includes(q) ||
        String(s.id).includes(q)
    );
  }, [senders, query]);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // request notification permission on mount
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission().catch(() => {});
    }

    // prepare audio (optional file: place /notify.mp3 in public/ if you prefer)
    try {
      audioRef.current = new Audio("/notify.mp3");
      audioRef.current.volume = 0.6;
    } catch {
      audioRef.current = null;
    }
  }, []);

  const playSound = () => {
    // try HTMLAudio first, fallback to WebAudio beep
    try {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {});
        return;
      }
      // WebAudio beep fallback
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "sine";
      o.frequency.value = 1000;
      g.gain.value = 0.05;
      o.connect(g);
      g.connect(ctx.destination);
      o.start();
      setTimeout(() => {
        o.stop();
        ctx.close();
      }, 120);
    } catch {
      /* ignore */
    }
  };

  const showBrowserNotification = (title: string, body?: string, onClick?: () => void) => {
    if (!("Notification" in window)) return;
    if (Notification.permission !== "granted") return;
    try {
      const n = new Notification(title, { body: body ?? undefined });
      n.onclick = () => {
        window.focus();
        onClick?.();
        try { n.close(); } catch {}
      };
    } catch {
      /* ignore */
    }
  };

  // inside your socket message handler (where you update senders/unread)
  // call this when a new incoming message arrives
  const onIncomingMessage = (message: any) => {
    const senderId = Number(message.senderId);
    const receiverId = Number(message.receiverId);
    // update senders/unread (existing logic)...
    // decide whether to notify:
    const isForCS = receiverId === CUSTOMER_SERVICE_ID;
    const participantId = isForCS ? senderId : receiverId;
    // If the conversation is not currently open OR the page is hidden => notify
    const shouldNotify = activeUserRef.current !== participantId || document.hidden;
    if (shouldNotify) {
      const title = isForCS ? `Message from ${message.senderName || `User ${senderId}`}` : "New message";
      const body = message.text && (message.text.length > 120 ? message.text.slice(0, 120) + "…" : message.text);
      showBrowserNotification(title, body, () => {
        // open conversation when clicked
        setActiveUserId(participantId);
        router.push(`/chat/${participantId}`);
      });
      playSound();
    }
  };

  return (
    <>
      {/* SIDEBAR */}
      <aside className="w-80 bg-white/95 backdrop-blur-md border-r border-gray-200 h-screen fixed left-0 top-0 z-40 flex flex-col shadow-lg">
        {error && (
          <div className="p-2 text-xs text-red-600 text-center bg-red-50 border-b border-red-100">
            {error}
          </div>
        )}
        <div className="p-4 border-b border-gray-200 bg-white/90">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-semibold text-gray-900 tracking-tight">Discussions</h2>
              {/* unread notifier */}
              {totalUnread > 0 && (
                <button
                  onClick={openFirstUnread}
                  className="ml-2 inline-flex items-center gap-2 bg-[#FEE2E2] text-[#9B1C2B] px-2 py-0.5 rounded-full text-xs font-semibold shadow-sm hover:scale-105 transition"
                  title="Open first unread conversation"
                >
                  <span className="text-[12px]">{totalUnread}</span>
                  <span className="sr-only">unread messages</span>
                </button>
              )}
            </div>

            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 transition"
                aria-label="menu"
              >
                <MoreVertical className="w-5 h-5 text-gray-600" />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white border border-gray-100 rounded-xl shadow-xl z-50 overflow-hidden">
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
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      setShowLabels((s) => !s);
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                  >
                    <Tag className="w-4 h-4 mr-2 text-[#6b7280]" />
                    {showLabels ? "Hide Labels" : "Show Labels"}
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                aria-label="Search conversations"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search people or messages..."
                className="w-full pl-10 pr-3 py-2 bg-gray-50 border border-gray-100 rounded-lg text-sm outline-none text-black focus:ring-1 focus:ring-[#CD1F45]"
              />
            </div>
            <div className="text-xs text-gray-500">Sorted by latest</div>
          </div>
        </div>

        {/* USERS LIST */}
        <div className="flex-1 overflow-y-auto p-3">
          {loading ? (
            <p className="text-gray-500 text-sm animate-pulse">Loading...</p>
          ) : filteredSenders.length === 0 ? (
            <div className="text-gray-400 text-sm text-center py-6">No messages yet</div>
          ) : (
            <ul className="space-y-2">
              {filteredSenders.map((user) => (
                <li
                  key={user.id}
                  onClick={() => handleSelectUser(user.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSelectUser(user.id);
                  }}
                  className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                    activeUserId === user.id
                      ? "bg-gradient-to-r from-white to-[#fff2f4] ring-1 ring-[#CD1F45]/20"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <div className="relative flex-shrink-0">
                    <div
                      className="w-11 h-11 flex items-center justify-center rounded-full font-semibold text-white text-sm"
                      style={{ backgroundColor: user.color || colorFromId(user.id) }}
                      title={capitalize(user.name)}
                    >
                      {capitalize(user.name).charAt(0)}
                    </div>

                    {unreadCounts[user.id] > 0 && (
                      <span className="absolute -top-1 -right-1 bg-[#CD1F45] text-white text-[10px] font-semibold px-1.5 py-0.5 rounded-full shadow-sm border-2 border-white">
                        {unreadCounts[user.id]}
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <p className="text-sm font-medium text-gray-900 truncate">{capitalize(user.name)}</p>
                      <span className="text-[11px] text-gray-400 ml-2">{formatDate(user.lastMessageDate)}</span>
                    </div>

                    <div className="flex items-center justify-between mt-1">
                      <div className="min-w-0">
                        <p className="text-xs text-gray-600 truncate">
                          {user.lastMessage
                            ? String(user.lastMessage).trim()
                            : "No messages yet"}
                        </p>
                        {user.label && (
                          <span
                            style={{ backgroundColor: user.color, color: "#fff" }}
                            className="text-[10px] px-2 py-0.5 rounded-full inline-block mt-1 shadow-sm"
                          >
                            {user.label}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center space-x-2 ml-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openLabelModal(user.id);
                          }}
                          className="text-xs text-gray-500 hover:text-[#CD1F45]"
                          aria-label="add label"
                        >
                          + Label
                        </button>

                        <button
                          onClick={(e) => handleDeleteConversation(e, user.id)}
                          className="p-1 rounded-md hover:bg-gray-100"
                          aria-label="delete conversation"
                          title="Delete conversation"
                        >
                          <X className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* LABELS SECTION */}
        {showLabels && (
          <div className="border-t border-gray-100 p-3 bg-white/90">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-semibold text-gray-800">Labels</h4>
              <button onClick={() => setShowLabels(false)} className="text-xs text-gray-500 hover:text-[#CD1F45]">
                Close
              </button>
            </div>

            <div className="space-y-2 max-h-44 overflow-y-auto">
              {labels.length === 0 ? (
                <p className="text-xs text-gray-400">No labels yet.</p>
              ) : (
                labels.map((l) => (
                  <div key={l.id} className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
                    <div>
                      <p className="text-sm text-gray-800">{l.name}</p>
                      <p className="text-[11px] text-gray-400">{formatDate(l.createdAt)}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button onClick={(e) => handleDeleteLabel(e, l.id)} className="p-1 rounded-md hover:bg-gray-100" aria-label="delete label">
                        <X className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="mt-3 flex space-x-2">
              <input
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                placeholder="New label"
                className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-[#CD1F45] outline-none text-black"
              />
              <button onClick={handleCreateLabel} className="bg-[#CD1F45] text-white px-3 py-2 rounded-lg text-sm hover:bg-[#b01a3a]" aria-label="create label">
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </aside>

      {/* CENTERED MODALS */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white w-96 rounded-2xl p-6 shadow-2xl relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-3 right-3 text-gray-500 hover:text-[#CD1F45]">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Send Group Message</h3>
            <input
              value={groupRecipients}
              onChange={(e) => setGroupRecipients(e.target.value)}
              placeholder="Enter user IDs separated by commas"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-3 focus:ring-1 focus:ring-[#CD1F45] outline-none text-black"
            />
            <textarea
              value={groupMessage}
              onChange={(e) => setGroupMessage(e.target.value)}
              placeholder="Enter your message"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm h-24 mb-4 focus:ring-1 focus:ring-[#CD1F45] outline-none text-black"
            />
            <button onClick={handleSendGroupMessage} className="bg-[#CD1F45] text-white w-full py-2 rounded-lg text-sm hover:bg-[#b01a3a] transition">
              Send Message
            </button>
          </div>
        </div>
      )}

      {isLabelModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white w-80 rounded-2xl p-6 shadow-xl relative">
            <button onClick={() => setIsLabelModalOpen(false)} className="absolute top-3 right-3 text-gray-500 hover:text-[#CD1F45]">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Add Label</h3>

            <div className="mb-3">
              <select
                value={labelInput}
                onChange={(e) => setLabelInput(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-2 focus:ring-1 focus:ring-[#CD1F45] outline-none text-black"
              >
                <option value="">— choose existing —</option>
                {labels.map((l) => (
                  <option key={l.id} value={l.name}>
                    {l.name}
                  </option>
                ))}
              </select>

              <input
                value={labelInput}
                onChange={(e) => setLabelInput(e.target.value)}
                placeholder="Or create a new label"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-[#CD1F45] outline-none text-black"
              />
            </div>

            <button onClick={saveLabel} className="bg-[#CD1F45] text-white w-full py-2 rounded-lg text-sm hover:bg-[#b01a3a] transition">
              Save Label
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
