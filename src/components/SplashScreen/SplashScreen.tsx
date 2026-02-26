import SiteName from "../SiteName/SiteName";
import styles from "./SplashScreen.module.scss";

const SplashScreen = () => {
  return (
    <div className={styles.splashScreen}>
      <SiteName className={styles.siteName} />
    </div>
  );
};

export default SplashScreen;
