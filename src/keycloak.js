
import Keycloak from "keycloak-js";

// Initialize Keycloak instance
const keycloak = new Keycloak({
  url: "https://dev-uba-registry-keycloak.tekdinext.com/auth", // Keycloak base URL
  realm: "UBI-SCHOLARSHIP", // Your Keycloak realm
  clientId: "beneficiary-app", // Your Keycloak client ID
});
export default keycloak;