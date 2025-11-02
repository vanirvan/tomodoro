import { useCallback } from "react";
import { soundManager, SoundType } from "@/lib/sounds";
import { useReadLocalStorage } from "./useReadLocalStorage";

export const useSoundPlayer = () => {
  const focusSound = useReadLocalStorage<string>("focusSound") || "bell";
  const breakSound = useReadLocalStorage<string>("breakSound") || "chime";

  const playFocusSound = useCallback(async () => {
    await soundManager.playSound(focusSound);
  }, [focusSound]);

  const playBreakSound = useCallback(async () => {
    await soundManager.playSound(breakSound);
  }, [breakSound]);

  const testSound = useCallback(async (soundType: SoundType | string) => {
    await soundManager.playSound(soundType);
  }, []);

  const playSoundByMode = useCallback(async (mode: "focus" | "break") => {
    if (mode === "focus") {
      await playFocusSound();
    } else {
      await playBreakSound();
    }
  }, [playFocusSound, playBreakSound]);

  return {
    playFocusSound,
    playBreakSound,
    testSound,
    playSoundByMode,
  };
};