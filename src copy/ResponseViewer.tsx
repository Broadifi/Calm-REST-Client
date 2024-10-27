/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Clock, CheckCircle, XCircle } from "lucide-react";
import { ResponseViewerProps } from "./types";

type TabType = "body" | "headers";

const ResponseViewer: React.FC<ResponseViewerProps> = ({
  response,
  loading,
}) => {
  const [activeTab, setActiveTab] = React.useState<TabType>("body");

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

  const formatData = (data: any): string => {
    if (typeof data === "string") {
      try {
        // Try to parse and format if it's a JSON string
        return JSON.stringify(JSON.parse(data), null, 2);
      } catch {
        return data;
      }
    }
    return JSON.stringify(data, null, 2);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        {isSuccess ? (
          <CheckCircle className="w-5 h-5 text-green-500" />
        ) : (
          <XCircle className="w-5 h-5 text-red-500" />
        )}
        <span className="font-mono">Status: {status}</span>
        <span className="text-gray-500">Time: {time}ms</span>
      </div>

      <div className="border-b">
        <div className="flex gap-4">
          {(["body", "headers"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 border-b-2 ${
                activeTab === tab
                  ? "border-blue-500 text-blue-500"
                  : "border-transparent"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "body" && (
        <pre className="bg-gray-50 p-4 rounded-lg overflow-auto max-h-96 font-mono text-sm">
          {formatData(data)}
        </pre>
      )}

      {activeTab === "headers" && (
        <div className="space-y-2">
          {Object.entries(headers).map(([key, value]) => (
            <div key={key} className="flex gap-2">
              <span className="font-mono text-gray-600">{key}:</span>
              <span className="font-mono">{value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResponseViewer;
