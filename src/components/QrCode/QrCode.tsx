import clsx from "clsx";
import styles from "./QrCode.module.scss";
import { QRCodeCanvas } from "qrcode.react";

interface QrCodeProps {
  showUrl?: boolean;
  showBackground?: boolean;
  size?: "sm" | "md";
  className?: string;
}

const QrCode = ({
  showUrl = true,
  showBackground = true,
  size = "md",
  className,
}: QrCodeProps) => {
  const { origin } = window.location;
  const url = origin.includes("localhost")
    ? "http://192.168.1.122:5173"
    : origin;

  return (
    <div
      className={clsx(
        styles.qrCode,
        !showBackground && styles.transparent,
        className,
      )}
      data-size={size}
    >
      <QRCodeCanvas
        value={url}
        bgColor="transparent"
        fgColor="#fff"
        size={size == "md" ? 128 : 90}
      />
      {showUrl && (
        <span>{url.replace("http://", "").replace("https://", "")}</span>
      )}
    </div>
  );
};

export default QrCode;
