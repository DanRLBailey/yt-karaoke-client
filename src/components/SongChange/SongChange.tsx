import clsx from "clsx";
import styles from "./SongChange.module.scss";
import { useQueue } from "../../context/QueueContext";
import { parseSongTitle } from "../../utils/Song";
import Countdown from "../Countdown/Countdown";
import type { SearchItem } from "../../pages/SearchPage/SearchPage";
import ProfileImage from "../ProfileImage/ProfileImage";
import { useEffect, useState } from "react";
import { getUserAvatarByName, getUserByName } from "../../utils/User";
import { useSoundEffect } from "../../context/SoundEffectContext";
import { useUserList } from "../../context/UserListContext";

interface SongChangeProps {
  countdown?: number;
  fadeToBlack?: boolean;
  endOfSong?: boolean;
  onCountdownEnd?: () => void;
  startOfQueue?: boolean;
}

const SongChange = ({
  countdown,
  fadeToBlack,
  endOfSong,
  onCountdownEnd,
  startOfQueue,
}: SongChangeProps) => {
  // All hooks must be called at the top level, not inside any function or conditional
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
  const { queue } = useQueue();
  const { userList } = useUserList();
  const { playSoundEffect } = useSoundEffect();

  // Always initialize state safely
  const [tagline, setTagline] = useState<string>(() => randomTagline());
  const [currentSong, setCurrentSong] = useState<SearchItem>(() => queue[0]);

  useEffect(() => {
    if (!currentSong && queue.length > 0) setCurrentSong(queue[0]);
  }, [queue]);

  useEffect(() => {
    if (fadeToBlack && endOfSong) setTagline(randomTagline());
  }, [fadeToBlack, endOfSong]);

  useEffect(() => {
    if (fadeToBlack && endOfSong && startOfQueue) setCurrentSong(queue[0]);
    if (fadeToBlack && endOfSong && !startOfQueue) setCurrentSong(queue[1]);
  }, [fadeToBlack, endOfSong, startOfQueue]);

  // Move all hooks to top level, do not call hooks in content()

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

  useEffect(() => {
    if (!currentSong) return;

    const user = getUserByName(userList, currentSong?.requester ?? "");
    if (user && user.soundEffect) {
      playSoundEffect(user.soundEffect);
    }
  }, [currentSong]);

  const content = (songItem: SearchItem) => {
    return (
      <>
        {endOfSong && (
          <Countdown
            className={styles.countdown}
            seconds={countdown ?? 10}
            onCountdownEnd={onCountdownEnd}
          />
        )}
        <div className={styles.profileImageContainer}>
          <ProfileImage
            avatar={getUserAvatarByName(songItem.requester ?? "")}
            className={styles.profileImage}
          />
          {songItem.team?.map((u, index) => (
            <ProfileImage
              avatar={getUserAvatarByName(u ?? "")}
              className={styles.profileImage}
              key={index}
            />
          ))}
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
        {currentSong && content(currentSong)}
      </div>
    </>
  );
};

export default SongChange;
