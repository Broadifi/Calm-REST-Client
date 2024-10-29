import React from "react";
import { Globe, Search, Settings, Folder, History } from "lucide-react";
import Collections from "./Collections";
import HistoryView from "./History";
import { TabSet, type Tab } from "../ui/Tabs";
import { Collection } from "../../types";
import Dropdown from "../ui/Dropdown";

interface SidebarProps {
  collections: Collection[];
  selectedEnvironment: string;
  onEnvironmentChange: (env: string) => void;
  onCollectionToggle: (collectionId: string) => void;
  onRequestSelect?: (collectionId: string, requestId: string) => void;
  onAddCollection?: () => void;
  onSettingsClick?: () => void;
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
  const [activeTab, setActiveTab] = React.useState<"collections" | "history">(
    "collections"
  );
  const environmentOptions = [
    { value: "development", label: "Development" },
    { value: "staging", label: "Staging" },
    { value: "production", label: "Production" },
  ];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
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
        {activeTab === "history" && <HistoryView />}
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
    </div>
  );
};

export default Sidebar;
