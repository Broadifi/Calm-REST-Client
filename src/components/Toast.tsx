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
    <div className="fixed bottom-4 right-4 flex items-center gap-2 bg-white border rounded-lg shadow-lg px-4 py-3 animate-slide-up">
      {type === "success" ? (
        <CheckCircle className="w-5 h-5 text-green-500" />
      ) : (
        <AlertCircle className="w-5 h-5 text-red-500" />
      )}
      <span className="text-gray-700">{message}</span>
      <button
        onClick={onClose}
        className="ml-2 p-1 hover:bg-gray-100 rounded-full"
      >
        <X className="w-4 h-4 text-gray-500" />
      </button>
    </div>
  );
};

export default Toast;
