import React from "react";

import styels from "./Icon.module.css";

const Icon = ({ className, src, alt }) => {
  return (
    <img className={`${styels.icon} ${className || ""}`} src={src} alt={alt} />
  );
};

export default Icon;
