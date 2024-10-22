import { ChakraProvider } from "@chakra-ui/react";
import theme from "./theme";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/auth/Login";
import SignIn from "./components/auth/SignIn";
import Signup from "./components/auth/SignUp";
import UserProfile from "./components/benefit/UserProfile";
import Footer from "./components/common/Footer";
import BenefitsDetails from "./components/benefit/Details";
import ExploreBenefits from "./components/benefit/Benefits";



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
        <Route path="/explorebenefits" element={<ExploreBenefits/>} />
        <Route path="/benefitsdetails" element={<BenefitsDetails/>} />
      </Routes>
    </Router>
    </ChakraProvider>
  );
}

export default App; 
