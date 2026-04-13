export interface CatalogueSong {
  title: string;
  songName: string;
  videoId: string;
  channelTitle: string;
  thumbnail: string;
}

export const getAllArtists = async (
  callback: (artistsByLetter: Record<string, string[]>) => void,
) => {
  const url = import.meta.env.VITE_API_URL + "/catalogue/all";
  const response = await fetch(url);
  const { result } = await response.json();
  callback(result.artists);
};

export const getArtistsByLetter = async (
  letter: string,
  callback: (artists: string[]) => void,
) => {
  const url = import.meta.env.VITE_API_URL + "/catalogue?letter=" + encodeURIComponent(letter);
  const response = await fetch(url);
  const { result } = await response.json();
  callback(result.artists);
};

export const getSongsByArtist = async (
  artist: string,
  callback: (songs: CatalogueSong[]) => void,
) => {
  const url =
    import.meta.env.VITE_API_URL +
    "/catalogue/songs?artist=" +
    encodeURIComponent(artist);
  const response = await fetch(url);
  const { result } = await response.json();
  callback(result.songs);
};
