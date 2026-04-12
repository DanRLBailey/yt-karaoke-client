import { useEffect, useRef, useState } from "react";
import { useUser } from "../../context/UserContext";
import styles from "./SearchPage.module.scss";
import Input from "../../components/Input/Input";
import { useUserList } from "../../context/UserListContext";
import useWebhooks from "../../hooks/useWebhooks";
import Layout from "../../layouts/Layout";
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
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import { getQueue } from "../../utils/Queue";
import { siteName } from "../../utils/SiteInfo";
import EmojiSelector from "../../components/EmojiSelector/EmojiSelector";
import type { Search, SearchItem } from "../../interfaces/search";
import type { User } from "../../interfaces/user";

const SearchPage = () => {
  const [search, setSearch] = useState<string>("");
  const [results, setResults] = useState<Search>();
  const [queueOpen, setQueueOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const { user } = useUser();
  const { dispatch } = useUserList();
  const { queue, dispatch: dispatchQueue } = useQueue();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  useEffect(() => {
    document.title = `Search - ${siteName()}`;
  }, []);

  useEffect(() => {
    const roomCode = user.roomCode ?? "";
    if (!roomCode) return;
    getQueue(roomCode, (nextQueue) =>
      dispatchQueue({ type: "SET_QUEUE", payload: nextQueue }),
    );
  }, [dispatchQueue, user.roomCode]);

  useWebhooks({
    onAddUser: (update) => {
      const roomCode = user.roomCode ?? "";
      if (update.roomCode !== roomCode) return;
      dispatch({
        type: "ADD_USER",
        payload: update,
      });
    },
  });

  const handleSearch = async (searchString?: string) => {
    const results: Search = { items: [] };
    setLoading(true);

    const url =
      import.meta.env.VITE_API_URL +
      "/search" +
      `?query=${searchString ?? search}`;
    const response = await fetch(url);
    const { result } = await response.json();
    results.items.push(...result.items);
    setResults(results);
    setLoading(false);
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
    showQueueNotification(song, addedToQueue ? "Updated" : undefined);
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...song,
        requester: user.name,
        roomCode: user.roomCode ?? "",
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
      <EmojiSelector />
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
            showRemoveButton
            searchDisabled={!search}
          />
        </div>

        {loading && (
          <div className={styles.loading}>
            <LoadingSpinner />
          </div>
        )}

        {!loading && results && (
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

        {!loading && results && results?.items.length == 0 && (
          <div className={styles.noResults}>
            <IconZoomExclamation />
            <span className={styles.heading}>No songs found</span>
            <span className={styles.subHeading}>
              Please try a different search
            </span>
          </div>
        )}

        {!loading && results == undefined && (
          <div className={styles.noResults}>
            <IconMicrophone2 />
            <span className={styles.heading}>Get mic-ready!</span>
            <span className={styles.subHeading}>
              Search for a song to add to the queue
            </span>
            <button
              className={styles.subHeading}
              onClick={() => {
                setSearch("Random");
                handleSearch("Random");
              }}
            >
              Need inspiration?
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default SearchPage;
