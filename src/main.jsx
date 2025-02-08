import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from "./App.jsx";
import "./index.css";
import * as Sentry from "@sentry/react";

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const sentryDsn = import.meta.env.VITE_SENTRY_DSN;

if (!clientId) {
  console.error("GOOGLE_CLIENT_ID is not defined in environment variables");
}

if (!sentryDsn) {
  console.error("SENTRY_DSN is not defined in environment variables");
}

// Sentry initialization
Sentry.init({
  dsn: sentryDsn,
    integrations: [],
    tracesSampleRate: 1.0,
    environment: import.meta.env.MODE, // development, production
});

createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId={clientId}>
    <StrictMode>
        <App />
    </StrictMode>
  </GoogleOAuthProvider>
);