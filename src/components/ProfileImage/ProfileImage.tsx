import clsx from "clsx";
import { useUser } from "../../context/UserContext";
import styles from "./ProfileImage.module.scss";

interface ProfileImageProps {
  className?: string;
  name?: string;
  avatar?: string;
}

const ProfileImage = ({ className, name, avatar }: ProfileImageProps) => {
  const { user } = useUser();

  if (avatar)
    return (
      <div className={clsx(styles.profileImage, className)}>
        <img src={avatar} />
        <span>{name}</span>
      </div>
    );

  if (user.avatar)
    return (
      <div className={clsx(styles.profileImage, className)}>
        <img src={user.avatar} />
        <span>{name}</span>
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
