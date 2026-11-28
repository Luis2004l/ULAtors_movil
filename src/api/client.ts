export class ApiError extends Error {
  constructor(public status: number, public detail: unknown) {
    super(`API ${status}`);
  }
}

const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://ulamonitors-uat-back.grye.org';

let authToken: string | null = null;
let onUnauthorized: (() => void) | null = null;

export const setAuthToken = (token: string | null) => {
  authToken = token;
};

export const setUnauthorizedHandler = (handler: () => void) => {
  onUnauthorized = handler;
};

export async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const headers: Record<string, string> = {
    Accept: 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });
  const body =
    response.status === 204
      ? null
      : await response.json().catch(() => null);

  if (!response.ok) {
    if (response.status === 401 && path !== '/token') {
      onUnauthorized?.();
    }
    throw new ApiError(response.status, body?.detail ?? body);
  }

  return body as T;
}

export const jsonBody = (data: unknown): RequestInit => ({
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data),
});
