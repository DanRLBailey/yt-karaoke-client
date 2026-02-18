import { useRef, useState } from "react";
import { useUser } from "../../context/UserContext";
import styles from "./SearchPage.module.scss";
import SongButton from "../../components/SongButton/SongButton";
import Input from "../../components/Input/Input";

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

const SearchPage = () => {
  const [search, setSearch] = useState<string>("");
  const [results, setResults] = useState<Search>();

  const { user } = useUser();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const siteName = import.meta.env.VITE_SITE_NAME;

  const handleSearch = async () => {
    const results: Search = { items: [] };

    const url = import.meta.env.VITE_API_URL + "/search" + `?query=${search}`;
    const response = await fetch(url);
    const { result } = await response.json();
    results.items.push(...result.items);
    setResults(results);
    inputRef.current?.blur();
  };

  const handleSongSelect = async (song: SearchItem) => {
    const url = import.meta.env.VITE_API_URL + "/queue";
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...song, requester: user.name }),
    });
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className={styles.searchPage}>
      <span className={styles.heading}>{siteName}</span>

      <Input
        onChange={(e) => setSearch(e.target.value)}
        value={search}
        placeholder={`What are you singing, ${user.name}?`}
        onKeyDown={onKeyDown}
        onButtonPress={handleSearch}
        enterKeyHint="search"
      />

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

export default SearchPage;
