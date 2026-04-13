import clsx from "clsx";
import styles from "./SiteName.module.scss";
import { siteName } from "../../utils/SiteInfo";
import { useNavigate } from "react-router";

interface SiteNameProps {
  className?: string;
  size?: "sm" | "md" | "xl";
}

const SiteName = ({ className, size = "md" }: SiteNameProps) => {
  const navigate = useNavigate();

  return (
    <span
      className={clsx(styles.siteName, styles[size], className)}
      onClick={() => navigate("/search")}
    >
      {siteName()}
    </span>
  );
};

export default SiteName;
