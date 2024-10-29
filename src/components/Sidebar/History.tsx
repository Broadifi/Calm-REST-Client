import React from "react";
import { Clock, ArrowRight } from "lucide-react";
import { HistoryEntry } from "../../types";
import { historyUtils } from "../../services/storage";

interface HistoryProps {
  history: HistoryEntry[];
  onSelectHistory: (entry: HistoryEntry) => void;
}

const History: React.FC<HistoryProps> = ({ history, onSelectHistory }) => {
  const getStatusColor = (status: number): string => {
    if (status >= 200 && status < 300)
      return "text-green-600 dark:text-green-400";
    if (status >= 300 && status < 400)
      return "text-blue-600 dark:text-blue-400";
    if (status >= 400 && status < 500)
      return "text-yellow-600 dark:text-yellow-400";
    if (status >= 500) return "text-red-600 dark:text-red-400";
    return "text-gray-600 dark:text-gray-400";
  };

  return (
    <div className="p-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
          Request History
        </span>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {history.length} requests
        </span>
      </div>

      {history.length === 0 ? (
        <div className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
          No recent requests
        </div>
      ) : (
        <div className="space-y-2">
          {history.map((entry) => (
            <button
              key={entry.id}
              onClick={() => onSelectHistory(entry)}
              className="w-full text-left group hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-lg transition-colors duration-200"
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-mono font-medium ${historyUtils.getMethodColor(
                      entry.request.method
                    )}`}
                  >
                    {entry.request.method}
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                    {entry.metadata.name ||
                      entry.request.url.split("/").pop() ||
                      entry.request.url}
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              </div>

              {/* Time and Status row */}
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                  <Clock className="w-3 h-3" />
                  <span>{new Date(entry.timestamp).toLocaleTimeString()}</span>
                </div>
                <span className={`${getStatusColor(entry.response.status)}`}>
                  {entry.response.status}
                </span>
              </div>

              {/* URL on new line */}
              <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                <div className="truncate max-w-full opacity-75">
                  {entry.request.url}
                </div>
              </div>

              {entry.metadata.environment && (
                <div className="mt-1">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300">
                    {entry.metadata.environment}
                  </span>
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;
