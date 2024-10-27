import React from "react";
import { RequestBodyEditorProps, ContentType } from "./types";

const RequestBodyEditor: React.FC<RequestBodyEditorProps> = ({
  body,
  setBody,
  method,
}) => {
  const [contentType, setContentType] =
    React.useState<ContentType>("application/json");

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
      <div className="text-gray-500 italic">
        Request body not available for {method} requests
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <select
        value={contentType}
        onChange={(e) => setContentType(e.target.value as ContentType)}
        className="px-3 py-2 border rounded-lg text-sm bg-white"
      >
        <option value="application/json">JSON</option>
        <option value="application/x-www-form-urlencoded">
          Form URL Encoded
        </option>
        <option value="text/plain">Plain Text</option>
      </select>

      <div className="relative">
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          onBlur={formatBody}
          placeholder={
            contentType === "application/json" ? '{\n  "key": "value"\n}' : ""
          }
          className="w-full h-64 px-3 py-2 border rounded-lg font-mono text-sm"
        />

        {contentType === "application/json" && (
          <button
            onClick={formatBody}
            className="absolute top-2 right-2 px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded"
          >
            Format
          </button>
        )}
      </div>
    </div>
  );
};

export default RequestBodyEditor;
