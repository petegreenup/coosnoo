import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import type { Alarm } from "@/types/alarm";

interface AddAlarmDialogProps {
  onAdd: (alarm: Omit<Alarm, "id">) => void;
}

export function AddAlarmDialog({ onAdd }: AddAlarmDialogProps) {
  const [open, setOpen] = useState(false);
  const [hour, setHour] = useState(7);
  const [minute, setMinute] = useState(0);
  const [label, setLabel] = useState("");
  const [period, setPeriod] = useState<"AM" | "PM">("AM");

  const handleSave = () => {
    const h24 = period === "PM" ? (hour % 12) + 12 : hour % 12;
    onAdd({
      hour: h24,
      minute,
      enabled: true,
      label,
      days: [],
    });
    setLabel("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="rounded-full gap-2 px-6">
          <Plus className="h-5 w-5" />
          Add Alarm
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card border-border max-w-xs">
        <DialogHeader>
          <DialogTitle className="text-foreground">New Alarm</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-2">
          {/* Time picker */}
          <div className="flex items-center justify-center gap-2">
            <div className="flex flex-col items-center">
              <button
                onClick={() => setHour((h) => (h % 12) + 1)}
                className="text-muted-foreground hover:text-foreground p-1 text-xl"
              >
                ▲
              </button>
              <span className="font-mono-display text-5xl font-light text-foreground w-20 text-center">
                {hour.toString().padStart(2, "0")}
              </span>
              <button
                onClick={() => setHour((h) => ((h - 2 + 12) % 12) + 1)}
                className="text-muted-foreground hover:text-foreground p-1 text-xl"
              >
                ▼
              </button>
            </div>
            <span className="font-mono-display text-5xl font-light text-muted-foreground">:</span>
            <div className="flex flex-col items-center">
              <button
                onClick={() => setMinute((m) => (m + 5) % 60)}
                className="text-muted-foreground hover:text-foreground p-1 text-xl"
              >
                ▲
              </button>
              <span className="font-mono-display text-5xl font-light text-foreground w-20 text-center">
                {minute.toString().padStart(2, "0")}
              </span>
              <button
                onClick={() => setMinute((m) => (m - 5 + 60) % 60)}
                className="text-muted-foreground hover:text-foreground p-1 text-xl"
              >
                ▼
              </button>
            </div>
            <div className="flex flex-col gap-1 ml-2">
              <button
                onClick={() => setPeriod("AM")}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  period === "AM"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground"
                }`}
              >
                AM
              </button>
              <button
                onClick={() => setPeriod("PM")}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  period === "PM"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground"
                }`}
              >
                PM
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-muted-foreground">Label (optional)</Label>
            <Input
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g. Work, Gym..."
              className="bg-secondary border-border text-foreground"
            />
          </div>

          <Button onClick={handleSave} className="w-full" size="lg">
            Save Alarm
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
