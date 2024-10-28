import React from "react";
import {
  Box,
  Card,
  CardBody,
  Flex,
  Heading,
  Text,
  Link,
} from "@chakra-ui/react";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import { Link as RouterLink } from "react-router-dom";

interface BenefitCardProps {
  date: string;
  title: string;
  ministry: string;
  amount: string;
  categories: string[];
  description: string;
  link: string;
}

const BenefitCard: React.FC<BenefitCardProps> = ({
  date,
  title,
  ministry,
  amount,
  categories,
  description,
  link,
}) => {
  return (
    <Card
      maxW="2xl"
      m={4}
      shadow="lg"
      sx={{ border: "1px solid #ebe4e4c9", borderRadius: "10px" }}
    >
      <CardBody>
        <Box className="badge-box">{date}</Box>
        <Heading size="md">{title}</Heading>
        <Heading size="sm" color="#484848" fontWeight={400} mt={2}>
          {ministry}
        </Heading>
        <Text fontSize="md" mt={2}>
          {amount}
        </Text>
        <Flex alignItems="center" mt={2} mb={2}>
          {categories.map((category, index) => (
            <Box key={index} className="category-box" mr={2}>
              {category}
            </Box>
          ))}
        </Flex>
        <Text mt={4}>{description}</Text>
      </CardBody>
      <Flex
        align="center"
        justify="center"
        width="100%"
        pt={2}
        mb={4}
        fontWeight={400}
      >
        <Link className="text-blue" as={RouterLink} to={"/benefitsdetails"}>
          View Details <ArrowForwardIcon />
        </Link>
      </Flex>
    </Card>
  );
};

export default BenefitCard;
