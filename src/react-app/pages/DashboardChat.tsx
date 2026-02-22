import { useState, useRef, useEffect } from "react";
import { useOutletContext } from "react-router";
import { Wind, Bell } from "lucide-react";
import {
  ChatMessage,
  ChatMessageData,
  ChatAttachment,
} from "@/react-app/components/chat/ChatMessage";
import { ChatInput } from "@/react-app/components/chat/ChatInput";
import { TypingIndicator } from "@/react-app/components/chat/TypingIndicator";
import { ThemeToggle } from "@/react-app/components/ThemeToggle";
import { Button } from "@/react-app/components/ui/button";
import type { Conversation } from "@/react-app/components/DashboardLayout";

const mockResponses = [
  "I've analyzed the documents you uploaded. Here are the key findings for the wind energy due diligence:\n\n**Permit Status (BImSchG)**\n• The permit was issued on March 15, 2023 and is currently valid\n• Environmental impact assessment completed with minor conditions\n• Building permit aligned with local zoning requirements\n\n**Identified Risks**\n1. **Medium Risk**: Clause 4.2 of the land lease allows early termination with 12-month notice\n2. **Low Risk**: Grid connection agreement expires in 2035, requires renewal\n3. **High Risk**: Missing documentation for aviation lighting compliance\n\nWould you like me to elaborate on any of these findings?",
  "Based on my analysis of the environmental impact assessment:\n\n**Wildlife Protection Measures**\n• Bat activity monitoring required during peak seasons (April-October)\n• Bird collision prevention shutdowns implemented during migration periods\n• Compensatory measures for habitat displacement are compliant\n\n**Compliance Status**: The project meets current BNatSchG requirements, but I recommend reviewing the latest amendments to ensure continued compliance.\n\nShall I generate a detailed risk matrix for these environmental factors?",
  "I've reviewed the grid connection agreement (Einspeisezusage) with the following observations:\n\n**Key Terms**\n• Connection capacity: 45 MW at 110 kV level\n• Feed-in priority: Standard renewable energy priority applies\n• Duration: Valid until December 31, 2035\n\n**Risk Assessment**\n🟢 **Low Risk**: Current capacity allocation is sufficient\n🟡 **Medium Risk**: Renewal negotiations should begin by 2033\n🔴 **High Risk**: No backup connection agreement exists\n\nI recommend adding this to your due diligence checklist.",
];

const suggestedPrompts = [
  { icon: "📋", text: "Analyze uploaded permits", desc: "Review BImSchG compliance" },
  { icon: "⚖️", text: "Check land lease risks", desc: "Identify contractual issues" },
  { icon: "🛡️", text: "Environmental compliance", desc: "Verify BNatSchG requirements" },
  { icon: "⚡", text: "Grid connection review", desc: "Analyze Einspeisezusage terms" },
];

interface OutletContextType {
  activeConversationId: string | null;
  setActiveConversationId: (id: string | null) => void;
  conversations: Conversation[];
  setConversations: (convs: Conversation[]) => void;
}

export default function DashboardChatPage() {
  const context = useOutletContext<OutletContextType>();
  const { activeConversationId, conversations } = context || {};

  const [messages, setMessages] = useState<ChatMessageData[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const responseIndexRef = useRef(0);

  // Get current active conversation
  const activeConversation = conversations?.find(c => c.id === activeConversationId);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Reset messages when conversation changes
  useEffect(() => {
    setMessages([]);
    responseIndexRef.current = 0;
  }, [activeConversationId]);

  const handleSendMessage = async (content: string, attachments: ChatAttachment[]) => {
    // Create user message
    const userMessage: ChatMessageData = {
      id: crypto.randomUUID(),
      role: "user",
      content,
      attachments,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    // Simulate AI response
    setIsTyping(true);
    await new Promise((resolve) => setTimeout(resolve, 1500 + Math.random() * 1500));
    setIsTyping(false);

    const aiMessage: ChatMessageData = {
      id: crypto.randomUUID(),
      role: "assistant",
      content: mockResponses[responseIndexRef.current % mockResponses.length],
      timestamp: new Date(),
    };
    responseIndexRef.current++;

    setMessages((prev) => [...prev, aiMessage]);
  };

  const handleSuggestedPrompt = (prompt: string) => {
    handleSendMessage(prompt, []);
  };

  return (
    <div className="h-full w-full flex flex-col bg-background overflow-hidden">
      {/* Fixed Header */}
      <div className="flex-shrink-0 h-14 border-b border-border flex items-center justify-between px-6 bg-background/50 backdrop-blur">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center">
            <Wind className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="text-sm font-semibold">
              {activeConversation ? activeConversation.title : "LAI Assistant"}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button variant="ghost" size="icon" className="relative h-9 w-9">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />
          </Button>
        </div>
      </div>

      {/* Scrollable Messages Area - ONLY THIS SCROLLS */}
      <div className="flex-1 w-full min-h-0 overflow-y-auto flex flex-col">
        {messages.length === 0 && !activeConversationId ? (
          // Empty State
          <div className="flex-1 flex flex-col items-center justify-center py-16 px-4">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-indigo-400/20 flex items-center justify-center mb-6">
                <Wind className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Welcome to LAI</h2>
              <p className="text-muted-foreground text-center max-w-md mb-8">
                Your AI assistant for wind energy legal due diligence. Upload documents, ask questions, and get instant analysis.
              </p>

              <div className="grid grid-cols-2 gap-3 w-full max-w-lg">
                {suggestedPrompts.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSuggestedPrompt(prompt.text)}
                    className="flex items-start gap-3 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 border border-border/50 hover:border-primary/30 transition-all text-left group"
                  >
                    <div className="text-xl flex-shrink-0">{prompt.icon}</div>
                    <div>
                      <p className="text-sm font-medium">{prompt.text}</p>
                      <p className="text-xs text-muted-foreground">{prompt.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : messages.length === 0 && activeConversationId ? (
            // New conversation started
            <div className="flex-1 flex flex-col items-center justify-center py-16 px-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-indigo-400/20 flex items-center justify-center mb-4">
                <Wind className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">New Conversation</h3>
              <p className="text-muted-foreground text-center max-w-md">
                Ask me anything about wind energy permits, contracts, or legal compliance. You can also upload documents for analysis.
              </p>
            </div>
          ) : (
            // Messages
            <div className="max-w-4xl mx-auto w-full px-4 py-4">
              {messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  message={message}
                  onRegenerate={() => {}}
                />
              ))}
              {isTyping && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>
          )}
      </div>

      {/* Fixed Input Area at Bottom */}
      <div className="flex-shrink-0 border-t border-border">
        <div className="max-w-4xl mx-auto w-full px-4 py-4">
          <ChatInput
            onSend={handleSendMessage}
            disabled={isTyping}
            placeholder="Ask LAI about permits, contracts, or upload documents..."
          />
        </div>
      </div>
    </div>
  );
}
