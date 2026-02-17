import clsx from "clsx";
import { useUser } from "../../context/UserContext";
import styles from "./ProfileImage.module.scss";

interface ProfileImageProps {
  className?: string;
}

const ProfileImage = ({ className }: ProfileImageProps) => {
  const { user } = useUser();

  if (user.avatar)
    return (
      <div className={clsx(styles.profileImage, className)}>
        <img src={user.avatar} />
      </div>
    );

  return (
    <div className={clsx(styles.profileImage, className)}>
      <div className={styles.head}></div>
      <div className={styles.body}></div>
    </div>
  );
};

export default ProfileImage;
