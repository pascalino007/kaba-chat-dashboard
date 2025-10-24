"use client";

import React, { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import { useRouter } from "next/router";
import { Loader2, RefreshCcw, MessageSquare, Users, MessageCircle, Clock } from "lucide-react";
import axios from "axios";

const API_URL = "https://kaba-chat-api.kabatitude.com";
const CUSTOMER_SERVICE_ID = 92109474;

interface Conversation {
  userId: number;
  lastMessage: string;
  updatedAt: string;
}

interface DashboardStats {
  totalConversations: number;
  totalMessages: number;
  todayMessages: number;
  activeUsers: number;
}

const Dashboard: React.FC = () => {
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
   useEffect(() => {
    
    const token = localStorage.getItem('token');
    if (!token) {
      router.replace('/login');
    }
  }, [router]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [convRes, statsRes] = await Promise.all([
        axios.get(`${API_URL}/conversations/${CUSTOMER_SERVICE_ID}`),
        axios.get(`${API_URL}/stats/${CUSTOMER_SERVICE_ID}`),
      ]);

      setConversations(convRes.data || []);
      setStats(statsRes.data || null);
    } catch (error: any) {
      console.error("❌ Failed to fetch dashboard data:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setTimeout(() => setRefreshing(false), 600);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openChat = (userId: number) => {
    router.push(`/chat/${userId}`);
  };

  return (
    <Layout>
      <div className="min-h-screen flex flex-col bg-gray-50">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-white border-b shadow-sm">
          <h1 className="text-xl font-semibold text-gray-800">Tableau de bord – Messages</h1>
          <button
            onClick={handleRefresh}
            className={`flex items-center space-x-2 text-[#CD1F45] font-medium ${
              refreshing ? "opacity-70 cursor-wait" : "hover:text-[#b01a3a]"
            }`}
            disabled={refreshing}
          >
            <RefreshCcw className={`w-5 h-5 ${refreshing ? "animate-spin" : ""}`} />
            <span>Rafraîchir</span>
          </button>
        </div>

        {/* Loading state */}
        {loading ? (
          <div className="flex flex-col flex-1 items-center justify-center text-gray-600">
            <Loader2 className="w-8 h-8 animate-spin text-[#CD1F45]" />
            <p className="mt-3 text-sm font-medium">Chargement du tableau de bord...</p>
          </div>
        ) : (
          <div className="flex-1 p-6 space-y-8 overflow-y-auto">
            {/* Stats Cards */}
            {stats && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl shadow-sm border flex items-center justify-between hover:shadow-md transition">
                  <div>
                    <p className="text-sm text-gray-500">Total Conversations</p>
                    <h2 className="text-2xl font-bold text-gray-800 mt-1">
                      {stats.totalConversations}
                    </h2>
                  </div>
                  <MessageSquare className="w-8 h-8 text-[#CD1F45]" />
                </div>

                <div className="bg-white p-5 rounded-2xl shadow-sm border flex items-center justify-between hover:shadow-md transition">
                  <div>
                    <p className="text-sm text-gray-500">Total Messages</p>
                    <h2 className="text-2xl font-bold text-gray-800 mt-1">
                      {stats.totalMessages}
                    </h2>
                  </div>
                  <MessageCircle className="w-8 h-8 text-[#CD1F45]" />
                </div>

                <div className="bg-white p-5 rounded-2xl shadow-sm border flex items-center justify-between hover:shadow-md transition">
                  <div>
                    <p className="text-sm text-gray-500">Messages Aujourd'hui</p>
                    <h2 className="text-2xl font-bold text-gray-800 mt-1">
                      {stats.todayMessages}
                    </h2>
                  </div>
                  <Clock className="w-8 h-8 text-[#CD1F45]" />
                </div>

                <div className="bg-white p-5 rounded-2xl shadow-sm border flex items-center justify-between hover:shadow-md transition">
                  <div>
                    <p className="text-sm text-gray-500">Utilisateurs Actifs</p>
                    <h2 className="text-2xl font-bold text-gray-800 mt-1">
                      {stats.activeUsers}
                    </h2>
                  </div>
                  <Users className="w-8 h-8 text-[#CD1F45]" />
                </div>
              </div>
            )}

            {/* Conversations List */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Conversations récentes
              </h2>
              {conversations.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                  <MessageSquare className="w-10 h-10 mb-2 text-gray-400" />
                  <p>Aucune conversation trouvée.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {conversations.map((conv, index) => (
                    <div
                      key={index}
                      onClick={() => openChat(conv.userId)}
                      className="bg-white p-5 rounded-2xl shadow-sm border hover:shadow-md hover:border-[#CD1F45] transition cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-800">
                          Utilisateur {conv.userId}
                        </h3>
                        <span className="text-xs text-gray-500">
                          {new Date(conv.updatedAt).toLocaleString("fr-FR", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {conv.lastMessage.startsWith("http")
                          ? "📷 Image envoyée"
                          : conv.lastMessage}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
