import { useNavigate } from "react-router";
import styles from "./JoinPage.module.scss";
import { useEffect } from "react";
import Layout from "../../layouts/Layout";
import UserEdit from "../../components/UserEdit/UserEdit";
import { siteName } from "../../utils/SiteInfo";

const JoinPage = () => {
  let navigate = useNavigate();

  useEffect(() => {
    document.title = `Home - ${siteName()}`;
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
