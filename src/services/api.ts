/**
 * Base API configuration and utilities
 */

const API_BASE_URL = 'http://localhost:8000';

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
