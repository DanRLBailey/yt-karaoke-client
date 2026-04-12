import { useEffect, useState } from "react";
import Input from "../Input/Input";
import WebcamCapture from "../WebcamCapture/WebcamCapture";
import styles from "./UserEdit.module.scss";
import { useUser } from "../../context/UserContext";
import { onboardUser as onboardUserRequest } from "../../utils/User";
import { useUserList } from "../../context/UserListContext";
import AudioCapture from "../AudioCapture/AudioCapture";
import { useSocketId } from "../../context/SocketContext";
import type { User } from "../../interfaces/user";
import { DEFAULT_EMOJIS } from "../../interfaces/user";
import EMOJI_CATEGORIES from "../../assets/emojis.json";

interface UserEditProps {
  onButtonPress?: () => void;
  saveKeyText?: string;
  onCancel?: () => void;
}

const blobToBase64 = async (blob: Blob | undefined): Promise<string | null> => {
  if (!blob) return null;

  const arrayBuffer = await blob.arrayBuffer();
  const uint8Array = new Uint8Array(arrayBuffer);
  let binary = "";
  for (let i = 0; i < uint8Array.length; i++) {
    binary += String.fromCharCode(uint8Array[i]);
  }
  return "data:audio/webm;base64," + btoa(binary);
};

const UserEdit = ({ onButtonPress, saveKeyText, onCancel }: UserEditProps) => {
  const { dispatch: dispatchUserList } = useUserList();
  const { user, dispatch } = useUser();
  const socketId = useSocketId();

  const [name, setName] = useState<string>("");
  const [nameValid, setNameValid] = useState<boolean>(false);
  const [image, setImage] = useState<string>(user.avatar);
  const [soundEffect, setSoundEffect] = useState<Blob | null | undefined>();
  const [emojis, setEmojis] = useState<string[]>(user.emojis ?? DEFAULT_EMOJIS);
  const [activeSlot, setActiveSlot] = useState<number | null>(null);
const handleSlotClick = (index: number) => {
    setActiveSlot((prev) => (prev === index ? null : index));
  };

  const handleEmojiPick = (emoji: string) => {
    if (activeSlot === null) return;
    setEmojis((prev) => prev.map((e, i) => (i === activeSlot ? emoji : e)));
    setActiveSlot(null);
  };


  const onGetUsers = (users: User[]) =>
    dispatchUserList({ type: "SET_USERS", payload: users });

  const handleButtonPress = async () => {
    if (!nameValid) return;

    const getBase64Audio = async (callback: (newUser: User) => void) => {
      let sfx: string | null;
      if (soundEffect === null) {
        sfx = null;
      } else if (soundEffect) {
        sfx = await blobToBase64(soundEffect);
      } else {
        sfx = user.soundEffect ?? null;
      }
      const newUser = {
        id: user.id,
        name: name,
        avatar: image,
        soundEffect: sfx,
        roomCode: user.roomCode ?? "",
        emojis,
      };

      dispatch({
        type: "SET_USER",
        payload: newUser,
      });

      callback(newUser);
    };

    const onboardUser = async (newUser: User) => {
      const payload: User = {
        ...newUser,
        socketId: socketId ?? newUser.socketId ?? null,
      };
      await onboardUserRequest(payload, onGetUsers);
    };

    getBase64Audio(onboardUser);
    onButtonPress?.();
  };

  useEffect(() => {
    setName(user.name);
  }, [user]);

  const validateName = (name: string) => {
    return name !== "";
  };

  return (
    <div className={styles.userEdit}>
      <div className={styles.profileImage}>
        <WebcamCapture onAcceptImage={setImage} image={image} />
      </div>

      <div className={styles.input}>
        <Input
          value={name}
          onChange={(e) => setName(e)}
          label={"Name"}
          placeholder={"Name"}
          validation={validateName}
          onValidChange={setNameValid}
          charLimit={32}
        />
      </div>
      <AudioCapture
        onAcceptSoundEffect={setSoundEffect}
        soundEffect={soundEffect}
        soundEffectB64={
          soundEffect === null ? null : (user.soundEffect ?? undefined)
        }
      />
      <div className={styles.emojiPicker}>
        <label className={styles.emojiLabel}>Emoji Reactions</label>
        <div className={styles.emojiSlots}>
          {emojis.map((emoji, i) => (
            <button
              key={i}
              className={`${styles.emojiSlot} ${activeSlot === i ? styles.active : ""}`}
              onClick={() => handleSlotClick(i)}
              aria-label={`Emoji slot ${i + 1}: ${emoji}`}
            >
              {emoji}
            </button>
          ))}
        </div>
        {activeSlot !== null && (
          <div className={styles.emojiBackdrop} onClick={() => setActiveSlot(null)} />
        )}
        {activeSlot !== null && (
          <div className={styles.emojiPopup}>
            {EMOJI_CATEGORIES.map((group) => (
              <div key={group.category} className={styles.emojiCategory}>
                <p className={styles.emojiCategoryLabel}>{group.category}</p>
                <div className={styles.emojiGrid}>
                  {group.emojis.map((emoji, i) => (
                    <button
                      key={i}
                      className={styles.emojiOption}
                      onClick={() => handleEmojiPick(emoji)}
                      aria-label={emoji}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className={styles.buttons}>
        {onCancel && <button onClick={onCancel}>Cancel</button>}
        <button onClick={handleButtonPress}>{saveKeyText ?? "Save"}</button>
      </div>
    </div>
  );
};

export default UserEdit;
