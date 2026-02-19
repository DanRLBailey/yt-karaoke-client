import clsx from "clsx";
import styles from "./ActionButton.module.scss";

interface ActionButtonProps {
  classNames?: string;
  onSubmit: () => void;
  icon: React.ReactNode;
  variant?: "default" | "warning" | "error";
}

const ActionButton = ({
  classNames,
  onSubmit,
  icon,
  variant = "default",
}: ActionButtonProps) => {
  return (
    <button
      className={clsx(styles.actionButton, classNames)}
      onClick={onSubmit}
      data-variant={variant}
    >
      {icon}
    </button>
  );
};

export default ActionButton;
