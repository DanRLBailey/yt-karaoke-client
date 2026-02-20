// NotificationContext.tsx
import React, { createContext, useContext, useState } from "react";
import Notification from "../components/Notification/Notification";
import type { NotificationProps } from "../components/Notification/Notification";

type NotificationContextType = {
  showNotification: (notification: NotificationProps) => void;
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
  const [notifications, setNotifications] = useState<NotificationProps[]>([]);

  const showNotification = (notification: NotificationProps) => {
    setNotifications((prev) => [...prev, notification]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n !== notification));
    }, 10000);
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}

      <div className="notificationContainer">
        {notifications.map((n, i) => (
          <Notification key={i} {...n} />
        ))}
      </div>
    </NotificationContext.Provider>
  );
};
