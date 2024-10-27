import React from "react";
import { AuthorizationEditorProps, AuthType } from "./types";
import { Key } from "lucide-react";

const AuthorizationEditor: React.FC<AuthorizationEditorProps> = ({
  authorization,
  setAuthorization,
}) => {
  const handleAuthTypeChange = (type: AuthType) => {
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
      <div className="flex items-center gap-2">
        <Key className="w-4 h-4 text-gray-500" />
        <select
          value={authorization.type}
          onChange={(e) => handleAuthTypeChange(e.target.value as AuthType)}
          className="px-3 py-2 border rounded-lg text-sm bg-white"
        >
          <option value="none">No Auth</option>
          <option value="bearer">Bearer Token</option>
        </select>
      </div>

      {authorization.type === "bearer" && (
        <div className="space-y-2">
          <input
            type="text"
            value={authorization.token || ""}
            onChange={(e) => handleTokenChange(e.target.value)}
            placeholder="Enter Bearer Token"
            className="w-full px-3 py-2 border rounded-lg text-sm"
          />
          <div className="text-xs text-gray-500">
            Token will be sent as: Bearer "[YOUR_TOKEN]"
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthorizationEditor;
