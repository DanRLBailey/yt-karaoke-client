export const parseSongTitle = (title: string) => {
  const parts = title.split("-");
  return { song: parts[0]?.trim() ?? "", artist: parts[1]?.trim() ?? "" };
};
