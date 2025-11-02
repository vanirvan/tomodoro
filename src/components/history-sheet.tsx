import { format } from "date-fns";
import { useAtom } from "jotai";
import { History as HistoryIcon } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { historySheetAtom } from "@/lib/store";
import { Session } from "@/lib/types";

import { useReadLocalStorage } from "@/hooks";

export default function HistorySheet() {
  const [sheetOpen, setSheetOpen] = useAtom(historySheetAtom);

  const focusColor = useReadLocalStorage<string>("focusColor");
  const breakColor = useReadLocalStorage<string>("breakColor");

  const sessions =
    useReadLocalStorage<Session[]>("tomodoro-sessions", {
      initializeWithValue: true,
    }) || [];
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date(),
  );

  const sessionsForDate = sessions.filter((session) => {
    const sessionDate = new Date(session.startTime);
    return (
      selectedDate &&
      sessionDate.getDate() === selectedDate.getDate() &&
      sessionDate.getMonth() === selectedDate.getMonth() &&
      sessionDate.getFullYear() === selectedDate.getFullYear()
    );
  });

  const sessionsByDate = sessions.reduce(
    (acc, session) => {
      const date = format(new Date(session.startTime), "yyyy-MM-dd");
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const datesWithSessions = Object.keys(sessionsByDate).map(
    (dateStr) => new Date(dateStr),
  );

  return (
    <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-xl">
        <SheetHeader>
          <SheetTitle>Session History</SheetTitle>
          <SheetDescription>
            View your completed Pomodoro sessions
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-8 px-4 py-8">
          {/* Calendar */}
          <div className="flex justify-center">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
              classNames={{
                today: `bg-[${focusColor}]`,
              }}
              modifiers={{
                hasSession: datesWithSessions,
              }}
              modifiersStyles={{
                hasSession: {
                  fontWeight: "bold",
                  textDecoration: "underline",
                },
              }}
            />
          </div>

          {/* Selected Date Sessions */}
          {selectedDate && (
            <Card>
              <CardContent>
                <h3 className="font-semibold">
                  {format(selectedDate, "MMMM d, yyyy")}
                </h3>

                {sessionsForDate.length > 0 ? (
                  <div className="space-y-4">
                    <div className="bg-muted flex items-center justify-between rounded-lg p-4">
                      <span className="text-sm font-medium">
                        Total Sessions
                      </span>
                      <span className="text-2xl font-bold">
                        {sessionsForDate.length}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <p className="text-muted-foreground text-sm font-medium">
                        Session Times
                      </p>
                      {sessionsForDate.map((session, index) => {
                        const minutes = Math.floor(session.duration / 60);
                        const seconds = session.duration % 60;
                        return (
                          <div
                            key={index}
                            className="bg-card flex flex-col gap-1 rounded-lg border p-3"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">
                                {session.mode === "focus"
                                  ? "Focus Session"
                                  : "Break Session"}{" "}
                                #{index + 1}
                              </span>
                              <span className="text-muted-foreground text-sm">
                                {format(new Date(session.startTime), "h:mm a")}
                              </span>
                            </div>
                            <span className="text-muted-foreground text-xs">
                              Duration: {minutes}m{" "}
                              {String(seconds).padStart(2, "0")}s •{" "}
                              {session.mode}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground py-8 text-center">
                    No sessions recorded for this date
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Overall Statistics */}
          <Card>
            <CardContent>
              <h3 className="font-semibold">Overall Statistics</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted rounded-lg p-4">
                  <p className="text-muted-foreground text-sm">
                    Total Sessions
                  </p>
                  <p className="text-2xl font-bold">{sessions.length}</p>
                </div>
                <div className="bg-muted rounded-lg p-4">
                  <p className="text-muted-foreground text-sm">Days Active</p>
                  <p className="text-2xl font-bold">
                    {Object.keys(sessionsByDate).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </SheetContent>
    </Sheet>
  );
}
