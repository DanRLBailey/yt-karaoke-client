import { useEffect, useState } from "react";
import type { SearchItem } from "../../pages/SearchPage/SearchPage";
import { parseSongTitle } from "../../utils/Song";
import styles from "./SongButton.module.scss";
import clsx from "clsx";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import ProfileImage from "../ProfileImage/ProfileImage";
import { getUserAvatarByName } from "../../utils/User";
import { IconPlus } from "@tabler/icons-react";
import { useUserList } from "../../context/UserListContext";
import { useUser } from "../../context/UserContext";
import type { User } from "../../interfaces/user";

interface SongButtonProps {
  item: SearchItem;
  onSubmit?: () => void;
  children?: React.ReactNode;
  expandable?: boolean;
  showThumbnail?: boolean;
  showStatus?: boolean;
  active?: boolean;
}

const SongButton = ({
  item,
  onSubmit,
  children,
  expandable,
  showThumbnail,
  showStatus,
  active,
}: SongButtonProps) => {
  const { user } = useUser();
  const { userList } = useUserList();
  const [otherUsers, setOtherUsers] = useState<User[]>([]);

  const { song, artist } = parseSongTitle(item.title);
  const [expanded, setExpanded] = useState<boolean>(false);

  useEffect(() => {
    const other =
      [...userList].filter((u) => u.id !== user.id) ?? ([] as User[]);

    setOtherUsers(other);
  }, [userList]);

  const isLoading = !item.downloaded && showStatus;

  const className = clsx(
    styles.songButton,
    active && styles.active,
    isLoading && styles.loading,
  );

  const content = (
    <div className={styles.content}>
      {showThumbnail && (
        <div className={styles.thumbnail}>
          {isLoading && (
            <div className={styles.loadingOverlay}>
              <LoadingSpinner />
            </div>
          )}
          <img src={item.thumbnail.url} />
        </div>
      )}
      <span>{item.downloaded}</span>
      <div className={styles.details}>
        <span className={styles.song}>{song}</span>
        <span className={styles.artist}>{artist}</span>
        <div className={styles.users}>
          {item.requester && (
            <ProfileImage
              avatar={getUserAvatarByName(item.requester)}
              className={styles.profileImage}
            />
          )}
          {item.team &&
            item.team.map((user) => (
              <ProfileImage
                avatar={getUserAvatarByName(user)}
                className={styles.profileImage}
              />
            ))}
        </div>
      </div>
    </div>
  );

  if (children || expandable)
    return (
      <div className={className} onClick={() => setExpanded(!expanded)}>
        {content}
        <div className={clsx(styles.drawer, expanded && styles.active)}>
          {children}
          <button onClick={() => onSubmit?.()}>
            <IconPlus />
          </button>
        </div>
      </div>
    );

  return (
    <button className={className} onClick={() => onSubmit?.()}>
      {content}
    </button>
  );
};

export default SongButton;
