import styles from "./LoadingSpinner.module.scss";

interface LoadingSpinnerProps {
  multiplier?: number;
  showName?: boolean;
}

const LoadingSpinner = ({ multiplier = 1, showName }: LoadingSpinnerProps) => {
  return (
    <div className={styles.loadingSpinner}>
      {showName && <span className={styles.loadingText}>Loading...</span>}
      <span
        className={styles.spinner}
        style={{ "--multiplier": multiplier } as React.CSSProperties}
      ></span>
    </div>
  );
};

export default LoadingSpinner;
