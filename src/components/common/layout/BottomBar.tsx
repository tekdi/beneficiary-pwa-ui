import React from "react";
import { Box, Flex, IconButton, Text } from "@chakra-ui/react";
import { FaFileAlt } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { MdHome } from "react-icons/md";
import { HiDocumentSearch } from "react-icons/hi";
const BottomBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const getTabColor = (path: string) => {
    return location.pathname === path ? "#3C5FDD" : "#433E3F";
  };

  return (
    <Box
      bg="#EDEFFF"
      borderRadius="lg"
      shadow="lg"
      borderWidth="1px"
      background="#fff"
      position="absolute"
      bottom={0}
      left="50%"
      transform="translateX(-50%)"
      width="100%"
      maxW="550px"
      height="85px"
      paddingBottom="8"
    >
      <Flex justify="space-around" align="center" py={2}>
        <Flex
          direction="column"
          align="center"
          onClick={() => handleNavigation("/userprofile")}
        >
          <IconButton
            aria-label="Home"
            icon={<MdHome />}
            fontSize="29px"
            variant="ghost"
            color={getTabColor("/userprofile")}
          />
          <Text fontSize="xs" color={getTabColor("/userprofile")}>
            Home
          </Text>
        </Flex>

        <Flex
          direction="column"
          align="center"
          onClick={() => handleNavigation("/explorebenefits")}
        >
          <IconButton
            aria-label="Search"
            icon={<HiDocumentSearch />}
            fontSize="29px"
            variant="ghost"
            color={getTabColor("/explorebenefits")}
          />
          <Text fontSize="xs" color={getTabColor("/explorebenefits")}>
            Search
          </Text>
        </Flex>

        <Flex
          direction="column"
          align="center"
          onClick={() => handleNavigation("/applicationstatus")}
        >
          <IconButton
            aria-label="Applications"
            icon={<FaFileAlt />}
            fontSize="24px"
            variant="ghost"
            color={getTabColor("/applicationstatus")}
          />
          <Text fontSize="xs" color={getTabColor("/applicationstatus")}>
            My Applications
          </Text>
        </Flex>
      </Flex>
    </Box>
  );
};

export default BottomBar;
