import { useEffect } from "react";
import { io } from "socket.io-client";
import type { SearchItem } from "../pages/SearchPage/SearchPage";
import type { User } from "../interfaces/user";

type UseWebhooksProps = {
  url?: string;
  onConnect?: () => void;
  onQueue?: (update: SearchItem) => void;
  onQueueSync?: (update: SearchItem[]) => void;
  onDownload?: (update: SearchItem) => void;
  onDownloadFailed?: (update: SearchItem) => void;
  onAddUser?: (update: User) => void;
};

const useWebhooks = ({
  url = import.meta.env.VITE_WEBHOOK_URL,
  onConnect,
  onQueue,
  onQueueSync,
  onDownload,
  onDownloadFailed,
  onAddUser,
}: UseWebhooksProps) => {
  useEffect(() => {
    const socket = io(url);

    if (onConnect) socket.on("connect", onConnect);

    if (onQueue) socket.on("queue", onQueue);

    if (onQueueSync) socket.on("queueSync", onQueueSync);

    if (onDownload) socket.on("download", onDownload);

    if (onDownloadFailed) socket.on("downloadFailed", onDownloadFailed);

    if (onAddUser) socket.on("add-user", onAddUser);

    return () => {
      socket.disconnect();
    };
  }, []);

  return <></>;
};

export default useWebhooks;
