import clsx from "clsx";
import styles from "./SongChange.module.scss";
import { useQueue } from "../../context/QueueContext";
import { parseSongTitle } from "../../utils/Song";
import Countdown from "../Countdown/Countdown";
import type { SearchItem } from "../../pages/SearchPage/SearchPage";
import ProfileImage from "../ProfileImage/ProfileImage";
import { useEffect, useState } from "react";
import { getUserAvatarByName } from "../../utils/User";

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

  useEffect(() => {
    if (fadeToBlack && endOfSong) setTagline(randomTagline());
  }, [fadeToBlack, endOfSong]);

  const joinWithLast = (
    arr: string[],
    lastSeparator: string,
    separator: string = ", ",
  ): string => {
    if (arr.length === 0) return "";
    if (arr.length === 1) return arr[0];
    if (arr.length === 2) return arr.join(lastSeparator);

    return `${arr.slice(0, -1).join(separator)}${lastSeparator}${arr[arr.length - 1]}`;
  };

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
        <div className={styles.profileImageContainer}>
          <ProfileImage
            avatar={getUserAvatarByName(songItem.requester ?? "")}
            className={styles.profileImage}
          />
          {songItem.team?.map((u, index) => {
            return (
              <ProfileImage
                avatar={getUserAvatarByName(u ?? "")}
                className={styles.profileImage}
                key={index}
              />
            );
          })}
        </div>
        {songItem.requester && (
          <span className={styles.songChangeRequester}>
            {tagline},{" "}
            {joinWithLast(
              [songItem.requester, ...(songItem.team ?? [])],
              " & ",
            )}
            !
          </span>
        )}
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
