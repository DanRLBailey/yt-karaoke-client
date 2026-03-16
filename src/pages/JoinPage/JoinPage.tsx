import { useNavigate } from "react-router";
import styles from "./JoinPage.module.scss";
import { useEffect } from "react";
import Layout from "../../layouts/Layout";
import UserEdit from "../../components/UserEdit/UserEdit";

const JoinPage = () => {
  let navigate = useNavigate();
  const siteTitle = import.meta.env.VITE_SITE_NAME;

  useEffect(() => {
    document.title = `Home - ${siteTitle}`;
  }, []);

  const navigateToSearch = () => {
    navigate("/search");
  };

  return (
    <Layout>
      <div className={styles.joinPage}>
        <UserEdit onButtonPress={navigateToSearch} saveKeyText="Join" />
      </div>
    </Layout>
  );
};

export default JoinPage;
