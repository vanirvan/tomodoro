export type Mode = "focus" | "break";

export interface Session {
  mode: Mode;
  duration: number;
  startTime: Date;
  endTime?: Date;
}
