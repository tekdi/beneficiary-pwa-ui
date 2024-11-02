import { createContext, useState, useEffect } from "react";
import { getToken } from "../../service/ayncStorage";
import jwt_decode from "jwt-decode";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  // Auth states
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [applicationId, setApplicationId] = useState();
  // User data states
  const [userData, setUserData] = useState(null);
  const [documents, setDocuments] = useState([]);

  // Function to check token and update login status

  const checkToken = async () => {
    try {
      const token = await getToken();
      if (!token?.token) {
        setIsLoggedIn(false);
        return;
      }

      // Verify token expiration
      const decodedToken = jwt_decode(token.token);
      if (decodedToken.exp * 1000 < Date.now()) {
        setIsLoggedIn(false);
        return;
      }

      setIsLoggedIn(true);
    } catch (error) {
      console.error(
        "Authentication error:",
        error instanceof Error ? error.message : "Unknown error"
      );
      setIsLoggedIn(false);
    }
  };

  const updateUserData = (user, docs) => {
    if (!user) {
      console.error("Invalid user data provided");
      return;
    }
    setUserData(user);
    setDocuments(docs);
  };

  const updateApplicationId = (id) => {
    setApplicationId(id);
  };
  const removeContextData = () => {
    setApplicationId(null);
    setDocuments([]);
    setUserData(null);
  };
  useEffect(() => {
    checkToken();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        checkToken,
        setIsLoggedIn,
        userData,
        documents,
        updateUserData,
        updateApplicationId,
        applicationId,
        removeContextData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };
