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
        type: AuthType;
        token?: string;
        username?: string;
        password?: string;
      }
      
// New props interface for the Authorization component
export interface AuthorizationEditorProps {
    authorization: Authorization;
    setAuthorization: (auth: Authorization) => void;
  }