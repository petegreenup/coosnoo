import { useState, useCallback, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ChevronUp, ChevronDown } from "lucide-react";

interface TimeInputProps {
  hour: number;
  minute: number;
  period: "AM" | "PM";
  onChange: (hour: number, minute: number, period: "AM" | "PM") => void;
  size?: "lg" | "md";
}

export function TimeInput({ hour, minute, period, onChange, size = "lg" }: TimeInputProps) {
  const [editingField, setEditingField] = useState<"hour" | "minute" | null>(null);
  const [editText, setEditText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const wrap = (val: number, min: number, max: number) => {
    if (val > max) return min;
    if (val < min) return max;
    return val;
  };

  const stepHour = useCallback(
    (dir: 1 | -1) => onChange(wrap(hour + dir, 1, 12), minute, period),
    [hour, minute, period, onChange]
  );

  const stepMinute = useCallback(
    (dir: 1 | -1) => onChange(hour, wrap(minute + dir, 0, 59), period),
    [hour, minute, period, onChange]
  );

  const stepMinute5 = useCallback(
    (dir: 1 | -1) => {
      let next = minute + dir * 5;
      if (next > 59) next = 0;
      if (next < 0) next = 55;
      onChange(hour, next, period);
    },
    [hour, minute, period, onChange]
  );

  const togglePeriod = () => onChange(hour, minute, period === "AM" ? "PM" : "AM");

  const startRepeat = (fn: () => void) => {
    fn();
    intervalRef.current = setInterval(fn, 150);
  };
  const stopRepeat = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => () => stopRepeat(), []);

  // Focus input when entering edit mode
  useEffect(() => {
    if (editingField && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingField]);

  const startEditing = (field: "hour" | "minute") => {
    setEditingField(field);
    setEditText(field === "hour" ? String(hour).padStart(2, "0") : String(minute).padStart(2, "0"));
  };

  const commitEdit = () => {
    if (!editingField) return;
    const n = parseInt(editText, 10);
    if (editingField === "hour") {
      const clamped = isNaN(n) || n < 1 ? 12 : n > 12 ? 12 : n;
      onChange(clamped, minute, period);
    } else {
      const clamped = isNaN(n) || n < 0 ? 0 : n > 59 ? 59 : n;
      onChange(hour, clamped, period);
    }
    setEditingField(null);
  };

  const handleEditChange = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 2);
    setEditText(digits);
    if (digits.length === 2) {
      // Auto-commit on 2 digits
      const n = parseInt(digits, 10);
      if (editingField === "hour") {
        const clamped = isNaN(n) || n < 1 ? 12 : n > 12 ? 12 : n;
        onChange(clamped, minute, period);
        // Auto-advance to minute
        setEditingField("minute");
        setEditText(String(minute).padStart(2, "0"));
      } else {
        const clamped = isNaN(n) || n < 0 ? 0 : n > 59 ? 59 : n;
        onChange(hour, clamped, period);
        setEditingField(null);
      }
    }
  };

  const isLg = size === "lg";
  const displaySize = isLg ? "text-6xl" : "text-5xl";
  const btnSize = isLg ? "h-12 w-14" : "h-10 w-12";
  const chevronSize = isLg ? "h-7 w-7" : "h-6 w-6";

  const StepButton = ({
    direction,
    onStep,
    label,
  }: {
    direction: "up" | "down";
    onStep: () => void;
    label: string;
  }) => (
    <button
      type="button"
      aria-label={label}
      onPointerDown={() => startRepeat(onStep)}
      onPointerUp={stopRepeat}
      onPointerLeave={stopRepeat}
      className={cn(
        "flex items-center justify-center rounded-xl bg-secondary text-foreground transition-colors hover:bg-primary/20 active:bg-primary/30 select-none touch-none",
        btnSize
      )}
    >
      {direction === "up" ? (
        <ChevronUp className={chevronSize} />
      ) : (
        <ChevronDown className={chevronSize} />
      )}
    </button>
  );

  const NumberDisplay = ({ value, field }: { value: number; field: "hour" | "minute" }) => {
    if (editingField === field) {
      return (
        <input
          ref={inputRef}
          type="text"
          inputMode="numeric"
          value={editText}
          onChange={(e) => handleEditChange(e.target.value)}
          onBlur={commitEdit}
          onKeyDown={(e) => e.key === "Enter" && commitEdit()}
          maxLength={2}
          className={cn(
            "font-mono-display font-light text-foreground bg-primary/10 text-center rounded-lg outline-none border-2 border-primary transition-colors tabular-nums",
            isLg ? "text-6xl w-[2.5ch] py-1" : "text-5xl w-[2.5ch] py-0.5"
          )}
        />
      );
    }
    return (
      <span
        onClick={() => startEditing(field)}
        className={cn(
          "font-mono-display font-light text-foreground tabular-nums select-none cursor-text rounded-lg px-1 transition-colors hover:bg-secondary/80",
          displaySize
        )}
        title="Tap to type"
      >
        {String(value).padStart(2, "0")}
      </span>
    );
  };

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Main stepper row */}
      <div className="flex items-center gap-2">
        {/* Hour column */}
        <div className="flex flex-col items-center gap-1.5">
          <StepButton direction="up" onStep={() => stepHour(1)} label="Hour up" />
          <NumberDisplay value={hour} field="hour" />
          <StepButton direction="down" onStep={() => stepHour(-1)} label="Hour down" />
        </div>

        {/* Colon */}
        <span className={cn("font-mono-display font-light text-muted-foreground select-none pb-1", displaySize)}>
          :
        </span>

        {/* Minute column */}
        <div className="flex flex-col items-center gap-1.5">
          <StepButton direction="up" onStep={() => stepMinute(1)} label="Minute up" />
          <NumberDisplay value={minute} field="minute" />
          <StepButton direction="down" onStep={() => stepMinute(-1)} label="Minute down" />
        </div>

        {/* AM/PM column */}
        <div className="flex flex-col items-center gap-1.5 ml-2">
          <button
            type="button"
            onClick={togglePeriod}
            className={cn(
              "rounded-xl font-semibold transition-colors select-none px-4 py-2",
              period === "AM"
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-muted-foreground hover:bg-secondary/80"
            )}
          >
            AM
          </button>
          <button
            type="button"
            onClick={togglePeriod}
            className={cn(
              "rounded-xl font-semibold transition-colors select-none px-4 py-2",
              period === "PM"
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-muted-foreground hover:bg-secondary/80"
            )}
          >
            PM
          </button>
        </div>
      </div>

      {/* Quick ±5 minute buttons */}
      <div className="flex items-center gap-2 mt-1">
        <button
          type="button"
          onClick={() => stepMinute5(-1)}
          className="rounded-lg bg-secondary px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-primary/20 hover:text-foreground transition-colors"
        >
          − 5 min
        </button>
        <button
          type="button"
          onClick={() => stepMinute5(1)}
          className="rounded-lg bg-secondary px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-primary/20 hover:text-foreground transition-colors"
        >
          + 5 min
        </button>
      </div>

      <p className="text-[10px] text-muted-foreground/60">Tap time to type directly</p>
    </div>
  );
}
