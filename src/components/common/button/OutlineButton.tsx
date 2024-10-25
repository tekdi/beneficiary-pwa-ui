import React from "react";
import { Button } from "@chakra-ui/react";

interface OutlineButton {
  onClick: () => void;
  mt?: number;
  width?: string;
  label?: string;
}

const OutlineButton: React.FC<OutlineButton> = ({
  onClick,
  mt = 4,
  width = "100%",
  label = "Submit",
}) => {
  return (
    <Button
      className="custom-outline-btn"
      type="submit"
      mt={mt}
      width={width}
      onClick={onClick}
    >
      {label}
    </Button>
  );
};

export default OutlineButton;
