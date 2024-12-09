import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Text,
  UnorderedList,
  ListItem,
  HStack,
  Icon,
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
import { getUser, sendConsent } from "../../services/auth/auth";
import {
  applyApplication,
  confirmApplication,
  createApplication,
  getApplication,
  getOne,
} from "../../services/benefit/benefits";
import { MdCurrencyRupee } from "react-icons/md";
import WebViewFormSubmitWithRedirect from "../../components/WebView";
import { useTranslation } from "react-i18next";
import Loader from "../../components/common/Loader";
import { checkEligibilityCriteria } from "../../utils/jsHelper/helper";
import termsAndConditions from "../../assets/termsAndConditions.json";
import CommonDialogue from "../../components/common/Dialogue";

// Define types for benefit item and user
interface BenefitItem {
  descriptor?: {
    name?: string;
    long_desc?: string;
  };
  price?: {
    value?: number;
    currency?: string;
  };
  document?: string[];
  tags?: Array<{
    descriptor?: { code?: string; short_desc: string };
    list?: Array<{ value?: string }>;
  }>;
}
interface FinancialSupportRequest {
  domain: string;
  action: string;
  version: string;
  bpp_id: string;
  bpp_uri: string;
  country: string;
  city: string;
  bap_id: string;
  bap_uri: string;
  transaction_id: string;
  message_id: string;
  ttl: string;
  timestamp: string;
}
interface AuthUser {
  user_id?: string;
  name?: string;
  current_class?: string;
  previous_year_marks?: string;
  phone_number?: string;
  username: string;
  email: string;
}

interface WebFormProps {
  url?: string;
  formData?: {};
  item?: BenefitItem;
}

