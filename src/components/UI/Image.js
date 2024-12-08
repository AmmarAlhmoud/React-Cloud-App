import React from "react";

import styels from "./Image.module.css";

function Image({ id, className, src, alt, onMouseEnter, onMouseLeave }) {
  return (
    <img
      id={id}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`${styels.image} ${className}`}
      src={src}
      alt={alt}
      loading="lazy"
    />
  );
}

export default Image;
