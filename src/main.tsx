import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import './index.css'
import { ThemeProvider } from "./context/ThemeContext";
import ThemeOverlayActivator from "./component/ThemeOverlayActivator";


ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider>
      <ThemeOverlayActivator />
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
