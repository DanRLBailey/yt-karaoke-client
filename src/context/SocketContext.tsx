import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

interface SocketContextValue {
  socket: Socket | null;
  socketId: string | null;
}

const SocketContext = createContext<SocketContextValue>({
  socket: null,
  socketId: null,
});

const resolveWebhookUrl = () => {
  const configured = import.meta.env.VITE_WEBHOOK_URL as string | undefined;
  if (!configured) {
    return `${window.location.protocol}//${window.location.hostname}:3002`;
  }

  try {
    const parsed = new URL(configured);
    const isLocalConfigured =
      parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1";
    const isLanHost =
      window.location.hostname !== "localhost" &&
      window.location.hostname !== "127.0.0.1";

    if (isLocalConfigured && isLanHost) {
      parsed.hostname = window.location.hostname;
      return parsed.toString();
    }
  } catch {
    // Keep configured value if parsing fails.
  }

  return configured;
};

export const useSocket = () => {
  const { socket } = useContext(SocketContext);
  return socket;
};

export const useSocketId = () => {
  const { socketId } = useContext(SocketContext);
  return socketId;
};

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [socketId, setSocketId] = useState<string | null>(null);

  useEffect(() => {
    const newSocket = io(resolveWebhookUrl());
    setSocket(newSocket);
    const handleConnect = () => setSocketId(newSocket.id ?? null);
    newSocket.on("connect", handleConnect);
    return () => {
      newSocket.off("connect", handleConnect);
      newSocket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, socketId }}>
      {children}
    </SocketContext.Provider>
  );
};
