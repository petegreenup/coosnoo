import { useState, useRef } from "react";
import { cn } from "@/lib/utils";

interface TimeInputProps {
  hour: number;
  minute: number;
  period: "AM" | "PM";
  onChange: (hour: number, minute: number, period: "AM" | "PM") => void;
  size?: "lg" | "md";
}

export function TimeInput({ hour, minute, period, onChange, size = "lg" }: TimeInputProps) {
  const [hourText, setHourText] = useState(String(hour).padStart(2, "0"));
  const [minText, setMinText] = useState(String(minute).padStart(2, "0"));
  const minRef = useRef<HTMLInputElement>(null);
  const hourRef = useRef<HTMLInputElement>(null);

  const textSize = size === "lg" ? "text-6xl" : "text-5xl";
  const periodSize = size === "lg" ? "text-xl" : "text-lg";

  const commitHour = (val: string) => {
    let n = parseInt(val, 10);
    if (isNaN(n) || n < 1) n = 12;
    if (n > 12) n = 12;
    setHourText(String(n).padStart(2, "0"));
    onChange(n, minute, period);
  };

  const commitMinute = (val: string) => {
    let n = parseInt(val, 10);
    if (isNaN(n) || n < 0) n = 0;
    if (n > 59) n = 59;
    setMinText(String(n).padStart(2, "0"));
    onChange(hour, n, period);
  };

  const handleHourChange = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 2);
    setHourText(digits);
    // Auto-advance to minutes if 2 digits entered
    if (digits.length === 2) {
      commitHour(digits);
      minRef.current?.focus();
      minRef.current?.select();
    }
  };

  const handleMinChange = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 2);
    setMinText(digits);
    if (digits.length === 2) {
      commitMinute(digits);
    }
  };

  const togglePeriod = () => {
    const newP = period === "AM" ? "PM" : "AM";
    onChange(hour, minute, newP);
  };

  return (
    <div className="flex items-center justify-center gap-1">
      <input
        ref={hourRef}
        type="text"
        inputMode="numeric"
        value={hourText}
        onChange={(e) => handleHourChange(e.target.value)}
        onFocus={(e) => e.target.select()}
        onBlur={(e) => commitHour(e.target.value)}
        className={cn(
          "font-mono-display font-light text-foreground bg-transparent text-center w-[3ch] outline-none border-b-2 border-transparent focus:border-primary transition-colors",
          textSize
        )}
        maxLength={2}
      />
      <span className={cn("font-mono-display font-light text-muted-foreground", textSize)}>:</span>
      <input
        ref={minRef}
        type="text"
        inputMode="numeric"
        value={minText}
        onChange={(e) => handleMinChange(e.target.value)}
        onFocus={(e) => e.target.select()}
        onBlur={(e) => commitMinute(e.target.value)}
        className={cn(
          "font-mono-display font-light text-foreground bg-transparent text-center w-[3ch] outline-none border-b-2 border-transparent focus:border-primary transition-colors",
          textSize
        )}
        maxLength={2}
      />
      <button
        type="button"
        onClick={togglePeriod}
        className={cn(
          "ml-2 font-semibold rounded-lg px-3 py-1.5 bg-primary/20 text-primary hover:bg-primary/30 transition-colors",
          periodSize
        )}
      >
        {period}
      </button>
    </div>
  );
}
