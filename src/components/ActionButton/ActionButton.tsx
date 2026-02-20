import clsx from "clsx";
import styles from "./ActionButton.module.scss";

interface ActionButtonProps {
  classNames?: string;
  onSubmit?: () => void;
  icon: React.ReactNode;
  variant?: "default" | "success" | "warning" | "error";
  absolute?: boolean;
  isStatic?: boolean;
}

const ActionButton = ({
  classNames,
  onSubmit,
  icon,
  variant = "default",
  absolute,
  isStatic,
}: ActionButtonProps) => {
  if (isStatic)
    return (
      <div
        className={clsx(
          styles.actionButton,
          absolute && styles.absolute,
          classNames,
        )}
        onClick={() => onSubmit?.()}
        data-variant={variant}
      >
        {icon}
      </div>
    );

  return (
    <button
      className={clsx(
        styles.actionButton,
        absolute && styles.absolute,
        classNames,
      )}
      onClick={() => onSubmit?.()}
      data-variant={variant}
    >
      {icon}
    </button>
  );
};

export default ActionButton;
