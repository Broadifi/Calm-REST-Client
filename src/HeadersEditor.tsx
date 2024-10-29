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
            className="flex-1 px-3 py-2 
              bg-white dark:bg-gray-800 
              text-gray-900 dark:text-gray-100
              border border-gray-200 dark:border-gray-700 
              rounded-lg text-sm
              placeholder-gray-500 dark:placeholder-gray-400
              focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400
              focus:border-transparent"
          />
          <input
            type="text"
            value={header.value}
            onChange={(e) => updateHeader(index, "value", e.target.value)}
            placeholder="Value"
            className="flex-1 px-3 py-2 
              bg-white dark:bg-gray-800 
              text-gray-900 dark:text-gray-100
              border border-gray-200 dark:border-gray-700 
              rounded-lg text-sm
              placeholder-gray-500 dark:placeholder-gray-400
              focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400
              focus:border-transparent"
          />
          <button
            onClick={() => removeHeader(index)}
            className="p-2 
              text-red-500 dark:text-red-400 
              hover:bg-red-50 dark:hover:bg-red-900/20 
              rounded-lg
              transition-colors duration-200"
            aria-label="Remove header"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ))}

      <button
        onClick={addHeader}
        className="flex items-center gap-2 
          text-primary-500 dark:text-primary-400 
          hover:bg-primary-50 dark:hover:bg-primary-900/20 
          px-3 py-2 rounded-lg
          transition-colors duration-200"
      >
        <Plus className="w-4 h-4" />
        Add Header
      </button>
    </div>
  );
};

export default HeadersEditor;
