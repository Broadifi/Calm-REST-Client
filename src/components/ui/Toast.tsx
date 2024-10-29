import React from "react";
import { CheckCircle, X, AlertCircle } from "lucide-react";

export type ToastType = "success" | "error";

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-slide-up">
      <div
        className={`
        flex items-center gap-2 
        bg-white dark:bg-gray-800 
        border border-gray-200 dark:border-gray-700
        rounded-lg 
        shadow-lg dark:shadow-lg dark:shadow-black/20
        px-4 py-3
        backdrop-blur-sm 
        ${
          type === "success"
            ? "border-l-4 border-l-green-500 dark:border-l-green-400"
            : "border-l-4 border-l-red-500 dark:border-l-red-400"
        }
      `}
      >
        {type === "success" ? (
          <CheckCircle className="w-5 h-5 text-green-500 dark:text-green-400" />
        ) : (
          <AlertCircle className="w-5 h-5 text-red-500 dark:text-red-400" />
        )}
        <span className="text-gray-700 dark:text-gray-200">{message}</span>
        <button
          onClick={onClose}
          className="ml-2 p-1.5 
            hover:bg-gray-100 dark:hover:bg-gray-700
            rounded-full
            transition-colors duration-200
            focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500"
          aria-label="Close notification"
        >
          <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
        </button>
      </div>
    </div>
  );
};

export default Toast;
