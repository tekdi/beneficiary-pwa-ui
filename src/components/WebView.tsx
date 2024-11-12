import { Box, useToast } from "@chakra-ui/react";
import CommonButton from "./common/button/Button";
import { useEffect, useRef } from "react";

const WebViewFormSubmitWithRedirect: React.FC<
  WebViewFormSubmitWithRedirectProps
> = ({ url, formData, setPageContent }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const toast = useToast();

  const handleFormSubmit = () => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage({ type: "submitForm" }, url);
      toast({ title: "Form Submitted", status: "success", duration: 2000 });
    }
  };

  const injectFormData = () => {
    const iframeWindow = iframeRef.current?.contentWindow;
    if (iframeWindow) {
      iframeWindow.postMessage({ type: "injectFormData", data: formData }, url);
    }
  };

  const handleLoad = () => {
    setTimeout(() => {
      injectFormData();
    }, 1000);
  };

  const handleMessage = (event: MessageEvent) => {
    if (event.origin !== new URL(url).origin) return;
    setPageContent(event.data);
  };

  useEffect(() => {
    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  return (
    <Box display="flex" flexDirection="column" alignItems="center" p={4}>
      <iframe
        ref={iframeRef}
        title="Web Form Submission"
        src={url}
        onLoad={handleLoad}
        style={{ width: "100%", height: "80vh", border: "1px solid #ccc" }}
        sandbox="allow-scripts allow-same-origin allow-forms"
      />
      <CommonButton onClick={handleFormSubmit} label="Submit Form" />
    </Box>
  );
};
export default WebViewFormSubmitWithRedirect;
