const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '');

function buildApiUrl(path) {
  if (!path.startsWith('/')) {
    return `${API_BASE_URL}/${path}`;
  }
  return `${API_BASE_URL}${path}`;
}

async function parseJsonSafely(response) {
  const contentType = response.headers.get('content-type') ?? '';
  if (!contentType.includes('application/json')) {
    return null;
  }
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
        'Content-Type': 'application/json',
        ...(options.headers ?? {}),
      },
      ...options,
    });
  } catch {
    throw new Error('Không thể kết nối tới máy chủ. Vui lòng thử lại.');
  }

  const payload = await parseJsonSafely(response);
  if (!response.ok) {
    throw new Error(payload?.message || `Yêu cầu thất bại (HTTP ${response.status}).`);
  }

  return payload;
}

export async function getAdminUsers() {
  return requestJson('/api/admin/users');
}
