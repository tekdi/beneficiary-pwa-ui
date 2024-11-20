import React from "react";
import { Button } from "@chakra-ui/react";

interface OutlineButton {
  onClick?: () => void;
  mt?: number;
  width?: string;
  label?: string;
  disabled?: boolean;
}

const OutlineButton: React.FC<OutlineButton> = ({
  onClick,
  mt,
  width = "100%",
  label = "Submit",
  disabled = false,
}) => {
  return (
    <Button
      className="custom-outline-btn"
      type="submit"
      mt={mt}
      width={width}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </Button>
  );
};

export default OutlineButton;
