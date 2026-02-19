import { useState } from "react";
import type { SearchItem } from "../../pages/SearchPage/SearchPage";
import styles from "./DeletableSongButton.module.scss";
import clsx from "clsx";
import { IconTrash } from "@tabler/icons-react";
import SongButton from "../SongButton/SongButton";
import ActionButton from "../ActionButton/ActionButton";

interface DeletableSongButtonProps {
  item: SearchItem;
  showThumbnail?: boolean;
  showStatus?: boolean;
  onDelete: () => void;
  onSubmit: () => void;
}

const DeletableSongButton = ({
  item,
  showThumbnail,
  showStatus,
  onDelete,
  onSubmit,
}: DeletableSongButtonProps) => {
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
      >
        <ActionButton
          classNames={clsx(styles.actionButton, expanded && styles.active)}
          onSubmit={onDelete}
          icon={<IconTrash />}
          variant="error"
        />
      </SongButton>
    </div>
  );
};

export default DeletableSongButton;
