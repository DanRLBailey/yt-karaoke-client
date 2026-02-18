import { useNavigate } from "react-router";
import WebcamCapture from "../../components/WebcamCapture/WebcamCapture";
import styles from "./HomePage.module.scss";
import { useEffect, useState } from "react";
import Input from "../../components/Input/Input";
import { useUser } from "../../context/UserContext";

const HomePage = () => {
  const { user, dispatch } = useUser();

  const [name, setName] = useState<string>("");
  const [image, setImage] = useState<string>(user.avatar);

  let navigate = useNavigate();
  const siteName = import.meta.env.VITE_SITE_NAME;

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") navigateToSearch();
  };

  const navigateToSearch = () => {
    const newUser = { id: user.id, name: name, avatar: image };

    dispatch({
      type: "SET_USER",
      payload: newUser,
    });

    const onboardUser = async () => {
      const url = import.meta.env.VITE_API_URL + "/onboard";
      await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });
    };

    onboardUser();
    if (user.name) navigate("/search");
  };

  useEffect(() => {
    setName(user.name);
  }, [user]);

  return (
    <div className={styles.homePage}>
      <span className={styles.heading}>{siteName}</span>
      <div className={styles.profileImage}>
        <WebcamCapture onAcceptImage={setImage} image={image} />
      </div>
      <div className={styles.input}>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={"Name"}
          onKeyDown={onKeyDown}
          onButtonPress={navigateToSearch}
          enterKeyHint="enter"
        />
      </div>
    </div>
  );
};

export default HomePage;
