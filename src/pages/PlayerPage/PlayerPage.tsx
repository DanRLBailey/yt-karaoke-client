import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useQueue } from "../../context/QueueContext";
import styles from "./PlayerPage.module.scss";
import VideoPlayer from "../../components/VideoPlayer/VideoPlayer";
import SongChange from "../../components/SongChange/SongChange";
import NoSongs from "../../components/NoSongs/NoSongs";
import Layout from "../../layouts/Layout";
import Queue from "../../components/Queue/Queue";
import { removeFirstFromQueue } from "../../utils/Queue";
import type { SearchItem } from "../SearchPage/SearchPage";
import { useUser } from "../../context/UserContext";
import { siteName } from "../../utils/SiteInfo";
import useWebhooks, {
  type EmojiReactionPayload,
} from "../../hooks/useWebhooks";
import { useNotification } from "../../context/NotificationContext";

const countdown = 2;

const getVideoUrl = (videoId: string) =>
  encodeURIComponent(`https://www.youtube.com/watch?v=${videoId}`);

const PlayerPage = () => {
  const { queue } = useQueue();
  const { user } = useUser();
  const { showNotification } = useNotification();
  const [queueOpen, setQueueOpen] = useState<boolean>(false);
  const [endOfSong, setEndOfSong] = useState<boolean>(false);
  const [startOfQueue, setStartOfQueue] = useState<boolean>(false);
  const [currentSong, setCurrentSong] = useState<SearchItem>();
  const [nextSong, setNextSong] = useState<SearchItem>();

  const prevQueueLength = useRef(queue.length);

  useEffect(() => {
    if (!queue || queue.length == 0) {
      document.title = `Player - ${siteName()}`;
      return;
    }

    document.title = `${queue[0].title} - ${siteName()}`;
  }, [queue]);

  useEffect(() => {
    if (queue.length === 0) {
      setCurrentSong(undefined);
      setNextSong(undefined);
      setEndOfSong(false);
      setStartOfQueue(false);
      prevQueueLength.current = 0;
      return;
    }

    // Show startOfQueue only if queue went from 0 → 1
    if (prevQueueLength.current === 0 && queue.length === 1) {
      setCurrentSong(queue[0]);
      setNextSong(undefined);
      setStartOfQueue(true);
    } else {
      // Normal queue handling
      if (!currentSong || currentSong !== queue[0]) setCurrentSong(queue[0]);
      if (queue.length >= 2 && nextSong !== queue[1]) {
        setNextSong(queue[1]);
      }
      if (queue.length < 2) {
        setNextSong(undefined);
      }
    }

    prevQueueLength.current = queue.length;
  }, [currentSong, nextSong, queue]);

  useEffect(() => {
    if (!endOfSong) return;

    if (queue.length <= 1) {
      removeFirstFromQueue(user.roomCode ?? "");
      setEndOfSong(false);
    }
  }, [endOfSong, queue.length, user.roomCode]);

  const handleSongChange = () => {
    removeFirstFromQueue(user.roomCode ?? "");
    setEndOfSong(false);
    setStartOfQueue(false);
  };

  useWebhooks({
    onEmojiReaction: (update: EmojiReactionPayload) => {
      const roomCode = user.roomCode ?? "";
      if (!update?.emoji || update.roomCode !== roomCode) return;
      const randomLeft = Math.floor(Math.random() * 70) + 15;
      const randomBottom = (Math.random() * 2 + 1).toFixed(2);

      showNotification({
        children: <span>{update.emoji}</span>,
        active: true,
        className: styles.notification,
        style: {
          "--notification-left": `${randomLeft}%`,
          "--notification-bottom": `${randomBottom}rem`,
        } as CSSProperties,
      });
    },
  });

  return (
    <Layout>
      <div className={styles.playerPage}>
        <div
          className={styles.queueHover}
          onMouseEnter={() => setQueueOpen(true)}
        ></div>
        <Queue open={queueOpen} onMouseLeave={setQueueOpen} />
        {endOfSong && nextSong ? (
          <SongChange
            countdown={countdown}
            onCountdownEnd={handleSongChange}
            nextSong={nextSong}
          />
        ) : startOfQueue && currentSong ? (
          <SongChange
            countdown={countdown}
            onCountdownEnd={() => setStartOfQueue(false)}
            nextSong={currentSong}
          />
        ) : null}
        {queue.length > 0 &&
          currentSong?.videoId &&
          !endOfSong &&
          !startOfQueue &&
          queue.length >= 0 &&
          currentSong.downloaded && (
            <div className={styles.video}>
              <VideoPlayer
                url={`${import.meta.env.VITE_API_URL}/stream?url=${getVideoUrl(currentSong?.videoId)}`}
                title={currentSong?.title}
                next={nextSong?.title}
                onEnded={() => setEndOfSong(true)}
                paused={startOfQueue || endOfSong}
              />
            </div>
          )}
        <NoSongs hidden={queue.length > 0} />
      </div>
    </Layout>
  );
};

export default PlayerPage;
