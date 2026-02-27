import clsx from "clsx";
import { useUser } from "../../context/UserContext";
import styles from "./ProfileImage.module.scss";

interface ProfileImageProps {
  className?: string;
  avatar?: string;
  onClick?: () => void;
  text?: string;
}

const ProfileImage = ({
  className,
  avatar,
  onClick,
  text,
}: ProfileImageProps) => {
  const { user } = useUser();

  const classNames = clsx(
    styles.profileImage,
    onClick && styles.clickable,
    className,
  );

  return (
    <div className={classNames} onClick={() => onClick?.()}>
      {!avatar && (
        <>
          <div className={styles.head}></div>
          <div className={styles.body}></div>
        </>
      )}

      {avatar && <img className={styles.avatar} src={avatar} />}
      {text && <span>{text}</span>}
      {user.avatar && avatar !== "" && !text && (
        <img className={styles.avatar} src={user.avatar} />
      )}
    </div>
  );
};

export default ProfileImage;