const BenefitsDetails: React.FC = () => {
  const [context, setContext] = useState<FinancialSupportRequest | null>(null);
  const [item, setItem] = useState<BenefitItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isApplied, setIsApplied] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [webFormProp, setWebFormProp] = useState<WebFormProps>({});
  const [confirmationConsent, setConfirmationConsent] = useState<
    boolean | object
  >(false);
  const [submitDialouge, setSubmitDialouge] = useState<boolean | object>(false);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const [isEligible, setIsEligible] = useState<any[]>();

  const handleConfirmation = async () => {
    if (isEligible?.length > 0) {
      setError(
        `You cannot proceed further because the criteria are not matching, such as ${isEligible.join(
          ", "
        )}.`
      );
    } else {
      setLoading(true);
      const result = await applyApplication({ id, context });
      const url = (result as { data: { responses: Array<any> } }).data
        ?.responses?.[0]?.message?.order?.items?.[0]?.xinput?.form?.url;
      const formData = authUser ?? undefined; // Ensure authUser is used or fallback to undefined
      setLoading(false);
      // Only set WebFormProps if the url exists
      if (url) {
        setWebFormProp({
          url,
          formData,
        });
      } else {
        setError("URL not found in response");
      }
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    let mounted = true;
    const init = async () => {
      try {
        const result = await getOne({ id });
        const resultItem =
          (result as { data: { responses: Array<any> } }).data?.responses?.[0]
            ?.message?.order?.items?.[0] || {};
        setContext(
          (result as { data: { responses: Array<any> } }).data?.responses?.[0]
            ?.context as FinancialSupportRequest
        );

        const docs =
          resultItem?.tags
            ?.find(
              (e: { descriptor: { code: string } }) =>
                e?.descriptor?.code === "required-docs"
            )
            ?.list?.filter((e: { value: unknown }) => e.value)
            .map((e: { value: unknown }) => e.value) || [];
        if (mounted) {
          setItem({ ...resultItem, document: docs });

          const token = localStorage.getItem("authToken");
          if (token) {
            const user = await getUser();
            const eligibilityArr = [];
            if (Array.isArray(resultItem?.tags)) {
              resultItem?.tags?.forEach((e: any) => {
                if (e?.descriptor?.code === "@eligibility") {
                  if (Array.isArray(e.list)) {
                    e.list.forEach((item: any) => {
                      const code = item?.descriptor?.code;
                      try {
                        const valueObj = JSON.parse(item.value || "{}");
                        const payload = {
                          ...valueObj,
                          value: user?.data?.[code],
                        };
                        const result = checkEligibilityCriteria(payload);
                        if (!result) {
                          eligibilityArr.push(code);
                        }
                      } catch (error) {
                        console.error(
                          `Failed to parse eligibility criteria: ${error}`
                        );
                        eligibilityArr.push(code);
                      }
                    });
                  }
                }
              });
            }
            setIsEligible(
              eligibilityArr.length > 0 ? eligibilityArr : undefined
            );
            setAuthUser(user?.data || {});
            const appResult = await getApplication({
              user_id: user?.data?.user_id,
              benefit_id: id,
            });

            if (appResult?.data?.applications?.length > 0) {
              setIsApplied(true);
            }
          }
          setLoading(false);
        }
      } catch (e: unknown) {
        if (mounted) {
          if (e instanceof Error) {
            setError(`Error: ${e.message}`);
          } else {
            setError("An unexpected error occurred");
          }
        }
        setLoading(false);
      }
    };
    init();
    return () => {
      mounted = false;
    };
  }, [id]);

  const submitConfirm = async (payload) => {
    const confirmPayload = {
      submission_id: payload?.submit.submission_id,
      item_id: payload?.submit.application_id,
      benefit_id: id,
      context: context,
    };
    setLoading(true);
    try {
      const result = await confirmApplication(confirmPayload);
      const orderId = (
        result as {
          data: { responses: { message: { order: { id: string } } }[] };
        }
      )?.data?.responses?.[0]?.message?.order?.id;
      if (orderId) {
        const payloadCreateApp = {
          user_id: authUser?.user_id,
          benefit_id: id,
          benefit_provider_id: context?.bpp_id,
          benefit_provider_uri: context?.bap_uri,
          external_application_id: orderId,
          application_name: item?.descriptor?.name,
          status: "submitted",
          application_data: payload?.userData,
        };

        await createApplication(payloadCreateApp);
        setSubmitDialouge({ orderId, name: item?.descriptor?.name });
        setWebFormProp({});
      } else {
        setError("Error while creating application. Please try again later");
      }
    } catch (e) {
      if (e instanceof Error) {
        setError(`Error: ${e.message}`);
      } else {
        setError("An unexpected error occurred");
      }
    }
    setLoading(false);
  };

  if (loading) {
    return <Loader />;
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
  if (webFormProp?.url && webFormProp?.formData) {
    return (
      <WebViewFormSubmitWithRedirect
        {...webFormProp}
        context={context}
        item={item}
        submitConfirm={submitConfirm}
      />
    );
  }
  const closeDialog = async () => {
    try {
      await sendConsent(authUser?.user_id, `${id}`, `Application for ${id}`);

      setConfirmationConsent(false);
      navigate("/applicationStatus");
    } catch {
      console.log("Error sending consent");
    }
  };
  const handleRedirect = () => {
    // setSubmitDialouge(false);
    navigate("/applicationStatus");
  };
  return (
    <Layout
      _heading={{ heading: item?.descriptor?.name || "", handleBack }}
      isMenu={Boolean(localStorage.getItem("authToken"))}
    >
      <Box className="card-scroll invisible_scroll">
        <Box maxW="2xl" m={4}>
          <Heading size="md" color="#484848" fontWeight={500}>
            {t("BENEFIT_DETAILS_HEADING_TITLE")}
          </Heading>
          <HStack mt={2}>
            <Icon as={MdCurrencyRupee} boxSize={5} color="#484848" />
            <Text>{item?.price?.value}</Text>
            {/* <Text>{item?.price?.currency}</Text> */}
          </HStack>
          <Heading size="md" mt={6} color="#484848" fontWeight={500}>
            {t("BENEFIT_DETAILS_HEADING_DETAILS")}
          </Heading>

          {item?.descriptor?.long_desc !== "" && (
            <Text mt={4}>{item?.descriptor?.long_desc}</Text>
          )}

          <Heading size="md" mt={6} color="#484848" fontWeight={500}>
            {t("BENEFIT_DETAILS_KEYPOINT_DETAILS")}
          </Heading>
          <UnorderedList mt={4}>
            {item?.tags
              ?.filter((tag) => ["@eligibility"].includes(tag.descriptor?.code))
              .map((tag, index) => (
                <ListItem key={"detail" + index}>
                  {tag.descriptor?.short_desc}
                </ListItem>
              ))}
          </UnorderedList>
          <Heading size="md" mt={6} color="#484848" fontWeight={500}>
            {t("BENEFIT_DETAILS_MANDATORY_DOCUMENTS")}
          </Heading>
          <UnorderedList mt={4}>
            {item?.document?.map((document) => (
              <ListItem key={document}>{document}</ListItem>
            ))}
          </UnorderedList>
          {localStorage.getItem("authToken") ? (
            <CommonButton
              mt={6}
              onClick={handleConfirmation}
              label={
                isApplied
                  ? t("BENEFIT_DETAILS_APPLICATION_SUBMITTED")
                  : t("BENEFIT_DETAILS_PROCEED_TO_APPLY")
              }
              isDisabled={isApplied}
            />
          ) : (
            <CommonButton
              mt={6}
              onClick={() => {
                localStorage.setItem("redirectUrl", window.location.href);
                navigate("/signin");
              }}
              label={t("BENEFIT_DETAILS_LOGIN_TO_APPLY")}
            />
          )}
        </Box>
      </Box>
      <CommonDialogue
        isOpen={confirmationConsent}
        onClose={closeDialog}
        termsAndConditions={termsAndConditions}
        handleDialog={handleConfirmation}
      />
      <CommonDialogue
        isOpen={submitDialouge}
        onClose={handleRedirect}
        handleDialog={handleRedirect}
      />
      {/* <ConfirmationDialog
        dialogVisible={isOpen}
        closeDialog={onClose}
        handleConfirmation={handleConfirmation}
        // documents={item?.document}
      />

      <SubmitDialog
        dialogVisible={
          confirmationConsent as { name?: string; orderId?: string }
        }
        closeSubmit={setConfirmationConsent}
      /> */}
    </Layout>
  );
};

export default BenefitsDetails;
