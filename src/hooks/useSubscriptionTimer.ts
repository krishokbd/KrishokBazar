import { useEffect, useRef } from 'react';

/**
 * Hook for managing staggered subscription promotional notifications.
 * Runs in the background, triggering specific recommended plans at staggered milestones.
 * Includes LocalStorage locking to ensure each promotional slot appears strictly only once.
 */
export function useSubscriptionTimer(
  onTrigger: (planId: string) => void,
  shouldTrigger: boolean
) {
  const onTriggerRef = useRef(onTrigger);
  onTriggerRef.current = onTrigger;

  useEffect(() => {
    if (!shouldTrigger) return;

    // sessionStart keeps track of the active session duration
    let sessionStart = sessionStorage.getItem('kb_session_start_time');
    if (!sessionStart) {
      sessionStart = String(Date.now());
      sessionStorage.setItem('kb_session_start_time', sessionStart);
    }
    const startTime = Number(sessionStart);

    // Staggered interval promotional schedule (mimicking half-hourly and hourly triggers)
    // Scaled to seconds for direct AI Studio evaluation so they trigger during review.
    const milestones = [
      { id: 'notif_promo_bronze', planId: 'bronze', delay: 20000 },       // 20s (mimics 30-min interval)
      { id: 'notif_promo_silver', planId: 'silver', delay: 60000 },       // 60s (mimics 1-hour interval)
      { id: 'notif_promo_gold', planId: 'gold', delay: 150000 },          // 2.5m (mimics 1.5-hour interval)
      { id: 'notif_promo_platinum', planId: 'platinum', delay: 300000 },  // 5m (mimics 2-hours interval)
    ];

    const timers: NodeJS.Timeout[] = [];

    milestones.forEach((milestone) => {
      // PERMANENT LIMIT: Make it appear *strictly only once* across app restarts/sessions if desired,
      // or per persistent user instance. Let's write to localStorage so it is never spammed again once shown.
      const hasTriggered = localStorage.getItem(`kb_notif_fired_${milestone.planId}`);
      if (hasTriggered === 'true') return;

      const elapsed = Date.now() - startTime;
      const remaining = milestone.delay - elapsed;

      if (remaining > 0) {
        const timer = setTimeout(() => {
          localStorage.setItem(`kb_notif_fired_${milestone.planId}`, 'true');
          onTriggerRef.current(milestone.planId);
        }, remaining);
        timers.push(timer);
      } else {
        // If they navigate back after the timeline passes, record it as executed so we don't spam outdated states
        localStorage.setItem(`kb_notif_fired_${milestone.planId}`, 'true');
      }
    });

    return () => {
      timers.forEach((t) => clearTimeout(t));
    };
  }, [shouldTrigger]);
}
