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
    (users: User[]) => dispatchUserList({ type: "SET_USERS", payload: users }),
    [dispatchUserList],
  );

  const handleConnect = useCallback(() => {
    if (typeof window !== "undefined") {
      const isHostRoute = window.location.pathname.includes("/host");
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
      dispatch({ type: "ADD", payload: update });
    },
    onDownload: (update) => {
      dispatch({
        type: "DOWNLOADED",
        id: update.videoId,
        downloaded: update.downloaded ?? false,
      });
    },
    onAddUser: (update) => {
      dispatchUserList({
        type: "ADD_USER",
        payload: update,
      });
    },
    onUserUpdate: (update) => {
      dispatchUserList({
        type: "SET_USERS",
        payload: update,
      });
    },
  });

  useEffect(() => {
    getUsers(handleUsersUpdate);
    getQueue((queue) => dispatch({ type: "SET_QUEUE", payload: queue }));
  }, [dispatch, handleUsersUpdate]);

  return <>{children}</>;
};

export default Layout;
