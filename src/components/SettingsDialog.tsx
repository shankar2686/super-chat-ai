import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  apiKeys: { openai: string; supermemory: string };
  onSave: (keys: { openai: string; supermemory: string }) => void;
}

const SettingsDialog = ({ open, onOpenChange, apiKeys, onSave }: SettingsDialogProps) => {
  const [openaiKey, setOpenaiKey] = useState(apiKeys.openai);
  const [supermemoryKey, setSupermemoryKey] = useState(apiKeys.supermemory);
  const { toast } = useToast();

  const handleSave = () => {
    onSave({ openai: openaiKey, supermemory: supermemoryKey });
    toast({
      title: "Settings saved",
      description: "Your API keys have been securely stored.",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>API Settings</DialogTitle>
          <DialogDescription>
            Enter your API keys to connect to OpenAI and Supermemory
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="openai">OpenAI API Key</Label>
            <Input
              id="openai"
              type="password"
              placeholder="sk-..."
              value={openaiKey}
              onChange={(e) => setOpenaiKey(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="supermemory">Supermemory API Key</Label>
            <Input
              id="supermemory"
              type="password"
              placeholder="Enter your Supermemory key"
              value={supermemoryKey}
              onChange={(e) => setSupermemoryKey(e.target.value)}
            />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsDialog;
