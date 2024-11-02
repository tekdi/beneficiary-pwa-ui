import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Box,
  FormControl,
  Text,
  VStack,
  useDisclosure,
  Center,
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import CommonButton from "../../components/common/button/Button";
import Layout from "../../components/common/layout/Layout";
import ConsentDialog from "../../components/common/ConsentDialog";
import FloatingInput from "../../components/common/inputs/FlotingInput";
import FloatingPasswordInput from "../../components/common/inputs/FloatingPasswordInput";
import {
  getDocumentsList,
  getUser,
  loginUser,
  sendConsent,
} from "../../service/auth/auth";
import { getTokenData, saveToken } from "../../service/auth/asyncStorage";
import { AuthContext } from "../../utils/context/checkToken";

const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [isFormValid, setIsFormValid] = useState<boolean>(false);

  console.log(password, "password");

  // const { checkToken, documents, updateUserData, userData } =
  //   useContext(AuthContext);

  // const passwordRef = useRef(null);

  useEffect(() => {
    // Check for empty fields
    const isValid = username.trim() !== "" && password.trim() !== "";

    // Set form validity
    setIsFormValid(isValid);
  }, [username, password]);

  const redirectUserProfile = () => {
    console.log("accepted");
    navigate("/userprofile");
  };

  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleLogin = async () => {
    // Clear error after 3 seconds
    const clearError = () => {
      setTimeout(() => {
        setError("");
      }, 3000);
    };

    try {
      setLoading(true); // Show loading indicator
      const response = await loginUser({ username, password });
      setLoading(false); // Hide loading indicator after response
      saveToken(response.data.access_token, response.data.refresh_token);
      //init();
      //setDialogVisible(true);
    } catch (error) {
      setLoading(false); // Hide loading indicator
      if (error.message === "INVALID_USERNAME_PASSWORD_MESSAGE") {
        setError("Invalid username or password");
      } else {
        setError(error.message);
      }
      clearError();
    }
  };

  // const init = async () => {
  //   try {
  //     setLoading(true);
  //     const { sub } = await getTokenData(); // Assuming sub is the user identifier
  //     const result = await getUser(sub);
  //     const data = await getDocumentsList();
  //     updateUserData(result?.user, data.data);
  //     setLoading(false);
  //   } catch (error) {
  //     console.log("Error fetching user data or documents:", error.message);
  //     setLoading(false);
  //   }
  // };

  const handleCofirmation = async () => {
    try {
      await sendConsent(userData?.user_id);
      checkToken();
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent the default form submission behavior
    onOpen(); // Open the modal
  };

  const handleBack = () => {
    navigate("/");
  };

  return (
    <Layout
      isMenu={false}
      _heading={{
        heading: "Sign In with E-Wallet",
        handleBack,
      }}
      isBottombar={false}
    >
      <Box p={5} shadow="md" borderWidth="1px" borderRadius="md">
        <VStack align="stretch">
          <FormControl>
            <FloatingInput
              label="User Name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              isInvalid={username.trim() === ""}
              errorMessage="User Name is required."
            />
            <FloatingPasswordInput
              label="Create Password"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
              isInvalid={password.trim() === ""}
              errorMessage="Password is required."
            />
          </FormControl>
          <CommonButton
            isDisabled={!isFormValid || loading}
            onClick={handleSubmit}
            label="Sign In"
          />
        </VStack>
        <ConsentDialog
          isOpen={isOpen}
          onClose={onClose}
          onAccept={redirectUserProfile}
        />
        <Center>
          <Text mt={6}>
            Don't Have An Account?{" "}
            <Link to="/signup" className="text-color text-decoration-underline">
              Sign Up
            </Link>
          </Text>
        </Center>
      </Box>
    </Layout>
  );
};

export default SignIn;
