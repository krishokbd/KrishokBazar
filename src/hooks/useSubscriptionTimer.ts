import { useEffect, useRef } from 'react';

export function useSubscriptionTimer(
  onTrigger: (intervalName: string) => void,
  shouldTrigger: boolean
) {
  const onTriggerRef = useRef(onTrigger);
  onTriggerRef.current = onTrigger;

  const triggeredRef = useRef<Record<string, boolean>>({
    '20s': false,
    '25s': false,
    '1m': false,
    '2m': false,
  });

  const startTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    if (!shouldTrigger) return;

    const milestones = [
      { id: '20s', delay: 20000 },
      { id: '25s', delay: 25000 },
      { id: '1m', delay: 60000 },
      { id: '2m', delay: 120000 },
    ];

    const timers: NodeJS.Timeout[] = [];

    milestones.forEach((milestone) => {
      if (triggeredRef.current[milestone.id]) return;

      const elapsed = Date.now() - startTimeRef.current;
      const remaining = milestone.delay - elapsed;

      if (remaining > 0) {
        const timer = setTimeout(() => {
          triggeredRef.current[milestone.id] = true;
          onTriggerRef.current(milestone.id);
        }, remaining);
        timers.push(timer);
      } else {
        // Already passed when timer became active again
        triggeredRef.current[milestone.id] = true;
      }
    });

    return () => {
      timers.forEach((t) => clearTimeout(t));
    };
  }, [shouldTrigger]);
}
