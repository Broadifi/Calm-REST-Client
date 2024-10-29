/* eslint-disable @typescript-eslint/no-explicit-any */
// Request-related types
export interface Header {
    key: string;
    value: string;
  }
  
  export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  
  export interface RequestConfig {
    method: HttpMethod;
    url: string;
    headers: Header[];
    body: string;
    authorization: Authorization;
  }
  
  // Response-related types
  export interface ResponseData {
    status: number;
    headers: Record<string, string>;
    data: any;
    time: number;
  }
  
  // Component Props types
  export interface HeadersEditorProps {
    headers: Header[];
    setHeaders: (headers: Header[]) => void;
  }
  
  export interface RequestBodyEditorProps {
    body: string;
    setBody: (body: string) => void;
    method: HttpMethod;
  }
  
  export interface ResponseViewerProps {
    response: ResponseData | null;
    loading: boolean;
  }
  
  export type ContentType = 
    | 'application/json'
    | 'application/x-www-form-urlencoded'
    | 'text/plain';

    export type AuthType = 'none' | 'bearer' | 'basic'; 

    export interface Authorization {
        type: string;
        token?: string;
        username?: string;
        password?: string;
      }
      
// New props interface for the Authorization component
export interface AuthorizationEditorProps {
    authorization: Authorization;
    setAuthorization: (auth: Authorization) => void;
  }

  export interface SavedRequest {
    id: string;
    name: string;
    method: HttpMethod;
    url: string;
  }
  
  export interface Collection {
    id: string;
    name: string;
    isOpen?: boolean;
    requests: SavedRequest[];
  }

export interface ContentTypeOption {
  value: ContentType;
  label: string;
  icon: React.ReactNode;
}

export interface HistoryEntry {
  id: string;                    // Unique identifier for the history entry
  timestamp: number;             // When the request was made
  
  // Request Details
  request: {
    url: string;                 // Full URL of the request
    method: HttpMethod;          // HTTP method
    headers: Record<string, string>;
    body?: string;               // Request body (if any)
    query?: Record<string, string>; // Query parameters
  };

  // Response Details
  response: {
    status: number;              // HTTP status code
    statusText: string;          // HTTP status text
    headers: Record<string, string>;
    body?: string;               // Response body
    size?: number;               // Size of the response in bytes
    timeMs: number;              // Time taken for the request in milliseconds
  };

  // Metadata
  metadata: {
    collectionId?: string;       // ID of the collection if request was from a collection
    requestId?: string;          // ID of the saved request if it was from a collection
    environment?: string;        // Environment used for the request
    name?: string;               // Optional name for the request
    tags?: string[];            // Optional tags for filtering/organization
  };

  // Error information (if request failed)
  error?: {
    message: string;
    code?: string;
    details?: string;
  };
}

// Helper type for creating a new history entry
export type CreateHistoryEntry = Omit<HistoryEntry, 'id' | 'timestamp'>;