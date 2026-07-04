const rawBase = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';
export const apiBaseUrl = rawBase.endsWith('/api') ? rawBase.replace(/\/$/, '') : rawBase.replace(/\/$/, '') + '/api';

async function handleResponse(response: Response) {
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    const message = data?.message || data?.error || response.statusText;
    throw new Error(message || 'API request failed');
  }
  return data;
}

export const api = {
  async get(endpoint: string) {
    const url = endpoint.startsWith('/') ? `${apiBaseUrl}${endpoint}` : `${apiBaseUrl}/${endpoint}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include'
    });
    return handleResponse(response);
  },

  async post(endpoint: string, body?: any) {
    const url = endpoint.startsWith('/') ? `${apiBaseUrl}${endpoint}` : `${apiBaseUrl}/${endpoint}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: body ? JSON.stringify(body) : undefined
    });
    return handleResponse(response);
  },

  async put(endpoint: string, body?: any) {
    const url = endpoint.startsWith('/') ? `${apiBaseUrl}${endpoint}` : `${apiBaseUrl}/${endpoint}`;
    const response = await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: body ? JSON.stringify(body) : undefined
    });
    return handleResponse(response);
  },

  async delete(endpoint: string) {
    const url = endpoint.startsWith('/') ? `${apiBaseUrl}${endpoint}` : `${apiBaseUrl}/${endpoint}`;
    const response = await fetch(url, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include'
    });
    return handleResponse(response);
  }
};

export async function loginUser(body: { email: string; password: string }) {
  return api.post('/auth/login', body);
}

export async function registerUser(body: { name: string; email: string; password: string; role: string }) {
  return api.post('/auth/register', body);
}

export async function logoutUser() {
  return api.post('/auth/logout');
}

export async function getCurrentUser() {
  return api.get('/auth/me');
}

export async function fetchStudentDashboard() {
  return api.get('/student/dashboard');
}

export async function fetchLecturerDashboard() {
  return api.get('/lecturer/dashboard');
}

export async function fetchLecturerStudents() {
  return api.get('/lecturer/students');
}

export async function fetchAdminDashboard() {
  return api.get('/admin/dashboard');
}

export async function fetchAdminUsers() {
  return api.get('/admin/users');
}
