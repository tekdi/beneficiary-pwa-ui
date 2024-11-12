import React, { useState } from "react";
import {
  Input,
  InputGroup,
  InputRightElement,
  IconButton,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder = "Search By Name",
}) => {
  const [query, setQuery] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = event.target.value;
    setQuery(newQuery);
  };

  const handleSearchClick = () => {
    onSearch(query);
  };

  return (
    <InputGroup>
      <Input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={handleChange}
        borderRadius={28}
        h="12"
        bg="#E9E7EF"
        m="4"
        mt="3"
        aria-label="Search input"
      />

      <InputRightElement h={55} margin={4} mr={6} mt={2}>
        <IconButton
          icon={<SearchIcon />}
          aria-label="Search"
          onClick={handleSearchClick}
          bg="transparent"
          _hover={{ bg: "transparent" }}
          _focus={{ outline: "none" }}
        />
      </InputRightElement>
    </InputGroup>
  );
};

export default SearchBar;
