import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion";

type ScrollToBottomProps = {
  show: boolean;
  onClick: () => void;
};

export default function ScrollToBottom({ show, onClick }: ScrollToBottomProps) {
  if (!show) return null;

  return (
    <motion.button
      onClick={onClick}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.2 }}
      className="fixed bottom-28 right-6 bg-green-500 text-white rounded-full p-3 shadow-lg hover:bg-green-600 active:scale-95 transition"
    >
      <ChevronDown className="w-5 h-5" />
    </motion.button>
  );
}
