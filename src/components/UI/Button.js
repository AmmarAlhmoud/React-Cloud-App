import React from "react";
import { motion } from "framer-motion";

import styles from "./Button.module.css";

function Button(props) {
  return (
    <motion.button
      id={props.id}
      className={`${styles.btn} ${props.className}`}
      type={props.type || "button"}
      onClick={props.onClick}
      disabled={props.disabled}
      whileHover={{ scale: props.scale || 1.1 }}
      transition={{ type: "spring", stiffness: props.stiffness || 400 }}
      style={props.style}
    >
      {props.children}
    </motion.button>
  );
}

export default Button;
