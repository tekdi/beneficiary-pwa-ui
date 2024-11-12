import React from "react";
import { Box, Flex, Spinner } from "@chakra-ui/react";
import Navbar from "./Navbar"; // Import your Navbar component
import HeadingText from "./HeadingText"; // Import your HeadingText component
import BottomBar from "./BottomBar";
import SearchBar from "./SearchBar";

interface LayoutProps {
  isScrollable?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  isMenu?: boolean;
  isNavbar?: boolean;
  afterHeader?: React.ReactNode;
  _heading?: {
    heading?: string;
    isFilter?: boolean;
    handleOpen?: () => void;
    onSearch?: (query: string) => void;
  };
  isBottombar?: boolean;
  isSearchbar?: boolean;
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
  isSearchbar = false,
}) => {
  const { onSearch } = _heading;

  // if (loading) {
  //   return (
  //     <Box display="flex" justifyContent="center" alignItems="center">
  //       <Spinner size="lg" />
  //     </Box>
  //   );
  // }

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
                {isSearchbar && onSearch && <SearchBar onSearch={onSearch} />}
                {afterHeader}
              </>
            )}
            {loading ? (
              <Flex align="center" justify="center" height="100vh" bg="#F7F7F7">
                <Spinner size="xl" color="teal.500" />
              </Flex>
            ) : (
              <Box overflow={isScrollable ? "auto" : "hidden"} flex="1">
                {children}
              </Box>
            )}

            {isBottombar && <BottomBar />}
          </Box>
        </Flex>
      </Box>
    </Box>
  );
};

export default Layout;
