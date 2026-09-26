export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  role: 'aluno' | 'instrutor';
}

export interface Exercise {
  id: string;
  name: string;
  group: string;
  series: number;
  repetitions: number;
  thumb: string;
  demo: string;
}

export interface HistoryItem {
  id: string;
  name: string;
  group: string;
  createdAt: string;
}

export interface HistoryDay {
  date: string;
  items: HistoryItem[];
}

const tokenKey = 'pucgym.token';

export function getToken(): string | null {
  return localStorage.getItem(tokenKey);
}

export function setToken(token: string | null): void {
  if (token) {
    localStorage.setItem(tokenKey, token);
  } else {
    localStorage.removeItem(tokenKey);
  }
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: unknown;
}

export async function api<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  let response: Response;
  try {
    response = await fetch(`/api${path}`, {
      method: options.method ?? 'GET',
      headers,
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
    });
  } catch {
    throw new Error('Sem conexão com o servidor. Tente novamente.');
  }
  if (response.status === 204) {
    return undefined as T;
  }
  const data = (await response.json().catch(() => ({}))) as { message?: string };
  if (!response.ok) {
    throw new Error(data.message ?? 'Não foi possível concluir. Tente novamente.');
  }
  return data as T;
}
