import { useRef, useState } from "react";
import styles from "./AudioCapture.module.scss";
import {
  IconMicrophone,
  IconMicrophoneFilled,
  IconX,
  IconCheck,
} from "@tabler/icons-react";
import clsx from "clsx";

interface AudioCaptureProps {
  soundEffect?: Blob;
  soundEffectB64?: string;
  onAcceptSoundEffect?: (soundEffect: Blob) => void;
}

const AudioCapture = ({
  soundEffect,
  soundEffectB64,
  onAcceptSoundEffect,
}: AudioCaptureProps) => {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const timeoutRef = useRef<number | null>(null);

  const [isRecording, setIsRecording] = useState(false);
  const [acceptedRecording, setAcceptedRecording] = useState<boolean>(
    soundEffectB64 != "",
  );
  const [audioBlob, setAudioBlob] = useState<Blob | null>(soundEffect ?? null);
  const [audioUrl, setAudioUrl] = useState<string | null>(
    soundEffectB64 ?? null,
  );

  const MAX_DURATION_MS = 5000;

  const startRecording = async () => {
    if (isRecording) return;

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    streamRef.current = stream;

    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;

    chunksRef.current = [];

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunksRef.current.push(event.data);
      }
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunksRef.current, {
        type: mediaRecorder.mimeType,
      });

      setAudioBlob(blob);
      setAudioUrl(URL.createObjectURL(blob));

      stream.getTracks().forEach((track) => track.stop());

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      setIsRecording(false);
    };

    mediaRecorder.start();
    setIsRecording(true);

    // Auto-stop after 5 seconds
    timeoutRef.current = window.setTimeout(() => {
      mediaRecorder.stop();
    }, MAX_DURATION_MS);
  };

  const stopRecording = () => {
    if (!isRecording) return;
    mediaRecorderRef.current?.stop();
  };

  const uploadAudio = async () => {
    if (!audioBlob) return;

    setAcceptedRecording(true);
    onAcceptSoundEffect?.(audioBlob);
  };

  return (
    <div className={styles.audioCapture}>
      {!audioUrl && (
        <>
          <span className={styles.title}>Record a sound effect?</span>

          <button
            className={clsx(
              styles.microphoneButton,
              isRecording && styles.active,
            )}
            onMouseDown={startRecording}
            onTouchStart={startRecording}
            onMouseUp={stopRecording}
            onTouchEnd={stopRecording}
          >
            {!isRecording && <IconMicrophone />}
            {isRecording && <IconMicrophoneFilled />}
          </button>
        </>
      )}

      {audioUrl && (
        <div className={styles.listener}>
          <button
            onClick={() => {
              setAudioUrl("");
              setAcceptedRecording(false);
            }}
            disabled={isRecording}
          >
            <IconX />
          </button>

          <audio controls src={audioUrl} />
          {!acceptedRecording && (
            <button onClick={uploadAudio}>
              <IconCheck />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default AudioCapture;
