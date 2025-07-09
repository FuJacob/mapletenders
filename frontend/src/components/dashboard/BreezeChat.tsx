import React, { useState } from "react";
import {
  PaperPlaneTilt,
  Robot,
  User,
  Lightbulb,
  MagnifyingGlass,
  TrendUp,
  Bell,
} from "@phosphor-icons/react";

interface ChatMessage {
  id: number;
  type: "user" | "bot";
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

const BreezeChat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      type: "bot",
      content:
        "Hi! I'm Breeze, your AI procurement assistant. I can help you find relevant tenders, analyze opportunities, and provide insights about government contracts. What would you like to know?",
      timestamp: new Date(),
      suggestions: [
        "Find IT contracts in Ontario under $100K",
        "Show me trending opportunities this week",
        "What are the most competitive tender categories?",
        "Help me write a compelling proposal",
      ],
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: messages.length + 1,
      type: "user",
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    // Simulate AI response (replace with actual API call)
    setTimeout(() => {
      const botResponse: ChatMessage = {
        id: messages.length + 2,
        type: "bot",
        content:
          "I understand you're looking for information about that. Let me help you find the most relevant opportunities and insights. This is a mockup response - in the full version, I'll provide personalized recommendations based on your company profile and past activity.",
        timestamp: new Date(),
        suggestions: [
          "Tell me more about deadline management",
          "Show me similar successful bids",
          "What's my win rate in this category?",
        ],
      };

      setMessages((prev) => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion);
  };

  const quickActions = [
    {
      icon: MagnifyingGlass,
      label: "Smart Search",
      description: "Find tenders using natural language",
    },
    {
      icon: TrendUp,
      label: "Market Analysis",
      description: "Get insights on tender trends",
    },
    {
      icon: Bell,
      label: "Alert Setup",
      description: "Create intelligent notifications",
    },
    {
      icon: Lightbulb,
      label: "Proposal Tips",
      description: "Get AI-powered writing help",
    },
  ];

  return (
    <div className="bg-surface border border-border rounded-xl p-6 h-[1200px] flex flex-col">
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

      {/* Quick Actions */}
      {messages.length === 1 && (
        <div className="mb-4">
          <p className="text-sm text-text-light mb-3">
            Try these quick actions:
          </p>
          <div className="grid grid-cols-2 gap-2">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(action.description)}
                className="p-3 bg-surface border border-border rounded-lg text-left hover:bg-primary/5 transition-colors"
              >
                <div className="flex items-center gap-2 mb-1">
                  <action.icon className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-text">
                    {action.label}
                  </span>
                </div>
                <p className="text-xs text-text-light">{action.description}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${
              message.type === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {message.type === "bot" && (
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Robot className="w-4 h-4 text-primary" />
              </div>
            )}

            <div
              className={`max-w-[80%] ${
                message.type === "user" ? "order-first" : ""
              }`}
            >
              <div
                className={`p-3 rounded-xl ${
                  message.type === "user"
                    ? "bg-primary text-white"
                    : "bg-gray-50 text-text border border-border"
                }`}
              >
                <p className="text-sm">{message.content}</p>
              </div>

              {message.suggestions && (
                <div className="mt-2 space-y-1">
                  {message.suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="block text-xs text-primary hover:underline text-left"
                    >
                      💡 {suggestion}
                    </button>
                  ))}
                </div>
              )}

              <div className="text-xs text-text-light mt-1">
                {message.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>

            {message.type === "user" && (
              <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-accent" />
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-3">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
              <Robot className="w-4 h-4 text-primary" />
            </div>
            <div className="bg-gray-50 border border-border rounded-xl p-3">
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
      </div>

      {/* Input Area */}
      <div className="border-t border-border pt-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="Ask me anything about tenders, deadlines, or procurement strategies..."
            className="flex-1 p-3 border border-border rounded-lg focus:outline-none focus:border-primary bg-surface text-text placeholder-text-light"
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isTyping}
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
