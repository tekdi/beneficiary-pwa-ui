import React from "react";
import {
  Box,
  Card,
  CardBody,
  Flex,
  Heading,
  Text,
  Link,
  Icon,
  HStack,
} from "@chakra-ui/react";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import { Link as RouterLink } from "react-router-dom";
import {
  extractEligibilityValues,
  formatDateString,
} from "../../utils/jsHelper/helper";
import { MdCurrencyRupee } from "react-icons/md";
interface BenefitCardProps {
  item_id: string;
  title: string;
  provider_name: string;
  description: string;
  item: {
    time?: { range?: { end?: string } };
    tags?: Array<{ list?: string[] }>;
    price?: { value?: number; currency?: string };
  };
}

const BenefitCard: React.FC<BenefitCardProps> = ({ item }) => {
  const dateStr = item?.item?.time?.range?.end;
  const formattedDate = formatDateString(dateStr);
  const eligibility = extractEligibilityValues(item?.item?.tags[0]?.list);
  const id = item?.item_id;

  return (
    <Card
      maxW="2xl"
      m={4}
      shadow="lg"
      sx={{ border: "1px solid #ebe4e4c9", borderRadius: "10px" }}
    >
      <CardBody>
        <Box className="badge-box" width={"auto"}>
          {formattedDate}
        </Box>
        <Heading marginTop={"15px"} size="md">
          {item?.title}
        </Heading>
        <Heading size="sm" color="#484848" fontWeight={400} mt={2}>
          {item?.provider_name}
        </Heading>
        {item?.item?.price?.value && (
          <HStack
            align="center"
            flexDirection={"row"}
            alignItems={"center"}
            mt={1.5}
          >
            {" "}
            <Icon as={MdCurrencyRupee} boxSize={4} color="#484848" />{" "}
            <Text fontSize="12px" marginLeft="1">
              {" "}
              {item?.item?.price?.value}{" "}
            </Text>{" "}
            <Text fontSize="12px" marginLeft="1">
              {" "}
              {item?.item?.price?.currency || "INR"}{" "}
            </Text>{" "}
          </HStack>
        )}
        <Flex alignItems="center" mt={2} mb={2}>
          {eligibility?.length > 0 ? (
            eligibility.map((category) => (
              <Box key={category} mr={2}>
                {category.toUpperCase()}
              </Box>
            ))
          ) : (
            <Box mr={2}>No eligibility criteria specified</Box>
          )}
        </Flex>
        <Text mt={4}>{item?.description}</Text>
      </CardBody>
      <Flex
        align="center"
        justify="center"
        width="100%"
        pt={2}
        mb={4}
        fontWeight={400}
      >
        <Link
          className="text-blue"
          as={RouterLink}
          to={`/benefitsdetails/${id}`}
          color={"#0037b9"}
        >
          View Details <ArrowForwardIcon />
        </Link>
      </Flex>
    </Card>
  );
};

export default BenefitCard;
