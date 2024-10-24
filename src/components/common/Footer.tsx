import React from "react";
import { Box, Center, Grid, Image } from "@chakra-ui/react";
import { MdOutlineHome } from "react-icons/md";
import { MdManageSearch } from "react-icons/md";
import { PiFiles } from "react-icons/pi";

const Footer: React.FC = () => {
  return (
    <Box
      bg="#EDEFFF"
      p="4"
      borderRadius="lg"
      shadow="lg"
      borderWidth="1px"
      background="#fff"
      position={"absolute"}
      bottom={0}
      width="550px"
    >
      <Grid templateColumns="repeat(3, 1fr)" gap={4}>
        <Box>
          <Center flexDirection="column">
            <Box>
              <MdOutlineHome size={"24px"} />
            </Box>
            <Box mt={1}>Home</Box>
          </Center>
        </Box>
        <Box>
          <Center flexDirection="column">
            <Box>
              <MdManageSearch size={"24px"} />
            </Box>

            <Box mt={1}>Search</Box>
          </Center>
        </Box>
        <Box>
          <Center flexDirection="column">
            <Box>
              <PiFiles size={"24px"} />
            </Box>
            <Box mt={1}>My Applications</Box>
          </Center>
        </Box>
      </Grid>
    </Box>
  );
};

export default Footer;
