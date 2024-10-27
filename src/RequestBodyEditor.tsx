import React from "react";
import { RequestBodyEditorProps, ContentType } from "./types";
import Dropdown from "./components/Dropdown";
import { FileJson, FileText, FileSpreadsheet } from "lucide-react";

const RequestBodyEditor: React.FC<RequestBodyEditorProps> = ({
  body,
  setBody,
  method,
}) => {
  const [contentType, setContentType] =
    React.useState<ContentType>("application/json");

  const contentTypeOptions = [
    {
      value: "application/json",
      label: "JSON",
      icon: <FileJson className="w-4 h-4 text-primary-500" />,
    },
    {
      value: "application/x-www-form-urlencoded",
      label: "Form URL Encoded",
      icon: <FileSpreadsheet className="w-4 h-4 text-primary-500" />,
    },
    {
      value: "text/plain",
      label: "Plain Text",
      icon: <FileText className="w-4 h-4 text-primary-500" />,
    },
  ];

  const formatBody = (): void => {
    if (contentType === "application/json") {
      try {
        const formatted = JSON.stringify(JSON.parse(body), null, 2);
        setBody(formatted);
      } catch (e) {
        console.error(e);
        // Invalid JSON, keep as is
      }
    }
  };

  if (!["POST", "PUT", "PATCH"].includes(method)) {
    return (
      <div className="text-gray-500 dark:text-gray-400 italic">
        Request body not available for {method} requests
      </div>
    );
  }

  const selectedContentType = contentTypeOptions.find(
    (opt) => opt.value === contentType
  );

  return (
    <div className="space-y-2">
      <Dropdown
        value={contentType}
        onChange={(value) => setContentType(value as ContentType)}
        options={contentTypeOptions.map(({ value, label }) => ({
          value,
          label,
        }))}
        icon={selectedContentType?.icon}
        placeholder="Select content type"
        className="w-full md:w-64"
      />

      <div className="relative">
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          onBlur={formatBody}
          placeholder={
            contentType === "application/json" ? '{\n  "key": "value"\n}' : ""
          }
          className="w-full h-64 px-3 py-2 
            bg-white dark:bg-gray-800 
            text-gray-900 dark:text-gray-100
            border border-gray-200 dark:border-gray-700 
            rounded-lg font-mono text-sm
            placeholder-gray-400 dark:placeholder-gray-500
            focus:outline-none focus:ring-2 focus:ring-primary-500/50 dark:focus:ring-primary-400/50
            transition-colors duration-200"
          spellCheck={false}
        />

        {contentType === "application/json" && (
          <button
            onClick={formatBody}
            className="absolute top-2 right-2 
              px-3 py-1.5 text-xs
              bg-gray-100 dark:bg-gray-700
              hover:bg-gray-200 dark:hover:bg-gray-600
              text-gray-700 dark:text-gray-300
              rounded
              transition-colors duration-200
              border border-gray-200 dark:border-gray-600"
          >
            Format JSON
          </button>
        )}
      </div>

      {/* Error message for invalid JSON */}
      {contentType === "application/json" && body.trim() !== "" && (
        <div className="text-xs">
          {(() => {
            try {
              JSON.parse(body);
              return (
                <span className="text-green-600 dark:text-green-400">
                  ✓ Valid JSON
                </span>
              );
            } catch (e) {
              return (
                <span className="text-red-600 dark:text-red-400">
                  ⚠ Invalid JSON
                </span>
              );
            }
          })()}
        </div>
      )}
    </div>
  );
};

export default RequestBodyEditor;
