import clsx from "clsx";
import { useQueue } from "../../context/QueueContext";
import styles from "./Queue.module.scss";
import { useEffect, useState } from "react";
import SongButton from "../SongButton/SongButton";
import useWebhooks from "../../hooks/useWebhooks";
import DeletableSongButton from "../DeletableSongButton/DeletableSongButton";
import { removeIndexFromQueue } from "../../utils/Queue";
import { IconMicrophone2 } from "@tabler/icons-react";
import QrCode from "../QrCode/QrCode";
import { useUser } from "../../context/UserContext";

interface QueueProps {
  open?: boolean;
  onMouseLeave?: (open: boolean) => void;
}

const Queue = ({ open, onMouseLeave }: QueueProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(open ?? false);
  const { queue, dispatch } = useQueue();
  const { user } = useUser();
  const roomCode = user.roomCode ?? "";

  const { pathname } = window.location;
  const showQr = pathname.includes("player");

  useWebhooks({
    onQueueSync: (update) => {
      dispatch({ type: "SET_QUEUE", payload: update });
    },
  });

  useEffect(() => {
    setIsOpen(open ?? false);

    if (open) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }

    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, [open]);

  return (
    <div
      className={clsx(styles.queue, isOpen ? styles.open : "")}
      onClick={() => {
        onMouseLeave?.(false);
      }}
    >
      <div
        className={clsx(styles.queueContent, isOpen ? styles.open : "")}
        onMouseLeave={() => onMouseLeave?.(false)}
        onClick={(e) => e.stopPropagation()}
      >
        {queue.length > 0 && (
          <div className={styles.queueList}>
            <span>Now Playing</span>
            <ul>
              <li>
                <SongButton item={queue[0]} showThumbnail showStatus active />
              </li>
            </ul>
            <span>Next Up</span>
            <ul>
              {queue.map((item, index) => {
                if (index == 0) return null;
                return (
                  <li key={index}>
                    {
                      <DeletableSongButton
                        item={item}
                        showThumbnail
                        showStatus
                        onDelete={() => removeIndexFromQueue(index, roomCode)}
                      />
                    }
                  </li>
                );
              })}
            </ul>
          </div>
        )}
        {queue.length == 0 && (
          <div className={styles.noResults}>
            <IconMicrophone2 />
            <span className={styles.heading}>No songs in queue</span>
            <span className={styles.subHeading}>
              Search for a song to add to it!
            </span>
          </div>
        )}
        {queue.length == 1 && (
          <div className={clsx(styles.noResults, styles.nextUp)}>
            <IconMicrophone2 />
            <span className={styles.heading}>No more songs in queue</span>
            <span className={styles.subHeading}>
              Search for a song to add more!
            </span>
          </div>
        )}
        {showQr && <QrCode showBackground={false} size="sm" />}
      </div>
    </div>
  );
};

export default Queue;
