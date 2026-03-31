import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Switch } from "@/components/ui/switch";
import { Clock, Trash2 } from "lucide-react";
import type { Alarm } from "@/types/alarm";

interface AlarmCardProps {
  alarm: Alarm;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

function formatTime(hour: number, minute: number) {
  const period = hour >= 12 ? "PM" : "AM";
  const h = hour % 12 || 12;
  const m = minute.toString().padStart(2, "0");
  return { time: `${h}:${m}`, period };
}

export function AlarmCard({ alarm, onToggle, onDelete }: AlarmCardProps) {
  const { time, period } = formatTime(alarm.hour, alarm.minute);
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/alarm/${alarm.id}/edit`)}
      className={`flex items-center justify-between rounded-lg border px-5 py-4 transition-all cursor-pointer ${
        alarm.enabled
          ? "border-primary/30 bg-card hover:bg-secondary/50"
          : "border-border/50 bg-card/50 opacity-60 hover:opacity-80"
      }`}
    >
      <div className="flex items-center gap-4">
        <Clock className="h-5 w-5 text-muted-foreground" />
        <div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-mono-display text-3xl font-light tracking-tight text-foreground">
              {time}
            </span>
            <span className="text-sm font-medium text-muted-foreground">
              {period}
            </span>
          </div>
          {alarm.label && (
            <p className="mt-0.5 text-xs text-muted-foreground">{alarm.label}</p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={() => onDelete(alarm.id)}
          className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </button>
        <Switch checked={alarm.enabled} onCheckedChange={() => onToggle(alarm.id)} />
      </div>
    </div>
  );
}
