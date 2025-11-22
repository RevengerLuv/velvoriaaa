import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { HashRouter } from "react-router-dom"; // CHANGED TO HashRouter
import { AppContextProvider } from "./context/AppContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HashRouter> {/* CHANGED TO HashRouter */}
      <AppContextProvider>
        <App />
      </AppContextProvider>
    </HashRouter>
  </StrictMode>
);
