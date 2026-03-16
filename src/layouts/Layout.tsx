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

type LayoutProps = {
  children: React.ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  const { dispatch } = useQueue();
  const { dispatch: dispatchUserList } = useUserList();
  const { user } = useUser();
  const socket = useSocket();

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
