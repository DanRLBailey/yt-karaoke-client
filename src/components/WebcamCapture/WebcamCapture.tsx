import { useEffect, useRef, useState } from "react";
import { useUser } from "../../context/UserContext";
import styles from "./WebcamCapture.module.scss";
import ProfileImage from "../ProfileImage/ProfileImage";

interface WebcamCaptureProps {
  image?: string;
  onAcceptImage?: (image: string) => void;
}

const WebcamCapture = ({ image, onAcceptImage }: WebcamCaptureProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const { dispatch } = useUser();
  const [ready, setReady] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string>("");
  const [webcamOpen, setWebcamOpen] = useState<boolean>(false);

  useEffect(() => {
    if (!videoRef.current) return;

    const video = videoRef.current;

    const onReady = () => setReady(true);
    video.addEventListener("loadedmetadata", onReady);

    return () => video.removeEventListener("loadedmetadata", onReady);
  }, [webcamOpen]);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
        });

        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Camera access denied:", err);
      }
    };

    if (webcamOpen) startCamera();

    return () => {
      // stop camera when component unmounts
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, [webcamOpen]);

  const capture = () => {
    if (!ready) return;

    const video = videoRef.current!;
    if (!video) return;

    // Get actual displayed size
    const displayWidth = video.clientWidth;
    const displayHeight = video.clientHeight;

    // Aspect ratios
    const videoRatio = video.videoWidth / video.videoHeight;
    const displayRatio = displayWidth / displayHeight;

    // Determine crop in source video
    let sx = 0;
    let sy = 0;
    let sWidth = video.videoWidth;
    let sHeight = video.videoHeight;

    if (videoRatio > displayRatio) {
      // video is wider than display → crop width
      sWidth = video.videoHeight * displayRatio;
      sx = (video.videoWidth - sWidth) / 2;
    } else {
      // video is taller than display → crop height
      sHeight = video.videoWidth / displayRatio;
      sy = (video.videoHeight - sHeight) / 2;
    }

    // Square crop (centered)
    const size = Math.min(sWidth, sHeight);
    sx += (sWidth - size) / 2;
    sy += (sHeight - size) / 2;

    const canvas = document.createElement("canvas");
    const outputSize = 300;
    canvas.width = outputSize;
    canvas.height = outputSize;

    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(video, sx, sy, size, size, 0, 0, outputSize, outputSize);

    setCapturedImage(canvas.toDataURL("image/png"));
    setWebcamOpen(false);
  };

  return (
    <div className={styles.webcamCapture}>
      <video ref={videoRef} autoPlay playsInline />
      {!webcamOpen && (
        <ProfileImage className={styles.absolute} avatar={image} />
      )}
      {!webcamOpen && capturedImage && (
        <img className={styles.capturedImage} src={capturedImage} />
      )}

      {!webcamOpen && !capturedImage && (
        <div className={styles.buttons} onClick={() => setWebcamOpen(true)}>
          <button>Capture new image</button>
        </div>
      )}
      {(webcamOpen || capturedImage) && (
        <div className={styles.buttons}>
          {capturedImage && (
            <button
              onClick={() => {
                setCapturedImage("");
                setWebcamOpen(true);
              }}
            >
              Cross mark
            </button>
          )}
          <button className={styles.captureButton} onClick={capture}>
            <div className={styles.captureButtonInner}></div>
          </button>
          {capturedImage && (
            <button
              onClick={() => {
                onAcceptImage?.(capturedImage);
                setCapturedImage("");
              }}
            >
              Tick mark
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default WebcamCapture;
