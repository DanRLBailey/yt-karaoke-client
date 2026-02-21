// components/Layout.tsx
import React, { useEffect } from "react";
import { getUsers } from "../utils/User";
import { useUserList } from "../context/UserListContext";
import useWebhooks from "../hooks/useWebhooks";
import { useQueue } from "../context/QueueContext";
import { getQueue } from "../utils/Queue";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  const { dispatch } = useQueue();
  const { dispatch: dispatchUserList } = useUserList();

  useWebhooks({
    onConnect: () => {},
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
  });

  useEffect(() => {
    getUsers((users) =>
      dispatchUserList({ type: "SET_USERS", payload: users }),
    );
    getQueue((queue) => dispatch({ type: "SET_QUEUE", payload: queue }));
  }, []);

  return <>{children}</>;
};

export default Layout;
