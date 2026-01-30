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

  const rawSrc = props.src ?? "";
  const isAbsolute =
    /^https?:\/\//i.test(rawSrc) ||
    rawSrc.startsWith("//") ||
    rawSrc.startsWith("data:") ||
    rawSrc.startsWith("blob:");
  const shouldUpgrade =
    isAbsolute &&
    /^http:\/\//i.test(rawSrc) &&
    typeof window !== "undefined" &&
    window.location.protocol === "https:";
  const normalizedSrc = shouldUpgrade
    ? rawSrc.replace(/^http:\/\//i, "https://")
    : rawSrc;
  const fullSrc = isAbsolute ? normalizedSrc : `${img_path}${rawSrc}`;

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
