import { useEffect, useState } from "react";
import { useQueue } from "../../context/QueueContext";
import styles from "./PlayerPage.module.scss";
import VideoPlayer from "../../components/VideoPlayer/VideoPlayer";
import clsx from "clsx";
import SongChange from "../../components/SongChange/SongChange";
import NoSongs from "../../components/NoSongs/NoSongs";
import SongButton from "../../components/SongButton/SongButton";
import { useUserList } from "../../context/UserListContext";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import useWebhooks from "../../hooks/useWebhooks";
import Layout from "../../layouts/Layout";

const fadeOutTime = 1;

const PlayerPage = () => {
  const { queue, dispatch } = useQueue();
  const { dispatch: dispatchUserList } = useUserList();
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [queueOpen, setQueueOpen] = useState<boolean>(false);
  const [fadeToBlack, setFadeToBlack] = useState<boolean>(false);
  const [endOfSong, setEndOfSong] = useState<boolean>(false);
  const [startOfQueue, setStartOfQueue] = useState<boolean>(true);

  useWebhooks({
    onConnect: () => {},
    onQueue: (update) => {
      dispatch({ type: "ADD", payload: update });
    },
    onDownload: (update) => {
      dispatch({
        type: "DOWNLOADED",
        id: update.videoId,
        downloaded: update.downloaded ?? false,
      });
    },
    onAddUser: (update) => {
      dispatchUserList({
        type: "ADD_USER",
        payload: update,
      });
    },
  });

  useEffect(() => {
    if (queue.length >= 1 && queue[0].downloaded) {
      setVideoUrl(
        encodeURIComponent(
          `https://www.youtube.com/watch?v=${queue[0].videoId}`,
        ),
      );
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
      dispatch({ type: "REMOVE_FIRST" });
    }, fadeOutTime * 1000);
  };

  return (
    <Layout>
      <div className={styles.playerPage}>
        <div
          className={styles.queueHover}
          onMouseEnter={() => setQueueOpen(true)}
        ></div>
        <div
          className={clsx(styles.queue, queueOpen ? styles.open : "")}
          onMouseLeave={() => setQueueOpen(false)}
        >
          <span>Now Playing</span>
          {queue.length > 0 && (
            <>
              <ul>
                <li>
                  <SongButton item={queue[0]} showThumbnail showStatus active />
                </li>
              </ul>
              <span>Next Up</span>
              <ul>
                {queue.map((item, index) => {
                  if (index == 0) return <></>;

                  const onSubmit = () =>
                    index ? dispatch({ type: "MOVE", from: index, to: 0 }) : {};

                  return (
                    <li key={index}>
                      {
                        <SongButton
                          item={item}
                          onSubmit={onSubmit}
                          showThumbnail
                          showStatus
                        />
                      }
                    </li>
                  );
                })}
              </ul>
            </>
          )}
        </div>
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
