export interface User {
  id: string;
  name: string;
  avatar: string;
  soundEffect: string | null;
  socketId?: string | null;
}
