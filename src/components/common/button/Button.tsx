import React from "react";
import { Button } from "@chakra-ui/react";

interface CustomButton {
  onClick: () => void;
  mt?: number;
  width?: string;
  label?: string;
  isDisabled?: boolean;
}

const CommonButton: React.FC<CustomButton> = ({
  onClick,
  mt = 4,
  width = "100%",
  label = "Submit",
  isDisabled = false,
}) => {
  return (
    <Button
      className="custom-btn"
      type="submit"
      mt={mt}
      width={width}
      onClick={onClick}
      isDisabled={isDisabled}
    >
      {label}
    </Button>
  );
};

export default CommonButton;
