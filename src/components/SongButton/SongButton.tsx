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
  onSubmit?: (selectedBandmates: User[]) => void;
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
  const [selectedBandmates, setSelectedBandmates] = useState<User[]>();

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

  const toggleBandmate = (user: User) => {
    setSelectedBandmates((prev) => {
      const exists = prev?.find((u) => u.id === user.id);
      if (exists) {
        return prev?.filter((u) => u.id !== user.id);
      } else {
        return [...(prev ?? []), user];
      }
    });
  };

  const handleSubmit = () => {
    onSubmit?.(selectedBandmates ?? []);
    setSelectedBandmates([]);
    setExpanded(false);
  };

  const content = () => (
    <div className={styles.content} onClick={() => setExpanded(!expanded)}>
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
            item.team.map((user, index) => (
              <ProfileImage
                avatar={getUserAvatarByName(user)}
                className={styles.profileImage}
                key={index}
              />
            ))}
        </div>
      </div>
    </div>
  );

  if (children || expandable)
    return (
      <div className={className}>
        <button
          className={clsx(styles.addButton, expanded && styles.active)}
          onClick={handleSubmit}
        >
          <IconPlus />
        </button>
        {content()}
        <div
          className={clsx(
            styles.drawer,
            expanded && otherUsers.length > 0 && styles.active,
          )}
        >
          {children}
          <span>Add some bandmates</span>
          <div className={styles.bandmates}>
            {otherUsers.map((user, index) => (
              <div
                className={styles.bandmate}
                onClick={() => toggleBandmate(user)}
                key={index}
              >
                <ProfileImage
                  avatar={getUserAvatarByName(user.name)}
                  className={clsx(
                    styles.profileImage,
                    selectedBandmates?.some((u) => u.id == user.id) &&
                      styles.active,
                  )}
                />
                <span>{user.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );

  return (
    <button className={className} onClick={handleSubmit}>
      {content()}
    </button>
  );
};

export default SongButton;
