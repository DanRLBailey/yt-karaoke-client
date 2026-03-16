import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import "./index.css";
import SearchPage from "./pages/SearchPage/SearchPage.tsx";
import { QueueProvider } from "./context/QueueContext.tsx";
import PlayerPage from "./pages/PlayerPage/PlayerPage.tsx";
import { UserProvider } from "./context/UserContext.tsx";
import HomePage from "./pages/HomePage/HomePage.tsx";
import { UserListProvider } from "./context/UserListContext.tsx";
import { NotificationProvider } from "./context/NotificationContext.tsx";
import UserPage from "./pages/UserPage/UserPage.tsx";
import { SoundEffectProvider } from "./context/SoundEffectContext.tsx";
import { StrictMode } from "react";
import { SocketProvider } from "./context/SocketContext.tsx";
import JoinPage from "./pages/JoinPage/JoinPage.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SocketProvider>
      <NotificationProvider>
        <UserListProvider>
          <UserProvider>
            <QueueProvider>
              <SoundEffectProvider>
                <BrowserRouter>
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/:id" element={<HomePage />} />
                    <Route path="/join" element={<JoinPage />} />
                    <Route path="/search" element={<SearchPage />} />
                    <Route path="/player" element={<PlayerPage />} />
                    <Route path="/user" element={<UserPage />} />
                  </Routes>
                </BrowserRouter>
              </SoundEffectProvider>
            </QueueProvider>
          </UserProvider>
        </UserListProvider>
      </NotificationProvider>
    </SocketProvider>
  </StrictMode>,
);
