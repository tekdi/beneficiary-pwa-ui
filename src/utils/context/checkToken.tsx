import { createContext, useState, useEffect } from "react";
import { getToken } from "../../service/auth/asyncStorage";

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
      setIsLoggedIn(!!token?.token);
    } catch (error) {
      console.error("Error retrieving token:", error);
      setIsLoggedIn(false);
    }
  };
  const updateUserData = (user, docs) => {
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
