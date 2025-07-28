import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import { UserProvider } from "./context/UserContext.tsx";
import ErrorBoundary from "./components/error-boundary.tsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
const GOOGLE_CLIENT_ID = '66908465154-mcjsgj1i0tbmma5c34sg3phn159vpt81.apps.googleusercontent.com';
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <ErrorBoundary>
         <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
          <App />
          </GoogleOAuthProvider>
      </ErrorBoundary>
    </BrowserRouter>
  </StrictMode>
);
