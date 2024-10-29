import React from "react";
import { Send, X } from "lucide-react";
import { HttpMethod, Header, Authorization, ResponseData } from "../../types";
import Dropdown from "../ui/Dropdown";
import HeadersEditor from "../../HeadersEditor";
import AuthorizationEditor from "../../AuthorizationEditor";
import RequestBodyEditor from "../../RequestBodyEditor";
import ResponseViewer from "../../ResponseViewer";

interface RequestPanelProps {
  method: HttpMethod;
  url: string;
  headers: Header[];
  body: string;
  authorization: Authorization;
  loading: boolean;
  response: ResponseData | null;
  onMethodChange: (method: HttpMethod) => void;
  onUrlChange: (url: string) => void;
  onHeadersChange: (headers: Header[]) => void;
  onBodyChange: (body: string) => void;
  onAuthorizationChange: (auth: Authorization) => void;
  onSendRequest: () => void;
  onCancelRequest: () => void;
}

const methodOptions = [
  { value: "GET", label: "GET" },
  { value: "POST", label: "POST" },
  { value: "PUT", label: "PUT" },
  { value: "DELETE", label: "DELETE" },
  { value: "PATCH", label: "PATCH" },
];

const RequestPanel: React.FC<RequestPanelProps> = ({
  method,
  url,
  headers,
  body,
  authorization,
  loading,
  response,
  onMethodChange,
  onUrlChange,
  onHeadersChange,
  onBodyChange,
  onAuthorizationChange,
  onSendRequest,
  onCancelRequest,
}) => {
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter") {
      onSendRequest();
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* URL Bar - Full Width */}
      <div className="flex gap-2 w-full">
        <Dropdown
          value={method}
          onChange={(value) => onMethodChange(value as HttpMethod)}
          options={methodOptions}
          className="w-[120px]"
          placeholder="Method"
        />

        <input
          type="text"
          value={url}
          onChange={(e) => onUrlChange(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Enter request URL"
          className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        />

        {!loading ? (
          <button
            onClick={onSendRequest}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary-700 disabled:opacity-50"
            disabled={!url.trim()}
          >
            <Send className="w-4 h-4" />
            Send
          </button>
        ) : (
          <button
            onClick={onCancelRequest}
            className="bg-red-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-600"
          >
            <X className="w-4 h-4" />
            Stop
          </button>
        )}
      </div>

      {/* Two-column layout for all panels */}
      <div className="grid grid-cols-2 gap-4">
        {/* Left Column - Request Configuration */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">
              Headers
            </h2>
            <HeadersEditor headers={headers} setHeaders={onHeadersChange} />
          </div>

          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">
              Authorization
            </h2>
            <AuthorizationEditor
              authorization={authorization}
              setAuthorization={onAuthorizationChange}
            />
          </div>

          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">
              Request Body
            </h2>
            <RequestBodyEditor
              body={body}
              setBody={onBodyChange}
              method={method}
            />
          </div>
        </div>

        {/* Right Column - Response */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">
            Response
          </h2>
          <ResponseViewer response={response} loading={loading} />
        </div>
      </div>
    </div>
  );
};

export default RequestPanel;
