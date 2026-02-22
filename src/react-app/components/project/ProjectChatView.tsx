import { useRef, useState, useEffect } from "react";
import {
  ArrowLeft,
  Share2,
  FileText,
  ChevronDown,
  Wind,
  X,
  Mic,
  Send,
  Paperclip,
  Settings2,
} from "lucide-react";
import { ProjectConversation, ChatMessage, ChatAttachment } from "./types";

// ── Typing indicator ──────────────────────────────────────────────────────────
function TypingIndicator() {
  return (
    <div className="flex items-start gap-3 py-2">
      <div className="w-7 h-7 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center flex-shrink-0 mt-0.5">
        <Wind className="w-3.5 h-3.5 text-primary" />
      </div>
      <div className="bg-card/40 border border-border/30 rounded-2xl rounded-bl-sm px-4 py-3">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-muted-foreground/60 animate-bounce [animation-delay:0ms]" />
          <span className="w-2 h-2 rounded-full bg-muted-foreground/60 animate-bounce [animation-delay:150ms]" />
          <span className="w-2 h-2 rounded-full bg-muted-foreground/60 animate-bounce [animation-delay:300ms]" />
        </div>
      </div>
    </div>
  );
}

// ── Props ─────────────────────────────────────────────────────────────────────
interface ProjectChatViewProps {
  projectName: string;
  conversation: ProjectConversation;
  onBack: () => void;
  onSendMessage: (message: string, attachments: ChatAttachment[]) => void;
}

