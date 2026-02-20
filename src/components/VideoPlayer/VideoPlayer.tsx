import { useEffect, useRef, useState } from "react";
import styles from "./VideoPlayer.module.scss";
import clsx from "clsx";
import { IconPlayerTrackNext, IconPlayerPlay } from "@tabler/icons-react";
import { parseSongTitle } from "../../utils/Song";
import { useNotification } from "../../context/NotificationContext";

interface VideoPlayerProps {
  url: string;
  title?: string;
  next?: string;
  onEnded: () => void;
}

interface SongArtist {
  song: String;
  artist: string;
}

const VideoPlayer = ({ url, title, next, onEnded }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [progress, setProgress] = useState<number>(0);
  const [currentShown, setCurrentShown] = useState<boolean>(false);
  const [nextShown, setNextShown] = useState<boolean>(false);
  const [hover, setHover] = useState<boolean>(false);
  const [currentSong, setCurrentSong] = useState<SongArtist>();
  const [nextSong, setNextSong] = useState<SongArtist>();

  const { showNotification } = useNotification();

  useEffect(() => {
    if (title) setCurrentSong(parseSongTitle(title));
  }, [title]);

  useEffect(() => {
    if (next) setNextSong(parseSongTitle(next));
  }, [next]);

  const songShownMin = 5;
  const songNextMax = 95;

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video || !video.duration) return;
    const percent = (video.currentTime / video.duration) * 100;
    setProgress(percent);
  };

  useEffect(() => {
    setCurrentShown(progress > 1 && progress < songShownMin);
    setNextShown(progress > songNextMax && progress < 99);
  }, [progress]);

  useEffect(() => {
    if (currentShown && title)
      showNotification({
        active: currentShown,
        className: styles.notification,
        subtitle: (
          <>
            <IconPlayerPlay /> Now Playing
          </>
        ),
        title: <>{currentSong?.song}</>,
        children: <span>{currentSong?.artist}</span>,
      });
  }, [currentShown]);

  useEffect(() => {
    if (nextShown && next)
      showNotification({
        active: nextShown,
        className: styles.notification,
        subtitle: (
          <>
            <IconPlayerTrackNext /> Up Next
          </>
        ),
        title: <>{nextSong?.song}</>,
        children: <span>{nextSong?.artist}</span>,
      });
  }, [nextShown]);

  return (
    <div className={styles.videoPlayer}>
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
          <IconPlayerTrackNext />
        </button>
      </div>
    </div>
  );
};

export default VideoPlayer;
