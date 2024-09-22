import React, { useRef } from "react";

import placeholderImage from "@/assets/images/placeholder.jpg";
import { espnOrigin } from "@/utils/constants";

const imgOriginStr = "https://p.imgci.com";
function Img({
  usePlaceholderImageOnError = false,
  isEspnImage = false,
  src,
  alt,
  onError,
  ...props
}) {
  if (!src) src = "";

  const usingEspnOrigin = useRef(false);
  if (isEspnImage) {
    if (usingEspnOrigin.current) {
      src = src.replace(imgOriginStr, "");
      src = espnOrigin + src;
    } else src = imgOriginStr + src;
  }

  function handleError(e) {
    if (isEspnImage && !usingEspnOrigin.current) {
      src = src.replace(imgOriginStr, "");
      src = espnOrigin + src;
      e.target.src = src;
      usingEspnOrigin.current = true;
    } else if (usePlaceholderImageOnError) e.target.src = placeholderImage;
    else if (onError) onError(e);
  }

  return <img src={src} alt={alt || ""} onError={handleError} {...props} />;
}

export default Img;
