'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export type TimerStatus = 'idle' | 'running' | 'paused' | 'complete';

interface UseTimerOptions {
  onComplete?: (elapsedMs: number) => void;
  onStop?: (elapsedMs: number) => void;
}

interface UseTimerReturn {
  status: TimerStatus;
  elapsedMs: number;
  remainingMs: number | null;
  start: (durationMs?: number) => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  reset: () => void;
}

export function useTimer(options: UseTimerOptions = {}): UseTimerReturn {
  const workerRef = useRef<Worker | null>(null);
  const [status, setStatus] = useState<TimerStatus>('idle');
  const [elapsedMs, setElapsedMs] = useState(0);
  const [targetDurationMs, setTargetDurationMs] = useState<number | null>(null);
  const optionsRef = useRef(options);
  optionsRef.current = options;

  useEffect(() => {
    const worker = new Worker('/timer-worker.js');
    workerRef.current = worker;

    worker.onmessage = (e) => {
      switch (e.data.type) {
        case 'tick':
          setElapsedMs(e.data.elapsed);
          break;
        case 'paused':
          setElapsedMs(e.data.elapsed);
          break;
        case 'complete':
          setElapsedMs(e.data.elapsed);
          setStatus('complete');
          optionsRef.current.onComplete?.(e.data.elapsed);
          break;
        case 'stopped':
          setElapsedMs(e.data.elapsed);
          setStatus('idle');
          optionsRef.current.onStop?.(e.data.elapsed);
          break;
        case 'reset':
          setElapsedMs(0);
          setStatus('idle');
          break;
      }
    };

    return () => {
      worker.terminate();
    };
  }, []);

  const start = useCallback((durationMs?: number) => {
    setTargetDurationMs(durationMs ?? null);
    setElapsedMs(0);
    setStatus('running');
    workerRef.current?.postMessage({
      type: 'start',
      duration: durationMs ?? null,
    });
  }, []);

  const pause = useCallback(() => {
    setStatus('paused');
    workerRef.current?.postMessage({ type: 'pause' });
  }, []);

  const resume = useCallback(() => {
    setStatus('running');
    workerRef.current?.postMessage({ type: 'resume' });
  }, []);

  const stop = useCallback(() => {
    workerRef.current?.postMessage({ type: 'stop' });
  }, []);

  const reset = useCallback(() => {
    setTargetDurationMs(null);
    workerRef.current?.postMessage({ type: 'reset' });
  }, []);

  const remainingMs =
    targetDurationMs !== null
      ? Math.max(0, targetDurationMs - elapsedMs)
      : null;

  return { status, elapsedMs, remainingMs, start, pause, resume, stop, reset };
}
