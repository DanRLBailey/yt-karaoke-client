import React, { useCallback, useEffect } from "react";
import { getUsers, onboardUser } from "../utils/User";
import { useUserList } from "../context/UserListContext";
import useWebhooks from "../hooks/useWebhooks";
import { useQueue } from "../context/QueueContext";
import { getQueue } from "../utils/Queue";
import { useUser } from "../context/UserContext";
import { useSocket } from "../context/SocketContext";
import { useNotification } from "../context/NotificationContext";
import { parseSongTitle } from "../utils/Song";
import { IconAlertTriangle } from "@tabler/icons-react";
import type { User } from "../interfaces/user";

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
    if (window.location.pathname.includes("/player")) return;

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
      dispatch({ type: "SET_QUEUE", payload: update });
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
        type: "error",
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
    const path = window.location.pathname;
    if (path === "/search" || path === "/player") {
      getUsers(user.roomCode ?? "", handleUsersUpdate);
    }
    const roomCode = user.roomCode ?? "";
    getQueue(roomCode, (queue) =>
      dispatch({ type: "SET_QUEUE", payload: queue }),
    );
  }, [dispatch, handleUsersUpdate, user.roomCode]);

  return <>{children}</>;
};

export default Layout;
