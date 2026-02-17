import clsx from "clsx";
import styles from "./SongChange.module.scss";
import { useQueue } from "../../context/QueueContext";
import { parseSongTitle } from "../../utils/Song";
import Countdown from "../Countdown/Countdown";
import type { SearchItem } from "../../pages/SearchPage/SearchPage";

interface SongChangeProps {
  fadeToBlack?: boolean;
  endOfSong?: boolean;
  onCountdownEnd?: () => void;
}

const SongChange = ({
  fadeToBlack,
  endOfSong,
  onCountdownEnd,
}: SongChangeProps) => {
  const { queue } = useQueue();

  const content = (songItem: SearchItem) => (
    <>
      {endOfSong && (
        <Countdown
          className={styles.countdown}
          seconds={1}
          onCountdownEnd={onCountdownEnd}
        />
      )}
      <span className={styles.songChangeRequester}>
        Get Ready, {songItem.requester}!
      </span>
      <span className={styles.songChangeUpNext}>Up next: </span>
      <span className={styles.songChangeTitle}>
        {parseSongTitle(songItem.title).song} -{" "}
        {parseSongTitle(songItem.title).artist}
      </span>
      {/* <button>Ready?</button> */}
    </>
  );

  return (
    <>
      <div
        className={clsx(
          styles.songChange,
          styles.blackScreen,
          fadeToBlack && styles.active,
        )}
      ></div>
      <div className={clsx(styles.songChange, endOfSong && styles.active)}>
        {queue[1] && content(queue[1])}
        {queue[0] && !queue[1] && content(queue[0])}
      </div>
    </>
  );
};

export default SongChange;
