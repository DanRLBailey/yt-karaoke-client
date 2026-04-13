import { useEffect, useState } from "react";
import { useUser } from "../../context/UserContext";
import styles from "./CataloguePage.module.scss";
import { useUserList } from "../../context/UserListContext";
import useWebhooks from "../../hooks/useWebhooks";
import Layout from "../../layouts/Layout";
import {
  IconChevronDown,
  IconChevronRight,
  IconPlaylist,
  IconPlus,
  IconSearch,
} from "@tabler/icons-react";
import ProfileImage from "../../components/ProfileImage/ProfileImage";
import Queue from "../../components/Queue/Queue";
import clsx from "clsx";
import SiteName from "../../components/SiteName/SiteName";
import { useNavigate, useSearchParams } from "react-router";
import ExpandableSongButton from "../../components/ExpandableSongButton/ExpandableSongButton";
import { parseSongTitle } from "../../utils/Song";
import { useNotification } from "../../context/NotificationContext";
import { useQueue } from "../../context/QueueContext";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import { getQueue } from "../../utils/Queue";
import { siteName } from "../../utils/SiteInfo";
import type { SearchItem } from "../../interfaces/search";
import type { User } from "../../interfaces/user";
import { getAllArtists, getSongsByArtist } from "../../utils/Catalogue";
import type { CatalogueSong } from "../../utils/Catalogue";
import Input from "../../components/Input/Input";

const LETTER_GROUPS: string[][] = [
  ["#"],
  ["A", "B", "C", "D"],
  ["E", "F", "G", "H"],
  ["I", "J", "K", "L"],
  ["M", "N", "O", "P"],
  ["Q", "R", "S", "T"],
  ["U", "V", "W", "X", "Y", "Z"],
];

const groupLabel = (group: string[]) =>
  group.length === 1 ? group[0] : `${group[0]}-${group[group.length - 1]}`;

const toSearchItem = (song: CatalogueSong): SearchItem => ({
  videoId: song.videoId,
  title: song.title,
  publishedAt: "",
  thumbnail: { url: song.thumbnail },
  channelTitle: song.channelTitle,
});

const CataloguePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [artistsByLetter, setArtistsByLetter] = useState<
    Record<string, string[]>
  >({});
  const [activeGroup, setActiveGroup] = useState<string[]>(() => {
    const letter = searchParams.get("letter")?.toUpperCase();
    return (
      LETTER_GROUPS.find((g) => letter && g.includes(letter)) ??
      LETTER_GROUPS[0]
    );
  });
  const [artistFilter, setArtistFilter] = useState<string>("");
  const [expandedArtist, setExpandedArtist] = useState<string | null>(null);
  const [songCache, setSongCache] = useState<Record<string, CatalogueSong[]>>(
    {},
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingArtist, setLoadingArtist] = useState<string | null>(null);
  const [queueOpen, setQueueOpen] = useState<boolean>(false);

  const { user } = useUser();
  const { dispatch } = useUserList();
  const { queue, dispatch: dispatchQueue } = useQueue();
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  useEffect(() => {
    document.title = `Catalogue - ${siteName()}`;
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
      dispatch({ type: "ADD_USER", payload: update });
    },
  });

  useEffect(() => {
    setLoading(true);
    getAllArtists((data) => {
      setArtistsByLetter(data);
      setLoading(false);
    });
  }, []);

  const handleGroupClick = (group: string[]) => {
    setActiveGroup(group);
    setExpandedArtist(null);
    setArtistFilter("");
    setSearchParams({ letter: group[0] });
  };

  const visibleArtists = artistFilter.trim()
    ? Object.values(artistsByLetter)
        .flat()
        .filter((artist) =>
          artist.toLowerCase().includes(artistFilter.toLowerCase()),
        )
        .sort((a, b) => a.localeCompare(b))
    : activeGroup.flatMap((letter) => artistsByLetter[letter] ?? []);

  const handleArtistClick = async (artist: string) => {
    if (expandedArtist === artist) {
      setExpandedArtist(null);
      return;
    }
    setExpandedArtist(artist);
    if (!songCache[artist]) {
      setLoadingArtist(artist);
      await getSongsByArtist(artist, (songs) => {
        setSongCache((prev) => ({ ...prev, [artist]: songs }));
      });
      setLoadingArtist(null);
    }
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

  return (
    <Layout>
      <Queue open={queueOpen} onMouseLeave={setQueueOpen} />
      <div className={clsx(styles.cataloguePage, queueOpen && styles.noScroll)}>
        <div className={styles.headerContainer}>
          <div className={styles.header}>
            <ProfileImage
              className={styles.profileImage}
              onClick={() => navigate("/user")}
            />
            <SiteName />
            <div className={styles.buttonWrapper}>
              <button onClick={() => navigate("/search")}>
                <IconSearch />
              </button>
              <div className={styles.queueButton}>
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
          </div>

          <nav className={styles.letterGroupNav}>
            {LETTER_GROUPS.map((group) => {
              const label = groupLabel(group);
              const isActive = activeGroup === group;
              return (
                <button
                  key={label}
                  className={clsx(
                    styles.letterGroupItem,
                    isActive && styles.letterGroupActive,
                  )}
                  onClick={() => handleGroupClick(group)}
                >
                  {label}
                </button>
              );
            })}
          </nav>

          <Input
            placeholder="Filter artists"
            value={artistFilter}
            onChange={(val) => setArtistFilter(val)}
            showRemoveButton
          />
        </div>

        <div className={styles.body}>
          {loading ? (
            <div className={styles.loading}>
              <LoadingSpinner />
            </div>
          ) : (
            <ul className={styles.artistList}>
              {visibleArtists.map((artist) => {
                const isExpanded = expandedArtist === artist;
                const isLoadingThis = loadingArtist === artist;
                const songs = songCache[artist];

                return (
                  <li key={artist}>
                    <button
                      className={clsx(
                        styles.artistRow,
                        isExpanded && styles.expanded,
                      )}
                      onClick={() => handleArtistClick(artist)}
                    >
                      {isExpanded ? <IconChevronDown /> : <IconChevronRight />}
                      <span>{artist}</span>
                    </button>

                    <div
                      className={clsx(
                        styles.artistSongsWrapper,
                        isExpanded && styles.artistSongsOpen,
                      )}
                    >
                      <div className={styles.artistSongs}>
                        {isLoadingThis && (
                          <div className={styles.artistLoading}>
                            <LoadingSpinner />
                          </div>
                        )}
                        {!isLoadingThis && songs && (
                          <ul className={styles.resultList}>
                            {songs.map((song, i) => {
                              const item = toSearchItem(song);
                              return (
                                <li key={song.videoId + i}>
                                  <ExpandableSongButton
                                    item={item}
                                    onSubmit={(bandmates, addedToQueue) =>
                                      handleSongSelect(
                                        item,
                                        bandmates,
                                        addedToQueue,
                                      )
                                    }
                                    showThumbnail
                                    compact
                                  />
                                </li>
                              );
                            })}
                          </ul>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default CataloguePage;
