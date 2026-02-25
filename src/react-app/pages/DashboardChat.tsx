import { useState, useRef, useEffect, useCallback } from "react";
import { useOutletContext } from "react-router";
import { Logo } from "@/react-app/components/Logo";
import { ChevronDown } from "lucide-react";
import {
  BellIcon,
  ManuscriptIcon,
  AlertIcon,
  SignalTowerIcon,
  CircuitBoltIcon,
} from "@/react-app/components/icons";
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
  {
    Icon: ManuscriptIcon,
    text: "Analyze uploaded permits",
    desc: "Review BImSchG compliance",
  },
  {
    Icon: AlertIcon,
    text: "Check land lease risks",
    desc: "Identify contractual issues",
  },
  {
    Icon: SignalTowerIcon,
    text: "Environmental compliance",
    desc: "Verify BNatSchG requirements",
  },
  {
    Icon: CircuitBoltIcon,
    text: "Grid connection review",
    desc: "Analyze Einspeisezusage terms",
  },
];

interface OutletContextType {
  activeConversationId: string | null;
  setActiveConversationId: (id: string | null) => void;
  conversations: Conversation[];
  setConversations: (convs: Conversation[]) => void;
}

export default function DashboardChatPage() {
  const context = useOutletContext<OutletContextType>();

  // Only destructure what we use — fixes TS6133 "declared but never read" errors
  // for setConversations and setActiveConversationId
  const { activeConversationId, conversations } = context || {};

  const [messages, setMessages] = useState<ChatMessageData[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showScrollBtn, setShowScrollBtn] = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const bottomAnchorRef = useRef<HTMLDivElement>(null);
  // Explicit generic required — TS5+ infers RefObject<HTMLTextAreaElement | null>
  // which isn't assignable to the RefObject<HTMLTextAreaElement> the inputRef prop expects
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const responseIndexRef = useRef(0);

  const activeConversation = conversations?.find(
    (c) => c.id === activeConversationId,
  );

  // ── Core scroll ───────────────────────────────────────────────────────────
  const forceScrollToBottom = useCallback(
    (behavior: ScrollBehavior = "smooth") => {
      bottomAnchorRef.current?.scrollIntoView({ behavior, block: "end" });
      const el = scrollContainerRef.current;
      if (el) el.scrollTo({ top: el.scrollHeight, behavior });
      setShowScrollBtn(false);
    },
    [],
  );

  // ── Show/hide scroll-to-bottom button ────────────────────────────────────
  const handleScroll = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const dist = el.scrollHeight - el.scrollTop - el.clientHeight;
    setShowScrollBtn(dist > 120);
  }, []);

  // ── Auto-scroll on messages / typing change ───────────────────────────────
  useEffect(() => {
    const timer = setTimeout(() => forceScrollToBottom("smooth"), 0);
    return () => clearTimeout(timer);
  }, [messages.length, isTyping, forceScrollToBottom]);

  // ── Reset on conversation switch ──────────────────────────────────────────
  useEffect(() => {
    setMessages([]);
    responseIndexRef.current = 0;
    setShowScrollBtn(false);
  }, [activeConversationId]);

  // ── Send message ──────────────────────────────────────────────────────────
  const handleSendMessage = async (
    content: string,
    attachments: ChatAttachment[],
  ) => {
    const userMessage: ChatMessageData = {
      id: crypto.randomUUID(),
      role: "user",
      content,
      attachments,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);
    setTimeout(() => forceScrollToBottom("smooth"), 0);

    await new Promise((resolve) =>
      setTimeout(resolve, 1500 + Math.random() * 1500),
    );

    const aiMessage: ChatMessageData = {
      id: crypto.randomUUID(),
      role: "assistant",
      content: mockResponses[responseIndexRef.current % mockResponses.length],
      timestamp: new Date(),
    };
    responseIndexRef.current++;

    setIsTyping(false);
    setMessages((prev) => [...prev, aiMessage]);

    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const handleSuggestedPrompt = (prompt: string) =>
    handleSendMessage(prompt, []);

  const hasMessages = messages.length > 0;

  return (
    <div className="h-full w-full flex flex-col bg-background overflow-hidden">
      {/* ── Header ── */}
      <div className="flex-shrink-0 h-14 border-b border-border flex items-center justify-between px-6 bg-background/50 backdrop-blur">
        <div className="flex items-center gap-3">
          <Logo size="sm" />
          {activeConversation && (
            <>
              <span className="text-border/60 select-none">·</span>
              <span className="text-sm text-muted-foreground truncate max-w-xs">
                {activeConversation.title}
              </span>
            </>
          )}
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button variant="ghost" size="icon" className="relative h-9 w-9">
            <BellIcon className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />
          </Button>
        </div>
      </div>

      {/* ── Scrollable Messages ── */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 w-full min-h-0 overflow-y-auto flex flex-col relative"
      >
        {!hasMessages && !activeConversationId ? (
          /* Welcome screen — no conversation selected */
          <div className="flex-1 flex flex-col items-center justify-center py-16 px-4">
            <div className="flex items-center justify-center mb-6">
              <Logo size="lg" showText={false} />
            </div>
            <h2 className="text-2xl font-bold mb-2">Welcome to LAI</h2>
            <p className="text-muted-foreground text-center max-w-md mb-8">
              Your AI assistant for wind energy legal due diligence. Upload
              documents, ask questions, and get instant analysis.
            </p>
            <div className="grid grid-cols-2 gap-3 w-full max-w-lg">
              {suggestedPrompts.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => handleSuggestedPrompt(prompt.text)}
                  className="flex items-start gap-3 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 border border-border/50 hover:border-primary/30 transition-all text-left"
                >
                  <div className="flex-shrink-0 mt-0.5 text-primary">
                    <prompt.Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{prompt.text}</p>
                    <p className="text-xs text-muted-foreground">
                      {prompt.desc}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : !hasMessages && activeConversationId ? (
          /* Conversation selected but no messages yet */
          <div className="flex-1 flex flex-col items-center justify-center py-16 px-4">
            <div className="flex items-center justify-center mb-4">
              <Logo size="lg" showText={false} />
            </div>
            <h3 className="text-lg font-semibold mb-2">New Conversation</h3>
            <p className="text-muted-foreground text-center max-w-md">
              Ask me anything about wind energy permits, contracts, or legal
              compliance. You can also upload documents for analysis.
            </p>
          </div>
        ) : (
          /* Messages list */
          <div className="max-w-4xl mx-auto w-full px-4 py-4">
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                onRegenerate={() => {}}
              />
            ))}
            {isTyping && <TypingIndicator />}
            <div ref={bottomAnchorRef} style={{ height: 1 }} />
          </div>
        )}

        {/* Scroll-to-bottom floating button */}
        {showScrollBtn && hasMessages && (
          <button
            onClick={() => forceScrollToBottom("smooth")}
            className="sticky bottom-4 left-1/2 -translate-x-1/2 w-fit mx-auto flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-all text-xs font-medium z-10"
          >
            <ChevronDown className="w-3.5 h-3.5" />
            Latest
          </button>
        )}
      </div>

      {/* ── Input ── */}
      <div className="flex-shrink-0 border-t border-border">
        <div className="max-w-4xl mx-auto w-full px-4 py-4">
          <ChatInput
            onSend={handleSendMessage}
            disabled={isTyping}
            placeholder="Ask LAI about permits, contracts, or upload documents..."
            inputRef={inputRef}
          />
        </div>
      </div>
    </div>
  );
}
