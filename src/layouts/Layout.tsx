// components/Layout.tsx
import React, { useCallback, useEffect } from "react";
import { getUsers, onboardUser } from "../utils/User";
import { useUserList } from "../context/UserListContext";
import useWebhooks from "../hooks/useWebhooks";
import { useQueue } from "../context/QueueContext";
import { getQueue } from "../utils/Queue";
import { useUser } from "../context/UserContext";
import { useSocket } from "../context/SocketContext";
import type { User } from "../interfaces/user";
import { useNotification } from "../context/NotificationContext";
import { parseSongTitle } from "../utils/Song";
import { IconAlertTriangle } from "@tabler/icons-react";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  const { dispatch } = useQueue();
  const { dispatch: dispatchUserList } = useUserList();
  const { user } = useUser();
  const socket = useSocket();
  const { showNotification } = useNotification();

  const handleUsersUpdate = useCallback(
    (users: User[]) => {
      const roomCode = user.roomCode ?? "";
      const filtered = users.filter((u) => u.roomCode === roomCode);
      dispatchUserList({ type: "SET_USERS", payload: filtered });
    },
    [dispatchUserList, user.roomCode],
  );

  const handleConnect = useCallback(() => {
    if (typeof window !== "undefined") {
      const isHostRoute = window.location.pathname.includes("/player");
      if (isHostRoute) return;
    }

    const payload = {
      ...user,
      socketId: socket?.id ?? user.socketId ?? null,
    };

    onboardUser(payload, handleUsersUpdate);
  }, [user, socket, handleUsersUpdate]);

  useWebhooks({
    onConnect: handleConnect,
    onQueue: (update) => {
      const roomCode = user.roomCode ?? "";
      if (update.roomCode !== roomCode) return;
      dispatch({ type: "ADD", payload: update });
    },
    onQueueSync: (update) => {
      const roomCode = user.roomCode ?? "";
      const filtered = update.filter((item) => item.roomCode === roomCode);
      dispatch({ type: "SET_QUEUE", payload: filtered });
    },
    onDownload: (update) => {
      const roomCode = user.roomCode ?? "";
      if (update.roomCode !== roomCode) return;
      dispatch({
        type: "DOWNLOADED",
        id: update.videoId,
        downloaded: update.downloaded ?? false,
      });
    },
    onDownloadFailed: (update) => {
      const roomCode = user.roomCode ?? "";
      if (update.roomCode !== roomCode) return;

      dispatch({
        type: "REMOVE_ITEM",
        payload: {
          videoId: update.videoId,
          roomCode: update.roomCode,
        },
      });

      const { song, artist } = parseSongTitle(update.title);

      showNotification({
        active: true,
        subtitle: (
          <>
            <IconAlertTriangle />
            Download failed
          </>
        ),
        title: song || update.title,
        children: (
          <>
            <span>{artist || "This song could not be downloaded."}</span>
            <span>It was removed from the queue.</span>
          </>
        ),
        style: {
          "--notification-right": "1rem",
          "--notification-top": "1rem",
          "--notification-transform-hidden": "translateX(120%)",
          "--notification-transform-active": "translateX(0)",
          "--notification-opacity-hidden": 0,
          "--notification-opacity-active": 1,
          borderColor: "var(--error-color)",
          boxShadow: "0 0 30px rgba(var(--error-color-rgb), 0.45)",
        } as React.CSSProperties,
      });
    },
    onAddUser: (update) => {
      const roomCode = user.roomCode ?? "";
      if (update.roomCode !== roomCode) return;
      dispatchUserList({ type: "ADD_USER", payload: update });
    },
    onUserUpdate: (update) => {
      handleUsersUpdate(update);
    },
  });

  useEffect(() => {
    if (!socket) return;

    const roomCode = user.roomCode?.trim() ?? "";
    if (!roomCode) return;

    const joinRoom = () => {
      socket.emit("join-room", roomCode);
    };

    joinRoom();
    socket.on("connect", joinRoom);

    return () => {
      socket.off("connect", joinRoom);
      socket.emit("leave-room", roomCode);
    };
  }, [socket, user.roomCode]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const path = window.location.pathname;
      const shouldFetchUsers = path === "/search" || path === "/player";
      if (shouldFetchUsers) {
        getUsers(user.roomCode ?? "", handleUsersUpdate);
      }
    }
    const roomCode = user.roomCode ?? "";
    getQueue(roomCode, (queue) =>
      dispatch({ type: "SET_QUEUE", payload: queue }),
    );
  }, [dispatch, handleUsersUpdate, user.roomCode]);

  return <>{children}</>;
};

export default Layout;
