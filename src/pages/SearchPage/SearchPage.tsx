import { useEffect, useRef, useState } from "react";
import { useUser } from "../../context/UserContext";
import styles from "./SearchPage.module.scss";
import Input from "../../components/Input/Input";
import { useUserList } from "../../context/UserListContext";
import useWebhooks from "../../hooks/useWebhooks";
import Layout from "../../layouts/Layout";
import type { User } from "../../interfaces/user";
import {
  IconMicrophone2,
  IconPlaylist,
  IconPlus,
  IconZoomExclamation,
} from "@tabler/icons-react";
import ProfileImage from "../../components/ProfileImage/ProfileImage";
import Queue from "../../components/Queue/Queue";
import clsx from "clsx";
import SiteName from "../../components/SiteName/SiteName";
import { useNavigate } from "react-router";
import ExpandableSongButton from "../../components/ExpandableSongButton/ExpandableSongButton";
import { parseSongTitle } from "../../utils/Song";
import { useNotification } from "../../context/NotificationContext";
import { useQueue } from "../../context/QueueContext";

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
  failed?: boolean;
}

const SearchPage = () => {
  const [search, setSearch] = useState<string>("");
  const [results, setResults] = useState<Search>();
  const [queueOpen, setQueueOpen] = useState<boolean>(false);

  const { user } = useUser();
  const { dispatch } = useUserList();
  const { queue } = useQueue();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  const siteTitle = import.meta.env.VITE_SITE_NAME;

  useEffect(() => {
    document.title = `Search - ${siteTitle}`;
  }, []);

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

  const showQueueNotification = (song: SearchItem, text?: string) => {
    const { song: title, artist } = parseSongTitle(song.title);

    showNotification({
      children: (
        <>
          <span>{title}</span>
          <span>{artist}</span>
        </>
      ),
      active: true,
      className: styles.notification,
      subtitle: (
        <>
          <IconPlus />
          {text ?? "Added to queue"}
        </>
      ),
    });
  };

  const handleSongSelect = async (
    song: SearchItem,
    bandmates: User[],
    addedToQueue: boolean,
  ) => {
    const url =
      import.meta.env.VITE_API_URL + "/queue" + (addedToQueue ? "/update" : "");
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...song,
        requester: user.name,
        ...(bandmates && { team: bandmates.map((u) => u.name) }),
      }),
    }).then(() =>
      showQueueNotification(song, addedToQueue ? "Updated" : undefined),
    );
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
              onClick={() => navigate("/user")}
            />
            <SiteName />
            <div className={styles.buttonWrapper}>
              {queue && queue.length > 0 && (
                <span className={styles.notificationBubble}>
                  {queue.length}
                </span>
              )}
              <button onClick={() => setQueueOpen(!queueOpen)}>
                <IconPlaylist />
              </button>
            </div>
          </div>

          <Input
            onChange={(val) => setSearch(val)}
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
              <li key={item.videoId + index}>
                <ExpandableSongButton
                  item={item}
                  onSubmit={(bandmates, addedToQueue) =>
                    handleSongSelect(item, bandmates, addedToQueue)
                  }
                  showThumbnail
                ></ExpandableSongButton>
              </li>
            ))}
          </ul>
        )}

        {results && results?.items.length == 0 && (
          <div className={styles.noResults}>
            <IconZoomExclamation />
            <span className={styles.heading}>No songs found</span>
            <span className={styles.subHeading}>
              Please try a different search
            </span>
          </div>
        )}

        {results == undefined && (
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
