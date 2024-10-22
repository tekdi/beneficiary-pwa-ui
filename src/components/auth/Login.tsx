import React, { useState } from "react";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Image,
} from "@chakra-ui/react";
import "../../assets/styles/App.css"
import { useNavigate } from "react-router-dom";
import FloatingSelect from "../common/FloatingSelect";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const handleRedirect = () => {
    navigate("/signup");
  };

  const [formData, setFormData] = useState({ name: "" });

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const options = [
    { value: "English", label: "English" },
    { value: "French", label: "French" },
  ];

  return (
    <Box className="main-bg">
      <Flex height="100vh" alignItems="center" justifyContent="center" position="relative">
        <Box
          width="550px"
          height="100vh"
          borderRadius="lg"
          shadow="lg"
          borderWidth="1px"
          background="#fff"
          className="layout"
        >
          <Flex
            height="50%"
            position="relative"
            justifyContent="flex-end"
            className="purple-bg"
          >
            <Image
              src="../src/assets/images/Frame.png"
              alt="Login Image"
              objectFit="contain"
              position="absolute"
              bottom="20%"
              left="50%"
              transform="translateX(-50%)"
              width="60%"
            />
          </Flex>
          <Box
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            p={4}
            mt={4}
            borderRadius='10rem 9rem 5px 35px'
          >
            <form>
              <FormControl>
                <FormLabel color={"#45464F"}>
                  Select Preferred Language
                </FormLabel>
                <FloatingSelect
                  label="Select Language"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  options={options}
                />
                <FormHelperText marginTop={"-15px"}>
                  You can change this later
                </FormHelperText>
              </FormControl>
            </form>

            <Button
              className="custom-btn"
              type="submit"
              mt={8}
              onClick={handleRedirect}
              width="100%"
            >
              Sign In/Sign Up With Your E-Wallet
            </Button>
          </Box>
        </Box>
      </Flex>
    </Box>
  );
};

export default Login;
