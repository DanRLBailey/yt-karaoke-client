import { useEffect, useRef, useState } from "react";
import { useUser } from "../../context/UserContext";
import styles from "./SearchPage.module.scss";
import SongButton from "../../components/SongButton/SongButton";

interface Search {
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
}

const HomePage = () => {
  const [search, setSearch] = useState<string>("phil collins");
  const [results, setResults] = useState<Search>();

  const { user, dispatch } = useUser();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleSearch = async () => {
    const results: Search = { items: [] };

    const url = import.meta.env.VITE_API_URL + "/search" + `?query=${search}`;
    const response = await fetch(url);
    const { result } = await response.json();
    results.items.push(...result.items);
    setResults(results);
    inputRef.current?.blur();
  };

  useEffect(() => {
    handleSearch();
    //MOVE TO HOME PAGE ON NAME SET
    dispatch({ type: "SET_USER", payload: "dan" });
  }, []);

  const handleSongSelect = async (song: SearchItem) => {
    const url = import.meta.env.VITE_API_URL + "/queue";
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(song),
    });
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className={styles.searchPage}>
      <span className={styles.heading}>KittDansKaraoke</span>
      <div className={styles.input}>
        <input
          ref={inputRef}
          onChange={(e) => setSearch(e.target.value)}
          value={search}
          placeholder={`What are you singing, ${user}?`}
          onKeyDown={onKeyDown}
          enterKeyHint="search"
        />
        <button className={styles.searchButton} onClick={handleSearch}>
          Q
        </button>
      </div>
      <ul className={styles.resultList}>
        {results?.items?.map((item, index) => (
          <li key={index}>
            <SongButton
              item={item}
              onSubmit={() => handleSongSelect(item)}
              expandable
              showThumbnail
            ></SongButton>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HomePage;
