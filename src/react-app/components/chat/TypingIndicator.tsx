import { Bot } from "lucide-react";

export function TypingIndicator() {
  return (
    <div className="flex gap-4 py-6">
      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-slate-600 to-slate-800 dark:from-slate-500 dark:to-slate-700 flex items-center justify-center flex-shrink-0">
        <Bot className="w-5 h-5 text-white" />
      </div>
      <div className="flex items-center gap-2 px-4 py-3 rounded-2xl rounded-tl-sm bg-muted/50">
        <div className="flex gap-1">
          <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
          <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
          <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
        <span className="text-sm text-muted-foreground ml-2">LAI is thinking...</span>
      </div>
    </div>
  );
}
