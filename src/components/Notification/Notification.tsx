import clsx from "clsx";
import styles from "./Notification.module.scss";
import { useEffect, useState } from "react";

export interface NotificationProps {
  children: React.ReactNode;
  active?: boolean;
  className?: string;
  subtitle?: React.ReactNode | string;
  title?: React.ReactNode | string;
  style?: React.CSSProperties;
  type?: "default" | "error";
}

const Notification = ({
  children,
  active,
  className,
  subtitle,
  title,
  style,
  type,
}: NotificationProps) => {
  const [isActive, setIsActive] = useState<boolean>(false);

  useEffect(() => {
    const startTimer = window.setTimeout(() => {
      setIsActive(active ?? false);
    }, 100);

    return () => window.clearTimeout(startTimer);
  }, [active]);

  useEffect(() => {
    if (!isActive) return;

    const stopTimer = window.setTimeout(() => {
      setIsActive(false);
    }, 5000);

    return () => window.clearTimeout(stopTimer);
  }, [isActive]);

  return (
    <div
      className={clsx(
        styles.notification,
        isActive ? styles.active : "",
        className,
      )}
      style={style}
      data-active={isActive}
      data-type={type}
    >
      <div>
        {subtitle && <span className={styles.subtitle}>{subtitle}</span>}
      </div>
      <div>{title && <span className={styles.title}>{title}</span>}</div>
      {children}
    </div>
  );
};

export default Notification;
