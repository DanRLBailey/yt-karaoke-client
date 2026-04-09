import { useEffect, useState } from "react";
import Input from "../Input/Input";
import WebcamCapture from "../WebcamCapture/WebcamCapture";
import styles from "./UserEdit.module.scss";
import { useUser } from "../../context/UserContext";
import { onboardUser as onboardUserRequest } from "../../utils/User";
import { useUserList } from "../../context/UserListContext";
import AudioCapture from "../AudioCapture/AudioCapture";
import { useSocketId } from "../../context/SocketContext";
import type { User } from "@shared/types";

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

  const onGetUsers = (users: User[]) =>
    dispatchUserList({ type: "SET_USERS", payload: users });

  const handleButtonPress = async () => {
    if (!nameValid) return;

    const getBase64Audio = async (callback: (newUser: User) => {}) => {
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
          // onKeyDown={handleKeyDown}
          // onButtonPress={handleButtonPress}
          // enterKeyHint="enter"
          validation={validateName}
          onValidChange={setNameValid}
        />
      </div>
      <AudioCapture
        onAcceptSoundEffect={setSoundEffect}
        soundEffect={soundEffect}
        soundEffectB64={soundEffect === null ? null : user.soundEffect ?? undefined}
      />
      <div className={styles.buttons}>
        {onCancel && <button onClick={onCancel}>Cancel</button>}
        {handleButtonPress && (
          <button onClick={handleButtonPress}>{saveKeyText ?? "Save"}</button>
        )}
      </div>
    </div>
  );
};

export default UserEdit;
