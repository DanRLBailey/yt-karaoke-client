import { useEffect } from "react";
import { io } from "socket.io-client";
import type { SearchItem } from "../pages/SearchPage/SearchPage";
import type { User } from "../interfaces/user";

type UseWebhooksProps = {
  url?: string;
  onConnect?: () => void;
  onQueue?: (update: SearchItem) => void;
  onDownload?: (update: SearchItem) => void;
  onAddUser?: (update: User) => void;
};

const useWebhooks = ({
  url = "http://localhost:3000",
  onConnect,
  onQueue,
  onDownload,
  onAddUser,
}: UseWebhooksProps) => {
  useEffect(() => {
    const socket = io(url);

    if (onConnect) socket.on("connect", onConnect);

    if (onQueue) socket.on("queue", onQueue);

    if (onDownload) socket.on("download", onDownload);

    if (onAddUser) socket.on("add-user", onAddUser);

    return () => {
      socket.disconnect();
    };
  }, [url, onConnect, onQueue, onDownload, onAddUser]);

  return <></>;
};

export default useWebhooks;
