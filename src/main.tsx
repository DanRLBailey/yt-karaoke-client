import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import "./index.css";
import SearchPage from "./pages/SearchPage/SearchPage.tsx";
import { QueueProvider } from "./context/QueueContext.tsx";
import PlayerPage from "./pages/PlayerPage/PlayerPage.tsx";
import { UserProvider } from "./context/UserContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <UserProvider>
      <QueueProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<SearchPage />} />
            <Route path="/host" element={<PlayerPage />} />
          </Routes>
        </BrowserRouter>
      </QueueProvider>
    </UserProvider>
  </StrictMode>,
);
