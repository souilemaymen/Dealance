import React from "react";
import { motion } from "framer-motion";

const Button = ({ children, className, titleClass, onClick }) => {
  return (
    <motion.button
      onClick={onClick}
      className={`cta relative flex items-center group border-none bg-transparent cursor-pointer ${className}`}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <span
        className={`
          hover-underline-animation relative text-white-300 text-sm uppercase 
          tracking-[4px] pl-1 pb-[7px] after:content-[''] 
          after:absolute after:w-full after:scale-x-0 
          after:h-[2px] after:bottom-0 after:left-0 
          after:bg-white-200 after:origin-bottom-right 
          after:transition-transform after:duration-300 
          group-hover:after:scale-x-100 group-hover:after:origin-bottom-left ${titleClass}
        `}
      >
        {children}
      </span>
    </motion.button>
  );
};

export default Button;
