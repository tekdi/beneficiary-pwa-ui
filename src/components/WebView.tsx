import { Box } from "@chakra-ui/react";
// import axios from "axios";
import { useEffect, useRef, useState } from "react";
import Loader from "./common/Loader";
import Layout from "./common/layout/Layout";
import { useNavigate, useParams } from "react-router-dom";
import { transformData } from "../utils/jsHelper/helper";
import {
  confirmApplication,
  createApplication,
} from "../services/benefit/benefits";
import SubmitDialog from "./SubmitDialog";
// import { getUser } from "../services/auth/auth";
interface FormData {
  user_id?: string;
  name?: string;
  current_class?: string;
  previous_year_marks?: string;
  phone_number?: string;
  username?: string;
  email?: string;
}
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
interface WebViewFormSubmitWithRedirectProps {
  url?: string;
  formData?: FormData;
  context?: FinancialSupportRequest;
  item?: BenefitItem;
  setPageContent?: (content: string) => void;
}

interface PrefillData {
  firstName: string;
  middleName: string;
  lastName: string;
  gender: string;
  class: string; // You can specify an enum or union type if you have predefined classes
  annualIncome: string; // You can specify types for certificates, if needed
  caste: string; // Same as annualIncome
  disabled: string; // Assuming it is "yes" or "no"
  state: string; // Assuming this refers to domicile certificate data
  student: string; // You can define a union type if the values are specific
  identityProof: string | null; // Can be nullable if not provided
  benefit_id: string;
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
  class?: string;
  previousYearMarks?: string;
  phone_number?: string;
  username: string;
  email: string;
}

const WebViewFormSubmitWithRedirect: React.FC<
  WebViewFormSubmitWithRedirectProps
> = ({ url, formData, context, item }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  // const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [confirmationConsent, setConfirmationConsent] =
    useState<unknown>(false);
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      window.postMessage({ type: "FORM_SUBMIT", data: formData }, "*");
      if (event.origin !== import.meta.env.VITE_PROVIDER_URL) {
        return;
      }

      const receivedData = event.data.data;
      if (receivedData) {
        submitConfirm(receivedData);
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  useEffect(() => {
    if (url) {
      // Event listener for iframe load
      const iframeLoadHandler = async () => {
        console.log("Iframe loaded, triggering prefill");
        await sendDataToIframe();
      };

      const iframeElement = iframeRef.current;
      iframeElement?.addEventListener("load", iframeLoadHandler);
      return () => {
        iframeElement?.removeEventListener("load", iframeLoadHandler);
      };
    }
  }, [url, formData]);

  const sendDataToIframe = async () => {
    const prefillData = transformData(formData);

    iframeRef.current.contentWindow.postMessage(prefillData, "*");
  };
  const submitConfirm = async (payload) => {
    const confirmPayload = {
      submission_id: payload?.submit.submission_id,
      item_id: payload?.submit.application_id,
      benefit_id: id,
      context: context,
    };

    const result = await confirmApplication(confirmPayload);
    setIsLoading(true);
    const orderId = (
      result as {
        data: { responses: { message: { order: { id: string } } }[] };
      }
    )?.data?.responses?.[0]?.message?.order?.id;
    if (orderId) {
      const payloadCreateApp = {
        user_id: formData?.user_id,
        benefit_id: id,
        benefit_provider_id: context?.bpp_id,
        benefit_provider_uri: context?.bap_uri,
        external_application_id: orderId,
        application_name: item?.descriptor?.name,
        status: "submitted",
        application_data: payload?.userData,
      };

      await createApplication(payloadCreateApp);
      setIsLoading(false);
      setConfirmationConsent({ orderId, name: item?.descriptor?.name });
    } else {
      console.log("Error while creating application. Please try again later");
    }
  };
  const handleBack = () => {
    navigate(-1);
  };
  return (
    <Layout
      _heading={{
        heading: "Complete Application",
        handleBack,
      }}
    >
      <Box className="card-scroll invisible_scroll">
        {isLoading ? (
          <Loader />
        ) : (
          <iframe
            ref={iframeRef}
            src={url}
            style={{ width: "100%", height: "90vh" }}
            title="Form UI"
          ></iframe>
        )}
      </Box>

      <SubmitDialog
        dialogVisible={
          confirmationConsent as { name?: string; orderId?: string }
        }
        closeSubmit={setConfirmationConsent}
      />
    </Layout>
  );
};

export default WebViewFormSubmitWithRedirect;
