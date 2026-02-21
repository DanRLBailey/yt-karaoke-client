import type { SearchItem } from "../pages/SearchPage/SearchPage";

export const getQueue = async (callback?: (queue: SearchItem[]) => void) => {
  const url = import.meta.env.VITE_API_URL + "/queue";
  const response = await fetch(url);
  const { result } = await response.json();

  callback?.(result.queue);
};

export const removeFirstFromQueue = async (callback?: () => void) => {
  const url = import.meta.env.VITE_API_URL + "/queue";
  const response = await fetch(url, {
    method: "DELETE",
  });
  await response.json();

  callback?.();
};

export const removeIndexFromQueue = async (
  index: number,
  callback?: () => void,
) => {
  const url = import.meta.env.VITE_API_URL + "/queue/" + index;
  const response = await fetch(url, {
    method: "DELETE",
  });
  await response.json();

  callback?.();
};

///
export const checkIfItemInQueue = (item: SearchItem, queue: SearchItem[]) => {
  return queue.find((q) => q.videoId == item.videoId) ?? item;
};
