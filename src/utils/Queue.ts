import type { SearchItem } from "@shared/types";

export const getQueue = async (
  roomCode: string,
  callback?: (queue: SearchItem[]) => void,
) => {
  const url =
    import.meta.env.VITE_API_URL + "/queue?roomCode=" + roomCode;
  const response = await fetch(url);
  const { result } = await response.json();

  callback?.(result.queue);
};

export const removeFirstFromQueue = async (
  roomCode: string,
  callback?: () => void,
) => {
  const url =
    import.meta.env.VITE_API_URL + "/queue?roomCode=" + roomCode;
  const response = await fetch(url, {
    method: "DELETE",
  });
  await response.json();

  callback?.();
};

export const removeIndexFromQueue = async (
  index: number,
  roomCode: string,
  callback?: () => void,
) => {
  const url =
    import.meta.env.VITE_API_URL +
    "/queue/" +
    index +
    "?roomCode=" +
    roomCode;
  const response = await fetch(url, {
    method: "DELETE",
  });
  await response.json();

  callback?.();
};

///
export const checkIfItemInQueue = (
  item: SearchItem,
  queue: SearchItem[],
): boolean => {
  return queue.find((q) => q.videoId == item.videoId) !== undefined;
};
