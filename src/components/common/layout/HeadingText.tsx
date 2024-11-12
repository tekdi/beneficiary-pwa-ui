import * as React from "react";
import { Box, Text, IconButton, Avatar, VStack } from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import FilterDialog from "./Filters";

interface HeadingTextProps {
  beneficiary?: boolean;
  heading?: string;
  subHeading?: string;
  handleBack?: () => void;
  isFilter?: boolean;
  filterInputs?: { label: string; key: string; value: string; data: any[] }[];
  onFilter?: (values: Record<string, string>) => void;
}

const LeftContent: React.FC<{ label: string; size?: string }> = ({
  label,
  size = "45px",
}) => (
  <Avatar
    boxSize={size}
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
const dummyInputs = [
  {
    label: "Category",
    key: "category",
    value: "1",
    data: ["Scholarship", "Grant", "Loan"],
  },
  {
    label: "Status",
    key: "status",
    value: "2",
    data: ["Active", "Expired", "Upcoming", "sw", "dshva"],
  },
  {
    label: "Amount",
    key: "amount",
    value: "3",
    data: ["< 1000", "1000 - 5000", "> 5000"],
  },
];

const handleFilter = (values: Record<string, string>) => {
  console.log("Applied Filter Values:", values);
};

const HeadingText: React.FC<HeadingTextProps> = ({
  beneficiary,
  heading,
  subHeading,
  handleBack,
  isFilter,
  filterInputs = dummyInputs,
  onFilter = handleFilter,
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
            <Box display="flex" alignItems="center" width="100%">
              {beneficiary && heading && <LeftContent label={heading} />}
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

              {isFilter && filterInputs && onFilter && (
                <FilterDialog
                  inputs={filterInputs}
                  onFilter={(values) => {
                    onFilter(values);
                  }}
                />
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
              marginLeft="12"
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
