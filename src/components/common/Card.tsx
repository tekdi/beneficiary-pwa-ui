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
  item: {
    item_id: number;
    title: string;
    provider_name: string;
    description: string;
    item: {
      price?: { value?: number; currency?: string };
      tags: Array<{ list?: string[] }>;
      time?: { range?: { end?: string } };
    };
  };
}

const BenefitCard: React.FC<BenefitCardProps> = ({ item }) => {
  const dateStr = item?.item?.time?.range?.end;
  const formattedDate = dateStr ? formatDateString(dateStr) : "";
  // const eligibility = extractEligibilityValues(
  //   item?.item?.tags[0]?.list.map((item) => ({
  //     descriptor: { code: "", name: "", short_desc: "" },
  //     display: true,
  //     item,
  //   }))
  // );

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
        <Heading size="md" mt={2}>
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
            mt={4}
          >
            {" "}
            <Icon as={MdCurrencyRupee} boxSize={4} color="#484848" />{" "}
            <Text color="#484848" marginLeft="1">
              {" "}
              {item?.item?.price?.value}{" "}
            </Text>{" "}
            <Text color="#484848" marginLeft="1">
              {" "}
              {/* {item?.item?.price?.currency || "INR"}{" "} */}
            </Text>{" "}
          </HStack>
        )}
        <Flex alignItems="center" mt={4}>
          {/* {eligibility?.length > 0 ? (
            eligibility.map((category, index) => (
              <Box
                key={index}
                mr={2}
                color={"#0037B9"}
                border={"1px"}
                borderRadius={"6px"}
                p={"2px 10px"}
              >
                {category.item.toUpperCase()}
              </Box>
            ))
          ) : (
            <Box mr={2}>No eligibility criteria specified</Box>
          )} */}
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
