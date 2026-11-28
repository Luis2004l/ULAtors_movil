import { request } from '@/api/client';

export async function login(username: string, password: string) {
  return request<{ access_token: string; token_type: string }>('/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ username, password }).toString(),
  });
}
