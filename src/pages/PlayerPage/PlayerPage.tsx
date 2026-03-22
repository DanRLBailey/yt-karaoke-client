import { useEffect, useRef, useState } from "react";
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

const countdown = 2;

const getVideoUrl = (videoId: string) =>
  encodeURIComponent(`https://www.youtube.com/watch?v=${videoId}`);

const PlayerPage = () => {
  const { queue } = useQueue();
  const { user } = useUser();
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
      if (queue.length >= 2 && nextSong !== queue[1]) setNextSong(queue[1]);
    }

    prevQueueLength.current = queue.length;
  }, [queue]);

  useEffect(() => {
    if (!endOfSong) return;

    if (queue.length == 1) {
      removeFirstFromQueue(user.roomCode ?? "");
      setEndOfSong(false);
    }
  }, [endOfSong]);

  const handleSongChange = () => {
    removeFirstFromQueue(user.roomCode ?? "");
    setEndOfSong(false);
    setStartOfQueue(false);
  };

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
