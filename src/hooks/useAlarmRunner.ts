import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import type { Alarm } from "@/types/alarm";

export function useAlarmRunner(alarms: Alarm[]) {
  const navigate = useNavigate();
  const firedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const check = () => {
      const now = new Date();
      const currentH = now.getHours();
      const currentM = now.getMinutes();
      const dateKey = now.toDateString();

      for (const alarm of alarms) {
        if (!alarm.enabled) continue;
        const key = `${alarm.id}-${dateKey}-${currentH}:${currentM}`;
        if (firedRef.current.has(key)) continue;

        if (alarm.hour === currentH && alarm.minute === currentM) {
          firedRef.current.add(key);
          // Clean old keys periodically
          if (firedRef.current.size > 200) {
            firedRef.current.clear();
            firedRef.current.add(key);
          }
          navigate("/alarm-active");
          return;
        }
      }
    };

    check();
    const id = setInterval(check, 1000);
    return () => clearInterval(id);
  }, [alarms, navigate]);
}
