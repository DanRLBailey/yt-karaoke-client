import { useEffect, useRef, useState } from "react";
import styles from "./Countdown.module.scss";
import clsx from "clsx";

interface CountdownProps {
  seconds: number;
  onCountdownEnd?: () => void;
  className?: string;
}

const Countdown = ({ seconds, onCountdownEnd, className }: CountdownProps) => {
  const DURATION = seconds * 1000;

  const [progress, setProgress] = useState(100);
  const frameRef = useRef<number | null>(null);
  const startRef = useRef<number>(0);

  useEffect(() => {
    const tick = (time: number) => {
      if (startRef.current === 0) {
        startRef.current = time;
      }

      const elapsed = time - startRef.current;
      const remaining = Math.max(DURATION - elapsed, 0);

      const percent = (remaining / DURATION) * 100;
      setProgress(percent);

      if (remaining > 0) {
        frameRef.current = requestAnimationFrame(tick);
      } else onCountdownEnd?.();
    };

    frameRef.current = requestAnimationFrame(tick);

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return (
    <div className={clsx(styles.countdown, className)}>
      <div className={styles.progressBar} style={{ width: `${progress}%` }} />
    </div>
  );
};

export default Countdown;
