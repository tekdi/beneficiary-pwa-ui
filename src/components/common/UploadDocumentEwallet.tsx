import React, { useEffect, useRef } from "react";
import OutlineButton from "./button/OutlineButton";
import { processDocuments } from "../../utils/jsHelper/helper";
import { uploadUserDocuments } from "../../services/user/User";
const VITE_EWALLET_ORIGIN = import.meta.env.VITE_EWALLET_ORIGIN;
const VITE_EWALLET_IFRAME_SRC = import.meta.env.VITE_EWALLET_IFRAME_SRC;
const UploadDocumentEwallet = ({ userId }) => {
  console.log("userId", userId);

  const iframeRef = useRef(null);

  // Function to open the iframe and load the document selector
  const openDocumentSelector = () => {
    if (iframeRef.current) {
      iframeRef.current.style.display = "block"; // Show iframe when button is clicked
    }
  };

  // Listen for messages from the iframe
  useEffect(() => {
    const handleMessage = async (event) => {
      if (event.origin === VITE_EWALLET_ORIGIN) {
        if (event.data.type === "selected-docs") {
          const payload = processDocuments(event.data.data, userId);
          console.log("updated data", payload);
          const result = uploadUserDocuments(payload);
          console.log("result", result);
          if (iframeRef.current) {
            iframeRef.current.style.display = "none"; // Hide iframe after selection
          }
        }
      } else {
        console.warn("Untrusted message origin:", event.origin);
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  return (
    <div>
      {/* Close button to hide iframe */}

      {/* Upload Missing Document Button */}
      <OutlineButton
        label="Upload Missing Document"
        onClick={openDocumentSelector}
      />

      {/* Iframe to select documents */}
      <iframe
        ref={iframeRef}
        src={VITE_EWALLET_IFRAME_SRC}
        title="Document Selector"
        style={{
          width: "100%", // Ensure iframe takes up full width of its container
          height: "100%", // Ensure iframe takes up full height of its container
          position: "fixed", // Absolutely position the iframe within the container
          top: 0,
          left: 0,
          border: "none",
          zIndex: 999, // Ensure iframe is on top
          display: "none", // Initially hidden, will be shown on button click
        }}
      />
    </div>
  );
};

export default UploadDocumentEwallet;
