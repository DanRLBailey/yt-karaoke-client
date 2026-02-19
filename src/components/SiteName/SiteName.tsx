import clsx from "clsx";
import styles from "./SiteName.module.scss";

interface SiteNameProps {
  size?: "sm" | "md" | "xl";
}

const SiteName = ({ size = "md" }: SiteNameProps) => {
  const siteName = import.meta.env.VITE_SITE_NAME;

  return (
    <span className={clsx(styles.siteName, styles[size])}>{siteName}</span>
  );
};

export default SiteName;
