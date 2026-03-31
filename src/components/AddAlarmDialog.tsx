import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { TimePicker } from "@/components/TimePicker";
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
  const [timePickerOpen, setTimePickerOpen] = useState(false);

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
      <DialogContent className="bg-card border-border max-w-xs" aria-describedby="add-alarm-desc">
        <DialogHeader>
          <DialogTitle className="text-foreground">New Alarm</DialogTitle>
          <DialogDescription id="add-alarm-desc" className="text-muted-foreground text-xs">
            Set your alarm time and label
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-2">
          {/* Tap to open time picker */}
          <button
            type="button"
            onClick={() => setTimePickerOpen(true)}
            className="w-full rounded-xl bg-secondary/50 border border-border py-5 px-4 flex items-center justify-center gap-2 transition-colors hover:bg-secondary"
          >
            <span className="font-mono-display text-5xl font-light text-foreground">
              {hour.toString().padStart(2, "0")}:{minute.toString().padStart(2, "0")}
            </span>
            <span className="text-lg text-muted-foreground ml-2">{period}</span>
          </button>
          <p className="text-xs text-muted-foreground text-center -mt-4">Tap to change time</p>

          <TimePicker
            open={timePickerOpen}
            onOpenChange={setTimePickerOpen}
            hour={hour}
            minute={minute}
            period={period}
            onConfirm={(h, m, p) => {
              setHour(h);
              setMinute(m);
              setPeriod(p);
            }}
          />

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
