// Timer Web Worker
// Runs on a separate thread so timers stay accurate when the tab is backgrounded.
// Uses Date.now() timestamps instead of counting intervals, so elapsed time
// is always correct even if setInterval is throttled.

let startTime = null;
let pausedElapsed = 0;
let interval = null;
let targetDuration = null; // null = stopwatch (count up), number = countdown (ms)

self.onmessage = function (e) {
  switch (e.data.type) {
    case 'start': {
      targetDuration = e.data.duration ?? null;
      startTime = Date.now();
      pausedElapsed = 0;
      clearInterval(interval);
      interval = setInterval(tick, 1000);
      tick();
      break;
    }
    case 'pause': {
      pausedElapsed += Date.now() - startTime;
      startTime = null;
      clearInterval(interval);
      self.postMessage({ type: 'paused', elapsed: pausedElapsed });
      break;
    }
    case 'resume': {
      startTime = Date.now();
      clearInterval(interval);
      interval = setInterval(tick, 1000);
      tick();
      break;
    }
    case 'stop': {
      const elapsed = getElapsed();
      clearInterval(interval);
      startTime = null;
      pausedElapsed = 0;
      self.postMessage({ type: 'stopped', elapsed });
      break;
    }
    case 'reset': {
      clearInterval(interval);
      startTime = null;
      pausedElapsed = 0;
      targetDuration = null;
      self.postMessage({ type: 'reset' });
      break;
    }
  }
};

function getElapsed() {
  if (startTime === null) return pausedElapsed;
  return pausedElapsed + (Date.now() - startTime);
}

function tick() {
  const elapsed = getElapsed();

  if (targetDuration !== null && elapsed >= targetDuration) {
    // Countdown complete
    clearInterval(interval);
    startTime = null;
    pausedElapsed = 0;
    self.postMessage({ type: 'complete', elapsed: targetDuration });
  } else {
    self.postMessage({ type: 'tick', elapsed });
  }
}
