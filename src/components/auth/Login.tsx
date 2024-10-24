import React, { useState } from "react";
import {
  Box,
  Flex,
  FormHelperText,
  Image,
} from "@chakra-ui/react";
import "../../assets/styles/App.css";
import { useNavigate } from "react-router-dom";
import FloatingSelect from "../common/FloatingSelect";
import CommonButton from "../common/button/Button";
import Layout from "../common/layout/Layout";

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
    <Layout isNavbar={false}>
      <>
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
            height={'50vh'}
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
          borderRadius="10rem 9rem 5px 35px"
        >
          <form>
              <FloatingSelect
                label={"Select Preferred Language"}
                name="name"
                value={formData.name}
                onChange={handleChange}
                options={options}

              />
            
          </form>
          <CommonButton
            onClick={() => handleRedirect()}
            label="Sign In/Sign Up With Your E-Wallet"
          />
        </Box>
      </>
    </Layout>
  );
};

export default Login;
