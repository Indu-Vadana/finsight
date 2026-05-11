import React from 'react';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12, filter: 'blur(4px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.35, ease: [0.23, 1, 0.32, 1] },
  },
};

export function AnimatedList({ children, className }) {
  return (
    <motion.div
      className={className}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {React.Children.map(children, (child) =>
        child ? (
          <motion.div variants={itemVariants}>{child}</motion.div>
        ) : null
      )}
    </motion.div>
  );
}

// Export item variant for direct use in mapped lists
export { itemVariants as listItemVariants, containerVariants as listContainerVariants };
