import { useEffect, useRef, useState } from "react";
import styles from "./AudioCapture.module.scss";
import {
  IconMicrophone,
  IconX,
  IconPlayerPlay,
  IconPlayerPause,
} from "@tabler/icons-react";
import InputWrapper from "../InputWrapper/InputWrapper";
import WavesurferPlayer from "@wavesurfer/react";
import WaveSurfer from "wavesurfer.js";
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
  const MAX_DURATION = 5;
  const [isRecording, setIsRecording] = useState(false);
  const [acceptedRecording, setAcceptedRecording] = useState<boolean>(
    soundEffectB64 != "" && soundEffectB64 !== undefined,
  );
  const [audioBlob, setAudioBlob] = useState<Blob | undefined>(
    soundEffect ?? undefined,
  );
  const [audioUrl, setAudioUrl] = useState<string | null>(
    soundEffectB64 ?? null,
  );
  const [playing, setPlaying] = useState<boolean>(false);
  const [wavesurfer, setWavesurfer] = useState<WaveSurfer>();

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
      uploadAudio();

      stream.getTracks().forEach((track) => track.stop());

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      setIsRecording(false);
    };

    mediaRecorder.start();
    setIsRecording(true);

    timeoutRef.current = window.setTimeout(() => {
      mediaRecorder.stop();
    }, MAX_DURATION * 1000);
  };

  const stopRecording = () => {
    if (!isRecording) return;
    mediaRecorderRef.current?.stop();
  };

  useEffect(() => {
    uploadAudio();
  }, [audioBlob]);

  const uploadAudio = async () => {
    if (!audioBlob) return;
    setAcceptedRecording(true);
    onAcceptSoundEffect?.(audioBlob);
  };

  const onReady = (ws: WaveSurfer) => {
    setWavesurfer(ws);
    setPlaying(false);
  };

  const onPlayPause = () => {
    wavesurfer && wavesurfer.playPause();
  };

  const waveColor =
    getComputedStyle(document.documentElement).getPropertyValue(
      "--accent-color",
    ) || "#00f";

  return (
    <div
      className={styles.audioCapture}
      style={{ ["--recording-duration" as any]: `${MAX_DURATION}s` }}
    >
      <InputWrapper
        label="Sound Effect?"
        className={isRecording ? styles.recordingProgress : ""}
      >
        {!acceptedRecording && (
          <>
            <button
              className={clsx(
                styles.recordButton,
                isRecording && styles.recording,
              )}
              onClick={
                !acceptedRecording
                  ? () => (!isRecording ? startRecording() : stopRecording())
                  : undefined
              }
            >
              <IconMicrophone />
            </button>
            <span>{isRecording ? "Recording..." : "Tap to record"}</span>
          </>
        )}
        {acceptedRecording && (
          <>
            <button onClick={onPlayPause}>
              {playing && <IconPlayerPause />}
              {!playing && <IconPlayerPlay />}
            </button>
            <div style={{ flex: 1 }}>
              {audioUrl && (
                <WavesurferPlayer
                  height={35}
                  waveColor={waveColor}
                  url={audioUrl}
                  onReady={onReady}
                  onPlay={() => setPlaying(true)}
                  onPause={() => setPlaying(false)}
                  barWidth={2}
                />
              )}
            </div>
            <button
              onClick={() => {
                setAudioUrl("");
                setAudioBlob(undefined);
                setAcceptedRecording(false);
              }}
              disabled={isRecording}
            >
              <IconX />
            </button>
          </>
        )}
      </InputWrapper>
    </div>
  );
};
export default AudioCapture;
