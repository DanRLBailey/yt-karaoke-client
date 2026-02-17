import { useState } from "react";
import type { SearchItem } from "../../pages/SearchPage/SearchPage";
import { parseSongTitle } from "../../utils/Song";
import styles from "./SongButton.module.scss";
import clsx from "clsx";

interface SongButtonProps {
  item: SearchItem;
  onSubmit?: () => void;
  children?: React.ReactNode;
  expandable?: boolean;
  showThumbnail?: boolean;
}

const SongButton = ({
  item,
  onSubmit,
  children,
  expandable,
  showThumbnail,
}: SongButtonProps) => {
  const { song, artist } = parseSongTitle(item.title);
  const [expanded, setExpanded] = useState<boolean>(false);

  const content = (
    <div className={styles.content}>
      {showThumbnail && (
        <div className={styles.thumbnail}>
          <img src={item.thumbnail.url} />
        </div>
      )}
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
      <div className={styles.songButton} onClick={() => setExpanded(!expanded)}>
        {content}
        <div className={clsx(styles.drawer, expanded && styles.active)}>
          {children}
          <button onClick={() => onSubmit?.()}>Add to queue</button>
        </div>
      </div>
    );

  return (
    <button className={styles.songButton} onClick={() => onSubmit?.()}>
      {content}
    </button>
  );
};

export default SongButton;
