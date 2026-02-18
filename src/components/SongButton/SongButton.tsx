import { useEffect, useState } from "react";
import type { SearchItem } from "../../pages/SearchPage/SearchPage";
import { parseSongTitle } from "../../utils/Song";
import styles from "./SongButton.module.scss";
import clsx from "clsx";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";

interface SongButtonProps {
  item: SearchItem;
  onSubmit?: () => void;
  children?: React.ReactNode;
  expandable?: boolean;
  showThumbnail?: boolean;
  showStatus?: boolean;
  active?: boolean;
}

const SongButton = ({
  item,
  onSubmit,
  children,
  expandable,
  showThumbnail,
  showStatus,
  active,
}: SongButtonProps) => {
  const { song, artist } = parseSongTitle(item.title);
  const [expanded, setExpanded] = useState<boolean>(false);

  useEffect(() => {
    console.log("does this item downloaded?", item.downloaded);
  }, [item]);

  const isLoading = !item.downloaded && showStatus;

  const className = clsx(
    styles.songButton,
    active && styles.active,
    isLoading && styles.loading,
  );

  const content = (
    <div className={styles.content}>
      {showThumbnail && (
        <div className={styles.thumbnail}>
          {isLoading && (
            <div className={styles.loadingOverlay}>
              <LoadingSpinner />
            </div>
          )}
          <img src={item.thumbnail.url} />
        </div>
      )}
      <span>{item.downloaded}</span>
      <div className={styles.details}>
        <span className={styles.song}>{song}</span>
        <span className={styles.artist}>{artist}</span>
        {item.requester && (
          <span className={styles.requester}>{item.requester}</span>
        )}
        {item.channelTitle && (
          <span className={styles.requester}>{item.channelTitle}</span>
        )}
      </div>
    </div>
  );

  if (children || expandable)
    return (
      <div className={className} onClick={() => setExpanded(!expanded)}>
        {content}
        <div className={clsx(styles.drawer, expanded && styles.active)}>
          {children}
          <button onClick={() => onSubmit?.()}>Add to queue</button>
        </div>
      </div>
    );

  return (
    <button className={className} onClick={() => onSubmit?.()}>
      {content}
    </button>
  );
};

export default SongButton;
