import { useState, useEffect, useCallback } from "react";
import type { Alarm } from "@/types/alarm";

const STORAGE_KEY = "snooze-grid-alarms";

function loadAlarms(): Alarm[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function useAlarms() {
  const [alarms, setAlarms] = useState<Alarm[]>(loadAlarms);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(alarms));
  }, [alarms]);

  const addAlarm = useCallback((alarm: Omit<Alarm, "id">) => {
    setAlarms((prev) => [...prev, { ...alarm, id: crypto.randomUUID() }]);
  }, []);

  const updateAlarm = useCallback((id: string, updates: Partial<Alarm>) => {
    setAlarms((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...updates } : a))
    );
  }, []);

  const deleteAlarm = useCallback((id: string) => {
    setAlarms((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const toggleAlarm = useCallback((id: string) => {
    setAlarms((prev) =>
      prev.map((a) => (a.id === id ? { ...a, enabled: !a.enabled } : a))
    );
  }, []);

  return { alarms, addAlarm, updateAlarm, deleteAlarm, toggleAlarm };
}
