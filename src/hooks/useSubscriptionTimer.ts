import { useEffect, useRef } from 'react';

export function useSubscriptionTimer(
  onTrigger: (intervalName: string) => void,
  shouldTrigger: boolean
) {
  const onTriggerRef = useRef(onTrigger);
  onTriggerRef.current = onTrigger;

  useEffect(() => {
    if (!shouldTrigger) return;

    // Use sessionStorage to preserve the session start time across tab transitions & page navigations
    let sessionStart = sessionStorage.getItem('kb_session_start_time');
    if (!sessionStart) {
      sessionStart = String(Date.now());
      sessionStorage.setItem('kb_session_start_time', sessionStart);
    }
    const startTime = Number(sessionStart);

    // Milestones requested: 2-3 minutes (2.5 mins), 5 minutes, and 10 minutes
    const milestones = [
      { id: '3m', delay: 150000 },  // 2.5 minutes (between 2 and 3 minutes)
      { id: '5m', delay: 300000 },  // 5 minutes
      { id: '10m', delay: 600000 }, // 10 minutes
    ];

    const timers: NodeJS.Timeout[] = [];

    milestones.forEach((milestone) => {
      // Ensure it triggers at most once per customer browser session
      const hasTriggered = sessionStorage.getItem(`kb_notif_triggered_${milestone.id}`);
      if (hasTriggered === 'true') return;

      const elapsed = Date.now() - startTime;
      const remaining = milestone.delay - elapsed;

      if (remaining > 0) {
        const timer = setTimeout(() => {
          sessionStorage.setItem(`kb_notif_triggered_${milestone.id}`, 'true');
          onTriggerRef.current(milestone.id);
        }, remaining);
        timers.push(timer);
      } else {
        // If they navigate back after the milestone has already passed, 
        // mark it as triggered globally so we don't spam outdated notifications
        sessionStorage.setItem(`kb_notif_triggered_${milestone.id}`, 'true');
      }
    });

    return () => {
      timers.forEach((t) => clearTimeout(t));
    };
  }, [shouldTrigger]);
}
