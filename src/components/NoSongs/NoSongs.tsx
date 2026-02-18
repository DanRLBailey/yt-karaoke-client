import styles from "./NoSongs.module.scss";
import DvdBounce from "../DvdBounce/DvdBounce";
import { useUserList } from "../../context/UserListContext";
import ProfileImage from "../ProfileImage/ProfileImage";

const NoSongs = () => {
  const { userList } = useUserList();
  const siteName = import.meta.env.VITE_SITE_NAME;

  const qotd = "Happy birthday, Linda! 🎉";

  return (
    <div className={styles.noSongs}>
      {qotd && (
        <DvdBounce>
          <span>{qotd}</span>
        </DvdBounce>
      )}
      {userList.map((user) => (
        <DvdBounce>
          <ProfileImage avatar={user.avatar} className={styles.profileImage} />
          <span>{user.name}</span>
        </DvdBounce>
      ))}
      <span className={styles.tagline}>{siteName}</span>
      <span className={styles.tagline}>Queue some songs to start singing!</span>
    </div>
  );
};

export default NoSongs;
