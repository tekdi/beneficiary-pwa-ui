import { useEffect } from "react";
import { HStack, Text, useToast } from "@chakra-ui/react";
import { CheckCircleIcon, WarningIcon } from "@chakra-ui/icons";

interface ToasterProps {
  message: string;
  type: "success" | "error" | "warning" | "info";
}

const Toaster: React.FC<ToasterProps> = ({ message, type }) => {
  const toast = useToast();

  const getToastStyles = (toastType: ToasterProps["type"]) => {
    switch (toastType) {
      case "success":
        return {
          bg: "#0B7B69",
          color: "white",
          icon: <CheckCircleIcon color="white" />,
        };
      case "error":
        return {
          bg: "#C03744",
          color: "white",
          icon: <WarningIcon color="white" />,
        };
      case "warning":
        return {
          bg: "#EDA145",
          color: "white",
          icon: <WarningIcon color="white" />,
        };
      default:
        return { bg: "gray.200", color: "black", icon: null };
    }
  };

  const showToast = () => {
    toast({
      status: type,
      duration: 3000,
      isClosable: true,
      position: "bottom",
      render: () => (
        <HStack p={3} borderRadius="md" {...getToastStyles(type)} color="white">
          {getToastStyles(type).icon}
          <Text>{message}</Text>
        </HStack>
      ),
    });
  };

  useEffect(() => {
    if (message) {
      showToast();
    }
  }, [message]);

  return null;
};

export default Toaster;
