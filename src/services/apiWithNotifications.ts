/**
 * Enhanced API service with automatic error handling
 */

const API_BASE_URL = 'http://localhost:8000';

// Global error handler - will be set by the app
let globalErrorHandler: ((error: unknown, context?: string) => void) | null =
  null;
let globalSuccessHandler: ((message: string, details?: string) => void) | null =
  null;

export const setGlobalErrorHandler = (
  handler: (error: unknown, context?: string) => void
) => {
  globalErrorHandler = handler;
};

export const setGlobalSuccessHandler = (
  handler: (message: string, details?: string) => void
) => {
  globalSuccessHandler = handler;
};

const handleError = (error: unknown, context?: string) => {
  console.error(`API Error${context ? ` (${context})` : ''}:`, error);
  if (globalErrorHandler) {
    globalErrorHandler(error, context);
  }
  throw error;
};

const handleSuccess = (message: string, details?: string) => {
  if (globalSuccessHandler) {
    globalSuccessHandler(message, details);
  }
};

export const apiWithNotifications = {
  get: async <T>(endpoint: string, context?: string): Promise<T> => {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      handleError(error, context || `GET ${endpoint}`);
      throw error; // This will never be reached due to handleError throwing
    }
  },

  post: async <T>(
    endpoint: string,
    data?: unknown,
    context?: string
  ): Promise<T> => {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: data ? JSON.stringify(data) : undefined,
      });

      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          console.error('API Error Details:', errorData);
          console.error(
            'Full Error Object:',
            JSON.stringify(errorData, null, 2)
          );

          // Try to extract meaningful error message
          if (errorData.detail) {
            errorMessage =
              typeof errorData.detail === 'string'
                ? errorData.detail
                : JSON.stringify(errorData.detail);
          } else if (errorData.message) {
            errorMessage = errorData.message;
          } else if (errorData.error) {
            errorMessage = errorData.error;
          } else {
            errorMessage = `${errorMessage} - ${JSON.stringify(errorData)}`;
          }
        } catch (parseError) {
          console.error('Failed to parse error response:', parseError);
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();

      // Show success notification for POST operations
      if (context) {
        handleSuccess(`${context} realizada com sucesso`);
      }

      return result;
    } catch (error) {
      handleError(error, context || `POST ${endpoint}`);
      throw error; // This will never be reached due to handleError throwing
    }
  },

  put: async <T>(
    endpoint: string,
    data?: unknown,
    context?: string
  ): Promise<T> => {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: data ? JSON.stringify(data) : undefined,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      // Show success notification for PUT operations
      if (context) {
        handleSuccess(`${context} atualizada com sucesso`);
      }

      return result;
    } catch (error) {
      handleError(error, context || `PUT ${endpoint}`);
      throw error; // This will never be reached due to handleError throwing
    }
  },

  delete: async <T>(endpoint: string, context?: string): Promise<T> => {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Check if response has content
      const text = await response.text();
      const result = text ? JSON.parse(text) : ({} as T);

      // Show success notification for DELETE operations
      if (context) {
        handleSuccess(`${context} removida com sucesso`);
      }

      return result;
    } catch (error) {
      handleError(error, context || `DELETE ${endpoint}`);
      throw error; // This will never be reached due to handleError throwing
    }
  },
};

// Keep original api for backward compatibility
export const api = {
  get: async <T>(endpoint: string): Promise<T> => {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API GET error:', error);
      throw error;
    }
  },

  post: async <T>(endpoint: string, data?: unknown): Promise<T> => {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: data ? JSON.stringify(data) : undefined,
      });

      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          console.error('API Error Details:', errorData);
          console.error(
            'Full Error Object:',
            JSON.stringify(errorData, null, 2)
          );

          // Try to extract meaningful error message
          if (errorData.detail) {
            errorMessage =
              typeof errorData.detail === 'string'
                ? errorData.detail
                : JSON.stringify(errorData.detail);
          } else if (errorData.message) {
            errorMessage = errorData.message;
          } else if (errorData.error) {
            errorMessage = errorData.error;
          } else {
            errorMessage = `${errorMessage} - ${JSON.stringify(errorData)}`;
          }
        } catch (parseError) {
          console.error('Failed to parse error response:', parseError);
        }
        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error) {
      console.error('API POST error:', error);
      throw error;
    }
  },

  put: async <T>(endpoint: string, data?: unknown): Promise<T> => {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: data ? JSON.stringify(data) : undefined,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API PUT error:', error);
      throw error;
    }
  },

  delete: async <T>(endpoint: string): Promise<T> => {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Check if response has content
      const text = await response.text();
      return text ? JSON.parse(text) : ({} as T);
    } catch (error) {
      console.error('API DELETE error:', error);
      throw error;
    }
  },
};
