import { useEffect, useRef, useState } from "react";
import styles from "./VideoPlayer.module.scss";
import clsx from "clsx";

interface VideoPlayerProps {
  url: string;
  title?: string;
  next?: string;
  onEnded: () => void;
}

const VideoPlayer = ({ url, title, next, onEnded }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [progress, setProgress] = useState<number>(0);
  const [currentShown, setCurrentShown] = useState<boolean>(false);
  const [nextShown, setNextShown] = useState<boolean>(false);
  const [hover, setHover] = useState<boolean>(false);

  const songShownMin = 5;
  const songShownMax = 92;
  const songNextMax = 95;

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video || !video.duration) return;
    const percent = (video.currentTime / video.duration) * 100;
    setProgress(percent);
  };

  useEffect(() => {
    setCurrentShown(
      (progress > 1 && progress < songShownMin) ||
        (progress > songShownMax && progress < 99),
    );
    setNextShown(progress > songNextMax && progress < 99);
  }, [progress]);

  return (
    <div className={styles.videoPlayer}>
      <div className={styles.title}>
        <span
          className={clsx(styles.current, currentShown ? styles.active : "")}
        >
          Now Playing: {title}
        </span>
        <span
          className={clsx(styles.next, nextShown && next ? styles.active : "")}
        >
          Up Next: {next}
        </span>
      </div>
      <video
        ref={videoRef}
        autoPlay
        controls
        src={url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={onEnded}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      />
      <div className={clsx(styles.overlay, hover && styles.active)}>
        <button onClick={onEnded} onMouseEnter={() => setHover(true)}>
          Skip
        </button>
      </div>
    </div>
  );
};

export default VideoPlayer;
