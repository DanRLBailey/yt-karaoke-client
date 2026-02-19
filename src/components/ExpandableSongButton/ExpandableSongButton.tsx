import { useEffect, useState } from "react";
import type { SearchItem } from "../../pages/SearchPage/SearchPage";
import styles from "./ExpandableSongButton.module.scss";
import clsx from "clsx";
import ProfileImage from "../ProfileImage/ProfileImage";
import { getUserAvatarByName } from "../../utils/User";
import { IconPlus } from "@tabler/icons-react";
import { useUserList } from "../../context/UserListContext";
import { useUser } from "../../context/UserContext";
import type { User } from "../../interfaces/user";
import SongButton from "../SongButton/SongButton";
import ActionButton from "../ActionButton/ActionButton";

interface ExpandableSongButtonProps {
  item: SearchItem;
  onSubmit?: (selectedBandmates: User[]) => void;
  children?: React.ReactNode;
  showThumbnail?: boolean;
  showStatus?: boolean;
  active?: boolean;
  hasDelete?: boolean;
}

const ExpandableSongButton = ({
  item,
  onSubmit,
  children,
  showThumbnail,
  showStatus,
  active,
}: ExpandableSongButtonProps) => {
  const { user } = useUser();
  const { userList } = useUserList();
  const [otherUsers, setOtherUsers] = useState<User[]>([]);
  const [selectedBandmates, setSelectedBandmates] = useState<User[]>();

  const [expanded, setExpanded] = useState<boolean>(false);

  useEffect(() => {
    const other =
      [...userList].filter((u) => u.id !== user.id) ?? ([] as User[]);

    setOtherUsers(other);
  }, [userList]);

  const isLoading = !item.downloaded && showStatus;

  const className = clsx(
    styles.expandableSongButton,
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

  return (
    <div className={className}>
      <SongButton
        item={item}
        showThumbnail={showThumbnail}
        showStatus={showStatus}
        onClick={() => setExpanded(!expanded)}
      >
        <ActionButton
          classNames={clsx(styles.actionButton, expanded && styles.active)}
          onSubmit={handleSubmit}
          icon={<IconPlus />}
        />
        <div
          className={clsx(
            styles.drawer,
            expanded && otherUsers.length > 0 && styles.active,
          )}
          onClick={(e) => e.stopPropagation()}
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
      </SongButton>
    </div>
  );
};

export default ExpandableSongButton;
