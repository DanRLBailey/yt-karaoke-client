import { useEffect } from "react";
import { useSocket } from "../context/SocketContext";
import type { SearchItem } from "../pages/SearchPage/SearchPage";
import type { User } from "../interfaces/user";

type UseWebhooksProps = {
  onConnect?: () => void;
  onQueue?: (update: SearchItem) => void;
  onQueueSync?: (update: SearchItem[]) => void;
  onDownload?: (update: SearchItem) => void;
  onDownloadFailed?: (update: SearchItem) => void;
  onAddUser?: (update: User) => void;
};

const useWebhooks = ({
  onConnect,
  onQueue,
  onQueueSync,
  onDownload,
  onDownloadFailed,
  onAddUser,
}: UseWebhooksProps) => {
  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;

    if (onConnect) socket.on("connect", onConnect);
    if (onQueue) socket.on("queue", onQueue);
    if (onQueueSync) socket.on("queueSync", onQueueSync);
    if (onDownload) socket.on("download", onDownload);
    if (onDownloadFailed) socket.on("downloadFailed", onDownloadFailed);
    if (onAddUser) socket.on("add-user", onAddUser);

    return () => {
      if (onConnect) socket.off("connect", onConnect);
      if (onQueue) socket.off("queue", onQueue);
      if (onQueueSync) socket.off("queueSync", onQueueSync);
      if (onDownload) socket.off("download", onDownload);
      if (onDownloadFailed) socket.off("downloadFailed", onDownloadFailed);
      if (onAddUser) socket.off("add-user", onAddUser);
    };
  }, [
    socket,
    onConnect,
    onQueue,
    onQueueSync,
    onDownload,
    onDownloadFailed,
    onAddUser,
  ]);

  return <></>;
};

export default useWebhooks;
