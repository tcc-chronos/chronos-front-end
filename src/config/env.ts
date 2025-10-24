type EnvConfig = {
  apiBaseUrl: string;
};

const loadEnvConfig = (): EnvConfig => {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  if (!apiBaseUrl) {
    throw new Error('VITE_API_BASE_URL nao esta configurada.');
  }

  return {
    apiBaseUrl,
  };
};

export const env = loadEnvConfig();
