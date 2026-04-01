// NotificationContext.tsx
import React, { createContext, useContext, useRef, useState } from "react";
import Notification from "../components/Notification/Notification";
import type { NotificationProps } from "../components/Notification/Notification";

type NotificationContextType = {
  showNotification: (notification: NotificationProps) => void;
};

type StoredNotification = NotificationProps & {
  id: number;
};

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined,
);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context)
    throw new Error("useNotification must be used within NotificationProvider");
  return context;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<StoredNotification[]>([]);
  const nextIdRef = useRef(0);

  const showNotification = (notification: NotificationProps) => {
    const id = nextIdRef.current++;
    const withId: StoredNotification = { ...notification, id };

    setNotifications((prev) => [...prev, withId]);

    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 10000);
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}

      <div className="notificationContainer">
        {notifications.map(({ id, ...notification }) => (
          <Notification key={id} {...notification} />
        ))}
      </div>
    </NotificationContext.Provider>
  );
};
