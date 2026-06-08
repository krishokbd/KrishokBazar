import { useEffect, useState } from 'react';
import { useApp } from '../AppContext';

/**
 * Hook for components that need to respond immediately to CMS updates
 * or background sync events from other modules.
 */
export function useRealTimeSync() {
  const { products, farmers, banners, siteSettings } = useApp();
  const [syncKey, setSyncKey] = useState(0);

  useEffect(() => {
    const handleSync = (e: Event) => {
      const customEvent = e as CustomEvent;
      console.log('Real-time synchronization triggered:', customEvent.detail);
      setSyncKey((prev) => prev + 1);
    };

    window.addEventListener('global-state-sync', handleSync);
    return () => {
      window.removeEventListener('global-state-sync', handleSync);
    };
  }, []);

  return {
    syncKey,
    products,
    farmers,
    banners,
    siteSettings,
    lastSync: new Date().toISOString()
  };
}
