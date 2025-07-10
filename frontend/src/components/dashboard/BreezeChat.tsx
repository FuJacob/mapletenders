import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  PaperPlaneTilt,
  Robot,
} from "@phosphor-icons/react";
import MessageBubble from "../common/MessageBubble";
import { createChatSession, sendChatMessage, type ChatMessage } from "../../api";

const BreezeChat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Initialize chat session when component mounts
  useEffect(() => {
    const initializeChat = async () => {
      try {
        const response = await createChatSession();
        setSessionId(response.sessionId);
        
        // Add welcome message from API
        const welcomeMessage: ChatMessage = {
          role: "model",
          message: "Hello! I'm here to help you with government tenders and procurement opportunities. I can answer questions about tender processes, requirements, deadlines, and help you understand specific opportunities. What would you like to know?",
          timestamp: new Date(),
        };
        
        setMessages([welcomeMessage]);
        setError(null);
      } catch (err) {
        console.error("Failed to initialize chat:", err);
        setError("Failed to start chat session. Please try again.");
      }
    };

    initializeChat();
  }, []);

  const handleSendMessage = useCallback(async () => {
    if (!inputMessage.trim() || !sessionId || isTyping) return;

    const userMessage: ChatMessage = {
      role: "user",
      message: inputMessage.trim(),
      timestamp: new Date(),
    };

    // Add user message immediately
    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);
    setError(null);

    try {
      // Send message to API
      const response = await sendChatMessage(sessionId, userMessage.message);
      
      // Add bot response
      const botMessage: ChatMessage = {
        role: "model",
        message: response.message,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      console.error("Failed to send message:", err);
      setError("Failed to send message. Please try again.");
      
      // Add error message to chat
      const errorMessage: ChatMessage = {
        role: "model",
        message: "I apologize, but I'm having trouble processing your message right now. Please try again.",
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  }, [inputMessage, sessionId, isTyping]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);

  return (
    <div className="bg-surface border border-border rounded-xl p-6 h-[1200px] flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4 pb-4 border-b border-border">
        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
          <Robot className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-text">
            Breeze AI Assistant
          </h3>
          <p className="text-sm text-text-light">
            Your intelligent procurement companion
          </p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          {error}
        </div>
      )}

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto mb-4 space-y-2">
        {messages.map((message, index) => (
          <MessageBubble
            key={index}
            message={message.message}
            isUser={message.role === "user"}
            timestamp={message.timestamp}
          />
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex gap-3">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <Robot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-surface border border-border rounded-2xl px-4 py-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-text-light rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-text-light rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-text-light rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-border pt-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask me anything about tenders, deadlines, or procurement strategies..."
            className="flex-1 p-3 border border-border rounded-lg focus:outline-none focus:border-primary bg-surface text-text placeholder-text-light"
            disabled={isTyping || !sessionId}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isTyping || !sessionId}
            className="px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            <PaperPlaneTilt className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-text-light mt-2 text-center">
          Breeze AI is in beta. Information may not always be accurate.
        </p>
      </div>
    </div>
  );
};

export default BreezeChat;
