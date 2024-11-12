// BenefitsDetails.tsx

import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Text,
  UnorderedList,
  ListItem,
  useDisclosure,
  HStack,
  Icon,
  Spinner,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";
import "../../assets/styles/App.css";
import { useNavigate, useParams } from "react-router-dom";
import CommonButton from "../../components/common/button/Button";
import Layout from "../../components/common/layout/Layout";
import { getTokenData } from "../../services/auth/asyncStorage";
import { getUser } from "../../services/auth/auth";
import {
  applyApplication,
  confirmApplication,
  createApplication,
  getApplication,
  getOne,
} from "../../services/benefit/benefits";
import { MdCurrencyRupee } from "react-icons/md";
import ConfirmationDialog from "../../components/ConfirmationDialog";
import WebViewFormSubmitWithRedirect from "../../components/WebView";

const BenefitsDetails: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [context, setContext] = useState({});
  // const [visibleDialog, setVisibleDialog] = useState(false);
  const [item, setItem] = useState();
  const [loading, setLoading] = useState(true);
  const [isApplied, setIsApplied] = useState(false);
  const [error, setError] = useState("");
  const [authUser, setAuthUser] = useState();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [webFormProp, setWebFormProp] = useState({});

  const handleConfirmation = async () => {
    setLoading(true);
    try {
      const result = await applyApplication({ id, context });
      setWebFormProp({
        url: result?.data?.responses?.[0]?.message?.order?.items?.[0]?.xinput
          ?.form?.url,
        formData: authUser,
      });
      // setLoading(false);
    } catch (error) {
      setError(`Failed to apply application: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  const submitConfirm = async (submission_id: string) => {
    setLoading(true);
    try {
      const result = await confirmApplication({
        submission_id,
        item_id: id,
        context,
      });
      const orderId = result?.data?.responses?.[0]?.message?.order?.id;

      if (orderId) {
        const payload = {
          user_id: authUser?.user_id,
          benefit_id: id,
          benefit_provider_id: context?.bpp_id,
          benefit_provider_uri: context?.bap_uri,
          external_application_id: orderId,
          application_name: item?.descriptor?.name,
          status: "submitted",
          application_data: authUser,
        };

        const appResult = await createApplication(payload);

        if (appResult) {
          setWebFormProp({});
        }
      } else {
        setError(
          "Error while creating application. Please try again later. (Status code 500)"
        );
      }
    } catch (e: any) {
      setError(`Error: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };
  useEffect(() => {
    let mounted = true;
    const init = async () => {
      try {
        const { sub } = await getTokenData();
        const user = await getUser(sub);
        const result = await getOne({ id });

        const resultItem =
          result?.data?.responses?.[0]?.message?.order?.items?.[0] || {};
        setContext(result?.data?.responses?.[0]?.context);

        const docs = resultItem?.tags
          ?.find((e) => e?.descriptor?.code == "required-docs")
          ?.list.filter((e) => e.value)
          .map((e) => e.value);
        if (mounted) {
          setItem({ ...resultItem, document: docs });

          const formData = {
            ...(user?.data || {}),
            class: user?.data?.current_class || "",
            marks_previous_class: user?.data?.previous_year_marks || "",
            phone_number: user?.data?.phone_number || "",
          };
          setAuthUser(formData);

          const appResult = await getApplication({
            user_id: formData?.user_id,
            benefit_id: id,
          });

          if (appResult?.data?.applications?.length > 0) {
            setIsApplied(true);
          }
          setLoading(false);
        }
      } catch (e) {
        if (mounted) {
          setError(
            `Error: ${
              e instanceof Error ? e.message : "Unknown error occurred"
            }`
          );
        }
      }
    };
    init();
    return () => {
      mounted = false;
    };
  }, [id]);
  if (loading) {
    return (
      <Box
        display="flex"
        flex="1"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Spinner size="xl" />
      </Box>
    );
  }
  if (error) {
    return (
      <Modal isOpen={true} onClose={() => setError("")}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Error</ModalHeader>
          <ModalBody>
            <Text>{error}</Text>
          </ModalBody>
          <ModalFooter>
            <CommonButton onClick={() => setError("")} label="Close" />
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  }
  if (webFormProp?.url) {
    return (
      <WebViewFormSubmitWithRedirect
        {...webFormProp}
        formData={webFormProp?.formData}
        setPageContent={submitConfirm}
      />
    );
  }
  return (
    <Layout
      _heading={{
        heading: `${item?.descriptor?.name}`,
        handleBack,
      }}
    >
      <Box className="card-scroll invisible_scroll">
        <Box maxW="2xl" m={4}>
          <Heading size="md" color="#484848" fontWeight={500} mt={2}>
            Benefits
          </Heading>
          <HStack
            align="center"
            flexDirection={"row"}
            alignItems={"center"}
            mt={1.5}
          >
            <Icon as={MdCurrencyRupee} boxSize={5} color="#484848" />
            <Text fontSize="16px" marginLeft="1">
              {item?.price?.value}
            </Text>
            <Text fontSize="16px" marginLeft="1">
              {item?.price?.currency}
            </Text>
          </HStack>
          <Heading size="md" color="#484848" fontWeight={500} mt={6}>
            Details
          </Heading>
          <Text mt={4}> {item?.descriptor?.long_desc}</Text>
          {/* <Heading size="md" color="#484848" fontWeight={500} mt={6}>
            Objectives of the Pre-matric Scholarship-ST:
          </Heading>
          <UnorderedList mt={4}>
            <ListItem>
              Provide financial assistance to ST students in Classes 9 and 10 to
              encourage continued education.
            </ListItem>
            <ListItem>
              Support low-income families by reducing the financial burden of
              schooling.
            </ListItem>
            <ListItem>
              Promote equal educational opportunities for students with
              disabilities through higher financial aid.
            </ListItem>
          </UnorderedList> */}
          <Heading size="md" color="#484848" fontWeight={500} mt={6}>
            Mandatory Documents:
          </Heading>
          <UnorderedList mt={4}>
            {item?.document?.map((document) => (
              <ListItem key={document}>{document}</ListItem>
            ))}
          </UnorderedList>
          <Box m={4}>
            <CommonButton
              onClick={onOpen}
              label={
                isApplied ? "Application Already Submitted" : "Proceed To Apply"
              }
              isDisabled={isApplied}
            />
          </Box>
          <Box height={"55px"}></Box>
        </Box>
      </Box>

      <ConfirmationDialog
        dialogVisible={isOpen}
        closeDialog={onClose}
        handleConfirmation={handleConfirmation}
        documents={item.document}
      />
    </Layout>
  );
};

export default BenefitsDetails;
