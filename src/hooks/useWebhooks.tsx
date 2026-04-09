import { useEffect } from "react";
import { useSocket } from "../context/SocketContext";
import type { SearchItem } from "../interfaces/search";
import type { User } from "../interfaces/user";

export interface EmojiReactionPayload {
  emoji: string;
  roomCode?: string | null;
  user?: string | null;
  sentAt?: number;
}

type UseWebhooksProps = {
  onConnect?: () => void;
  onQueue?: (update: SearchItem) => void;
  onQueueSync?: (update: SearchItem[]) => void;
  onDownload?: (update: SearchItem) => void;
  onDownloadFailed?: (update: SearchItem) => void;
  onAddUser?: (update: User) => void;
  onUserUpdate?: (update: User[]) => void;
  onEmojiReaction?: (update: EmojiReactionPayload) => void;
};

const useWebhooks = ({
  onConnect,
  onQueue,
  onQueueSync,
  onDownload,
  onDownloadFailed,
  onAddUser,
  onUserUpdate,
  onEmojiReaction,
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
    if (onUserUpdate) socket.on("user-update", onUserUpdate);
    if (onEmojiReaction) socket.on("emoji-reaction", onEmojiReaction);

    return () => {
      if (onConnect) socket.off("connect", onConnect);
      if (onQueue) socket.off("queue", onQueue);
      if (onQueueSync) socket.off("queueSync", onQueueSync);
      if (onDownload) socket.off("download", onDownload);
      if (onDownloadFailed) socket.off("downloadFailed", onDownloadFailed);
      if (onAddUser) socket.off("add-user", onAddUser);
      if (onUserUpdate) socket.off("user-update", onUserUpdate);
      if (onEmojiReaction) socket.off("emoji-reaction", onEmojiReaction);
    };
  }, [
    socket,
    onConnect,
    onQueue,
    onQueueSync,
    onDownload,
    onDownloadFailed,
    onAddUser,
    onUserUpdate,
    onEmojiReaction,
  ]);

};

export default useWebhooks;
