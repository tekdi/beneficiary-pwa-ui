import { Spinner, Text, VStack } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

const Loader = () => {
  const { t } = useTranslation();
  return (
    <VStack>
      <Spinner color="var(--theme-color)" />
      <Text color="var(--theme-color)">{t("GENERAL_LOADING")}</Text>
    </VStack>
  );
};

export default Loader;
