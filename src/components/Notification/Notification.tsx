import clsx from "clsx";
import styles from "./Notification.module.scss";
import { useEffect, useState } from "react";

export interface NotificationProps {
  children: React.ReactNode;
  active?: boolean;
  className?: string;
  subtitle?: React.ReactNode | string;
  title?: React.ReactNode | string;
}

const Notification = ({
  children,
  active,
  className,
  subtitle,
  title,
}: NotificationProps) => {
  const [isActive, setIsActive] = useState<boolean>(false);

  useEffect(() => {
    setTimeout(() => {
      setIsActive(active ?? false);
    }, 100);
  }, [active]);

  useEffect(() => {
    if (isActive)
      setTimeout(() => {
        setIsActive(false);
      }, 5000);
  }, [isActive]);

  return (
    <div
      className={clsx(
        styles.notification,
        isActive ? styles.active : "",
        className,
      )}
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
