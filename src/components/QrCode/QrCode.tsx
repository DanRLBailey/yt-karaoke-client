import styles from "./QrCode.module.scss";
import { QRCodeCanvas } from "qrcode.react";

interface QrCodeProps {
  showUrl?: boolean;
}

const QrCode = ({ showUrl = true }: QrCodeProps) => {
  const { origin } = window.location;
  const url = origin.includes("localhost")
    ? "http://192.168.1.122:5173"
    : origin;
  console.log(url, origin);

  return (
    <div className={styles.qrCode}>
      <QRCodeCanvas value={url} bgColor="transparent" fgColor="#fff" />
      {showUrl && <span>{url.replace("http://", "")}</span>}
    </div>
  );
};

export default QrCode;
