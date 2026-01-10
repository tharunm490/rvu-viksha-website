import { createRoot } from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from "./App";
import "./index.css";

// Note: You must add VITE_GOOGLE_CLIENT_ID to your .env file
const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

if (!clientId) {
    console.warn("VITE_GOOGLE_CLIENT_ID is missing in .env. Google Auth will not work.");
}

createRoot(document.getElementById("root")!).render(
    <GoogleOAuthProvider clientId={clientId}>
        <App />
    </GoogleOAuthProvider>
);
