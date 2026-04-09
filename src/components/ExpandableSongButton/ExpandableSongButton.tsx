import { useEffect, useState } from "react";
import styles from "./ExpandableSongButton.module.scss";
import clsx from "clsx";
import ProfileImage from "../ProfileImage/ProfileImage";
import { getUserAvatarByName, getUserByName } from "../../utils/User";
import { IconPlus, IconCheck } from "@tabler/icons-react";
import { useUserList } from "../../context/UserListContext";
import { useUser } from "../../context/UserContext";
import SongButton from "../SongButton/SongButton";
import ActionButton from "../ActionButton/ActionButton";
import { useQueue } from "../../context/QueueContext";
import { checkIfItemInQueue } from "../../utils/Queue";
import type { SearchItem, User } from "@shared/types";

interface ExpandableSongButtonProps {
  item: SearchItem;
  onSubmit?: (selectedBandmates: User[], addedToQueue: boolean) => void;
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
  const { queue } = useQueue();
  const [otherUsers, setOtherUsers] = useState<User[]>([]);
  const [selectedBandmates, setSelectedBandmates] = useState<User[]>(
    item.team
      ? item.team
          .map((name) => getUserByName(userList, name))
          .filter((u): u is User => u !== undefined)
      : [],
  );
  const [addedToQueue, setAddedToQueue] = useState<boolean>(
    checkIfItemInQueue(item, queue),
  );
  const [expanded, setExpanded] = useState<boolean>(false);

  useEffect(() => {
    setAddedToQueue(checkIfItemInQueue(item, queue));
  }, [queue]);

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
    onSubmit?.(selectedBandmates ?? [], addedToQueue);
    setAddedToQueue(true);
  };

  return (
    <div className={className}>
      <SongButton
        item={item}
        showThumbnail={showThumbnail}
        showStatus={showStatus}
        onClick={() => setExpanded(!expanded)}
        overlayIcon={
          addedToQueue && (
            <ActionButton
              classNames={clsx(styles.actionButton, styles.active)}
              onSubmit={handleSubmit}
              icon={<IconCheck />}
              variant="success"
              absolute
            />
          )
        }
      >
        {!addedToQueue && (
          <ActionButton
            classNames={clsx(styles.actionButton, expanded && styles.active)}
            onSubmit={handleSubmit}
            icon={<IconPlus />}
            absolute
          />
        )}

        <div
          className={clsx(
            styles.drawer,
            expanded && otherUsers.length > 0 && styles.active,
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {children}
          <span>Add some bandmates?</span>
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
