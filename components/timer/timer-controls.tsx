'use client';

import { Button } from '@/components/ui/button';
import { Play, Pause, Square, RotateCcw } from 'lucide-react';
import type { TimerStatus } from '@/lib/timer/use-timer';

interface TimerControlsProps {
  status: TimerStatus;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
  onReset: () => void;
}

export function TimerControls({
  status,
  onStart,
  onPause,
  onResume,
  onStop,
  onReset,
}: TimerControlsProps) {
  if (status === 'idle' || status === 'complete') {
    return (
      <div className="flex items-center justify-center gap-4">
        <Button size="lg" onClick={onStart} className="h-16 w-16 rounded-full">
          <Play className="h-6 w-6" />
        </Button>
        {status === 'complete' && (
          <Button
            size="lg"
            variant="outline"
            onClick={onReset}
            className="h-16 w-16 rounded-full"
          >
            <RotateCcw className="h-6 w-6" />
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center gap-4">
      {status === 'running' ? (
        <Button
          size="lg"
          variant="outline"
          onClick={onPause}
          className="h-16 w-16 rounded-full"
        >
          <Pause className="h-6 w-6" />
        </Button>
      ) : (
        <Button size="lg" onClick={onResume} className="h-16 w-16 rounded-full">
          <Play className="h-6 w-6" />
        </Button>
      )}
      <Button
        size="lg"
        variant="destructive"
        onClick={onStop}
        className="h-16 w-16 rounded-full"
      >
        <Square className="h-5 w-5" />
      </Button>
    </div>
  );
}
