import React, { useEffect } from "react";
import { Box, Text, HStack, VStack } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { formatDate } from "../../utils/jsHelper/helper";

// Define common styles for Text and Input components
const labelStyles = {
  fontSize: "12px",
  fontWeight: "600",
  mb: 1,
  color: "#06164B",
  lineHeight: "16px",
};

const valueStyles = {
  fontSize: "14px",
  fontWeight: "400",
  color: "#1F1B13",
  lineHeight: "14px",
};

interface UserData {
  firstName?: string;
  middleName?: string | null;
  lastName?: string;
  fatherName?: string;
  motherName?: string;
  dob?: string | null;
  gender?: string;

  // Contact Information
  email?: string;
  phoneNumber?: string;

  // Educational Information
  class?: string;
  currentSchoolName?: string | null;
  currentSchoolAddress?: string | null;
  currentSchoolDistrict?: string | null;
  previousYearMarks?: string;

  // Demographic Information
  caste?: string;
  disabilityStatus?: string | null;
  annualIncome?: string;
  studentType?: string;

  // System Information
  user_id?: string;
  sso_id?: string;
  sso_provider?: string;
  samagraId?: string;
  aadhaar?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
  image?: string | null;
}

interface UserDetailsProps {
  userData: UserData;
}
type FieldValue = string | number | null | undefined;
interface FieldProps {
  label: string;
  value?: FieldValue;
  defaultValue?: string;
}

const Field: React.FC<FieldProps> = ({ label, value, defaultValue = "__" }) => (
  <Box flex={1}>
    <Text {...labelStyles}>{label}</Text>
    <Text {...valueStyles}>{value ?? defaultValue}</Text>
  </Box>
);

const UserDetails: React.FC<UserDetailsProps> = ({ userData }) => {
  const { t } = useTranslation();

  const formattedDate = formatDate(userData?.dob);

  return (
    <Box
      borderRadius="5px"
      boxShadow="0px 2px 4px rgba(0, 0, 0, 0.1)"
      bg="white"
      w="100%"
      borderWidth={1}
      p={6}
    >
      {/* <VStack spacing={6} align="stretch" mb={6}>
        <Field
          label={t("USER_DETAILS_FATHER_NAME")}
          value={userData?.fatherName}
        />
        <Field
          label={t("USER_DETAILS_MOTHER_NAME")}
          value={userData?.motherName}
        />
        <Field label={t("USER_DETAILS_LAST_NAME")} value={userData?.lastName} />
      </VStack> */}

      <VStack spacing={6} align="stretch">
        <HStack spacing={4}>
          <Field label={t("USER_DETAILS_DOB")} value={formattedDate} />{" "}
        </HStack>
        <HStack spacing={4}>
          <Field label={t("USER_DETAILS_GENDER")} value={userData?.gender} />
          <Field label={t("USER_DETAILS_CASTE")} value={userData?.caste} />
        </HStack>
        <HStack spacing={4}>
          <Field
            label={t("USER_DETAILS_DISABILITY")}
            value={userData?.disabilityStatus}
          />
          <Field label={t("USER_DETAILS_CLASS")} value={userData?.class} />
        </HStack>

        <HStack spacing={4}>
          <Field
            label={t("USER_DETAILS_ANNUAL_INCOME")}
            value={userData?.annualIncome && `INR ${userData?.annualIncome}`}
          />
          <Field
            label={t("USER_DETAILS_DAY_SCHOLAR_HOSTLER")}
            value={userData?.studentType}
          />
        </HStack>
        <Field
          label={t("USER_DETAILS_PREVIOUS_YEAR_MARKS")}
          value={userData?.previousYearMarks}
        />
      </VStack>
    </Box>
  );
};
export default UserDetails;
