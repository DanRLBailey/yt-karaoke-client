export interface User {
  id: string;
  name: string;
  avatar: string;
  soundEffect: string | null;
  socketId?: string | null;
  roomCode?: string | null;
  emojis?: string[];
}

export const DEFAULT_EMOJIS = ["😃", "👏", "🎉", "🔥"];
