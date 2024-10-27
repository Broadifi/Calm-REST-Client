import React from "react";
import { Plus, Trash2 } from "lucide-react";
import { HeadersEditorProps, Header } from "./types";

const HeadersEditor: React.FC<HeadersEditorProps> = ({
  headers,
  setHeaders,
}) => {
  const addHeader = (): void => {
    setHeaders([...headers, { key: "", value: "" }]);
  };

  const removeHeader = (index: number): void => {
    const newHeaders = headers.filter((_, i) => i !== index);
    setHeaders(newHeaders);
  };

  const updateHeader = (
    index: number,
    field: keyof Header,
    value: string
  ): void => {
    const newHeaders = headers.map((header, i) => {
      if (i === index) {
        return { ...header, [field]: value };
      }
      return header;
    });
    setHeaders(newHeaders);
  };

  return (
    <div className="space-y-2">
      {headers.map((header, index) => (
        <div key={index} className="flex gap-2">
          <input
            type="text"
            value={header.key}
            onChange={(e) => updateHeader(index, "key", e.target.value)}
            placeholder="Header name"
            className="flex-1 px-3 py-2 border rounded-lg text-sm"
          />
          <input
            type="text"
            value={header.value}
            onChange={(e) => updateHeader(index, "value", e.target.value)}
            placeholder="Value"
            className="flex-1 px-3 py-2 border rounded-lg text-sm"
          />
          <button
            onClick={() => removeHeader(index)}
            className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
            aria-label="Remove header"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ))}

      <button
        onClick={addHeader}
        className="flex items-center gap-2 text-blue-500 hover:bg-blue-50 px-3 py-2 rounded-lg"
      >
        <Plus className="w-4 h-4" />
        Add Header
      </button>
    </div>
  );
};

export default HeadersEditor;
