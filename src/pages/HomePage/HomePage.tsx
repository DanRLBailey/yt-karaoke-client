import { useNavigate } from "react-router";
import styles from "./HomePage.module.scss";
import { useEffect } from "react";
import Layout from "../../layouts/Layout";
import UserEdit from "../../components/UserEdit/UserEdit";
import SplashScreen from "../../components/SplashScreen/SplashScreen";

const HomePage = () => {
  let navigate = useNavigate();
  const siteTitle = import.meta.env.VITE_SITE_NAME;

  useEffect(() => {
    document.title = `Home - ${siteTitle}`;
  }, []);

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") navigateToSearch();
  };

  const navigateToSearch = () => {
    navigate("/search");
  };

  return (
    <Layout>
      <div className={styles.homePage}>
        <SplashScreen />
        <UserEdit onKeyDown={onKeyDown} onButtonPress={navigateToSearch} />
      </div>
    </Layout>
  );
};

export default HomePage;
