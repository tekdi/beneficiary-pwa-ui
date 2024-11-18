import { Box, useToast } from "@chakra-ui/react";
import { MutableRefObject, useEffect, useRef } from "react";

import BenefitFormUI from "../screens/benefit/details/DetailsFormUI";
import Layout from "./common/layout/Layout";
import { useNavigate } from "react-router-dom";
interface FormData {
  user_id?: string;
  name?: string;
  current_class?: string;
  previous_year_marks?: string;
  phone_number?: string;
  username?: string;
  email?: string;
}
interface WebViewFormSubmitWithRedirectProps {
  url?: string;
  formData?: FormData;
  setPageContent?: (content: string) => void;
}

const WebViewFormSubmitWithRedirect: React.FC<
  WebViewFormSubmitWithRedirectProps
> = ({ url, formData, setPageContent }) => {
  const formRef = useRef<HTMLFormElement>(null);
  const toast = useToast();
  const navigate = useNavigate();

  const searchForm = async (url: string) => {
    try {
      const response = await fetch(url, { method: "GET" });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const htmlContent = await response.text();
      const container = document.getElementById("formContainer");
      if (container) {
        container.innerHTML = htmlContent;

        const form = container.querySelector("form");
        if (form) {
          (formRef as MutableRefObject<HTMLFormElement | null>).current = form; // Store form reference

          // Autofill form inputs
          const inputElements = form.querySelectorAll("input");
          inputElements.forEach((input) => {
            const inputName = input.getAttribute("name");
            // Provide a default empty object if formData is undefined
            const data = formData || {};
            if (inputName && data[inputName] !== undefined) {
              if (input.type === "checkbox" || input.type === "radio") {
                input.checked = data[inputName] === input.value;
              } else {
                input.value = data[inputName] as string;
              }
            }
          });

          const selectElements = form.querySelectorAll("select");
          selectElements.forEach((select) => {
            const selectName = select.getAttribute("name");
            // Provide a default empty object if formData is undefined
            const data = formData || {};
            if (selectName && data[selectName] !== undefined) {
              const value = data[selectName];
              if (typeof value === "string") {
                select.value = value;
              } else if (
                typeof value === "number" ||
                typeof value === "boolean"
              ) {
                select.value = value.toString();
              } else if (Array.isArray(value) && value.length > 0) {
                select.value = value[0]; // Select the first value if it's an array of strings
              }
            }
          });

          // Hide the submit button inside the form loaded from the URL
          const submitButton = form.querySelector(
            'input[type="submit"], button[type="submit"]'
          ) as HTMLElement;
          if (submitButton) {
            submitButton.style.display = "none";
          }
        }
      }
    } catch (error) {
      const err = error as Error;
      console.error("Error loading form:", err);
      toast({
        title: "Error loading form",
        description: err.message,
        status: "error",
        duration: 3000,
      });
    }
  };

  useEffect(() => {
    if (url) {
      searchForm(url);
    }
  }, [url]);
  const handleBack = () => {
    navigate(-1);
  };
  return (
    <Layout _heading={{ heading: "Complete Application", handleBack }}>
      <Box display="flex" flexDirection="column" alignItems="center" p={4}>
        <Box className="card-scroll invisible_scroll">
          <BenefitFormUI />
        </Box>
      </Box>
    </Layout>
  );
};

export default WebViewFormSubmitWithRedirect;
