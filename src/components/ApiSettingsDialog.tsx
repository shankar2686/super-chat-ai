import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

export type LLMProvider = "openai" | "anthropic" | "gemini" | "groq";

interface ApiSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (provider: LLMProvider, apiKey: string, supermemoryKey: string) => void;
  currentProvider: LLMProvider;
  currentApiKey: string;
  currentSupermemoryKey: string;
}

const ApiSettingsDialog = ({
  open,
  onOpenChange,
  onSave,
  currentProvider,
  currentApiKey,
  currentSupermemoryKey,
}: ApiSettingsDialogProps) => {
  const [provider, setProvider] = useState<LLMProvider>(currentProvider);
  const [apiKey, setApiKey] = useState(currentApiKey);
  const [supermemoryKey, setSupermemoryKey] = useState(currentSupermemoryKey);
  const { toast } = useToast();

  const handleSave = () => {
    if (!apiKey.trim() || !supermemoryKey.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter both API keys",
        variant: "destructive",
      });
      return;
    }

    onSave(provider, apiKey.trim(), supermemoryKey.trim());
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
            <Input
              id="apiKey"
              type="password"
              placeholder="Enter your API key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="supermemoryKey">Supermemory API Key</Label>
            <Input
              id="supermemoryKey"
              type="password"
              placeholder="Enter your Supermemory API key"
              value={supermemoryKey}
              onChange={(e) => setSupermemoryKey(e.target.value)}
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
