import clsx from "clsx";
import styles from "./SiteName.module.scss";
import { siteName } from "../../utils/SiteInfo";

interface SiteNameProps {
  className?: string;
  size?: "sm" | "md" | "xl";
}

const SiteName = ({ className, size = "md" }: SiteNameProps) => {
  return (
    <span className={clsx(styles.siteName, styles[size], className)}>
      {siteName()}
    </span>
  );
};

export default SiteName;
