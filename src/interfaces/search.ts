export interface Search {
  items: SearchItem[];
}

export interface SearchItem {
  videoId: string;
  title: string;
  publishedAt: string;
  thumbnail: { url: string };
  channelTitle: string;
  downloaded?: boolean;
  requester?: string;
  team?: string[];
  failed?: boolean;
  roomCode?: string | null;
}
