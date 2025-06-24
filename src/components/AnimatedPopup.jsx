"use client";

import { X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";

const AnimatedPopup = ({ show, message, onClose }) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ x: -100, y: 100, opacity: 0 }}
          animate={{ x: 0, y: 0, opacity: 1 }}
          exit={{ x: -100, y: 100, opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="fixed bottom-6 left-6 z-50 bg-black text-white-50 px-6 py-4 rounded-xl shadow-lg"
        >
          <div>
            <span>{message}</span>
            <button
              onClick={onClose}
              className="text-white-50 hover:opacity-60"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AnimatedPopup;