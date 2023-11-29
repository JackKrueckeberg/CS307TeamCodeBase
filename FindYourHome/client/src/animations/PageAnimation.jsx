import React from "react";
import { motion } from "framer-motion";
import { useNavigationContext } from "../contexts/NavigationContext";

const animation = {
    initial: { opacity: 0},
    animate: { opacity: 1},
    exit: { opacity: 0},
  };
  

  const PageAnimation = ({ children }) => {
    const { isNavigated } = useNavigationContext();
  
    return (
      <motion.div
        variants={isNavigated ? animation : {}}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 1 }}
      >
        {children}
      </motion.div>
    );
  };

export default PageAnimation;