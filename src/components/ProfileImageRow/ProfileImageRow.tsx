import clsx from "clsx";
import ProfileImage from "../ProfileImage/ProfileImage";
import styles from "./ProfileImageRow.module.scss";

interface ProfileImageRowProps {
  avatars: string[];
  className?: string;
}

const ProfileImageRow = ({ avatars, className }: ProfileImageRowProps) => {
  return (
    <div className={clsx(styles.profileImageRow, className)}>
      <ProfileImage avatar={avatars[0]} />

      {avatars.length == 2 && <ProfileImage avatar={avatars[1]} />}

      {avatars.length > 2 && <ProfileImage text={`+${avatars.length - 1}`} />}
    </div>
  );
};

export default ProfileImageRow;
