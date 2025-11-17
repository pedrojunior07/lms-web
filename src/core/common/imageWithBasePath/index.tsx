import React, { useState } from "react";
import { img_path } from "../../../environment";

interface ImageProps {
  className?: string;
  src?: string | null;
  alt?: string;
  height?: number;
  width?: number;
  id?: string;
  fallback?: string; // fallback opcional
  style?: React.CSSProperties; // 👈 adicionado
}

const ImageWithBasePath = (props: ImageProps) => {
  const [error, setError] = useState(false);

  const fullSrc = props.src?.includes("https")
    ? props.src
    : `${img_path}${props.src}`;

  return (
    <img
      className={props.className}
      src={
        error ? props.fallback ?? "/assets/img/course/course-40.jpg" : fullSrc
      }
      height={props.height}
      alt={props.alt ?? "image"}
      width={props.width}
      id={props.id}
      style={props.style} // 👈 repassa o style
      onError={() => setError(true)} // fallback ao falhar
    />
  );
};

export default ImageWithBasePath;
