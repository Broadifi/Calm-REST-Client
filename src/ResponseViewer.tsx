/* eslint-disable @typescript-eslint/no-explicit-any */
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
      <div className="h-full flex items-center justify-center text-gray-500">
        <Clock className="w-6 h-6 animate-spin" />
        <span className="ml-2">Sending request...</span>
      </div>
    );
  }

  if (!response) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
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
            <CheckCircle className="w-5 h-5 text-green-500" />
          ) : (
            <XCircle className="w-5 h-5 text-red-500" />
          )}
          <span className="font-mono">Status: {status}</span>
          <span className="text-gray-500">Time: {time}ms</span>
        </div>
        <button
          onClick={() => copyToClipboard(JSON.stringify(data, null, 2))}
          className="flex items-center gap-2 px-3 py-1.5 text-sm hover:bg-gray-100 rounded"
        >
          <Copy className="w-4 h-4" />
          Copy
        </button>
      </div>

      <div className="border-b">
        <div className="flex justify-between items-center">
          <div className="flex gap-4">
            {(["body", "headers"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 border-b-2 ${
                  activeTab === tab
                    ? "border-blue-500 text-blue-500"
                    : "border-transparent hover:border-gray-200"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
          {activeTab === "body" && (
            <button
              onClick={() => setExpandAll(!expandAll)}
              className="text-sm text-blue-500 hover:text-blue-600"
            >
              {expandAll ? "Collapse All" : "Expand All"}
            </button>
          )}
        </div>
      </div>

      {activeTab === "body" && (
        <div className="bg-white border rounded-lg p-4 overflow-auto max-h-96 font-mono text-sm">
          <JsonViewer data={data} isCollapsible={true} />
        </div>
      )}

      {activeTab === "headers" && (
        <div className="space-y-2 bg-white border rounded-lg p-4">
          {Object.entries(headers).map(([key, value]) => (
            <div
              key={key}
              className="flex gap-2 items-center hover:bg-gray-50 p-2 rounded"
            >
              <span className="font-mono text-red-500">{key}:</span>
              <span className="font-mono text-gray-700">{value}</span>
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
