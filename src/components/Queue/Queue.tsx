import clsx from "clsx";
import { useQueue } from "../../context/QueueContext";
import styles from "./Queue.module.scss";
import { useEffect, useState } from "react";
import SongButton from "../SongButton/SongButton";
import useWebhooks from "../../hooks/useWebhooks";
import DeletableSongButton from "../DeletableSongButton/DeletableSongButton";
import { removeIndexFromQueue } from "../../utils/Queue";
import { IconMicrophone2 } from "@tabler/icons-react";

interface QueueProps {
  open?: boolean;
  onMouseLeave?: (open: boolean) => void;
}

const Queue = ({ open, onMouseLeave }: QueueProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(open ?? false);
  const { queue, dispatch } = useQueue();

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
          <>
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

                //SYNC ON SERVER
                const onSubmit = () =>
                  index ? dispatch({ type: "MOVE", from: index, to: 0 }) : {};

                return (
                  <li key={index}>
                    {
                      <DeletableSongButton
                        item={item}
                        onSubmit={onSubmit}
                        showThumbnail
                        showStatus
                        onDelete={() => removeIndexFromQueue(index)}
                      />
                    }
                  </li>
                );
              })}
            </ul>
          </>
        )}
        {queue.length == 0 && (
          <div className={styles.noResults}>
            <IconMicrophone2 />
            <span className={styles.heading}>No songs in queue</span>
            <span className={styles.subHeading}>
              Search for a song to add to the queue
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Queue;
