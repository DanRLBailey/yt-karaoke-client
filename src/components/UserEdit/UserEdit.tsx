import { useEffect, useState } from "react";
import Input from "../Input/Input";
import WebcamCapture from "../WebcamCapture/WebcamCapture";
import styles from "./UserEdit.module.scss";
import { useUser } from "../../context/UserContext";
import { getUsers } from "../../utils/User";
import { useUserList } from "../../context/UserListContext";
import type { User } from "../../interfaces/user";
import AudioCapture from "../AudioCapture/AudioCapture";

interface UserEditProps {
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onButtonPress?: () => void;
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

const UserEdit = ({ onKeyDown, onButtonPress }: UserEditProps) => {
  const { dispatch: dispatchUserList } = useUserList();
  const { user, dispatch } = useUser();

  const [name, setName] = useState<string>("");
  const [image, setImage] = useState<string>(user.avatar);
  const [soundEffect, setSoundEffect] = useState<Blob | undefined>();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(e);
  };

  const onGetUsers = (users: User[]) =>
    dispatchUserList({ type: "SET_USERS", payload: users });

  const handleButtonPress = async () => {
    const getBase64Audio = async (callback: (newUser: User) => {}) => {
      const sfx = await blobToBase64(soundEffect);
      const newUser = {
        id: user.id,
        name: name,
        avatar: image,
        soundEffect: sfx ?? user.soundEffect,
      };

      dispatch({
        type: "SET_USER",
        payload: newUser,
      });

      callback(newUser);
    };

    const onboardUser = async (newUser: User) => {
      const url = import.meta.env.VITE_API_URL + "/users/onboard";
      await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      }).then(() => getUsers(onGetUsers));
    };

    getBase64Audio(onboardUser);
    onButtonPress?.();
  };

  useEffect(() => {
    setName(user.name);
  }, [user]);

  return (
    <div className={styles.userEdit}>
      <div className={styles.profileImage}>
        <WebcamCapture onAcceptImage={setImage} image={image} />
      </div>
      <AudioCapture
        onAcceptSoundEffect={setSoundEffect}
        soundEffect={soundEffect}
        soundEffectB64={user.soundEffect}
      />
      <div className={styles.input}>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={"Name"}
          onKeyDown={handleKeyDown}
          onButtonPress={handleButtonPress}
          enterKeyHint="enter"
        />
      </div>
    </div>
  );
};

export default UserEdit;
