
import Keycloak from "keycloak-js";
const VITE_KEYCLOAK_URL = import.meta.env.VITE_KEYCLOAK_URL;
const VITE_KEYCLOAK_REALM = import.meta.env.VITE_KEYCLOAK_REALM;
const VITE_KEYCLOAK_CLIENT_ID = import.meta.env.VITE_KEYCLOAK_CLIENT_ID;

// Initialize Keycloak instance
const keycloak = new Keycloak({
  url: VITE_KEYCLOAK_URL, // Keycloak base URL
  realm: VITE_KEYCLOAK_REALM, // Your Keycloak realm
  clientId: VITE_KEYCLOAK_CLIENT_ID, // Your Keycloak client ID
});
export default keycloak;