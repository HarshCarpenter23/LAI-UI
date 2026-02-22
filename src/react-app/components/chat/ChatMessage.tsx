import { useState } from "react";
import {
  Copy,
  Check,
  RotateCcw,
  ThumbsUp,
  ThumbsDown,
  FileText,
  Download,
  Bot,
  User,
} from "lucide-react";
import { Button } from "@/react-app/components/ui/button";
import { cn } from "@/react-app/lib/utils";

export interface ChatAttachment {
  id: string;
  name: string;
  size: number;
  type: string;
}

export interface ChatMessageData {
  id: string;
  role: "user" | "assistant";
  content: string;
  attachments?: ChatAttachment[];
  timestamp: Date;
}

interface ChatMessageProps {
  message: ChatMessageData;
  onRegenerate?: () => void;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

export function ChatMessage({ message, onRegenerate }: ChatMessageProps) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === "user";

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={cn("group flex gap-4 py-6", isUser ? "flex-row-reverse" : "")}
    >
      {/* Avatar */}
      <div
        className={cn(
          "w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0",
          isUser
            ? "bg-gradient-to-br from-primary to-indigo-600"
            : "bg-gradient-to-br from-slate-600 to-slate-800 dark:from-slate-500 dark:to-slate-700",
        )}
      >
        {isUser ? (
          <User className="w-5 h-5 text-white" />
        ) : (
          <Bot className="w-5 h-5 text-white" />
        )}
      </div>

      {/* Message Content */}
      <div
        className={cn("flex-1 space-y-3 min-w-0", isUser ? "text-right" : "")}
      >
        <div
          className={cn("flex items-center gap-2", isUser ? "justify-end" : "")}
        >
          <span className="text-sm font-medium">
            {isUser ? "You" : "LAI Assistant"}
          </span>
          <span className="text-xs text-muted-foreground">
            {message.timestamp.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>

        {/* Attachments */}
        {message.attachments && message.attachments.length > 0 && (
          <div
            className={cn("flex flex-wrap gap-2", isUser ? "justify-end" : "")}
          >
            {message.attachments.map((file) => (
              <div
                key={file.id}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50 border border-border/50 max-w-xs"
              >
                <FileText className="w-4 h-4 text-primary flex-shrink-0" />
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(file.size)}
                  </p>
                </div>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <Download className="w-3.5 h-3.5" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Message Text */}
        <div
          className={cn(
            "prose prose-sm dark:prose-invert max-w-none",
            isUser ? "text-right" : "",
          )}
        >
          <div
            className={cn(
              "inline-block px-4 py-3 rounded-2xl",
              isUser
                ? "bg-primary text-primary-foreground rounded-tr-sm"
                : "bg-muted/50 rounded-tl-sm",
            )}
          >
            <p className="whitespace-pre-wrap text-sm leading-relaxed">
              {message.content}
            </p>
          </div>
        </div>

        {/* Actions */}
        {!isUser && (
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={handleCopy}
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={onRegenerate}
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
            <div className="w-px h-4 bg-border mx-1" />
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ThumbsUp className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ThumbsDown className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
