export const parseSongTitle = (title: string) => {
  const parts = title.split(/\s-\s/);
  return { song: parts[0]?.trim() ?? "", artist: parts[1]?.trim() ?? "" };
};
