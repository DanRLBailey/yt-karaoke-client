import { useEffect, useRef } from "react";
import styles from "./NoSongs.module.scss";
import DvdBounce from "../DvdBounce/DvdBounce";
import { useUserList } from "../../context/UserListContext";
import ProfileImage from "../ProfileImage/ProfileImage";
import SiteName from "../SiteName/SiteName";
import QrCode from "../QrCode/QrCode";
import { useSoundEffect } from "../../context/SoundEffectContext";

const NoSongs = () => {
  const { userList } = useUserList();
  const { playSoundEffect } = useSoundEffect();
  const prevSoundEffectsRef = useRef<Map<string, string | null>>(new Map());

  const qotd = import.meta.env.VITE_QOTD ?? "";

  useEffect(() => {
    const prevMap = prevSoundEffectsRef.current;

    for (const user of userList) {
      const prev = prevMap.get(user.id);
      const current = user.soundEffect ?? null;
      if (prev !== undefined && prev !== current && current) {
        playSoundEffect(current);
      }
      prevMap.set(user.id, current);
    }
  }, [userList, playSoundEffect]);

  return (
    <div className={styles.noSongs}>
      {qotd && (
        <DvdBounce>
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
        >
          <ProfileImage avatar={user.avatar} className={styles.profileImage} />
          <span>{user.name}</span>
        </DvdBounce>
      ))}
      <SiteName size="xl" />
      <span className={styles.tagline}>Queue some songs to start singing!</span>
      <QrCode className={styles.zIndex} />
    </div>
  );
};

export default NoSongs;
