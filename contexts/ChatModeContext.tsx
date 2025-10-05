import React, { createContext, useContext, useState, ReactNode } from "react";

type ChatMode = "AI" | "Real";

interface ChatModeContextProps {
  chatMode: ChatMode;
  setChatMode: (mode: ChatMode) => void;
}

const ChatModeContext = createContext<ChatModeContextProps | undefined>(undefined);

export const ChatModeProvider = ({ children }: { children: ReactNode }) => {
  const [chatMode, setChatMode] = useState<ChatMode>("AI");

  return (
    <ChatModeContext.Provider value={{ chatMode, setChatMode }}>
      {children}
    </ChatModeContext.Provider>
  );
};

export const useChatMode = () => {
  const context = useContext(ChatModeContext);
  if (!context) {
    throw new Error("useChatMode must be used within a ChatModeProvider");
  }
  return context;
};
