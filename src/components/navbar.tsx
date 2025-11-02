import { useSetAtom } from "jotai";
import { HistoryIcon, SettingsIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

import { historySheetAtom, settingsSheetAtom } from "@/lib/store";

import { useReadLocalStorage } from "@/hooks/useReadLocalStorage";

export default function Navbar() {
  const setHistorySheetOpen = useSetAtom(historySheetAtom);
  const setSettingsSheetOpen = useSetAtom(settingsSheetAtom);

  const sessions = useReadLocalStorage<unknown[]>("tomodoro-sessions");
  const sessionCount = sessions?.length || 0;

  return (
    <nav className="sticky top-0 z-10 container mx-auto px-4 py-6 backdrop-blur-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-foreground text-2xl font-bold">Tomodoro</h1>
          <Button
            variant={"ghost"}
            size={"sm"}
            onClick={() => setHistorySheetOpen(true)}
            className="text-foreground shadow-strong hidden cursor-pointer items-center gap-2 rounded-full border bg-white/10 px-4 py-2 text-sm backdrop-blur-md sm:flex"
          >
            <span className="font-medium">Sessions Today:</span>
            <span className="font-bold">{sessionCount}</span>
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="cursor-pointer rounded-full"
            onClick={() => setHistorySheetOpen(true)}
          >
            <HistoryIcon className="size-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="cursor-pointer rounded-full"
            onClick={() => setSettingsSheetOpen(true)}
          >
            <SettingsIcon className="size-6" />
          </Button>
        </div>
      </div>
    </nav>
  );
}
