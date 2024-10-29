import React from "react";
import { ChevronDown, ChevronRight, FolderOpen, Plus } from "lucide-react";
import { Collection } from "../../types";

interface CollectionsProps {
  collections: Collection[];
  onCollectionToggle: (collectionId: string) => void;
  onRequestSelect?: (collectionId: string, requestId: string) => void;
  onAddCollection?: () => void;
}

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

const Collections: React.FC<CollectionsProps> = ({
  collections,
  onCollectionToggle,
  onRequestSelect,
  onAddCollection,
}) => {
  return (
    <div className="p-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
          Collections
        </span>
        <button
          onClick={onAddCollection}
          className="p-1.5 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors duration-200"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {collections.map((collection) => (
        <div key={collection.id} className="mb-2">
          <div
            onClick={() => onCollectionToggle(collection.id)}
            className="flex items-center gap-2 px-2 py-1.5 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded cursor-pointer transition-colors duration-200"
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
                  onClick={() => onRequestSelect?.(collection.id, request.id)}
                  className="flex items-center gap-2 px-2 py-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded cursor-pointer transition-colors duration-200"
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
  );
};

export default Collections;
