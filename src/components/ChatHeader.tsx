import { Brain } from "lucide-react";
import { motion } from "framer-motion";

const ChatHeader = () => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between gap-3 p-6 border-b border-border bg-card/50 backdrop-blur-sm"
    >
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl gradient-user flex items-center justify-center shadow-glow">
          <Brain className="w-6 h-6 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-foreground">AI Memory Chat</h1>
          <p className="text-sm text-muted-foreground">Powered by OpenAI & Supermemory</p>
        </div>
      </div>
    </motion.header>
  );
};

export default ChatHeader;
