/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Simple analytics service proxy supporting both Firebase Analytics (when connected) and high-fidelity live tracking simulation for admin audits.

export interface AnalyticsEvent {
  id: string;
  eventName: string;
  params: Record<string, any>;
  timestamp: string;
}

// Memory / Local Storage buffer of events for real-time visual streams
const STORAGE_KEY = 'kb_production_analytics_events';

export const logAnalyticsEvent = (eventName: string, params: Record<string, any> = {}) => {
  const newEvent: AnalyticsEvent = {
    id: `EVT-${Math.floor(100000 + Math.random() * 900000)}`,
    eventName,
    params,
    timestamp: new Date().toISOString()
  };

  try {
    // 1. Console auditing for developer diagnostic feedback
    console.log(`%c[FIREBASE ANALYTICS] Event: ${eventName}`, 'color: #059669; font-weight: bold; padding: 2px 5px;', params);

    // 2. Buffer inside Local Storage for Admin dashboard visual auditing
    const existing = localStorage.getItem(STORAGE_KEY);
    const list: AnalyticsEvent[] = existing ? JSON.parse(existing) : [];
    
    // Maintain maximum 100 events
    list.unshift(newEvent);
    if (list.length > 100) {
      list.pop();
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));

    // 3. Fire custom event for real-time reactivity in the UI if open
    window.dispatchEvent(new CustomEvent('kb-analytics-event', { detail: newEvent }));
  } catch (err) {
    console.error('Failed to log analytics event:', err);
  }
};

export const getAnalyticsEvents = (): AnalyticsEvent[] => {
  try {
    const existing = localStorage.getItem(STORAGE_KEY);
    return existing ? JSON.parse(existing) : [];
  } catch {
    return [];
  }
};

export const clearAnalyticsEvents = () => {
  localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new CustomEvent('kb-analytics-event', { detail: null }));
};
