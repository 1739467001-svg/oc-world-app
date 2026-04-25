// Local API client
export const client = {
  api: {
    fetch: (url: string, options?: RequestInit) =>
      fetch(url, {
        ...options,
        headers: {
          ...options?.headers,
        },
        credentials: "include" as RequestCredentials,
      }),
  },
};
