'use client';

import { useCallback, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CountdownTimer } from '@/components/timer/countdown-timer';
import { Stopwatch } from '@/components/timer/stopwatch';
import type { TimerStatus } from '@/lib/timer/use-timer';

export default function TimerPage() {
  const [timerActive, setTimerActive] = useState(false);

  const handleStatusChange = useCallback((status: TimerStatus) => {
    setTimerActive(status === 'running' || status === 'paused');
  }, []);

  return (
    <div className="flex flex-col items-center gap-6 pt-4">
      <Tabs defaultValue="countdown" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="countdown" disabled={timerActive}>
            Countdown
          </TabsTrigger>
          <TabsTrigger value="stopwatch" disabled={timerActive}>
            Stopwatch
          </TabsTrigger>
        </TabsList>
        <TabsContent value="countdown" className="pt-8">
          <CountdownTimer onStatusChange={handleStatusChange} />
        </TabsContent>
        <TabsContent value="stopwatch" className="pt-8">
          <Stopwatch onStatusChange={handleStatusChange} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
