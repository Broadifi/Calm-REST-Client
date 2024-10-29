import React from "react";
import { AuthorizationEditorProps } from "./types";
import { Key } from "lucide-react";
import Dropdown from "./components/ui/Dropdown";

const AuthorizationEditor: React.FC<AuthorizationEditorProps> = ({
  authorization,
  setAuthorization,
}) => {
  const authOptions = [
    { value: "none", label: "No Auth" },
    { value: "bearer", label: "Bearer Token" },
  ];
  const handleAuthTypeChange = (type: string) => {
    setAuthorization({
      type,
      token: type === "bearer" ? "" : undefined,
    });
  };

  const handleTokenChange = (token: string) => {
    setAuthorization({
      ...authorization,
      token,
    });
  };

  return (
    <div className="space-y-3">
      <Dropdown
        value={authorization.type}
        onChange={handleAuthTypeChange}
        options={authOptions}
        icon={<Key className="w-4 h-4 text-gray-500" />}
        placeholder="Select authorization type"
      />

      {authorization.type === "bearer" && (
        <div className="space-y-2">
          <input
            type="text"
            value={authorization.token || ""}
            onChange={(e) => handleTokenChange(e.target.value)}
            placeholder="Enter Bearer Token"
            className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
          <div className="text-xs text-gray-500">
            Token will be sent as: Bearer [TOKEN]
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthorizationEditor;
