// SoundEffectContext.tsx
import React, { createContext, useContext } from "react";

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
  const playSoundEffect = (soundEffect: string) => {
    const audio = new Audio(soundEffect);
    console.log("PLAYING SOUND EFFECT");
    // audio.volume = 0.75;
    audio.play().catch((err) => console.error("Playback failed:", err));
  };

  return (
    <SoundEffectContext.Provider value={{ playSoundEffect }}>
      {children}
    </SoundEffectContext.Provider>
  );
};
