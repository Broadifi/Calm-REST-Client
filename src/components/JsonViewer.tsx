import { ChevronDown, ChevronRight } from "lucide-react";
import React from "react";

interface JsonViewerProps {
  data: any;
  level?: number;
  isLast?: boolean;
  isCollapsible?: boolean;
}

const JsonViewer: React.FC<JsonViewerProps> = ({
  data,
  level = 0,
  isLast = true,
  isCollapsible = true,
}) => {
  const [isCollapsed, setIsCollapsed] = React.useState(level > 1);
  const indent = React.useMemo(() => "  ".repeat(level), [level]);

  if (data === null)
    return <span className="text-gray-500">null{!isLast && ","}</span>;
  if (typeof data === "boolean")
    return (
      <span className="text-purple-500">
        {data.toString()}
        {!isLast && ","}
      </span>
    );
  if (typeof data === "number")
    return (
      <span className="text-blue-500">
        {data}
        {!isLast && ","}
      </span>
    );
  if (typeof data === "string")
    return (
      <span className="text-green-500">
        "{data}"{!isLast && ","}
      </span>
    );

  if (Array.isArray(data)) {
    if (data.length === 0) return <span>[]</span>;

    return (
      <span>
        <span className="text-gray-400 select-none">
          {isCollapsible && (
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hover:bg-gray-200 rounded p-1 focus:outline-none"
            >
              {isCollapsed ? (
                <ChevronRight className="w-3 h-3 inline" />
              ) : (
                <ChevronDown className="w-3 h-3 inline" />
              )}
            </button>
          )}
          [
        </span>
        {!isCollapsed && (
          <>
            <br />
            {data.map((item, index) => (
              <div key={index} className="ml-4">
                {indent}
                <JsonViewer
                  data={item}
                  level={level + 1}
                  isLast={index === data.length - 1}
                  isCollapsible={
                    isCollapsible && typeof item === "object" && item !== null
                  }
                />
                <br />
              </div>
            ))}
            {indent}
          </>
        )}
        <span className="text-gray-400">]{!isLast && ","}</span>
      </span>
    );
  }

  if (typeof data === "object") {
    const entries = Object.entries(data);
    if (entries.length === 0) return <span>{"{}"}</span>;

    return (
      <span>
        <span className="text-gray-400 select-none">
          {isCollapsible && (
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hover:bg-gray-200 rounded p-1 focus:outline-none"
            >
              {isCollapsed ? (
                <ChevronRight className="w-3 h-3 inline" />
              ) : (
                <ChevronDown className="w-3 h-3 inline" />
              )}
            </button>
          )}
          {"{"}
        </span>
        {!isCollapsed && (
          <>
            <br />
            {entries.map(([key, value], index) => (
              <div key={key} className="ml-4">
                {indent}
                <span className="text-red-500">"{key}"</span>
                <span className="text-gray-400">: </span>
                <JsonViewer
                  data={value}
                  level={level + 1}
                  isLast={index === entries.length - 1}
                  isCollapsible={typeof value === "object" && value !== null}
                />
                <br />
              </div>
            ))}
            {indent}
          </>
        )}
        <span className="text-gray-400">
          {"}"}
          {!isLast && ","}
        </span>
      </span>
    );
  }

  return null;
};

export default JsonViewer;
