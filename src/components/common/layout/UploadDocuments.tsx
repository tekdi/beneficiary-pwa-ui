import {
  Box,
  Button,
  Flex,
  Image,
  List,
  ListIcon,
  ListItem,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { CheckIcon, CloseIcon } from "@chakra-ui/icons";

function UploadDocuments() {
  const [fileName, setFileName] = useState("");

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
      // Handle file upload logic here
    }
  };

  const removeFile = () => {
    setFileName("");
  };
  return (
    <>
      {/* Hidden file input */}
      <input
        type="file"
        id="fileInput"
        onChange={handleFileChange}
        style={{ display: "none" }}
        accept=".json,.xml,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      />

      {/* Styled button that looks like a link */}
      <Box>
        <Button
          as="label"
          htmlFor="fileInput"
          variant="link"
          style={{ color: "var(--theme-color)" }}
          textDecoration="underline"
          fontWeight="normal"
          cursor="pointer"
          padding={0} // Remove default button padding
          mt="6"
        >
          <Image
            src="../../src/assets/images/file_upload.png"
            alt="Upload Documents"
            mr="2"
          />
          Upload
        </Button>
      </Box>
      <Box>
        <Button
          as="label"
          htmlFor="fileInput"
          variant="link"
          style={{ color: "var(--theme-color)" }}
          textDecoration="underline"
          fontWeight="normal"
          cursor="pointer"
          padding={0} // Remove default button padding
          mt="6"
        >
          <Image
            src="../../src/assets/images/file_upload.png"
            alt="Upload Documents"
            mr="2"
          />
          Caste Certificate
        </Button>
      </Box>

      {fileName && (
        <>
          <Flex align={"center"} justifyContent={"space-between"} mt="4" mb="4">
            <Box>
              <List spacing={3}>
                <ListItem>
                  <ListIcon as={CheckIcon} color="var(--theme-color)" />
                  Caste Certificate
                </ListItem>
              </List>
              <Text mt={2}>{fileName}</Text>
            </Box>

            <Box>
              {" "}
              <CloseIcon onClick={removeFile} cursor={"pointer"} />
            </Box>
          </Flex>
        </>
      )}
    </>
  );
}

export default UploadDocuments;
