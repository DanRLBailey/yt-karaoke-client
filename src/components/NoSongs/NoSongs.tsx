import styles from "./NoSongs.module.scss";
import DvdBounce from "../DvdBounce/DvdBounce";
import { useUserList } from "../../context/UserListContext";
import ProfileImage from "../ProfileImage/ProfileImage";
import SiteName from "../SiteName/SiteName";
import QrCode from "../QrCode/QrCode";

const NoSongs = () => {
  const { userList } = useUserList();

  const qotd = "Happy birthday, Linda! 🎉";

  return (
    <div className={styles.noSongs}>
      {qotd && (
        <DvdBounce>
          <span>{qotd}</span>
        </DvdBounce>
      )}
      {userList.map((user, index) => (
        <DvdBounce key={index}>
          <ProfileImage avatar={user.avatar} className={styles.profileImage} />
          <span>{user.name}</span>
        </DvdBounce>
      ))}
      <SiteName size="xl" />
      <span className={styles.tagline}>Queue some songs to start singing!</span>
      <QrCode />
    </div>
  );
};

export default NoSongs;
