import clsx from "clsx";
import { useQueue } from "../../context/QueueContext";
import styles from "./Queue.module.scss";
import { useEffect, useState } from "react";
import SongButton from "../SongButton/SongButton";
import useWebhooks from "../../hooks/useWebhooks";

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

    if (isOpen) {
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
      onClick={(e) => {
        e.stopPropagation();
        onMouseLeave?.(false);
      }}
    >
      <div
        className={clsx(styles.queueContent, isOpen ? styles.open : "")}
        onMouseLeave={() => onMouseLeave?.(false)}
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
                if (index == 0) return null;

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
    </div>
  );
};

export default Queue;
