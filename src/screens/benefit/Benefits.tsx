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
import { getUser } from "../../services/auth/auth";
import { getAll } from "../../services/benefit/benefits";
import { Castes, IncomeRange } from "../../assets/mockdata/FilterData";

// Define types for benefit data and filter structure
interface Benefit {
  item_id: number;
  title: string;
  provider_name: string;
  description: string;
  item: {
    price?: {
      value?: number;
      currency?: string;
    };
    tags: { list?: string[] }[];
    time?: {
      range?: {
        end?: string;
      };
    };
  };
}
interface Filter {
  "caste-eligibility"?: string;
  annualIncome?: string;
  [key: string]: string | undefined; // This allows any string key to be used
}
const ExploreBenefits: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");
  const [filter, setFilter] = useState<Filter>({});
  const [initState, setInitState] = useState<string>("yes");
  const [error, setError] = useState<string | null>(null); // Allow null for error state
  const [benefits, setBenefits] = useState<Benefit[]>([]); // Use Benefit[] type for benefits

  const handleOpen = () => {};

  useEffect(() => {
    const init = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (token) {
          const user = await getUser();

          const filters: Filter = {
            "caste-eligibility": user?.data?.caste,
            annualIncome: user?.data?.annualIncome,
          };

          const newFilter: Filter = {};
          Object.keys(filters).forEach((key) => {
            if (filters[key] && filters[key] !== "") {
              newFilter[key] = filters[key]?.toLowerCase() || filters[key];
            }
          });

          setFilter(newFilter);
        }
        setInitState("no");
      } catch (e) {
        setError(`Failed to initialize user data: ${(e as Error).message}`);
        setInitState("no");
      }
    };
    init();
  }, []);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try {
        if (initState === "no") {
          const result = await getAll({
            filters: {
              ...filter,
              annualIncome: filter?.["annualIncome"]
                ? `0-${filter?.["annualIncome"]}`
                : "",
            },
            search,
          });

          setBenefits(result?.data?.ubi_network_cache || []);
        }
      } catch (e) {
        setError(`Failed to fetch benefits: ${(e as Error).message}`);
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
        setFilter: setFilter,
        onSearch: setSearch,
        inputs: [
          {
            label: "Caste",
            data: Castes,
            value: filter?.["caste-eligibility"]?.toLowerCase() || "",
            key: "caste-eligibility",
          },
          {
            label: "Income Range",
            data: IncomeRange,
            value: filter?.["annualIncome"] || "",
            key: "annualIncome",
          },
        ],
      }}
      isSearchbar={true}
      isMenu={Boolean(localStorage.getItem("authToken"))}
    >
      {error && (
        <Modal isOpen={!!error} onClose={() => setError(null)}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Error</ModalHeader>
            <ModalBody>
              <Text>{error}</Text>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" onClick={() => setError(null)}>
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
          {benefits.map((benefit) => (
            <BenefitCard item={benefit} key={benefit.item_id} />
          ))}
        </Box>
      )}
    </Layout>
  );
};

export default ExploreBenefits;
