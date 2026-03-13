'use client';

import { useCallback, useEffect } from 'react';
import type { TimerStatus } from '@/lib/timer/use-timer';
import { gooeyToast } from 'goey-toast';
import { useTimer } from '@/lib/timer/use-timer';
import { roundToNearestMinute } from '@/lib/timer/timer-utils';
import { saveSession } from '@/lib/db/sessions';
import { TimerDisplay } from './timer-display';
import { TimerControls } from './timer-controls';

interface StopwatchProps {
  onStatusChange?: (status: TimerStatus) => void;
}

export function Stopwatch({ onStatusChange }: StopwatchProps) {
  const handleSave = useCallback(async (elapsedMs: number) => {
    const durationMin = roundToNearestMinute(elapsedMs);
    if (durationMin < 1) {
      gooeyToast.info('Less than 1 minute — not saved.');
      return;
    }

    const now = new Date();
    const started = new Date(now.getTime() - elapsedMs);
    await saveSession({
      started_at: started.toISOString(),
      ended_at: now.toISOString(),
      duration_min: durationMin,
      source: 'stopwatch',
    });
    gooeyToast.success(`Saved ${durationMin} min of standing time!`);
  }, []);

  const timer = useTimer({
    onStop: handleSave,
  });

  useEffect(() => {
    onStatusChange?.(timer.status);
  }, [timer.status, onStatusChange]);

  return (
    <div className="flex flex-col items-center gap-8">
      <TimerDisplay
        timeMs={timer.elapsedMs}
        label={
          timer.status === 'running'
            ? 'Elapsed'
            : timer.status === 'paused'
            ? 'Paused'
            : undefined
        }
      />
      <TimerControls
        status={timer.status}
        onStart={() => timer.start()}
        onPause={timer.pause}
        onResume={timer.resume}
        onStop={timer.stop}
        onReset={timer.reset}
      />
    </div>
  );
}
