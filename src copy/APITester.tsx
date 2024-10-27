import React from "react";
import { Send } from "lucide-react";
import { HttpMethod, Header, ResponseData } from "./types";
import HeadersEditor from "./HeadersEditor";
import RequestBodyEditor from "./RequestBodyEditor";
import ResponseViewer from "./ResponseViewer";
import AuthorizationEditor from "./AuthorizationEditor";
import { Authorization } from "./types";

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

  const sendRequest = async (): Promise<void> => {
    if (!url.trim()) {
      alert("Please enter a URL");
      return;
    }

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

      // Add authorization header if needed
      if (authorization.type === "bearer" && authorization.token) {
        requestHeaders["Authorization"] = `Bearer ${authorization.token}`;
      }

      const requestOptions: RequestInit = {
        method,
        headers: requestHeaders,
        body: ["POST", "PUT", "PATCH"].includes(method) ? body : undefined,
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
      setResponse({
        status: 0,
        headers: {},
        data:
          error instanceof Error ? error.message : "An unknown error occurred",
        time: Date.now() - startTime,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter") {
      sendRequest();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto space-y-4">
        <header className="bg-white rounded-lg shadow p-4">
          <h1 className="text-2xl font-bold text-gray-800">REST API Tester</h1>
        </header>

        <main className="bg-white rounded-lg shadow p-4 space-y-4">
          <div className="flex gap-2">
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value as HttpMethod)}
              className="px-3 py-2 border rounded-lg bg-white text-gray-800"
            >
              {(["GET", "POST", "PUT", "DELETE", "PATCH"] as const).map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>

            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter request URL"
              className="flex-1 px-3 py-2 border rounded-lg"
            />

            <button
              onClick={sendRequest}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600 disabled:opacity-50"
              disabled={loading || !url.trim()}
            >
              <Send className="w-4 h-4" />
              Send
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <h2 className="text-lg font-semibold mb-2">Headers</h2>
                <HeadersEditor headers={headers} setHeaders={setHeaders} />
              </div>

              <div className="border rounded-lg p-4">
                <h2 className="text-lg font-semibold mb-2">Authorization</h2>
                <AuthorizationEditor
                  authorization={authorization}
                  setAuthorization={setAuthorization}
                />
              </div>

              <div className="border rounded-lg p-4">
                <h2 className="text-lg font-semibold mb-2">Request Body</h2>
                <RequestBodyEditor
                  body={body}
                  setBody={setBody}
                  method={method}
                />
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-2">Response</h2>
              <ResponseViewer response={response} loading={loading} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default APITester;
