import { ChakraProvider } from "@chakra-ui/react";
import theme from "./theme";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./screens/auth/Splash";
import SignIn from "./screens/auth/SignIn";
import Signup from "./screens/auth/SignUp";
import UserProfile from "./screens/Profile";
import BenefitsDetails from "./screens/benefit/Details";
import ExploreBenefits from "./screens/benefit/Benefits";
import Preview from "./screens/application/Preview";
import MyApplications from "./screens/application/ApplicationStatus";
import { AuthProvider } from "./utils/context/checkToken";

function App() {
  return (
    <ChakraProvider theme={theme}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/userprofile" element={<UserProfile />} />
            <Route path="/explorebenefits" element={<ExploreBenefits />} />
            <Route path="/benefitsdetails" element={<BenefitsDetails />} />
            <Route path="/previewapplication" element={<Preview />} />
            <Route path="/applicationstatus" element={<MyApplications />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ChakraProvider>
  );
}

export default App;
