import styles from "./NoSongs.module.scss";
import DvdBounce from "../DvdBounce/DvdBounce";
import { useUserList } from "../../context/UserListContext";
import ProfileImage from "../ProfileImage/ProfileImage";
import SiteName from "../SiteName/SiteName";
import QrCode from "../QrCode/QrCode";
import { useSoundEffect } from "../../context/SoundEffectContext";
import { useState } from "react";
import CornerConfetti from "../CornerConfetti/CornerContetti";
import playFanfare from "../../utils/Fanfare";
import clsx from "clsx";
import { siteQotd } from "../../utils/SiteInfo";

interface NoSongsProps {
  hidden?: boolean;
}

const NoSongs = ({ hidden }: NoSongsProps) => {
  const { userList } = useUserList();
  const { playSoundEffect } = useSoundEffect();

  const [confettiTrigger, setConfettiTrigger] = useState<number>(0);
  const [corner, setCorner] = useState<"tl" | "tr" | "bl" | "br" | undefined>(
    undefined,
  );

  const qotd = siteQotd();

  const handleCornerHit = (c: typeof corner) => {
    if (hidden) return;

    setConfettiTrigger((prev) => prev + 1);
    setCorner(c);
    playFanfare();
  };

  return (
    <div className={clsx(styles.noSongs, hidden && styles.hidden)}>
      {qotd && (
        <DvdBounce onCornerHit={handleCornerHit}>
          <span>{qotd}</span>
        </DvdBounce>
      )}
      {userList.map((user, index) => (
        <DvdBounce
          key={index}
          onEnter={() => {
            if (user.soundEffect) {
              playSoundEffect(user.soundEffect);
            }
          }}
          onCornerHit={handleCornerHit}
        >
          <ProfileImage avatar={user.avatar} className={styles.profileImage} />
          <span>{user.name}</span>
        </DvdBounce>
      ))}
      <SiteName size="xl" />
      <span className={styles.tagline}>Queue some songs to start singing!</span>
      <QrCode className={styles.zIndex} />
      <CornerConfetti corner={corner} trigger={confettiTrigger} />
    </div>
  );
};

export default NoSongs;
