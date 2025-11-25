import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface UserIdDialogProps {
  open: boolean;
  onSave: (userId: string) => void;
}

const UserIdDialog = ({ open, onSave }: UserIdDialogProps) => {
  const [userId, setUserId] = useState("");

  const handleSave = () => {
    if (userId.trim()) {
      onSave(userId.trim());
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Welcome to AI Memory Chat</DialogTitle>
          <DialogDescription>
            Please enter your name or user ID to enable personalized memory across conversations
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="userId">Your Name or User ID</Label>
            <Input
              id="userId"
              placeholder="e.g., John or user_123"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && userId.trim()) {
                  handleSave();
                }
              }}
            />
          </div>
        </div>
        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={!userId.trim()}>
            Continue
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserIdDialog;
