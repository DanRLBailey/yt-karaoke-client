import clsx from "clsx";
import styles from "./SongChange.module.scss";
import { useQueue } from "../../context/QueueContext";
import { parseSongTitle } from "../../utils/Song";
import Countdown from "../Countdown/Countdown";
import type { SearchItem } from "../../pages/SearchPage/SearchPage";
import ProfileImage from "../ProfileImage/ProfileImage";
import { useUserList } from "../../context/UserListContext";
import { useEffect, useState } from "react";

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
  const nextSongTaglines = [
    "Get ready",
    "Grab the mic",
    "Warm up those vocal chords",
    "It's showtime",
    "Take the stage",
    "Your time to shine",
    "Let it rip",
    "Drop the beat",
    "Sing it proud",
    "Let's rock and roll",
  ];
  const randomTagline = () =>
    nextSongTaglines[Math.floor(Math.random() * nextSongTaglines.length)];

  const [tagline, setTagline] = useState<string>(randomTagline());

  const { queue } = useQueue();
  const { userList } = useUserList();

  useEffect(() => {
    if (fadeToBlack && endOfSong) setTagline(randomTagline());
  }, [fadeToBlack, endOfSong]);

  const content = (songItem: SearchItem) => {
    return (
      <>
        {endOfSong && (
          <Countdown
            className={styles.countdown}
            seconds={10}
            onCountdownEnd={onCountdownEnd}
          />
        )}
        <div className={styles.profileImage}>
          <ProfileImage
            avatar={userList.find((u) => u.name == songItem.requester)?.avatar}
          />
        </div>
        <span className={styles.songChangeRequester}>
          {tagline}, {songItem.requester}!
        </span>
        <span className={styles.songChangeUpNext}>Up next: </span>
        <span className={styles.songChangeTitle}>
          {parseSongTitle(songItem.title).song} -{" "}
          {parseSongTitle(songItem.title).artist}
        </span>
        {/* <button>Ready?</button> */}
      </>
    );
  };

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
