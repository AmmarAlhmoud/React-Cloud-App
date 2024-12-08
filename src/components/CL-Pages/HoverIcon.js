import React from "react";
import { motion } from "framer-motion";

import styels from "./HoverIcon.module.css";

const HoverIcon = ({ id, className, src, alt, onClick }) => {
  return (
    <motion.img
      id={id}
      whileHover={{
        scale: 1.2,
        cursor: "pointer",
      }}
      transition={{ type: "spring" }}
      className={`${styels.icon} ${className || ""}`}
      src={src}
      alt={alt}
      onClick={onClick}
    />
  );
};

export default HoverIcon;
