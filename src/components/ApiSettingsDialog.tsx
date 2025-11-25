import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff } from "lucide-react";

export type LLMProvider = "openai" | "anthropic" | "gemini" | "groq";

interface ApiSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (provider: LLMProvider, apiKey: string, supermemoryKey: string, userId: string) => void;
  currentProvider: LLMProvider;
  currentApiKeys: Record<LLMProvider, string>;
  currentSupermemoryKey: string;
  currentUserId: string;
}

const ApiSettingsDialog = ({
  open,
  onOpenChange,
  onSave,
  currentProvider,
  currentApiKeys,
  currentSupermemoryKey,
  currentUserId,
}: ApiSettingsDialogProps) => {
  const [provider, setProvider] = useState<LLMProvider>(currentProvider);
  const [apiKey, setApiKey] = useState(currentApiKeys[currentProvider]);
  const [supermemoryKey, setSupermemoryKey] = useState(currentSupermemoryKey);
  const [userId, setUserId] = useState(currentUserId);
  const [showApiKey, setShowApiKey] = useState(false);
  const [showSupermemoryKey, setShowSupermemoryKey] = useState(false);
  const { toast } = useToast();

  // Update API key field when provider changes
  useEffect(() => {
    setApiKey(currentApiKeys[provider]);
  }, [provider, currentApiKeys]);

  const handleSave = () => {
    if (!apiKey.trim() || !supermemoryKey.trim() || !userId.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter all required fields",
        variant: "destructive",
      });
      return;
    }

    onSave(provider, apiKey.trim(), supermemoryKey.trim(), userId.trim());
    toast({
      title: "Settings Saved",
      description: "Your API settings have been updated for this session",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>API Settings</DialogTitle>
          <DialogDescription>
            Configure your LLM provider and API keys. These are stored only for this session.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="provider">LLM Provider</Label>
            <Select value={provider} onValueChange={(value) => setProvider(value as LLMProvider)}>
              <SelectTrigger id="provider">
                <SelectValue placeholder="Select provider" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="openai">OpenAI</SelectItem>
                <SelectItem value="anthropic">Anthropic</SelectItem>
                <SelectItem value="gemini">Gemini</SelectItem>
                <SelectItem value="groq">Groq</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="apiKey">{provider.charAt(0).toUpperCase() + provider.slice(1)} API Key</Label>
            <div className="relative">
              <Input
                id="apiKey"
                type={showApiKey ? "text" : "password"}
                placeholder="Enter your API key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                onClick={() => setShowApiKey(!showApiKey)}
              >
                {showApiKey ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="supermemoryKey">Supermemory API Key</Label>
            <div className="relative">
              <Input
                id="supermemoryKey"
                type={showSupermemoryKey ? "text" : "password"}
                placeholder="Enter your Supermemory API key"
                value={supermemoryKey}
                onChange={(e) => setSupermemoryKey(e.target.value)}
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                onClick={() => setShowSupermemoryKey(!showSupermemoryKey)}
              >
                {showSupermemoryKey ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="userId">User ID (for Supermemory)</Label>
            <Input
              id="userId"
              placeholder="e.g., John or user_123"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Settings
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ApiSettingsDialog;
