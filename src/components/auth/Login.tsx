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
import { useNavigate } from "react-router-dom";
import FloatingSelect from "../common/FloatingSelect";
import i18n from "../common/i18n";
import { useTranslation } from "react-i18next";
import Layout from "../common/layout/Layout";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [formData, setFormData] = useState({ name: "" });

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    i18n.changeLanguage(value); // Change language based on selection
  };

  const options = [
    { label: t("ENGLISH"), value: "en" },
    { label: t("HINDI"), value: "hn" },
  ];

  const handleRedirect = () => {
    navigate("/signup");
  };

  return (
    <Layout isNavbar={false}>
      <Flex height="50%" justifyContent="flex-end" className="purple-bg">
        <Image
          src="../src/assets/images/Frame.png"
          alt="Login Image"
          objectFit="contain"
          transform="translateX(-50%)"
          width="60%"
          height="400px"
        />
      </Flex>
      <Box p={4} mt={4} borderRadius="10rem 9rem 5px 35px">
        <form>
          <FormControl>
            <FormLabel color={"#45464F"}>
              {t("SELECT_PREFERRED_LANGUAGE")}
            </FormLabel>
            <FloatingSelect
              label={t("SELECT_LANGUAGE")}
              name="name"
              value={formData.name}
              onChange={handleChange}
              options={options}
            />
            <FormHelperText marginTop={"-15px"}>
              {t("CHANGE_LATER")}
            </FormHelperText>
          </FormControl>
        </form>

        <Button
          className="custom-btn"
          mt={8}
          onClick={handleRedirect}
          width="100%"
        >
          {t("SIGN_IN/SIGN_UI_WITH_YOUR_E-WALLET")}
        </Button>
      </Box>
    </Layout>
  );
};

export default Login;