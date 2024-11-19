import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
// import '/styles/index.css'
import keycloak from "./keycloak";
import { ReactKeycloakProvider } from "@react-keycloak/web";
createRoot(document.getElementById("root")!).render(
  <ReactKeycloakProvider authClient={keycloak}>
    <StrictMode>
      <App />
    </StrictMode>
  </ReactKeycloakProvider>
);
