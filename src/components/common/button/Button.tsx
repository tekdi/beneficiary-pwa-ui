import React from "react";
import { Button } from "@chakra-ui/react";

interface CustomButton {
  onClick?: (event: React.FormEvent<HTMLFormElement>) => void;
  mt?: number;
  width?: string;
  label?: string;
}

const CommonButton: React.FC<CustomButton> = ({
  onClick,
  mt = 4,
  width = "100%",
  label = "Submit",
}) => {
  return (
    <Button
      className="custom-btn"
      type="submit"
      mt={mt}
      width={width}
      onClick={(event: React.MouseEvent<HTMLButtonElement>) =>
        onClick?.(event as unknown as React.FormEvent<HTMLFormElement>)
      }
      alignSelf={"center"}
    >
      {label}
    </Button>
  );
};

export default CommonButton;
