import clsx from "clsx";
import styles from "./SiteName.module.scss";
import Logo from "../../assets/logo-transparent.svg";

interface SiteNameProps {
  className?: string;
  size?: "sm" | "md" | "xl";
}

const SiteName = ({ className, size = "md" }: SiteNameProps) => {
  const siteName = import.meta.env.VITE_SITE_NAME;

  return (
    <span className={clsx(styles.siteName, styles[size], className)}>
      {siteName}
    </span>
  );
};

export default SiteName;
