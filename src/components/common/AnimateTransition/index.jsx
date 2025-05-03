import { motion, AnimatePresence } from "framer-motion";

export default function AnimateTransition ({ condition, firstComponent, secondComponent }) {
    return <AnimatePresence mode="wait">
    {condition ? (
      <motion.div
        key="firstComponent"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.25 }}
      >
        {firstComponent()}
      </motion.div>
    ) : (
      <motion.div
        key="secondComponent"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.25 }}
      >
        {secondComponent()}
      </motion.div>
    )}
  </AnimatePresence>
}