'use client';

import { formatMMSS } from '@/lib/timer/timer-utils';

interface TimerDisplayProps {
  timeMs: number;
  label?: string;
}

export function TimerDisplay({ timeMs, label }: TimerDisplayProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      {label && <span className="text-sm text-muted-foreground">{label}</span>}
      <span className="font-mono text-7xl font-bold tabular-nums tracking-tight">
        {formatMMSS(timeMs)}
      </span>
    </div>
  );
}
