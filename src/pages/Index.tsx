import { useState, useRef, useEffect } from "react";
import ChatHeader from "@/components/ChatHeader";
import ChatMessage from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import UserIdDialog from "@/components/UserIdDialog";
import ApiSettingsDialog, { LLMProvider } from "@/components/ApiSettingsDialog";
import { useToast } from "@/hooks/use-toast";
import { useUserId } from "@/hooks/useUserId";
import { motion } from "framer-motion";
import { Brain } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [provider, setProvider] = useState<LLMProvider>("openai");
  const [apiKey, setApiKey] = useState("");
  const [supermemoryKey, setSupermemoryKey] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { userId, updateUserId } = useUserId();

  // Check if API keys are configured on mount
  useEffect(() => {
    if (!apiKey || !supermemoryKey) {
      setSettingsOpen(true);
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    if (!apiKey || !supermemoryKey) {
      toast({
        title: "API Keys Required",
        description: "Please configure your API keys in settings first",
        variant: "destructive",
      });
      setSettingsOpen(true);
      return;
    }

    const userMessage: Message = { role: "user", content };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('chat', {
        body: {
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
          userId: userId,
          provider: provider,
          apiKey: apiKey,
          supermemoryKey: supermemoryKey,
        }
      });

      if (error) throw error;

      const assistantMessage: Message = {
        role: "assistant",
        content: data.choices[0].message.content || "No response generated.",
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSettings = (newProvider: LLMProvider, newApiKey: string, newSupermemoryKey: string) => {
    setProvider(newProvider);
    setApiKey(newApiKey);
    setSupermemoryKey(newSupermemoryKey);
  };

  return (
    <div className="flex flex-col h-screen gradient-main">
      <ChatHeader onSettingsClick={() => setSettingsOpen(true)} />
      <UserIdDialog open={!userId} onSave={updateUserId} />
      <ApiSettingsDialog
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        onSave={handleSaveSettings}
        currentProvider={provider}
        currentApiKey={apiKey}
        currentSupermemoryKey={supermemoryKey}
      />
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex-1 overflow-y-auto p-6 space-y-4"
      >
        {messages.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-center h-full"
          >
            <div className="text-center">
              <div className="w-20 h-20 rounded-2xl gradient-user flex items-center justify-center mx-auto mb-4 shadow-glow">
                <Brain className="w-10 h-10 text-primary-foreground" />
              </div>
              <h2 className="text-2xl font-semibold text-foreground mb-2">
                Start a Conversation
              </h2>
              <p className="text-muted-foreground max-w-md">
                Chat with an AI that remembers. Your conversations are stored in Supermemory for context-aware responses.
              </p>
            </div>
          </motion.div>
        ) : (
          <>
            {messages.map((message, index) => (
              <ChatMessage
                key={index}
                role={message.role}
                content={message.content}
              />
            ))}
            {isLoading && (
              <ChatMessage
                role="assistant"
                content=""
                isStreaming
              />
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </motion.div>

      <ChatInput onSendMessage={handleSendMessage} disabled={isLoading} />
    </div>
  );
};

export default Index;
