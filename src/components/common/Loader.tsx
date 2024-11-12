import { Spinner, Text, VStack } from "@chakra-ui/react";

const Loader = () => {
  return (
    <VStack>
      <Spinner color="var(--theme-color)" />
      <Text color="var(--theme-color)">Loading...</Text>
    </VStack>
  );
};

export default Loader;
