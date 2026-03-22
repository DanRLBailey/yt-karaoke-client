import { useNavigate } from "react-router";
import styles from "./UserPage.module.scss";
import { useEffect } from "react";
import Layout from "../../layouts/Layout";
import UserEdit from "../../components/UserEdit/UserEdit";
import { siteName } from "../../utils/SiteInfo";

const UserPage = () => {
  let navigate = useNavigate();

  useEffect(() => {
    document.title = `Home - ${siteName()}`;
  }, []);

  const navigateToSearch = () => {
    navigate("/search");
  };

  return (
    <Layout>
      <div className={styles.userPage}>
        <UserEdit
          onButtonPress={navigateToSearch}
          onCancel={navigateToSearch}
        />
      </div>
    </Layout>
  );
};

export default UserPage;
