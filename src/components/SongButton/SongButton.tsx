import type { SearchItem } from "../../pages/SearchPage/SearchPage";
import { parseSongTitle } from "../../utils/Song";
import styles from "./SongButton.module.scss";
import clsx from "clsx";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import { getUserAvatarByName } from "../../utils/User";
import ProfileImageRow from "../ProfileImageRow/ProfileImageRow";
import ActionButton from "../ActionButton/ActionButton";
import { IconPlayerPlay } from "@tabler/icons-react";

interface SongButtonProps {
  item: SearchItem;
  children?: React.ReactNode;
  showThumbnail?: boolean;
  showStatus?: boolean;
  active?: boolean;
  onClick?: () => void;
}

const SongButton = ({
  item,
  children,
  showThumbnail,
  showStatus,
  active,
  onClick,
}: SongButtonProps) => {
  const { song, artist } = parseSongTitle(item.title);

  const isLoading = !item.downloaded && showStatus;

  const className = clsx(
    styles.songButton,
    active && styles.active,
    isLoading && styles.loading,
  );

  const content = () => {
    return (
      <>
        <div className={styles.content}>
          {showThumbnail && (
            <div className={styles.thumbnail}>
              <img src={item.thumbnail.url} />
            </div>
          )}
          <span>{item.downloaded}</span>
          <div className={styles.details}>
            <span className={styles.song}>{song}</span>
            <span className={styles.artist}>{artist}</span>
            <div className={styles.users}>
              {item.requester && (
                <ProfileImageRow
                  avatars={[
                    getUserAvatarByName(item.requester),
                    ...(item.team?.map((user) => getUserAvatarByName(user)) ??
                      ([] as string[])),
                  ]}
                  className={styles.profileImageRow}
                />
              )}
            </div>
          </div>
        </div>
        {isLoading && (
          <div className={styles.loadingSpinner}>
            <LoadingSpinner multiplier={0.5} />
          </div>
        )}
        {active && (
          <ActionButton
            onSubmit={() => {}}
            icon={<IconPlayerPlay />}
            variant="success"
            absolute
            isStatic
          />
        )}
      </>
    );
  };

  if (children)
    return (
      <div className={className} onClick={() => onClick?.()}>
        {content()}
        {children && children}
      </div>
    );

  return (
    <button className={className} onClick={() => onClick?.()}>
      {content()}
    </button>
  );
};

export default SongButton;
