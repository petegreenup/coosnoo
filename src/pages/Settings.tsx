import { useNavigate } from "react-router-dom";
import { useSettings } from "@/hooks/useSettings";
import { ArrowLeft } from "lucide-react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

const SettingsPage = () => {
  const { settings, updateSettings, updateSnoozeMinutes } = useSettings();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="mx-auto max-w-md">
        {/* Header */}
        <div className="mb-8 flex items-center gap-3">
          <button
            onClick={() => navigate("/")}
            className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-xl font-semibold text-foreground">Settings</h1>
        </div>

        {/* Snooze Button Count */}
        <div className="space-y-6">
          <div className="rounded-lg border border-border bg-card p-5">
            <Label className="text-sm font-medium text-foreground">
              Number of Snooze Buttons
            </Label>
            <p className="text-xs text-muted-foreground mt-1 mb-3">
              How many snooze options to show when alarm rings
            </p>
            <Select
              value={String(settings.snoozeButtonCount)}
              onValueChange={(v) =>
                updateSettings({ snoozeButtonCount: Number(v) as 2 | 4 | 6 })
              }
            >
              <SelectTrigger className="bg-secondary border-border text-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2">2 buttons</SelectItem>
                <SelectItem value="4">4 buttons</SelectItem>
                <SelectItem value="6">6 buttons</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Snooze Durations */}
          <div className="rounded-lg border border-border bg-card p-5">
            <Label className="text-sm font-medium text-foreground">
              Snooze Durations
            </Label>
            <p className="text-xs text-muted-foreground mt-1 mb-4">
              Set minutes for each snooze button
            </p>
            <div className="grid grid-cols-2 gap-3">
              {settings.snoozeButtons
                .slice(0, settings.snoozeButtonCount)
                .map((btn, i) => (
                  <div key={btn.index} className="space-y-1.5">
                    <label className="text-xs text-muted-foreground">
                      Button {i + 1}
                    </label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min={1}
                        max={120}
                        value={btn.minutes}
                        onChange={(e) =>
                          updateSnoozeMinutes(btn.index, Number(e.target.value) || 1)
                        }
                        className="bg-secondary border-border text-foreground font-mono-display"
                      />
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        min
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
