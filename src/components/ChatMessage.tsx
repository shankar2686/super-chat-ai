import { cn } from "@/lib/utils";
import { Bot, User } from "lucide-react";
import { motion } from "framer-motion";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  isStreaming?: boolean;
  provider?: string;
}

const ChatMessage = ({ role, content, isStreaming, provider }: ChatMessageProps) => {
  const isUser = role === "user";

  const getProviderLabel = (provider?: string) => {
    const labels: Record<string, string> = {
      openai: "OpenAI",
      anthropic: "Anthropic",
      gemini: "Gemini",
      groq: "Groq"
    };
    return provider ? labels[provider] || provider : "";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "flex gap-4 mb-6",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {!isUser && (
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shadow-glow">
          <Bot className="w-5 h-5 text-primary" />
        </div>
      )}
      
      <div
        className={cn(
          "max-w-[70%] rounded-2xl px-5 py-3 shadow-message transition-smooth",
          isUser 
            ? "gradient-user text-primary-foreground" 
            : "gradient-message text-foreground"
        )}
      >
        {!isUser && provider && (
          <div className="text-xs text-muted-foreground mb-2 font-medium">
            {getProviderLabel(provider)}
          </div>
        )}
        <p className="text-sm leading-relaxed whitespace-pre-wrap">
          {content}
          {isStreaming && (
            <span className="inline-block w-1 h-4 ml-1 bg-primary animate-pulse" />
          )}
        </p>
      </div>

      {isUser && (
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
          <User className="w-5 h-5 text-foreground" />
        </div>
      )}
    </motion.div>
  );
};

export default ChatMessage;
