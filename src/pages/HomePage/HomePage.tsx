import { useNavigate, useParams } from "react-router";
import styles from "./HomePage.module.scss";
import { useEffect, useState } from "react";
import Layout from "../../layouts/Layout";
import Input from "../../components/Input/Input";
import { useUser } from "../../context/UserContext";
import SplashScreen from "../../components/SplashScreen/SplashScreen";

const HomePage = () => {
  let navigate = useNavigate();
  const { id } = useParams();
  const siteTitle = import.meta.env.VITE_SITE_NAME;
  const { user, dispatch } = useUser();
  const [roomCode, setRoomCode] = useState<string>(user.roomCode ?? "");
  const [pendingJoin, setPendingJoin] = useState<boolean>(false);

  const normalizeRoomCode = (value: string) =>
    value
      .toUpperCase()
      .replace(/[^A-Z]/g, "")
      .slice(0, 5);

  const generateRoomCode = (length = 5) => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const bytes = crypto.getRandomValues(new Uint8Array(length));
    return Array.from(bytes, (b) => chars[b % chars.length]).join("");
  };

  useEffect(() => {
    document.title = `Home - ${siteTitle}`;
  }, []);

  useEffect(() => {
    if (!id) return;
    const normalized = normalizeRoomCode(id);
    if (normalized.length === 0) return;
    setRoomCode(normalized);
  }, [id]);

  const navigateToJoin = () => {
    const normalized = normalizeRoomCode(roomCode);
    dispatch({
      type: "SET_ROOM_CODE",
      payload: normalized,
    });

    setPendingJoin(true);
  };

  const navigateToCreate = () => {
    const newRoomCode = generateRoomCode();
    setRoomCode(newRoomCode);
    dispatch({
      type: "SET_ROOM_CODE",
      payload: newRoomCode,
    });
    navigate("/player");
  };

  useEffect(() => {
    if (!pendingJoin) return;
    const normalized = normalizeRoomCode(roomCode);
    if ((user.roomCode ?? "") === normalized) {
      navigate("/join");
      setPendingJoin(false);
    }
  }, [pendingJoin, roomCode, user.roomCode, navigate]);

  return (
    <Layout>
      <div className={styles.homePage}>
        <SplashScreen />
        <div className={styles.roomInputs}>
          <div className={styles.roomInput}>
            <Input
              value={roomCode ?? ""}
              label="Room Code"
              placeholder="ABCDE"
              onChange={(val) => setRoomCode(val.toUpperCase().slice(0, 5))}
              onKeyDown={(e) => {
                if (e.key === "Enter") navigateToJoin();
              }}
              onButtonPress={navigateToJoin}
              enterKeyHint="enter"
            />
          </div>
          <div className={styles.roomInput}>
            <button onClick={navigateToCreate}>Create Room</button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
