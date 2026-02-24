import styles from "./SongChange.module.scss";
import { parseSongTitle } from "../../utils/Song";
import Countdown from "../Countdown/Countdown";
import type { SearchItem } from "../../pages/SearchPage/SearchPage";
import ProfileImage from "../ProfileImage/ProfileImage";
import { useEffect } from "react";
import { getUserAvatarByName, getUserByName } from "../../utils/User";
import { useSoundEffect } from "../../context/SoundEffectContext";
import { useUserList } from "../../context/UserListContext";

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

interface SongChangeProps {
  countdown: number;
  onCountdownEnd?: () => void;
  nextSong: SearchItem;
}

const SongChange = ({
  countdown,
  onCountdownEnd,
  nextSong,
}: SongChangeProps) => {
  const { playSoundEffect } = useSoundEffect();
  const { userList } = useUserList();

  const tagline = randomTagline();

  useEffect(() => {
    if (!nextSong?.requester) return;
    const user = getUserByName(userList, nextSong.requester);

    console.log(user?.soundEffect);

    if (!user?.soundEffect) return;
    playSoundEffect(user?.soundEffect);
  }, []);

  return (
    <div className={styles.songChange}>
      <Countdown
        className={styles.countdown}
        seconds={countdown ?? 10}
        onCountdownEnd={onCountdownEnd}
      />
      <div className={styles.profileImageContainer}>
        <ProfileImage
          avatar={getUserAvatarByName(nextSong.requester ?? "")}
          className={styles.profileImage}
        />
        {nextSong.team?.map((u, index) => (
          <ProfileImage
            avatar={getUserAvatarByName(u ?? "")}
            className={styles.profileImage}
            key={index}
          />
        ))}
      </div>
      {nextSong.requester && (
        <span className={styles.songChangeRequester}>
          {tagline},{" "}
          {joinWithLast([nextSong.requester, ...(nextSong.team ?? [])], " & ")}!
        </span>
      )}
      <span className={styles.songChangeUpNext}>Up next: </span>
      <span className={styles.songChangeTitle}>
        {parseSongTitle(nextSong.title).song} -{" "}
        {parseSongTitle(nextSong.title).artist}
      </span>
    </div>
  );
};

export default SongChange;
