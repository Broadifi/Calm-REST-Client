import React from "react";
import { LucideIcon } from "lucide-react";

interface Tab {
  id: string;
  label: string;
  icon?: LucideIcon;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  variant: "default" | "pills" | "underline";
  size: "sm" | "md" | "lg";
  fullWidth?: boolean;
  className?: string;
}

interface TabButtonProps extends Tab {
  isActive: boolean;
  onClick: () => void;
  variant: TabsProps["variant"];
  size: TabsProps["size"];
  fullWidth: boolean;
}

const TabButton: React.FC<TabButtonProps> = ({
  label,
  icon: Icon,
  isActive,
  onClick,
  variant = "default",
  size = "md",
  fullWidth,
}) => {
  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  const variantClasses = {
    default: `
      ${
        isActive
          ? "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100"
          : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100"
      }
      rounded-lg
    `,
    pills: `
      ${
        isActive
          ? "bg-primary-100 text-primary-900 dark:bg-primary-900 dark:text-primary-100"
          : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100"
      }
      rounded-full
    `,
    underline: `
      ${
        isActive
          ? "text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400"
          : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 border-b-2 border-transparent"
      }
    `,
  };

  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-2 font-medium transition-colors duration-200
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${fullWidth ? "flex-1 justify-center" : ""}
      `}
    >
      {Icon && (
        <Icon
          className={
            size === "sm" ? "w-4 h-4" : size === "md" ? "w-5 h-5" : "w-6 h-6"
          }
        />
      )}
      {label}
    </button>
  );
};

const TabSet: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onTabChange,
  variant = "default",
  size = "md",
  fullWidth = false,
  className = "",
}) => {
  const containerVariantClasses = {
    default: "p-1 bg-gray-50 dark:bg-gray-900 rounded-lg",
    pills: "space-x-2",
    underline: "border-b border-gray-200 dark:border-gray-700",
  };

  return (
    <div
      className={`
        flex items-center
        ${containerVariantClasses[variant]}
        ${fullWidth ? "w-full" : ""}
        ${className}
      `}
    >
      {tabs.map((tab) => (
        <TabButton
          key={tab.id}
          {...tab}
          isActive={activeTab === tab.id}
          onClick={() => onTabChange(tab.id)}
          variant={variant}
          size={size}
          fullWidth={fullWidth}
        />
      ))}
    </div>
  );
};

export { TabSet, type Tab, type TabsProps };
