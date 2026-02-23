import { useNavigate } from "react-router";
import styles from "./UserPage.module.scss";
import { useEffect } from "react";
import Layout from "../../layouts/Layout";
import UserEdit from "../../components/UserEdit/UserEdit";

const UserPage = () => {
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
      <div className={styles.userPage}>
        <UserEdit onKeyDown={onKeyDown} onButtonPress={navigateToSearch} />
        <button onClick={navigateToSearch}>Cancel</button>
      </div>
    </Layout>
  );
};

export default UserPage;
