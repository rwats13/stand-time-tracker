'use client';

import { useState, useCallback, useEffect } from 'react';
import type { TimerStatus } from '@/lib/timer/use-timer';
import { gooeyToast } from 'goey-toast';
import { useTimer } from '@/lib/timer/use-timer';
import { roundToNearestMinute } from '@/lib/timer/timer-utils';
import { saveSession } from '@/lib/db/sessions';
import { TimerDisplay } from './timer-display';
import { DurationPicker } from './duration-picker';
import { TimerControls } from './timer-controls';

interface CountdownTimerProps {
  onStatusChange?: (status: TimerStatus) => void;
}

export function CountdownTimer({ onStatusChange }: CountdownTimerProps) {
  const [selectedMinutes, setSelectedMinutes] = useState(15);

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
      source: 'timer',
    });
    gooeyToast.success(`Saved ${durationMin} min of standing time!`);
  }, []);

  const timer = useTimer({
    onComplete: handleSave,
    onStop: handleSave,
  });

  useEffect(() => {
    onStatusChange?.(timer.status);
  }, [timer.status, onStatusChange]);

  const isActive = timer.status === 'running' || timer.status === 'paused';
  const displayMs =
    timer.remainingMs !== null ? timer.remainingMs : selectedMinutes * 60000;

  return (
    <div className="flex flex-col items-center gap-8">
      <DurationPicker
        value={selectedMinutes}
        onChange={setSelectedMinutes}
        disabled={isActive}
        collapsed={isActive}
      />
      <TimerDisplay
        timeMs={displayMs}
        label={isActive ? 'Remaining' : undefined}
      />
      <TimerControls
        status={timer.status}
        onStart={() => timer.start(selectedMinutes * 60000)}
        onPause={timer.pause}
        onResume={timer.resume}
        onStop={timer.stop}
        onReset={timer.reset}
      />
    </div>
  );
}
