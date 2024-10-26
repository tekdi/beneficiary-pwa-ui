import * as React from "react";
import { Box, Text, IconButton, Avatar, VStack } from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";

interface HeadingTextProps {
  beneficiary?: boolean;
  heading?: string;
  subHeading?: string;
  handleBack?: () => void; // This should always expect a function
  label?: string;
}

const LeftContent: React.FC<{ label: string }> = ({ label }) => (
  <Avatar
    size="sm"
    name={label}
    src="https://bit.ly/broken-link"
    marginRight={1}
  />
);

const BackIcon: React.FC<{ onClick: () => void; iconSize?: number }> = ({
  onClick,
  iconSize = 7,
}) => (
  <IconButton
    aria-label="Back"
    icon={<ArrowBackIcon boxSize={iconSize} />}
    onClick={onClick}
    variant="ghost"
    size="sm"
  />
);

const HeadingText: React.FC<HeadingTextProps> = ({
  beneficiary,
  heading,
  subHeading,
  handleBack, // Expecting a function or undefined
  label,
}) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      padding="5"
      backgroundColor="#FFFFFF"
      borderBottomWidth={beneficiary ? 0 : 1}
      borderBottomColor="#DDDDDD"
    >
      {(handleBack || heading || subHeading) && (
        <VStack align="start">
          {(handleBack || heading) && (
            <Box display="flex" alignItems="center">
              {beneficiary && label && <LeftContent label={heading} />}
              {handleBack && <BackIcon onClick={handleBack} />}
              {heading && (
                <Text
                  fontFamily="Poppins"
                  fontSize="22px"
                  fontWeight="400"
                  lineHeight="28px"
                  color="#4D4639"
                  marginLeft={handleBack ? "2" : "0"}
                >
                  {heading}
                </Text>
              )}
            </Box>
          )}
          {beneficiary && subHeading ? (
            <Text
              fontFamily="Poppins"
              fontSize="11px"
              fontWeight="500"
              lineHeight="16px"
              color="#4D4639"
              marginLeft="10"
            >
              {subHeading}
            </Text>
          ) : (
            subHeading && (
              <Text
                fontFamily="Poppins"
                fontSize="11px"
                fontWeight="500"
                lineHeight="16px"
                color="#4D4639"
                marginTop="1"
              >
                {subHeading}
              </Text>
            )
          )}
        </VStack>
      )}
    </Box>
  );
};

export default HeadingText;
