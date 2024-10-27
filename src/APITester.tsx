import React from "react";
import {
  ChevronDown,
  ChevronRight,
  FolderOpen,
  Globe,
  Plus,
  Save,
  Search,
  Send,
  Settings,
  X,
} from "lucide-react";
import { HttpMethod, Header, ResponseData, Collection } from "./types";
import HeadersEditor from "./HeadersEditor";
import RequestBodyEditor from "./RequestBodyEditor";
import ResponseViewer from "./ResponseViewer";
import AuthorizationEditor from "./AuthorizationEditor";
import { Authorization } from "./types";
import Dropdown from "./components/Dropdown";

const APITester: React.FC = () => {
  const [method, setMethod] = React.useState<HttpMethod>("GET");
  const [url, setUrl] = React.useState<string>("");
  const [headers, setHeaders] = React.useState<Header[]>([]);
  const [body, setBody] = React.useState<string>("");
  const [response, setResponse] = React.useState<ResponseData | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [authorization, setAuthorization] = React.useState<Authorization>({
    type: "none",
  });
  const [abortController, setAbortController] =
    React.useState<AbortController | null>(null);
  const cancelRequest = () => {
    if (abortController) {
      abortController.abort();
      setAbortController(null);
      setLoading(false);
    }
  };

  const methodOptions = [
    { value: "GET", label: "GET" },
    { value: "POST", label: "POST" },
    { value: "PUT", label: "PUT" },
    { value: "DELETE", label: "DELETE" },
    { value: "PATCH", label: "PATCH" },
  ];

  const environmentOptions = [
    { value: "development", label: "Development" },
    { value: "staging", label: "Staging" },
    { value: "production", label: "Production" },
  ];

  // New states for collections and environments
  const [collections, setCollections] = React.useState<Collection[]>([
    {
      id: "1",
      name: "My Collection",
      isOpen: true,
      requests: [
        {
          id: "1",
          name: "Get Users",
          method: "GET",
          url: "https://api.example.com/users",
        },
        {
          id: "2",
          name: "Create User",
          method: "POST",
          url: "https://api.example.com/users",
        },
      ],
    },
  ]);
  const [selectedEnvironment, setSelectedEnvironment] =
    React.useState<string>("Development");

  const sendRequest = async (): Promise<void> => {
    if (!url.trim()) {
      alert("Please enter a URL");
      return;
    }

    // Create new AbortController for this request
    const controller = new AbortController();
    setAbortController(controller);
    setLoading(true);
    const startTime = Date.now();

    try {
      const requestHeaders: Record<string, string> = headers.reduce(
        (acc, header) => {
          if (header.key && header.value) {
            acc[header.key] = header.value;
          }
          return acc;
        },
        {} as Record<string, string>
      );

      if (authorization.type === "bearer" && authorization.token) {
        requestHeaders["Authorization"] = `Bearer ${authorization.token}`;
      }

      const requestOptions: RequestInit = {
        method,
        headers: requestHeaders,
        body: ["POST", "PUT", "PATCH"].includes(method) ? body : undefined,
        signal: controller.signal, // Add the abort signal
      };

      const response = await fetch(url, requestOptions);
      let data;

      const contentType = response.headers.get("content-type");
      if (contentType?.includes("application/json")) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      setResponse({
        status: response.status,
        headers: Object.fromEntries(response.headers.entries()),
        data,
        time: Date.now() - startTime,
      });
    } catch (error) {
      // Check if the error is due to abortion
      if (error instanceof Error && error.name === "AbortError") {
        setResponse({
          status: 0,
          headers: {},
          data: "Request cancelled",
          time: Date.now() - startTime,
        });
      } else {
        setResponse({
          status: 0,
          headers: {},
          data:
            error instanceof Error
              ? error.message
              : "An unknown error occurred",
          time: Date.now() - startTime,
        });
      }
    } finally {
      setLoading(false);
      setAbortController(null);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter") {
      sendRequest();
    }
  };

  React.useEffect(() => {
    return () => {
      if (abortController) {
        abortController.abort();
      }
    };
  }, [abortController]);

  return (
    <div className="h-screen flex">
      {/* Sidebar */}
      <div className="w-64 bg-gray-50 border-r flex flex-col">
        {/* Environment Selector */}
        <div className="p-3 border-b">
          <Dropdown
            value={selectedEnvironment}
            onChange={setSelectedEnvironment}
            options={environmentOptions}
            icon={<Globe className="w-4 h-4 text-gray-500" />}
            placeholder="Select environment"
          />
        </div>

        {/* Search Bar */}
        <div className="p-3 border-b">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white border rounded-md">
            <Search className="w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search requests..."
              className="flex-1 bg-transparent outline-none text-sm"
            />
          </div>
        </div>

        {/* Collections List */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Collections</span>
              <button className="p-1 hover:bg-gray-200 rounded">
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {collections.map((collection) => (
              <div key={collection.id} className="mb-2">
                <div className="flex items-center gap-2 px-2 py-1.5 hover:bg-gray-200 rounded cursor-pointer">
                  {collection.isOpen ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                  <FolderOpen className="w-4 h-4" />
                  <span className="text-sm">{collection.name}</span>
                </div>

                {collection.isOpen && (
                  <div className="ml-4 mt-1">
                    {collection.requests.map((request) => (
                      <div
                        key={request.id}
                        className="flex items-center gap-2 px-2 py-1.5 hover:bg-gray-200 rounded cursor-pointer"
                      >
                        <span
                          className={`text-xs font-mono ${
                            request.method === "GET"
                              ? "text-green-600"
                              : request.method === "POST"
                              ? "text-blue-600"
                              : request.method === "PUT"
                              ? "text-orange-600"
                              : request.method === "DELETE"
                              ? "text-red-600"
                              : "text-gray-600"
                          }`}
                        >
                          {request.method}
                        </span>
                        <span className="text-sm truncate">{request.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Settings Button */}
        <div className="p-3 border-t">
          <button className="flex items-center gap-2 px-3 py-2 w-full hover:bg-gray-200 rounded">
            <Settings className="w-4 h-4" />
            <span className="text-sm">Settings</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b p-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-800">
              Calm REST Client
            </h1>
            <button className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded">
              <Save className="w-4 h-4" />
              Save Request
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 bg-gray-50">
          <div className="space-y-4">
            {/* URL Bar */}
            <div className="flex gap-2">
              <Dropdown
                value={method}
                onChange={(value) => setMethod(value as HttpMethod)}
                options={methodOptions}
                className="w-[120px]"
                placeholder="Method"
              />

              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter request URL"
                className="flex-1 px-3 py-2 border rounded-lg"
              />

              {!loading ? (
                <button
                  onClick={sendRequest}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600 disabled:opacity-50"
                  disabled={!url.trim()}
                >
                  <Send className="w-4 h-4" />
                  Send
                </button>
              ) : (
                <button
                  onClick={cancelRequest}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-600"
                >
                  <X className="w-4 h-4" />
                  Stop
                </button>
              )}
            </div>

            {/* Request/Response Panels */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="bg-white border rounded-lg p-4">
                  <h2 className="text-lg font-semibold mb-2">Headers</h2>
                  <HeadersEditor headers={headers} setHeaders={setHeaders} />
                </div>

                <div className="bg-white border rounded-lg p-4">
                  <h2 className="text-lg font-semibold mb-2">Authorization</h2>
                  <AuthorizationEditor
                    authorization={authorization}
                    setAuthorization={setAuthorization}
                  />
                </div>

                <div className="bg-white border rounded-lg p-4">
                  <h2 className="text-lg font-semibold mb-2">Request Body</h2>
                  <RequestBodyEditor
                    body={body}
                    setBody={setBody}
                    method={method}
                  />
                </div>
              </div>

              <div className="bg-white border rounded-lg p-4">
                <h2 className="text-lg font-semibold mb-2">Response</h2>
                <ResponseViewer response={response} loading={loading} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default APITester;
