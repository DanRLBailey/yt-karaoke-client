import { useState } from "react";
import type { SearchItem } from "../../interfaces/search";
import styles from "./DeletableSongButton.module.scss";
import clsx from "clsx";
import { IconTrash } from "@tabler/icons-react";
import SongButton from "../SongButton/SongButton";
import ActionButton from "../ActionButton/ActionButton";
import { useUser } from "../../context/UserContext";
import { useLocation } from "react-router";

interface DeletableSongButtonProps {
  item: SearchItem;
  showThumbnail?: boolean;
  showStatus?: boolean;
  onDelete: () => void;
}

const DeletableSongButton = ({
  item,
  showThumbnail,
  showStatus,
  onDelete,
}: DeletableSongButtonProps) => {
  const { user } = useUser();
  const location = useLocation();
  const [expanded, setExpanded] = useState<boolean>(false);

  const isLoading = !item.downloaded && showStatus;

  const className = clsx(
    styles.deletableSongButton,
    expanded && styles.active,
    isLoading && styles.loading,
  );

  return (
    <div className={className}>
      <SongButton
        item={item}
        showThumbnail={showThumbnail}
        showStatus={showStatus}
        onClick={() => setExpanded(!expanded)}
        disabled={user.name !== item.requester}
      >
        {(user.name === item.requester || location.pathname === "/player") && (
          <ActionButton
            classNames={clsx(styles.actionButton, expanded && styles.active)}
            onSubmit={onDelete}
            icon={<IconTrash />}
            variant="error"
            absolute
          />
        )}
      </SongButton>
    </div>
  );
};

export default DeletableSongButton;
