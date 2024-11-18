import { Navigate } from "react-router-dom";
interface PrivateRouteProps {
  children: React.ReactElement; // The type for a single React component
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const isLoggedIn = localStorage.getItem("authToken");
  return isLoggedIn ? children : <Navigate to="/signin" />;
};

export default PrivateRoute;
