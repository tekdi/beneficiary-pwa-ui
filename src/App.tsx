import { ChakraProvider } from "@chakra-ui/react";
import theme from "./theme";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./screens/auth/Splash";
import SignIn from "./screens/auth/SignIn";
import Signup from "./screens/auth/SignUp";
import UserProfile from "./screens/Profile";
import Footer from "./components/common/Footer";
import BenefitsDetails from "./screens/benefit/Details";
import ExploreBenefits from "./screens/benefit/Benefits";
import Preview from "./screens/application/Preview";
import MyApplications from "./screens/application/ApplicationStatus";

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/userprofile" element={<UserProfile />} />
          <Route path="/footer" element={<Footer />} />
          <Route path="/explorebenefits" element={<ExploreBenefits />} />
          <Route path="/benefitsdetails" element={<BenefitsDetails />} />
          <Route path="/previewapplication" element={<Preview />} />
          <Route path="/applicationstatus" element={<MyApplications />} />
        </Routes>
      </Router>
    </ChakraProvider>
  );
}

export default App;
