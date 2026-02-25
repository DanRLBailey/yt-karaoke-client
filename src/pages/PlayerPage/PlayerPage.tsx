import { useEffect, useState } from "react";
import { useQueue } from "../../context/QueueContext";
import styles from "./PlayerPage.module.scss";
import VideoPlayer from "../../components/VideoPlayer/VideoPlayer";
import SongChange from "../../components/SongChange/SongChange";
import NoSongs from "../../components/NoSongs/NoSongs";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import Layout from "../../layouts/Layout";
import Queue from "../../components/Queue/Queue";
import { removeFirstFromQueue } from "../../utils/Queue";
import type { SearchItem } from "../SearchPage/SearchPage";

const countdown = 10;

const getVideoUrl = (videoId: string) =>
  encodeURIComponent(`https://www.youtube.com/watch?v=${videoId}`);

const PlayerPage = () => {
  const { queue } = useQueue();
  const [queueOpen, setQueueOpen] = useState<boolean>(false);
  const [endOfSong, setEndOfSong] = useState<boolean>(false);
  const [startOfQueue, setStartOfQueue] = useState<boolean>(false);
  const [currentSong, setCurrentSong] = useState<SearchItem>();
  const [nextSong, setNextSong] = useState<SearchItem>();

  const siteTitle = import.meta.env.VITE_SITE_NAME;

  useEffect(() => {
    if (!queue || queue.length == 0) {
      document.title = `Player - ${siteTitle}`;
      return;
    }

    document.title = `${queue[0].title} - ${siteTitle}`;
  }, [queue]);

  useEffect(() => {
    if (queue.length === 0) return;
    if (!currentSong || currentSong !== queue[0]) setCurrentSong(queue[0]);

    if (queue.length === 1) {
      setNextSong(undefined);
      setStartOfQueue(true);
      return;
    }
    if (queue.length >= 2 && nextSong !== queue[1]) setNextSong(queue[1]);
  }, [queue]);

  useEffect(() => {
    if (!endOfSong) return;

    if (queue.length == 1) {
      removeFirstFromQueue();
      setEndOfSong(false);
    }
  }, [endOfSong]);

  const handleSongChange = () => {
    removeFirstFromQueue();
    setEndOfSong(false);
  };

  return (
    <Layout>
      <div className={styles.playerPage}>
        <div
          className={styles.queueHover}
          onMouseEnter={() => setQueueOpen(true)}
        ></div>
        <Queue open={queueOpen} onMouseLeave={setQueueOpen} />
        {endOfSong && nextSong && (
          <SongChange
            countdown={countdown}
            onCountdownEnd={handleSongChange}
            nextSong={nextSong}
          />
        )}
        {startOfQueue && currentSong && nextSong === undefined && (
          <SongChange
            countdown={countdown}
            onCountdownEnd={() => setStartOfQueue(false)}
            nextSong={currentSong}
          />
        )}
        <div className={styles.video}>
          {queue.length > 0 && currentSong?.videoId && (
            <VideoPlayer
              url={`${import.meta.env.VITE_API_URL}/stream?url=${getVideoUrl(currentSong?.videoId)}`}
              title={currentSong?.title}
              next={nextSong?.title}
              onEnded={() => setEndOfSong(true)}
              paused={startOfQueue || endOfSong}
            />
          )}
          {queue.length == 0 && <NoSongs />}
          {queue.length > 0 && !queue[0].downloaded && (
            <LoadingSpinner multiplier={2} />
          )}
        </div>
      </div>
    </Layout>
  );
};

export default PlayerPage;
