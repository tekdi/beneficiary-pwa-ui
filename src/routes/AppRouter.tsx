import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "../screens/auth/Splash";
import Signup from "../screens/auth/SignUp";
import SignIn from "../screens/auth/SignIn";

import ExploreBenefits from "../screens/benefit/Benefits";
import BenefitsDetails from "../screens/benefit/Details";
import Preview from "../screens/application/Preview";
import MyApplications from "../screens/application/ApplicationStatus";
import PrivateRoute from "./ProtectedRoute";
import UploadDocuments from "../components/common/layout/UploadDocuments";
import Home from "../screens/Home";
import UserProfile from "../screens/UserProfile";

const AppRouter = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/uploaddocuments" element={<UploadDocuments />} />

      <Route
        path="/userprofile"
        element={
          <PrivateRoute>
            <UserProfile />
          </PrivateRoute>
        }
      />
      <Route
        path="/home"
        element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        }
      />
      <Route
        path="/explorebenefits"
        element={
          <PrivateRoute>
            <ExploreBenefits />
          </PrivateRoute>
        }
      />
      <Route
        path={`/benefitsdetails/:id`}
        element={
          <PrivateRoute>
            <BenefitsDetails />
          </PrivateRoute>
        }
      />
      <Route
        path={`/previewapplication/:id`}
        element={
          <PrivateRoute>
            <Preview />
          </PrivateRoute>
        }
      />
      <Route
        path="/applicationstatus"
        element={
          <PrivateRoute>
            <MyApplications />
          </PrivateRoute>
        }
      />
    </Routes>
  </Router>
);

export default AppRouter;
