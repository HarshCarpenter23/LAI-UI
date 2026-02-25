import {
  useState,
  useRef,
  useCallback,
  KeyboardEvent,
  RefObject,
} from "react";
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

  // ✅ FIX: Must include | null for TS5+ strict compatibility
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

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // ✅ FIX: Explicitly include | null
  const internalTextareaRef = useRef<HTMLTextAreaElement | null>(null);

  // ✅ Unified ref type
  const textareaRef: RefObject<HTMLTextAreaElement | null> =
    inputRef ?? internalTextareaRef;

  // ── Speech recognition ──────────────────────────────────────────────
  const handleTranscript = useCallback((fullText: string) => {
    setMessage(fullText);

    requestAnimationFrame(() => {
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
        textareaRef.current.style.height =
          Math.min(textareaRef.current.scrollHeight, 200) + "px";
      }
    });
  }, [textareaRef]);

  const { micState, errorMessage, isSupported, toggleListening } =
    useSpeechRecognition({ onTranscript: handleTranscript });

  const isListening = micState === "listening";

  // ── Send ─────────────────────────────────────────────────────────────
  const handleSend = () => {
    if (!message.trim() && attachments.length === 0) return;

    if (isListening) toggleListening(message);

    onSend(message, attachments);
    setMessage("");
    setAttachments([]);

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // ── File handling ────────────────────────────────────────────────────
  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const newAttachments: ChatAttachment[] = Array.from(files).map(
      (file) => ({
        id: crypto.randomUUID(),
        name: file.name,
        size: file.size,
        type: file.type,
      }),
    );

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

  const handleTextareaChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setMessage(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height =
      Math.min(e.target.scrollHeight, 200) + "px";
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
      {/* Attachments */}
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

      {/* Input row */}
      <div className="flex items-end gap-2 p-3">
        <Textarea
          ref={textareaRef}
          value={message}
          onChange={handleTextareaChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || "Ask LAI..."}
          disabled={disabled}
          className="min-h-[44px] max-h-[200px] resize-none border-0 bg-transparent focus-visible:ring-0"
          rows={1}
        />

        <Button
          size="icon"
          className="h-9 w-9"
          onClick={handleSend}
          disabled={disabled || (!message.trim() && attachments.length === 0)}
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
