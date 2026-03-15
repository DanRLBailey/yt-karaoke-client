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
    const newSocket = io(import.meta.env.VITE_WEBHOOK_URL);
    setSocket(newSocket);
    const handleConnect = () => setSocketId(newSocket.id ?? null);
    newSocket.on("connect", handleConnect);
    const handleUnload = () => {
      newSocket.disconnect();
    };
    window.addEventListener("beforeunload", handleUnload);
    return () => {
      window.removeEventListener("beforeunload", handleUnload);
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
