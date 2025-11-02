import { useAtom } from "jotai";
import { PlayIcon } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { settingsSheetAtom } from "@/lib/store";

import { useLocalStorage, useSoundPlayer } from "@/hooks";

import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Slider } from "./ui/slider";

const SOUND_OPTIONS = [
  { value: "bell", label: "Bell" },
  { value: "chime", label: "Chime" },
  { value: "ding", label: "Ding" },
  { value: "gong", label: "Gong" },
  { value: "notification", label: "Notification" },
];

const COLOR_PRESETS = [
  { value: "#8B5CF6", label: "Purple" },
  { value: "#3B82F6", label: "Blue" },
  { value: "#10B981", label: "Green" },
  { value: "#F59E0B", label: "Amber" },
  { value: "#EF4444", label: "Red" },
  { value: "#EC4899", label: "Pink" },
  { value: "#F97316", label: "Orange" },
  { value: "#14B8A6", label: "Teal" },
];

export default function SettingsSheet() {
  const [sheetOpen, setSheetOpen] = useAtom(settingsSheetAtom);
  const { testSound } = useSoundPlayer();

  const [focusDuration, setFocusDuration] = useLocalStorage(
    "focusDuration",
    25,
  );
  const [breakDuration, setBreakDuration] = useLocalStorage("breakDuration", 5);
  const [focusColor, setFocusColor] = useLocalStorage("focusColor", "#8B5CF6");
  const [breakColor, setBreakColor] = useLocalStorage("breakColor", "#F97316");
  const [focusSound, setFocusSound] = useLocalStorage("focusSound", "bell");
  const [breakSound, setBreakSound] = useLocalStorage("breakSound", "chime");

  return (
    <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Settings</SheetTitle>
          <SheetDescription>
            Customize your Pomodoro timer settings
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-8 px-4 py-8">
          {/* Focus Duration */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <Label>Focus Duration</Label>
              <span className="text-muted-foreground text-sm">
                {focusDuration} minutes
              </span>
            </div>
            <Slider
              value={[focusDuration]}
              onValueChange={([value]) => setFocusDuration(value)}
              min={1}
              max={60}
              step={1}
              rangeStyle={{
                backgroundColor: focusColor,
              }}
              thumbStyle={{
                backgroundColor: focusColor,
                borderColor: focusColor,
              }}
            />
          </div>

          {/* Break Duration */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Break Duration</Label>
              <span className="text-muted-foreground text-sm">
                {breakDuration} minutes
              </span>
            </div>
            <Slider
              value={[breakDuration]}
              onValueChange={([value]) => setBreakDuration(value)}
              min={1}
              max={30}
              step={1}
              rangeStyle={{
                backgroundColor: breakColor,
              }}
              thumbStyle={{
                backgroundColor: breakColor,
                borderColor: breakColor,
              }}
            />
          </div>

          {/* Focus Color */}
          <div className="space-y-4">
            <Label>Focus Color</Label>
            <Select value={focusColor} onValueChange={setFocusColor}>
              <SelectTrigger className="w-full">
                <div className="flex items-center gap-2">
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent>
                {COLOR_PRESETS.map((color) => (
                  <SelectItem key={color.value} value={color.value}>
                    <div className="flex items-center gap-2">
                      <div
                        className="h-4 w-4 rounded-full"
                        style={{ backgroundColor: color.value }}
                      />
                      {color.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Break Color */}
          <div className="space-y-4">
            <Label>Break Color</Label>
            <Select value={breakColor} onValueChange={setBreakColor}>
              <SelectTrigger className="w-full">
                <div className="flex items-center gap-2">
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent>
                {COLOR_PRESETS.map((color) => (
                  <SelectItem key={color.value} value={color.value}>
                    <div className="flex items-center gap-2">
                      <div
                        className="h-4 w-4 rounded-full"
                        style={{ backgroundColor: color.value }}
                      />
                      {color.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Focus Sound */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Focus Complete Sound</Label>
              <Button
                variant={"outline"}
                size={"icon-sm"}
                className="rounded-full"
                onClick={() => testSound(focusSound)}
              >
                <PlayIcon className="h-4 w-4" />
              </Button>
            </div>
            <Select value={focusSound} onValueChange={setFocusSound}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SOUND_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Break Sound */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Break Complete Sound</Label>
              <Button
                variant={"outline"}
                size={"icon-sm"}
                className="rounded-full"
                onClick={() => testSound(breakSound)}
              >
                <PlayIcon className="h-4 w-4" />
              </Button>
            </div>
            <Select value={breakSound} onValueChange={setBreakSound}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SOUND_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
