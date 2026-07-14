import { getAuthSession } from '../../auth/services/authSession';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '');

function buildApiUrl(path) {
  return path.startsWith('/') ? `${API_BASE_URL}${path}` : `${API_BASE_URL}/${path}`;
}

function buildAuthHeaders() {
  const session = getAuthSession();
  if (!session?.accessToken || Number(session.expiresAt) <= Date.now()) {
    throw new Error('Phi?n ??ng nh?p ?? h?t h?n. Vui l?ng ??ng nh?p l?i.');
  }

  return {
    Authorization: `${session.tokenType ?? 'Bearer'} ${session.accessToken}`,
    'Content-Type': 'application/json',
  };
}

async function parseJsonSafely(response) {
  const contentType = response.headers.get('content-type') ?? '';
  if (!contentType.includes('application/json')) return null;
  try {
    return await response.json();
  } catch {
    return null;
  }
}

async function requestJson(path, options = {}) {
  let response;
  try {
    response = await fetch(buildApiUrl(path), {
      credentials: 'include',
      headers: {
        ...buildAuthHeaders(),
        ...(options.headers ?? {}),
      },
      ...options,
    });
  } catch (error) {
    if (error?.message?.includes('dang nhap')) throw error;
    throw new Error('Kh?ng th? k?t n?i t?i m?y ch?. Vui l?ng th? l?i.');
  }

  const payload = await parseJsonSafely(response);
  if (!response.ok) {
    throw new Error(payload?.message || `Y?u c?u th?t b?i (HTTP ${response.status}).`);
  }

  return payload;
}

export function getUserExperienceSurveys() {
  return requestJson('/api/admin/user-experience-surveys', {
    method: 'GET',
  });
}
