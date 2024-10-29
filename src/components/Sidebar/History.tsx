import React from "react";

const History: React.FC = () => {
  return (
    <div className="p-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
          Request History
        </span>
      </div>
      <div className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
        No recent requests
      </div>
    </div>
  );
};

export default History;
