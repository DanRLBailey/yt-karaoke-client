import clsx from "clsx";
import styles from "./QrCode.module.scss";
import { QRCodeCanvas } from "qrcode.react";
import { useUser } from "../../context/UserContext";

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
  const { user } = useUser();
  const url = origin + (user.roomCode ? `/room/${user.roomCode}` : "") + "test";

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
        value={`${url}`}
        bgColor="transparent"
        fgColor="#fff"
        size={size == "md" ? 162 : 128}
      />
      {showUrl && (
        <span>{url.replace("http://", "").replace("https://", "")}</span>
      )}
    </div>
  );
};

export default QrCode;
