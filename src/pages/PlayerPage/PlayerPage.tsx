import { useEffect, useState } from "react";
import { useQueue } from "../../context/QueueContext";
import styles from "./PlayerPage.module.scss";
import VideoPlayer from "../../components/VideoPlayer/VideoPlayer";
import SongChange from "../../components/SongChange/SongChange";
import NoSongs from "../../components/NoSongs/NoSongs";
import { useUserList } from "../../context/UserListContext";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import Layout from "../../layouts/Layout";
import Queue from "../../components/Queue/Queue";
import { removeFirstFromQueue } from "../../utils/Queue";

const fadeOutTime = 1;

const PlayerPage = () => {
  const { queue, dispatch } = useQueue();
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [queueOpen, setQueueOpen] = useState<boolean>(false);
  const [fadeToBlack, setFadeToBlack] = useState<boolean>(false);
  const [endOfSong, setEndOfSong] = useState<boolean>(false);
  const [startOfQueue, setStartOfQueue] = useState<boolean>(true);

  useEffect(() => {
    if (queue.length > 1 && queue[0].downloaded) {
      setVideoUrl(
        encodeURIComponent(
          `https://www.youtube.com/watch?v=${queue[0].videoId}`,
        ),
      );
      setStartOfQueue(false);
    }
    if (queue.length == 1 && queue[0].downloaded && startOfQueue) {
      handleStartOfQueue(() =>
        setVideoUrl(
          encodeURIComponent(
            `https://www.youtube.com/watch?v=${queue[0].videoId}`,
          ),
        ),
      );
    }
    if (queue.length == 0) setStartOfQueue(true);
  }, [queue]);

  const handleStartOfQueue = (callback?: () => void) => {
    setEndOfSong(true);

    setTimeout(() => {
      setStartOfQueue(false);
      callback?.();
    }, fadeOutTime * 1000);
  };

  const handleEndOfSong = () => {
    setFadeToBlack(true);

    if (queue.length == 1) {
      handleSongChange();
      return;
    }

    setTimeout(() => {
      setEndOfSong(true);
    }, fadeOutTime * 1000);
  };

  const handleSongChange = () => {
    setEndOfSong(false);

    if (startOfQueue) {
      setStartOfQueue(false);
      return;
    }

    setTimeout(() => {
      setFadeToBlack(false);
      removeFirstFromQueue();
    }, fadeOutTime * 1000);
  };

  return (
    <Layout>
      <div className={styles.playerPage}>
        <div
          className={styles.queueHover}
          onMouseEnter={() => setQueueOpen(true)}
        ></div>
        <Queue open={queueOpen} onMouseLeave={setQueueOpen} />
        <SongChange
          fadeToBlack={fadeToBlack}
          endOfSong={endOfSong}
          onCountdownEnd={handleSongChange}
        />
        <div className={styles.video}>
          {queue.length > 0 &&
            videoUrl != "" &&
            queue[0].downloaded &&
            !endOfSong && (
              <VideoPlayer
                url={`http://localhost:3000/api/stream?url=${videoUrl}`}
                title={queue[0].title}
                next={queue[1]?.title}
                onEnded={handleEndOfSong}
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
