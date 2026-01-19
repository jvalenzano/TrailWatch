
export class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
    this.name = 'ApiError';
  }
}

export const fetchApi = async <T>(url: string, options: RequestInit = {}): Promise<T> => {
  const response = await fetch(url, options);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'An unknown error occurred' }));
    throw new ApiError(errorData.message || 'An unknown error occurred', response.status);
  }
  return response.json();
};