// ── Main component ────────────────────────────────────────────────────────────
export function ProjectChatView({
  projectName,
  conversation,
  onBack,
  onSendMessage,
}: ProjectChatViewProps) {
  const [chatInput, setChatInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [attachments, setAttachments] = useState<ChatAttachment[]>([]);
  const [showScrollBtn, setShowScrollBtn] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Scroll ────────────────────────────────────────────────────────────────
  const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
    messagesEndRef.current?.scrollIntoView({ behavior });
    setShowScrollBtn(false);
  };

  const handleScroll = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    setShowScrollBtn(el.scrollHeight - el.scrollTop - el.clientHeight > 120);
  };

  useEffect(() => {
    scrollToBottom("instant");
  }, []);

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    if (el.scrollHeight - el.scrollTop - el.clientHeight < 200)
      scrollToBottom("smooth");
  }, [conversation.messages.length, isTyping]);

  // ── Send ──────────────────────────────────────────────────────────────────
  const handleSend = async () => {
    const text = chatInput.trim();
    if (!text && attachments.length === 0) return;

    onSendMessage(text, attachments);
    setChatInput("");
    setAttachments([]);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    setIsTyping(true);
    await new Promise((r) => setTimeout(r, 1400 + Math.random() * 1200));
    setIsTyping(false);
  };

  // Auto-grow textarea (max 5 lines ≈ 120px)
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setChatInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
  };

  // ── File attachment ───────────────────────────────────────────────────────
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (!files) return;
    const next: ChatAttachment[] = Array.from(files).map((f) => ({
      id: Date.now().toString() + Math.random(),
      name: f.name,
      size: f.size,
      type: (f.name.split(".").pop() ?? "file").toUpperCase(),
    }));
    setAttachments((prev) => [...prev, ...next]);
    e.currentTarget.value = "";
  };

  const removeAttachment = (id: string) =>
    setAttachments((prev) => prev.filter((a) => a.id !== id));

  const canSend = chatInput.trim().length > 0 || attachments.length > 0;

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="h-full flex flex-col bg-background overflow-hidden">
      {/* ── FIXED HEADER ── */}
      <div className="flex-shrink-0 h-10 border-b border-border/50 flex items-center justify-between px-5 bg-background/95 backdrop-blur">
        <div className="flex items-center gap-2 text-sm min-w-0">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{projectName}</span>
          </button>
          <span className="text-border/70 shrink-0">/</span>
          <span className="text-foreground font-semibold truncate">
            {conversation.title}
          </span>
          <ChevronDown className="w-3.5 h-3.5 text-muted-foreground shrink-0 ml-0.5" />
        </div>
        <div className="flex items-center gap-1.5 shrink-0 ml-3">
          <button className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors">
            <FileText className="w-4 h-4" />
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border/50 text-sm font-medium text-foreground hover:bg-muted/30 transition-colors">
            <Share2 className="w-3.5 h-3.5" />
            Share
          </button>
        </div>
      </div>

      {/* ── SCROLLABLE MESSAGES — flex-1 min-h-0, ONLY this scrolls ── */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 w-full min-h-0 overflow-y-auto flex flex-col relative"
      >
        {/* Empty state */}
        {conversation.messages.length === 0 && !isTyping && (
          <div className="flex-1 flex flex-col items-center justify-center py-12 px-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-indigo-400/20 flex items-center justify-center mb-4">
              <Wind className="w-7 h-7 text-primary" />
            </div>
            <h3 className="text-base font-semibold mb-2">New Conversation</h3>
            <p className="text-muted-foreground text-center max-w-sm text-sm">
              Ask me anything about wind energy permits, contracts, or legal
              compliance.
            </p>
          </div>
        )}

        {/* Messages list */}
        {(conversation.messages.length > 0 || isTyping) && (
          <div className="max-w-4xl mx-auto w-full px-5 pt-5 pb-2 space-y-6">
            {conversation.messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
            {isTyping && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>
        )}

        {/* Scroll to bottom button */}
        {showScrollBtn && (
          <button
            onClick={() => scrollToBottom("smooth")}
            className="sticky bottom-3 left-1/2 -translate-x-1/2 w-fit mx-auto flex p-2 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/80 transition-all z-10"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* ── FIXED INPUT AREA — flex-shrink-0, no extra scroll ── */}
      <div className="flex-shrink-0">
        <div className="max-w-4xl mx-auto w-full px-5 pt-3 pb-3">
          {/* Attachment chips */}
          {attachments.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {attachments.map((att) => (
                <div
                  key={att.id}
                  className="flex items-center gap-1.5 bg-card border border-border/50 rounded-lg px-2.5 py-1.5 text-xs"
                >
                  <FileText className="w-3.5 h-3.5 text-primary" />
                  <span className="text-foreground max-w-[140px] truncate">
                    {att.name}
                  </span>
                  <button
                    onClick={() => removeAttachment(att.id)}
                    className="text-muted-foreground hover:text-destructive transition-colors ml-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Input box */}
          <div className="bg-card/60 backdrop-blur rounded-2xl border border-border/50 shadow-sm">
            <div className="flex items-center gap-2 px-3 pt-3 pb-2">
              {/* Paperclip left */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex-shrink-0 p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors"
                title="Attach document"
              >
                <Paperclip className="w-[18px] h-[18px]" />
              </button>

              {/* Textarea */}
              <textarea
                ref={textareaRef}
                className="flex-1 resize-none outline-none bg-transparent text-foreground placeholder-muted-foreground text-sm leading-relaxed min-h-[24px] max-h-[120px] py-0.5"
                placeholder="Ask LAI about permits, contracts, or upload documents..."
                rows={1}
                value={chatInput}
                onChange={handleTextareaChange}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                disabled={isTyping}
              />

              {/* Right: mic + send */}
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <button className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors">
                  <Mic className="w-[18px] h-[18px]" />
                </button>
                <button
                  onClick={handleSend}
                  disabled={!canSend || isTyping}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                    canSend && !isTyping
                      ? "bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm"
                      : "bg-muted text-muted-foreground opacity-50 cursor-not-allowed"
                  }`}
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Hint row */}
            <div className="flex items-center justify-between px-4 pb-2.5">
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground/60">
                <Settings2 className="w-3 h-3" />
                LAI analyzes legal documents for wind energy due diligence
              </span>
              <span className="text-xs text-muted-foreground/40">
                Press Enter to send, Shift+Enter for new line
              </span>
            </div>
          </div>
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleFileSelect}
          accept=".pdf,.doc,.docx,.xlsx,.xls,.txt,.csv"
        />
      </div>
    </div>
  );
}

// ── Message bubble ────────────────────────────────────────────────────────────
interface MessageBubbleProps {
  message: ChatMessage;
}

function MessageBubble({ message }: MessageBubbleProps) {
  const [expanded, setExpanded] = useState(true);
  const isUser = message.sender === "user";
  const isLong = message.message.length > 400;

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[72%] space-y-1.5">
          {message.attachments && message.attachments.length > 0 && (
            <div className="flex flex-wrap gap-1.5 justify-end">
              {message.attachments.map((att) => (
                <div
                  key={att.id}
                  className="flex items-center gap-1.5 bg-card border border-border/50 rounded-lg px-2.5 py-1.5 text-xs"
                >
                  <FileText className="w-3.5 h-3.5 text-primary" />
                  <span className="text-foreground max-w-[120px] truncate">
                    {att.name}
                  </span>
                  <span className="text-muted-foreground/60 uppercase ml-0.5">
                    {att.type}
                  </span>
                </div>
              ))}
            </div>
          )}
          <div className="bg-card border border-border/50 rounded-2xl rounded-br-sm px-4 py-3">
            <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
              {message.message}
            </p>
          </div>
          <p className="text-xs text-muted-foreground/40 text-right px-1">
            {message.timestamp}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3">
      <div className="w-7 h-7 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center flex-shrink-0 mt-0.5">
        <Wind className="w-3.5 h-3.5 text-primary" />
      </div>
      <div className="flex-1 min-w-0 space-y-1.5">
        <span className="text-xs text-muted-foreground font-medium">
          LAI Assistant
        </span>
        {isLong ? (
          <div className="bg-card/40 border border-border/30 rounded-xl rounded-tl-sm px-4 py-3 space-y-2">
            <div
              className={`text-sm text-foreground leading-relaxed whitespace-pre-wrap ${!expanded ? "line-clamp-6" : ""}`}
            >
              {message.message}
            </div>
            <button
              onClick={() => setExpanded((v) => !v)}
              className="text-xs text-primary hover:text-primary/80 transition-colors font-medium"
            >
              {expanded ? "Show less" : "Show more"}
            </button>
          </div>
        ) : (
          <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
            {message.message}
          </p>
        )}
        <p className="text-xs text-muted-foreground/40">{message.timestamp}</p>
      </div>
    </div>
  );
}
