import { useRef, useState } from "react";
import { useUser } from "../../context/UserContext";
import styles from "./SearchPage.module.scss";
import Input from "../../components/Input/Input";
import { useUserList } from "../../context/UserListContext";
import useWebhooks from "../../hooks/useWebhooks";
import Layout from "../../layouts/Layout";
import type { User } from "../../interfaces/user";
import { IconMicrophone2, IconPlaylist } from "@tabler/icons-react";
import ProfileImage from "../../components/ProfileImage/ProfileImage";
import Queue from "../../components/Queue/Queue";
import clsx from "clsx";
import SiteName from "../../components/SiteName/SiteName";
import { useNavigate } from "react-router";
import ExpandableSongButton from "../../components/ExpandableSongButton/ExpandableSongButton";

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
  team?: string[];
}

const SearchPage = () => {
  const [search, setSearch] = useState<string>("");
  const [results, setResults] = useState<Search>();
  const [queueOpen, setQueueOpen] = useState<boolean>(false);

  const { user } = useUser();
  const { dispatch } = useUserList();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();

  useWebhooks({
    onAddUser: (update) => {
      dispatch({
        type: "ADD_USER",
        payload: update,
      });
    },
  });

  const handleSearch = async () => {
    const results: Search = { items: [] };

    const url = import.meta.env.VITE_API_URL + "/search" + `?query=${search}`;
    const response = await fetch(url);
    const { result } = await response.json();
    results.items.push(...result.items);
    setResults(results);
    inputRef.current?.blur();
  };

  const handleSongSelect = async (song: SearchItem, bandmates?: User[]) => {
    const url = import.meta.env.VITE_API_URL + "/queue";
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...song,
        requester: user.name,
        ...(bandmates && { team: bandmates.map((u) => u.name) }),
      }),
    });
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <Layout>
      <Queue open={queueOpen} onMouseLeave={setQueueOpen} />
      <div className={clsx(styles.searchPage, queueOpen && styles.noScroll)}>
        <div className={styles.headerContainer}>
          <div className={styles.header}>
            <ProfileImage
              className={styles.profileImage}
              onClick={() => navigate("/")}
            />
            <SiteName />
            <button onClick={() => setQueueOpen(!queueOpen)}>
              <IconPlaylist />
            </button>
          </div>

          <Input
            onChange={(e) => setSearch(e.target.value)}
            value={search}
            placeholder={`What are you singing, ${user.name}?`}
            onKeyDown={onKeyDown}
            onButtonPress={handleSearch}
            enterKeyHint="search"
          />
        </div>

        {results && (
          <ul className={styles.resultList}>
            {results?.items?.map((item, index) => (
              <li key={index}>
                <ExpandableSongButton
                  item={item}
                  onSubmit={(bandmates) => handleSongSelect(item, bandmates)}
                  showThumbnail
                ></ExpandableSongButton>
              </li>
            ))}
          </ul>
        )}

        {(results == undefined || results?.items.length == 0) && (
          <div className={styles.noResults}>
            <IconMicrophone2 />
            <span className={styles.heading}>Get mic-ready!</span>
            <span className={styles.subHeading}>
              Search for a song to add to the queue
            </span>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default SearchPage;
