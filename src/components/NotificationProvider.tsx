import React, { createContext, useContext, useEffect, useRef } from 'react';

interface NotificationContextProps {
  playPing: () => void;
}

const NotificationContext = createContext<NotificationContextProps | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create an HTML5 Audio element loading a subtle WhatsApp-style ping sound effect
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2358/2358-84.wav');
    audio.preload = 'auto';
    audioRef.current = audio;
  }, []);

  const playPing = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(err => {
        console.warn("HTML5 Audio play failed or prevented by autoplay policy, falling back to Web Audio synthesis:", err);
        playSynthPing();
      });
    } else {
      playSynthPing();
    }
  };

  const playSynthPing = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      const gain2 = ctx.createGain();
      
      // WhatsApp-like dual tone high chime (sweet bell ping)
      osc1.frequency.setValueAtTime(659.25, ctx.currentTime); // E5
      osc1.frequency.setValueAtTime(880, ctx.currentTime + 0.07); // A5 (higher ping)
      
      osc2.frequency.setValueAtTime(880, ctx.currentTime); // A5
      osc2.frequency.setValueAtTime(1318.51, ctx.currentTime + 0.07); // E6
      
      gain1.gain.setValueAtTime(0.12, ctx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      
      gain2.gain.setValueAtTime(0.08, ctx.currentTime);
      gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
      
      osc1.connect(gain1);
      osc2.connect(gain2);
      gain1.connect(ctx.destination);
      gain2.connect(ctx.destination);
      
      osc1.start();
      osc2.start();
      osc1.stop(ctx.currentTime + 0.4);
      osc2.stop(ctx.currentTime + 0.5);
    } catch (e) {
      console.warn("Speech/Audio synth fallback failed:", e);
    }
  };

  return (
    <NotificationContext.Provider value={{ playPing }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
