import React from "react";
import { Clock, CheckCircle, XCircle, Copy } from "lucide-react";
import { ResponseViewerProps } from "./types";
import Toast, { ToastType } from "./components/Toast";
import JsonViewer from "./components/JsonViewer";

type TabType = "body" | "headers";

interface ToastState {
  message: string;
  type: ToastType;
  visible: boolean;
}

const ResponseViewer: React.FC<ResponseViewerProps> = ({
  response,
  loading,
}) => {
  const [activeTab, setActiveTab] = React.useState<TabType>("body");
  const [expandAll, setExpandAll] = React.useState(false);
  const [toast, setToast] = React.useState<ToastState>({
    message: "",
    type: "success",
    visible: false,
  });

  const showToast = (message: string, type: ToastType) => {
    setToast({ message, type, visible: true });
  };

  const hideToast = () => {
    setToast((prev) => ({ ...prev, visible: false }));
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      showToast("Copied to clipboard!", "success");
    } catch (err) {
      showToast("Failed to copy", "error");
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
        <Clock className="w-6 h-6 animate-spin" />
        <span className="ml-2">Sending request...</span>
      </div>
    );
  }

  if (!response) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
        Response will appear here
      </div>
    );
  }

  const { status, headers, data, time } = response;
  const isSuccess = status >= 200 && status < 300;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {isSuccess ? (
            <CheckCircle className="w-5 h-5 text-green-500 dark:text-green-400" />
          ) : (
            <XCircle className="w-5 h-5 text-red-500 dark:text-red-400" />
          )}
          <span className="font-mono text-gray-900 dark:text-gray-100">
            Status: {status}
          </span>
          <span className="text-gray-500 dark:text-gray-400">
            Time: {time}ms
          </span>
        </div>
        <button
          onClick={() => copyToClipboard(JSON.stringify(data, null, 2))}
          className="flex items-center gap-2 px-3 py-1.5 text-sm 
            text-gray-700 dark:text-gray-300
            hover:bg-gray-100 dark:hover:bg-gray-700 
            rounded transition-colors duration-200"
        >
          <Copy className="w-4 h-4" />
          Copy
        </button>
      </div>

      <div className="border-b border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center">
          <div className="flex gap-4">
            {(["body", "headers"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 border-b-2 transition-colors duration-200 ${
                  activeTab === tab
                    ? "border-primary-600 text-primary-600 dark:border-primary-400 dark:text-primary-400"
                    : "border-transparent hover:border-gray-200 dark:hover:border-gray-700 text-gray-600 dark:text-gray-400"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
          {activeTab === "body" && (
            <button
              onClick={() => setExpandAll(!expandAll)}
              className="text-sm text-primary-600 hover:text-primary-700 
                dark:text-primary-400 dark:hover:text-primary-300
                transition-colors duration-200"
            >
              {expandAll ? "Collapse All" : "Expand All"}
            </button>
          )}
        </div>
      </div>

      {activeTab === "body" && (
        <div
          className="bg-white dark:bg-gray-800 
          border border-gray-200 dark:border-gray-700 
          rounded-lg p-4 overflow-auto max-h-96 
          font-mono text-sm"
        >
          <JsonViewer data={data} isCollapsible={true} />
        </div>
      )}

      {activeTab === "headers" && (
        <div
          className="space-y-2 bg-white dark:bg-gray-800 
          border border-gray-200 dark:border-gray-700 
          rounded-lg p-4"
        >
          {Object.entries(headers).map(([key, value]) => (
            <div
              key={key}
              className="flex gap-2 items-center 
                hover:bg-gray-50 dark:hover:bg-gray-700 
                p-2 rounded transition-colors duration-200"
            >
              <span className="font-mono text-red-500 dark:text-red-400">
                {key}:
              </span>
              <span className="font-mono text-gray-700 dark:text-gray-300">
                {value}
              </span>
            </div>
          ))}
        </div>
      )}
      {toast.visible && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}
    </div>
  );
};

export default ResponseViewer;
