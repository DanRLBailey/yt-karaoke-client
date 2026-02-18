import styles from "./LoadingSpinner.module.scss";

interface LoadingSpinnerProps {
  multiplier?: number;
}

const LoadingSpinner = ({ multiplier = 1 }: LoadingSpinnerProps) => {
  return (
    <div className={styles.loadingSpinner}>
      <span
        className={styles.spinner}
        style={{ "--multiplier": multiplier } as React.CSSProperties}
      ></span>
    </div>
  );
};

export default LoadingSpinner;
