import { useState, type CSSProperties } from "react";
import styles from "./EmojiSelector.module.scss";
import { IconMoodSmile } from "@tabler/icons-react";
import { useSocket } from "../../context/SocketContext";
import { useUser } from "../../context/UserContext";
import { DEFAULT_EMOJIS } from "../../interfaces/user";

const EmojiSelector = () => {
  const [isOpen, setIsOpen] = useState(false);
  const socket = useSocket();
  const { user } = useUser();
  const emojis = user.emojis?.length ? user.emojis : DEFAULT_EMOJIS;

  const sendReaction = (emoji: string) => {
    const roomCode = user.roomCode?.trim();
    if (!socket || !roomCode) return;
    socket.emit("emoji-reaction", {
      emoji,
      roomCode,
      user: user.name,
      sentAt: Date.now(),
    });
  };

  return (
    <div className={`${styles.emojiSelector} ${isOpen ? styles.open : ""}`}>
      <button
        className={styles.center}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-label={isOpen ? "Hide emoji options" : "Show emoji options"}
      >
        <IconMoodSmile />
      </button>
      {emojis.map((emoji, i) => {
        const count = emojis.length;
        const start = 180;
        const end = 270;
        const angle =
          count === 1 ? start : start + ((end - start) * i) / (count - 1);

        return (
          <button
            key={`${emoji}-${i}`}
            className={styles.satellite}
            style={
              {
                "--angle": `${angle}deg`,
                "--delay": `${i * 40}ms`,
              } as CSSProperties
            }
            tabIndex={isOpen ? 0 : -1}
            aria-hidden={!isOpen}
            onClick={() => sendReaction(emoji)}
          >
            {emoji}
          </button>
        );
      })}
    </div>
  );
};

export default EmojiSelector;
