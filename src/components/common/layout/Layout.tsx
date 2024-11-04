import React from "react";
import { Box, Flex, Spinner } from "@chakra-ui/react";
import Navbar from "./Navbar"; // Import your Navbar component
import HeadingText from "./HeadingText"; // Import your HeadingText component
import BottomBar from "./BottomBar";

interface LayoutProps {
  isScrollable?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  isMenu?: boolean;
  isNavbar?: boolean;
  afterHeader?: React.ReactNode; // Optional: Additional components to render after the header
  _heading?: object; // Optional: Props to pass to HeadingText,
  isBottombar?: boolean;
}

const Layout: React.FC<LayoutProps> = ({
  isScrollable = true,
  loading,
  children,
  isMenu = true,
  isNavbar = true,
  afterHeader,
  _heading = {},
  isBottombar = true,
}) => {
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center">
        <Spinner size="lg" />
      </Box>
    );
  }

  return (
    <Box>
      <Box className="main-bg">
        <Flex
          height="100vh"
          alignItems="center"
          justifyContent="center"
          position="relative"
        >
          <Box
            width="550px"
            height="100vh"
            borderRadius="lg"
            shadow="lg"
            background="#fff"
            className="layout"
            position="relative"
            overflow="hidden"
          >
            {isNavbar && (
              <>
                <Navbar isMenu={isMenu} />
                <HeadingText {..._heading} />
                {afterHeader}
              </>
            )}
            <Box overflow={isScrollable ? "auto" : "hidden"} flex="1">
              {children}
            </Box>
            {isBottombar && <BottomBar />}
          </Box>
        </Flex>
      </Box>
    </Box>
  );
};

export default Layout;
