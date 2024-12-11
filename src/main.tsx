import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./components/common/i18n";
import keycloak from "./keycloak";
import { ReactKeycloakProvider } from "@react-keycloak/web";

const rootElement = document.getElementById("root");
if (rootElement) {
  createRoot(rootElement).render(
    <ReactKeycloakProvider authClient={keycloak}>
      <StrictMode>
        <App />
      </StrictMode>
    </ReactKeycloakProvider>
  );
} else {
  console.error("Root element not found.");
}
