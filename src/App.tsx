// import { ChakraProvider } from "@chakra-ui/react";
// import theme from "./theme";
// import { AuthProvider } from "./utils/context/checkToken";
// import AppRouter from "./routes/AppRouter";

// function App() {
//   return (
//     <ChakraProvider theme={theme}>
//       <AuthProvider>
//         <AppRouter />
//       </AuthProvider>
//     </ChakraProvider>
//   );
// }

// export default App;

import { ChakraProvider } from "@chakra-ui/react";
import theme from "./theme";
import authRoutes from "./routes/AuthRoutes";
import guestRoutes from "./routes/GuestRoutes";
import { Suspense, useEffect, useState } from "react";
import Loader from "./components/common/Loader";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useKeycloak } from "@react-keycloak/web";
import { AuthProvider } from "./utils/context/checkToken";
import "./assets/styles/App.css";
import Layout from "./components/common/layout/Layout";

function App() {
  const [loading, setLoading] = useState(true);
  const [routes, setRoutes] = useState<
    { path: string; component: React.ElementType }[]
  >([]);
  const [token, setToken] = useState(localStorage.getItem("authToken"));
  const { keycloak } = useKeycloak();

  useEffect(() => {
    if (!token && keycloak?.token) {
      localStorage.setItem("authToken", keycloak.token);
      setToken(keycloak.token);
    } else {
      setToken(localStorage.getItem("authToken"));
    }
    if (token || keycloak?.token) {
      setRoutes(authRoutes);
      const redirectUrl = localStorage.getItem("redirectUrl");
      if (redirectUrl) {
        window.location.href = redirectUrl;
        localStorage.removeItem("redirectUrl");
      }
    } else {
      setRoutes(guestRoutes);
    }
    setLoading(false);
  }, [keycloak?.token]);

  if (loading) {
    return (
      <ChakraProvider theme={theme}>
        <Layout loading />
      </ChakraProvider>
    );
  }

  return (
    <ChakraProvider theme={theme}>
      <AuthProvider>
        <Suspense fallback={<Loader />}>
          <Router>
            <Routes>
              {routes?.map((item, index) => (
                <Route
                  key={item?.path + index}
                  path={item?.path}
                  element={<item.component />}
                />
              ))}
            </Routes>
          </Router>
        </Suspense>
      </AuthProvider>
    </ChakraProvider>
  );
}
export default App;
