import { Navigate } from "react-router-dom";
import { useKeycloak } from "@react-keycloak/web";
interface PrivateRouteProps {
  children: React.ReactElement; // The type for a single React component
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  // const isLoggedIn = localStorage.getItem("authToken");
  const { keycloak } = useKeycloak();
  const isLoggedIn = keycloak.authenticated;

  return isLoggedIn ? children : <Navigate to="/" />;
};

export default PrivateRoute;
