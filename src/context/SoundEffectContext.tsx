// SoundEffectContext.tsx
import React, { createContext, useCallback, useContext, useRef } from "react";

type SoundEffectContextType = {
  playSoundEffect: (soundEffect: string) => void;
};

const SoundEffectContext = createContext<SoundEffectContextType | undefined>(
  undefined,
);

export const useSoundEffect = () => {
  const context = useContext(SoundEffectContext);
  if (!context)
    throw new Error("useSoundEffect must be used within SoundEffectProvider");
  return context;
};

export const SoundEffectProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const queueRef = useRef<string[]>([]);
  const isPlayingRef = useRef(false);

  const playNext = useCallback(() => {
    if (queueRef.current.length === 0) {
      isPlayingRef.current = false;
      return;
    }

    const nextSound = queueRef.current.shift();
    if (!nextSound) return;

    const audio = new Audio(nextSound);
    audio.volume = 0.5;
    isPlayingRef.current = true;

    audio.onended = () => {
      playNext();
    };

    audio.onerror = () => {
      console.error("Playback failed");
      playNext();
    };

    audio.play().catch((err) => {
      console.error("Playback failed:", err);
      playNext();
    });
  }, []);

  const playSoundEffect = useCallback(
    (soundEffect: string) => {
      queueRef.current.push(soundEffect);

      if (!isPlayingRef.current) {
        playNext();
      }
    },
    [playNext],
  );

  return (
    <SoundEffectContext.Provider value={{ playSoundEffect }}>
      {children}
    </SoundEffectContext.Provider>
  );
};
