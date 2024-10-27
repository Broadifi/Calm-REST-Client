// src/components/Sidebar/Sidebar.tsx
import React from "react";
import {
  ChevronDown,
  ChevronRight,
  FolderOpen,
  Globe,
  Plus,
  Search,
  Settings,
} from "lucide-react";
import { Collection } from "../types";
import Dropdown from "./Dropdown";

interface SidebarProps {
  collections: Collection[];
  selectedEnvironment: string;
  onEnvironmentChange: (env: string) => void;
  onCollectionToggle: (collectionId: string) => void;
  onRequestSelect?: (collectionId: string, requestId: string) => void;
  onAddCollection?: () => void;
  onSettingsClick?: () => void;
}

const environmentOptions = [
  { value: "development", label: "Development" },
  { value: "staging", label: "Staging" },
  { value: "production", label: "Production" },
];

const getMethodColor = (method: string) => {
  switch (method) {
    case "GET":
      return "text-green-600 dark:text-green-400";
    case "POST":
      return "text-blue-600 dark:text-blue-400";
    case "PUT":
      return "text-orange-600 dark:text-orange-400";
    case "DELETE":
      return "text-red-600 dark:text-red-400";
    default:
      return "text-gray-600 dark:text-gray-400";
  }
};

const Sidebar: React.FC<SidebarProps> = ({
  collections,
  selectedEnvironment,
  onEnvironmentChange,
  onCollectionToggle,
  onRequestSelect,
  onAddCollection,
  onSettingsClick,
}) => {
  const [searchTerm, setSearchTerm] = React.useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    // You can implement search functionality here
  };

  return (
    <div className="w-64 bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      {/* Environment Selector */}
      <div className="p-3 border-b border-gray-200 dark:border-gray-700">
        <Dropdown
          value={selectedEnvironment}
          onChange={onEnvironmentChange}
          options={environmentOptions}
          icon={
            <Globe className="w-4 h-4 text-primary-500 dark:text-primary-400" />
          }
          placeholder="Select environment"
        />
      </div>

      {/* Search Bar */}
      <div className="p-3 border-b border-gray-200 dark:border-gray-700">
        <div
          className="flex items-center gap-2 px-3 py-1.5 
          bg-white dark:bg-gray-700 
          border border-gray-200 dark:border-gray-600 
          rounded-lg transition-colors duration-200"
        >
          <Search className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search requests..."
            className="flex-1 bg-transparent outline-none text-sm 
              text-gray-900 dark:text-gray-100
              placeholder-gray-500 dark:placeholder-gray-400"
          />
        </div>
      </div>

      {/* Collections List */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
              Collections
            </span>
            <button
              onClick={onAddCollection}
              className="p-1.5 text-gray-600 dark:text-gray-400 
                hover:bg-gray-200 dark:hover:bg-gray-700 
                rounded transition-colors duration-200"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {collections.map((collection) => (
            <div key={collection.id} className="mb-2">
              <div
                onClick={() => onCollectionToggle(collection.id)}
                className="flex items-center gap-2 px-2 py-1.5 
                  text-gray-700 dark:text-gray-300
                  hover:bg-gray-200 dark:hover:bg-gray-700 
                  rounded cursor-pointer 
                  transition-colors duration-200"
              >
                {collection.isOpen ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
                <FolderOpen className="w-4 h-4 text-primary-500 dark:text-primary-400" />
                <span className="text-sm">{collection.name}</span>
              </div>

              {collection.isOpen && (
                <div className="ml-4 mt-1 space-y-1">
                  {collection.requests.map((request) => (
                    <div
                      key={request.id}
                      onClick={() =>
                        onRequestSelect?.(collection.id, request.id)
                      }
                      className="flex items-center gap-2 px-2 py-1.5 
                        hover:bg-gray-200 dark:hover:bg-gray-700 
                        rounded cursor-pointer
                        transition-colors duration-200"
                    >
                      <span
                        className={`text-xs font-mono ${getMethodColor(
                          request.method
                        )}`}
                      >
                        {request.method}
                      </span>
                      <span className="text-sm truncate text-gray-700 dark:text-gray-300">
                        {request.name}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Settings Button */}
      <div className="p-3 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={onSettingsClick}
          className="flex items-center gap-2 px-3 py-2 w-full 
            text-gray-700 dark:text-gray-300
            hover:bg-gray-200 dark:hover:bg-gray-700 
            rounded transition-colors duration-200"
        >
          <Settings className="w-4 h-4" />
          <span className="text-sm">Settings</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
