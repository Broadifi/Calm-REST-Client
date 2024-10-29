import React from "react";
import {
  HttpMethod,
  ResponseData,
  Collection,
  Authorization,
  Header,
  CreateHistoryEntry,
  HistoryEntry,
} from "./types";
import { useStorage } from "./services/storage";
import HeaderSection from "./components/Header/Header";
import RequestPanel from "./components/RequestPanel";
import Sidebar from "./components/Sidebar";

const APITester: React.FC = () => {
  const { storage } = useStorage();

  // Request state
  const [method, setMethod] = React.useState<HttpMethod>("GET");
  const [url, setUrl] = React.useState<string>("");
  const [headers, setHeaders] = React.useState<Header[]>([]);
  const [body, setBody] = React.useState<string>("");
  const [authorization, setAuthorization] = React.useState<Authorization>({
    type: "none",
  });

  // UI state
  const [loading, setLoading] = React.useState<boolean>(false);
  const [response, setResponse] = React.useState<ResponseData | null>(null);
  const [abortController, setAbortController] =
    React.useState<AbortController | null>(null);

  // Collections and environment state
  const [collections, setCollections] = React.useState<Collection[]>([]);
  const [history, setHistory] = React.useState<HistoryEntry[]>([]);
  const [selectedEnvironment, setSelectedEnvironment] =
    React.useState<string>("development");

  // Load initial data
  React.useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const [savedCollections, settings, history] = await Promise.all([
        storage.getCollections(),
        storage.getSettings(),
        storage.getHistory(),
      ]);

      setCollections(savedCollections);
      setSelectedEnvironment(settings.environment);
      setHistory(history);

      console.log("Initial data loaded", savedCollections, settings, history);
    } catch (error) {
      console.error("Failed to load initial data:", error);
    }
  };

  const reloadHistory = async () => {
    const history = await storage.getHistory();
    setHistory(history);
  };

  const saveToHistory = async (requestData: ResponseData) => {
    const entry: CreateHistoryEntry = {
      request: {
        url,
        method,
        headers: Object.fromEntries(
          headers.filter((h) => h.key && h.value).map((h) => [h.key, h.value])
        ),
        body,
      },
      response: {
        status: requestData.status,
        headers: requestData.headers,
        body:
          typeof requestData.data === "string"
            ? requestData.data
            : JSON.stringify(requestData.data),
        timeMs: requestData.time,
      },
      metadata: {
        environment: selectedEnvironment,
        name: url.split("/").pop() || url,
      },
    };

    await storage.addHistoryEntry(entry);
    await reloadHistory();
  };

  const handleSendRequest = async () => {
    if (!url.trim()) {
      alert("Please enter a URL");
      return;
    }

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
        signal: controller.signal,
      };

      const response = await fetch(url, requestOptions);
      const contentType = response.headers.get("content-type");
      const data = contentType?.includes("application/json")
        ? await response.json()
        : await response.text();

      const responseData = {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        data,
        time: Date.now() - startTime,
      };

      setResponse(responseData);
      await saveToHistory(responseData);
    } catch (error) {
      const errorResponse = {
        status: 0,
        headers: {},
        data:
          error instanceof Error ? error.message : "An unknown error occurred",
        time: Date.now() - startTime,
      };

      setResponse(errorResponse);
      await saveToHistory(errorResponse);
    } finally {
      setLoading(false);
      setAbortController(null);
    }
  };

  const handleSaveRequest = async () => {
    // Implement save to collection functionality
  };

  const handleCollectionToggle = (collectionId: string) => {
    setCollections(
      collections.map((collection) =>
        collection.id === collectionId
          ? { ...collection, isOpen: !collection.isOpen }
          : collection
      )
    );
  };

  const handleRequestSelect = async (
    collectionId: string,
    requestId: string
  ) => {
    const collection = collections.find((c) => c.id === collectionId);
    const request = collection?.requests.find((r) => r.id === requestId);

    if (request) {
      setMethod(request.method);
      setUrl(request.url);
      // Load other request details if available
    }
  };

  const onHistorySelect = (history: HistoryEntry) => {
    setMethod(history.request.method);
    setUrl(history.request.url);
    setHeaders(
      Object.entries(history.request.headers).map(([key, value]) => ({
        key,
        value,
      }))
    );
    setBody(history.request.body || "");
    setAuthorization({ type: "none" });
  };

  return (
    <div className="h-screen flex bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Sidebar
        history={history}
        collections={collections}
        selectedEnvironment={selectedEnvironment}
        onEnvironmentChange={setSelectedEnvironment}
        onCollectionToggle={handleCollectionToggle}
        onRequestSelect={handleRequestSelect}
        onAddCollection={() => {}}
        onSettingsClick={() => {}}
        onHistorySelect={onHistorySelect}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <HeaderSection onSaveRequest={handleSaveRequest} />

        <main className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900">
          <RequestPanel
            method={method}
            url={url}
            headers={headers}
            body={body}
            authorization={authorization}
            loading={loading}
            onMethodChange={setMethod}
            onUrlChange={setUrl}
            onHeadersChange={setHeaders}
            onBodyChange={setBody}
            onAuthorizationChange={setAuthorization}
            onSendRequest={handleSendRequest}
            onCancelRequest={() => abortController?.abort()}
            response={response}
          />
        </main>
      </div>
    </div>
  );
};

export default APITester;
