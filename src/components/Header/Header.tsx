import React from "react";
import { Save } from "lucide-react";
import ThemeToggle from "../ThemeToggle";

interface HeaderProps {
  onSaveRequest: () => void;
}

const HeaderSection: React.FC<HeaderProps> = ({ onSaveRequest }) => {
  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800 dark:text-white">
          Calm REST Client
        </h1>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={onSaveRequest}
            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-primary-50 hover:bg-primary-100 dark:bg-primary-900/50 dark:hover:bg-primary-900 text-primary-600 dark:text-primary-400 rounded"
          >
            <Save className="w-4 h-4" />
            Save Request
          </button>
        </div>
      </div>
    </header>
  );
};

export default HeaderSection;
