import { useState, useEffect } from "react";
import { useAlarms } from "@/hooks/useAlarms";
import { useSettings } from "@/hooks/useSettings";
import { AlarmCard } from "@/components/AlarmCard";
import { AddAlarmDialog } from "@/components/AddAlarmDialog";
import { AlarmClock, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const { alarms, addAlarm, toggleAlarm, deleteAlarm } = useAlarms();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="mx-auto max-w-md">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <AlarmClock className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-foreground">Snooze Grid</h1>
              <p className="text-xs text-muted-foreground">Smart alarm clock</p>
            </div>
          </div>
          <button
            onClick={() => navigate("/settings")}
            className="rounded-lg p-2.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <Settings className="h-5 w-5" />
          </button>
        </div>

        {/* Current Time */}
        <div className="mb-8 text-center">
          <CurrentTime />
        </div>

        {/* Alarms */}
        <div className="space-y-3 mb-8">
          {alarms.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border/50 py-12 text-center">
              <AlarmClock className="mx-auto mb-3 h-8 w-8 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">No alarms set</p>
              <p className="text-xs text-muted-foreground/60 mt-1">
                Tap the button below to add one
              </p>
            </div>
          ) : (
            alarms.map((alarm) => (
              <AlarmCard
                key={alarm.id}
                alarm={alarm}
                onToggle={toggleAlarm}
                onDelete={deleteAlarm}
              />
            ))
          )}
        </div>

        {/* Add button */}
        <div className="flex justify-center">
          <AddAlarmDialog onAdd={addAlarm} />
        </div>

        {/* Preview snooze grid button */}
        {alarms.length > 0 && (
          <div className="mt-6 text-center">
            <button
              onClick={() => navigate("/alarm-active")}
              className="text-xs text-muted-foreground underline-offset-2 hover:underline"
            >
              Preview alarm screen →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

function CurrentTime() {
  const [time, setTime] = useState(new Date());

  useState(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  });

  const h = time.getHours() % 12 || 12;
  const m = time.getMinutes().toString().padStart(2, "0");
  const s = time.getSeconds().toString().padStart(2, "0");
  const period = time.getHours() >= 12 ? "PM" : "AM";

  return (
    <div>
      <span className="font-mono-display text-6xl font-light tracking-tight text-foreground">
        {h}:{m}
      </span>
      <span className="font-mono-display text-2xl font-light text-muted-foreground ml-1">
        :{s}
      </span>
      <span className="ml-2 text-lg text-muted-foreground">{period}</span>
    </div>
  );
}

export default Index;
