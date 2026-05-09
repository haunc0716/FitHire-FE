import { getAuthSession } from '../../auth/services/authSession';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '');

function buildApiUrl(path) {
  if (!path.startsWith('/')) {
    return `${API_BASE_URL}/${path}`;
  }
  return `${API_BASE_URL}${path}`;
}

function resolveErrorMessage(payload, fallbackMessage) {
  if (payload && typeof payload === 'object' && typeof payload.message === 'string' && payload.message.trim()) {
    return payload.message.trim();
  }
  return fallbackMessage;
}

function buildAuthHeaders() {
  const session = getAuthSession();
  if (!session?.accessToken || Number(session.expiresAt) <= Date.now()) {
    throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
  }
  return {
    Authorization: `${session.tokenType ?? 'Bearer'} ${session.accessToken}`,
    'Content-Type': 'application/json',
  };
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
      headers: buildAuthHeaders(),
      ...options,
    });
  } catch (error) {
    if (error.message.includes('đăng nhập')) throw error;
    throw new Error('Không thể kết nối tới máy chủ. Vui lòng thử lại.');
  }

  const payload = await parseJsonSafely(response);
  if (!response.ok) {
    throw new Error(resolveErrorMessage(payload, `Yêu cầu thất bại (HTTP ${response.status}).`));
  }

  return payload;
}

export async function getAdminSubscriptions() {
  return requestJson('/api/admin/subscriptions');
}

export async function getAdminSubscriptionById(id) {
  return requestJson(`/api/admin/subscriptions/${id}`);
}

export async function createAdminSubscription(body) {
  return requestJson('/api/admin/subscriptions', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export async function updateAdminSubscription(id, body) {
  return requestJson(`/api/admin/subscriptions/${id}`, {
    method: 'PUT',
    body: JSON.stringify(body),
  });
}

export async function deleteAdminSubscription(id) {
  await requestJson(`/api/admin/subscriptions/${id}`, {
    method: 'DELETE',
  });
  return true;
}
