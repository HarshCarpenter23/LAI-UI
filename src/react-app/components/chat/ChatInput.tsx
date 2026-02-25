import { useState, useRef, useCallback, KeyboardEvent, RefObject } from "react";
import { Send, Paperclip, X, Mic, MicOff, Sparkles } from "lucide-react";
import { Button } from "@/react-app/components/ui/button";
import { Textarea } from "@/react-app/components/ui/textarea";
import { cn } from "@/react-app/lib/utils";
import type { ChatAttachment } from "./ChatMessage";
import { ManuscriptIcon } from "@/react-app/components/icons";
import { useSpeechRecognition } from "@/react-app/hooks/useSpeechRecognition";

interface ChatInputProps {
  onSend: (message: string, attachments: ChatAttachment[]) => void;
  disabled?: boolean;
  placeholder?: string;
  /** Optional ref forwarded from parent so it can call .focus() after answer */
  // Accept RefObject<HTMLTextAreaElement | null> — what useRef<T>(null) produces in TS5+
  inputRef?: RefObject<HTMLTextAreaElement | null>;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

export function ChatInput({
  onSend,
  disabled,
  placeholder,
  inputRef,
}: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [attachments, setAttachments] = useState<ChatAttachment[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const internalTextareaRef = useRef<HTMLTextAreaElement>(null);

  // Use parent-provided ref if given, otherwise fall back to internal one.
  // Both are now typed as RefObject<HTMLTextAreaElement | null> so no cast needed.
  const textareaRef: RefObject<HTMLTextAreaElement | null> =
    inputRef ?? internalTextareaRef;

  // ── Speech recognition ────────────────────────────────────────────────────
  const handleTranscript = useCallback((fullText: string) => {
    setMessage(fullText);
    requestAnimationFrame(() => {
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
        textareaRef.current.style.height =
          Math.min(textareaRef.current.scrollHeight, 200) + "px";
      }
    });
  }, []);

  const { micState, errorMessage, isSupported, toggleListening } =
    useSpeechRecognition({ onTranscript: handleTranscript });

  const isListening = micState === "listening";

  // ── Send ──────────────────────────────────────────────────────────────────
  const handleSend = () => {
    if (!message.trim() && attachments.length === 0) return;
    if (isListening) toggleListening(message);
    onSend(message, attachments);
    setMessage("");
    setAttachments([]);
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // ── File handling ─────────────────────────────────────────────────────────
  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;
    const newAttachments: ChatAttachment[] = Array.from(files).map((file) => ({
      id: crypto.randomUUID(),
      name: file.name,
      size: file.size,
      type: file.type,
    }));
    setAttachments((prev) => [...prev, ...newAttachments]);
  };

  const removeAttachment = (id: string) =>
    setAttachments((prev) => prev.filter((a) => a.id !== id));

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 200) + "px";
  };

  return (
    <div
      className={cn(
        "relative rounded-2xl border bg-background/80 backdrop-blur transition-all",
        isDragging
          ? "border-primary border-dashed bg-primary/5"
          : "border-border",
        "focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20",
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* ── Attachments ── */}
      {attachments.length > 0 && (
        <div className="p-3 pb-0 flex flex-wrap gap-2">
          {attachments.map((file) => (
            <div
              key={file.id}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50 border border-border/50 group"
            >
              <ManuscriptIcon className="w-4 h-4 text-primary flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate max-w-[150px]">
                  {file.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(file.size)}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 opacity-50 group-hover:opacity-100"
                onClick={() => removeAttachment(file.id)}
              >
                <X className="w-3.5 h-3.5" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* ── Drag overlay ── */}
      {isDragging && (
        <div className="absolute inset-0 flex items-center justify-center bg-primary/5 rounded-2xl z-10">
          <div className="text-center">
            <Paperclip className="w-8 h-8 text-primary mx-auto mb-2" />
            <p className="text-sm font-medium text-primary">Drop files here</p>
          </div>
        </div>
      )}

      {/* ── Listening indicator ── */}
      {isListening && (
        <div className="px-4 pt-2 flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
          </span>
          <span className="text-xs text-red-500 font-medium">
            Listening… speak now
          </span>
        </div>
      )}

      {/* ── Error / unsupported ── */}
      {micState === "error" && errorMessage && (
        <div className="px-4 pt-2">
          <p className="text-xs text-destructive">{errorMessage}</p>
        </div>
      )}
      {micState === "unsupported" && (
        <div className="px-4 pt-2">
          <p className="text-xs text-muted-foreground">
            Voice input not supported in this browser. Try Chrome or Edge.
          </p>
        </div>
      )}

      {/* ── Input row ── */}
      <div className="flex items-end gap-2 p-3">
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => handleFileSelect(e.target.files)}
          accept=".pdf,.doc,.docx,.txt,.xlsx,.xls,.csv"
        />

        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 flex-shrink-0"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled}
          title="Attach document"
        >
          <Paperclip className="w-5 h-5" />
        </Button>

        <Textarea
          ref={textareaRef}
          value={message}
          onChange={handleTextareaChange}
          onKeyDown={handleKeyDown}
          placeholder={
            isListening
              ? "Listening… speak now"
              : placeholder || "Ask LAI about your documents..."
          }
          disabled={disabled}
          className={cn(
            "min-h-[44px] max-h-[200px] resize-none border-0 bg-transparent",
            "focus-visible:ring-0 focus-visible:ring-offset-0 p-2 text-base",
            isListening && "placeholder:text-red-400",
          )}
          rows={1}
        />

        <div className="flex items-center gap-1 flex-shrink-0">
          {/* Mic button */}
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-9 w-9 transition-all duration-200 relative",
              isListening
                ? "text-red-500 hover:text-red-600 hover:bg-red-500/10"
                : !isSupported
                  ? "opacity-40 cursor-not-allowed"
                  : "hover:text-primary",
            )}
            onClick={() => toggleListening(message)}
            disabled={disabled || !isSupported}
            title={
              !isSupported
                ? "Not supported in this browser. Try Chrome or Edge."
                : isListening
                  ? "Stop recording"
                  : "Start voice input"
            }
          >
            {isListening && (
              <span className="absolute inset-0 rounded-lg animate-ping bg-red-400/20" />
            )}
            {isListening ? (
              <MicOff className="w-5 h-5 relative z-10" />
            ) : (
              <Mic className="w-5 h-5 relative z-10" />
            )}
          </Button>

          {/* Send button */}
          <Button
            size="icon"
            className="h-9 w-9 glow-sm"
            onClick={handleSend}
            disabled={disabled || (!message.trim() && attachments.length === 0)}
            title="Send message"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* ── Hint bar ── */}
      <div className="px-4 pb-2 flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <Sparkles className="w-3 h-3" />
          <span>
            LAI analyzes legal documents for wind energy due diligence
          </span>
        </div>
        <span>Press Enter to send, Shift+Enter for new line</span>
      </div>
    </div>
  );
}
