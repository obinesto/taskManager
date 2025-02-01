/* eslint-disable react/prop-types */
import { useEffect, useRef, useCallback } from "react";
import { Camera } from "lucide-react";

const CloudinaryUploadWidget = ({uploadConfig, getSecureUrl}) => {
  const uploadWidgetRef = useRef(null);
  
  const initializeUploadWidget = useCallback(() => {
    if (window.cloudinary) {
      uploadWidgetRef.current = window.cloudinary.createUploadWidget(
        uploadConfig,
        (error, result) => {
          if (error) {
            console.error("Upload error:", error);
          } else if (result?.event === "success") {
            getSecureUrl(result.info.secure_url);
          }
        }
      );
    }
  }, [getSecureUrl, uploadConfig]);
  
  useEffect(() => {
    initializeUploadWidget();
  }, [initializeUploadWidget]);
  
  const handleUploadClick = () => {
    if (uploadWidgetRef.current) {
      uploadWidgetRef.current.open();
    }
  };

  return (
    <button onClick={handleUploadClick} className="flex items-center">
      <Camera className="h-4 w-4" />
    </button>
  );
};

export default CloudinaryUploadWidget;
