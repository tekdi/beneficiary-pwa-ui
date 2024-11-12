import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import BenefitCard from "../../components/common/Card";
import Layout from "../../components/common/layout/Layout";
import { getTokenData } from "../../services/auth/asyncStorage";
import { getUser } from "../../services/auth/auth";
import { getAll } from "../../services/benefit/benefits";

const ExploreBenefits: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [search] = useState("");
  const [filter, setFilter] = useState({});
  const [initState, setInitState] = useState("yes");
  const [error, setError] = useState("");
  const handleOpen = () => {};
  const [benefits, setBenefits] = useState([]);

  useEffect(() => {
    const init = async () => {
      try {
        const { sub } = await getTokenData();
        const user = await getUser(sub);

        const filters = {
          "social-eligibility": user?.data?.caste,
          "ann-hh-inc": user?.data?.income,
          "gender-eligibility": user?.data?.gender,
        };
        const newFilter = {};
        Object.keys(filters).forEach((key) => {
          if (filters[key] && filters[key] !== "") {
            if (typeof filters[key] === "string") {
              newFilter[key] = filters[key].toLowerCase();
            } else {
              newFilter[key] = filters[key];
            }
          }
        });
        setFilter(newFilter);
        setInitState("no");
      } catch (e) {
        setError(`Failed to initialize user data: ${e.message}`);
        setInitState("no");
      }
    };
    init();
  }, []);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try {
        if (initState == "no") {
          const result = await getAll({
            // filters: {
            //   ...filter,
            //   "ann-hh-inc": filter?.["ann-hh-inc"]
            //     ? `0-${filter?.["ann-hh-inc"]}`
            //     : "",
            // },
            search,
          });

          setBenefits(result?.data?.ubi_network_cache || []);

          setLoading(false);
        }
      } catch (e) {
        setError(`Failed to fetch benefits: ${e.message}`);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [filter, search, initState]);
  return (
    <Layout
      loading={loading}
      _heading={{
        heading: "Browse Benefits",
        isFilter: true,
        handleOpen: handleOpen,
      }}
    >
      {error && (
        <Modal isOpen={!!error} onClose={() => setError("")}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Error</ModalHeader>
            <ModalBody>
              <Text>{error}</Text>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" onClick={() => setError("")}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
      {benefits.length === 0 ? (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          padding={5}
          height="200px"
          bg="#F7F7F7"
          borderRadius="md"
        >
          <Text fontSize="lg" color="gray.600">
            No benefits available
          </Text>
        </Box>
      ) : (
        <Box className="card-scroll">
          {benefits?.map((scholarship) => {
            return (
              <BenefitCard item={scholarship} key={scholarship?.item_id} />
            );
          })}
        </Box>
      )}

      <Box m={4}>
        <Button className="custom-btn" type="submit" mt={4} width="100%">
          Load More
        </Button>
      </Box>

      {/* <Modal
        isCentered
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader className="border-bottom">
            <Box className="heading">Filters</Box>
          </ModalHeader>
          <Divider />

          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FloatingSelect
                label="Education level"
                name="name"
                value={formData.name}
                onChange={handleChange}
                options={options}
              />
              <FloatingSelect
                label="Gender"
                name="name"
                value={formData.name}
                onChange={handleChange}
                options={options}
              />
              <FloatingSelect
                label="Annual Income"
                name="name"
                value={formData.name}
                onChange={handleChange}
                options={options}
              />
              <FloatingSelect
                label="Benefit Amount"
                name="name"
                value={formData.name}
                onChange={handleChange}
                options={options}
              />
              <FloatingSelect
                label="Subject"
                name="name"
                value={formData.name}
                onChange={handleChange}
                options={options}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <CommonButton label="Apply Filters" />
          </ModalFooter>
        </ModalContent>
      </Modal> */}
    </Layout>
  );
};

export default ExploreBenefits;
