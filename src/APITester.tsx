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
import ThemeToggle from "./components/ThemeToggle";
import Sidebar from "./components/Sidebar";

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

  const handleCollectionToggle = (collectionId: string) => {
    setCollections(
      collections.map((collection) =>
        collection.id === collectionId
          ? { ...collection, isOpen: !collection.isOpen }
          : collection
      )
    );
  };

  const handleRequestSelect = (collectionId: string, requestId: string) => {
    const collection = collections.find((c) => c.id === collectionId);
    const request = collection?.requests.find((r) => r.id === requestId);

    if (request) {
      setMethod(request.method);
      setUrl(request.url);
      // You can add more state updates here
    }
  };

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
    <div className="h-screen flex bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Sidebar */}
      <Sidebar
        collections={collections}
        selectedEnvironment={selectedEnvironment}
        onEnvironmentChange={setSelectedEnvironment}
        onCollectionToggle={handleCollectionToggle}
        onRequestSelect={handleRequestSelect}
        onAddCollection={() => {
          // Implement add collection logic
        }}
        onSettingsClick={() => {
          // Implement settings click logic
        }}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-800 dark:text-white">
              Calm REST Client
            </h1>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <button className="flex items-center gap-2 px-3 py-1.5 text-sm bg-primary-50 hover:bg-primary-100 dark:bg-primary-900/50 dark:hover:bg-primary-900 text-primary-600 dark:text-primary-400 rounded">
                <Save className="w-4 h-4" />
                Save Request
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900">
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
                className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />

              {!loading ? (
                <button
                  onClick={sendRequest}
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary-700 disabled:opacity-50"
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
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">
                    Headers
                  </h2>
                  <HeadersEditor headers={headers} setHeaders={setHeaders} />
                </div>

                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">
                    Authorization
                  </h2>
                  <AuthorizationEditor
                    authorization={authorization}
                    setAuthorization={setAuthorization}
                  />
                </div>

                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">
                    Request Body
                  </h2>
                  <RequestBodyEditor
                    body={body}
                    setBody={setBody}
                    method={method}
                  />
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">
                  Response
                </h2>
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
