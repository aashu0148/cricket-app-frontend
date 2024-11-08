import React, { useEffect, useRef, useState } from "react";

import userProfileIcon from "@/assets/profile-icon.png";
import placeholderImage from "@/assets/images/placeholder.jpg";

const imageOrigins = {
  o1: "https://img1.hscicdn.com/image/upload",
  o2: "https://p.imgci.com",
};
function Img({
  usePlaceholderImageOnError = false,
  usePLaceholderUserImageOnError = false,
  isEspnImage = false,
  src,
  alt,
  onError,
  ...props
}) {
  if (!src) src = "";

  const originsUsed = useRef({
    o1: isEspnImage ? true : false,
    o2: false,
  });
  const [imageSrc, setImageSrc] = useState(
    isEspnImage ? imageOrigins.o1 + src : src
  );

  const computeImageOnError = () => {
    let newSrc = imageSrc || "";

    if (isEspnImage && !originsUsed.current.o2) {
      newSrc = newSrc.replace(imageOrigins.o1, "");
      newSrc = imageOrigins.o2 + newSrc;
      originsUsed.current.o2 = true;
    } else if (usePLaceholderUserImageOnError) newSrc = userProfileIcon;
    else if (usePlaceholderImageOnError) newSrc = placeholderImage;
    else if (onError) onError(e);

    setImageSrc(newSrc);
  };

  return (
    <img
      src={imageSrc}
      alt={alt || ""}
      onError={computeImageOnError}
      {...props}
    />
  );
}

export default Img;
