import HistorySheet from "@/components/history-sheet";
import Navbar from "@/components/navbar";
import SettingsSheet from "@/components/settings-sheet";
import { Timer } from "@/components/timer";

import { Mode } from "@/lib/types";

import { useReadLocalStorage } from "@/hooks";

import { Card, CardContent } from "./components/ui/card";

export default function App() {
  const mode = useReadLocalStorage<Mode>("mode") || "focus";
  const focusColor = useReadLocalStorage<string>("focusColor") || "#8B5CF6";
  const breakColor = useReadLocalStorage<string>("breakColor") || "#F97316";

  const currentColor = mode === "focus" ? focusColor : breakColor;

  return (
    <main
      className="min-h-screen transition-all duration-700"
      style={{
        background: `linear-gradient(135deg, ${currentColor}15 0%, ${currentColor}40 100%)`,
      }}
    >
      <Navbar />

      {/* Timer */}
      <div className="px-4 pb-6">
        <Card className="mx-auto max-w-xl rounded-3xl bg-white/30 shadow-xl backdrop-blur-md">
          <CardContent>
            <Timer />
          </CardContent>
        </Card>
      </div>

      <HistorySheet />
      <SettingsSheet />
    </main>
  );
}
