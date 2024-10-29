import React, { useState, useCallback } from "react";
import { Globe, Search, Settings, Folder, History } from "lucide-react";
import Collections from "./Collections";
import HistoryView from "./History";
import { TabSet, type Tab } from "../ui/Tabs";
import { Collection, HistoryEntry } from "../../types";
import Dropdown from "../ui/Dropdown";

interface SidebarProps {
  collections: Collection[];
  history: HistoryEntry[];
  selectedEnvironment: string;
  onEnvironmentChange: (env: string) => void;
  onCollectionToggle: (collectionId: string) => void;
  onRequestSelect?: (collectionId: string, requestId: string) => void;
  onAddCollection?: () => void;
  onSettingsClick?: () => void;
  onHistorySelect: (history: HistoryEntry) => void;
}

const tabs: Tab[] = [
  {
    id: "collections",
    label: "Collections",
    icon: Folder,
  },
  {
    id: "history",
    label: "History",
    icon: History,
  },
];

const MIN_WIDTH = 250;
const MAX_WIDTH = 600;
const DEFAULT_WIDTH = 300;

const Sidebar: React.FC<SidebarProps> = ({
  collections,
  history = [],
  selectedEnvironment,
  onEnvironmentChange,
  onCollectionToggle,
  onRequestSelect,
  onAddCollection,
  onSettingsClick,
  onHistorySelect,
}) => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [activeTab, setActiveTab] = React.useState<"collections" | "history">(
    "collections"
  );
  const [width, setWidth] = useState(DEFAULT_WIDTH);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startWidth, setStartWidth] = useState(0);

  const environmentOptions = [
    { value: "development", label: "Development" },
    { value: "staging", label: "Staging" },
    { value: "production", label: "Production" },
  ];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setIsDragging(true);
      setStartX(e.clientX);
      setStartWidth(width);
    },
    [width]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;

      const diff = e.clientX - startX;
      const newWidth = Math.min(
        Math.max(startWidth + diff, MIN_WIDTH),
        MAX_WIDTH
      );
      setWidth(newWidth);
    },
    [isDragging, startX, startWidth]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    } else {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <div
      className="h-screen flex-none bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col relative select-none"
      style={{ width: `${width}px` }}
    >
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
        <div className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg transition-colors duration-200">
          <Search className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search requests..."
            className="flex-1 bg-transparent outline-none text-sm text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
          />
        </div>
      </div>

      {/* Tabs */}
      <TabSet
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={(tabId) =>
          setActiveTab(tabId as "collections" | "history")
        }
        variant="underline"
        size="sm"
        fullWidth
      />

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === "collections" && (
          <Collections
            collections={collections}
            onCollectionToggle={onCollectionToggle}
            onRequestSelect={onRequestSelect}
            onAddCollection={onAddCollection}
          />
        )}
        {activeTab === "history" && (
          <HistoryView history={history} onSelectHistory={onHistorySelect} />
        )}
      </div>

      {/* Settings Button */}
      <div className="p-3 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={onSettingsClick}
          className="flex items-center gap-2 px-3 py-2 w-full text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors duration-200"
        >
          <Settings className="w-4 h-4" />
          <span className="text-sm">Settings</span>
        </button>
      </div>

      {/* Resize Handle */}
      <div
        onMouseDown={handleMouseDown}
        className={`absolute right-0 top-0 bottom-0 w-2 cursor-col-resize hover:bg-primary-500/10 transition-colors duration-200 ${
          isDragging ? "bg-primary-500/10" : ""
        }`}
      >
        <div
          className={`absolute right-0 w-0.5 h-full ${
            isDragging
              ? "bg-primary-500"
              : "bg-gray-200 dark:bg-gray-700 group-hover:bg-primary-500"
          }`}
        />
      </div>
    </div>
  );
};

export default Sidebar;
