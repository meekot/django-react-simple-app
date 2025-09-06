import { ACCESS_TOKEN, REFRESH_TOKEN } from "./constants";
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  User,
  Note,
  CreateNoteRequest,
} from "./types/api";

export class ApiError extends Error {
  public status: number;
  public details?: any;

  constructor({
    message,
    status,
    details,
  }: {
    message: string;
    status: number;
    details?: any;
  }) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

type RequestInterceptor = (
  options: RequestInit & { url: string },
) => RequestInit;
type ResponseInterceptor = (
  response: Response,
  originalRequest: () => Promise<Response>,
) => Promise<Response>;

type FetchClientConfig = {
  baseUrl?: string;
  requestInterceptors?: RequestInterceptor[];
  responseInterceptors?: ResponseInterceptor[];
};

class FetchClient {
  private baseURL = "";
  private requestInterceptors: RequestInterceptor[] = [];
  private responseInterceptors: ResponseInterceptor[] = [];

  constructor(config: FetchClientConfig = {}) {
    this.baseURL = config.baseUrl ?? this.baseURL;

    this.requestInterceptors =
      config?.requestInterceptors ?? this.requestInterceptors;
    this.responseInterceptors =
      config?.responseInterceptors ?? this.responseInterceptors;

    this.addResponseInterceptor(this.errorHandlingInterceptor);
  }

  addRequestInterceptor(interceptor: RequestInterceptor): void {
    this.requestInterceptors.push(interceptor);
  }

  addResponseInterceptor(interceptor: ResponseInterceptor): void {
    this.responseInterceptors.push(interceptor);
  }

  private errorHandlingInterceptor: ResponseInterceptor = async (
    response: Response,
  ): Promise<Response> => {
    if (!response.ok) {
      const errorText = await response.text();
      let errorDetails;

      try {
        errorDetails = JSON.parse(errorText);
      } catch {
        errorDetails = errorText;
      }

      throw new ApiError({
        message: `HTTP ${response.status}: ${response.statusText}`,
        status: response.status,
        details: errorDetails,
      });
    }

    return response;
  };

  async fetch(url: string, options: RequestInit = {}): Promise<Response> {
    const fullUrl = url.startsWith("http") ? url : `${this.baseURL}${url}`;

    // Apply request interceptors
    let processedOptions = options;

    for (const interceptor of this.requestInterceptors) {
      processedOptions = interceptor({ ...processedOptions, url });
    }

    // Create original request function for retry logic
    const makeRequest = async (): Promise<Response> => {
      return await fetch(fullUrl, processedOptions);
    };

    // Make initial request
    let response = await makeRequest();

    // Apply response interceptors
    for (const interceptor of this.responseInterceptors) {
      response = await interceptor(response, makeRequest);
    }

    return response;
  }

  // Helper method to get JSON response
  async fetchJson<T, B = Record<string, any>>(
    url: string,
    options?: Omit<RequestInit, "body"> & { body: B },
  ): Promise<Response & { data: T }> {
    const response = await this.fetch(url, {
      ...options,
      body: options?.body ? JSON.stringify(options?.body) : undefined,
    });
    const contentType = response.headers.get("content-type");

    const data =
      contentType && contentType.includes("application/json")
        ? await response.json()
        : ({} as T);

    return { ...response, data };
  }
}

// Create and export the configured client
export const apiClient = new FetchClient({
  baseUrl: import.meta.env.VITE_API_URL,
  requestInterceptors: [
    (options: RequestInit): RequestInit => {
      const token = localStorage.getItem(ACCESS_TOKEN);

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...(options.headers as Record<string, string>),
        Authorization: `Bearer ${token ?? undefined}`,
      };

      return {
        ...options,
        headers,
      };
    },
  ],
});

// Export API methods using the client
export const api = {
  // Authentication
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = (
      await apiClient.fetchJson<LoginResponse, typeof credentials>(
        "/api/token/",
        { method: "POST", body: credentials },
      )
    ).data;

    // Store tokens
    localStorage.setItem(ACCESS_TOKEN, response.access);
    localStorage.setItem(REFRESH_TOKEN, response.refresh);

    return response;
  },

  register: async (userData: RegisterRequest): Promise<User> => {
    return (
      await apiClient.fetchJson<User>("/api/user/register/", {
        method: "POST",
        body: userData,
      })
    ).data;
  },

  // Users
  getUsers: async (): Promise<User[]> => {
    return (await apiClient.fetchJson<User[]>("/api/users/")).data;
  },

  // Notes
  getNotes: async (): Promise<Note[]> => {
    return (await apiClient.fetchJson<Note[]>("/api/notes/")).data;
  },


  createNote: async (noteData: CreateNoteRequest): Promise<Note> => {
    return (
      await apiClient.fetchJson<Note>("/api/notes/", {
        method: "POST",
        body: noteData,
      })
    ).data;
  },

  deleteNote: async (id: number): Promise<void> => {
    await apiClient.fetch(`/api/notes/delete/${id}/`, { method: "DELETE" });
  },

  adminDeleteNote: async (id: number): Promise<void> => {
    await apiClient.fetch(`/api/notes/admin/delete/${id}/`, { method: "DELETE" });
  },

  // Get current user info
  getCurrentUser: async (): Promise<User> => {
    return (await apiClient.fetchJson<User>("/api/user/me/")).data;
  },
};

// Export the FetchClient class for custom instances
export default FetchClient;
