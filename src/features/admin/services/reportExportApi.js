import { getAuthSession } from '../../auth/services/authSession';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '');

function buildApiUrl(path) {
  return path.startsWith('/') ? `${API_BASE_URL}${path}` : `${API_BASE_URL}/${path}`;
}

function buildAuthHeaders({ json = true } = {}) {
  const session = getAuthSession();
  if (!session?.accessToken || Number(session.expiresAt) <= Date.now()) {
    throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
  }

  const headers = {
    Authorization: `${session.tokenType ?? 'Bearer'} ${session.accessToken}`,
  };

  if (json) {
    headers['Content-Type'] = 'application/json';
  }

  return headers;
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
    if (error?.message?.includes('đăng nhập')) throw error;
    throw new Error('Không thể kết nối tới máy chủ. Vui lòng thử lại.');
  }

  const payload = await parseJsonSafely(response);
  if (!response.ok) {
    throw new Error(payload?.message || `Yêu cầu thất bại (HTTP ${response.status}).`);
  }

  return payload;
}

async function requestBlob(path, payload) {
  let response;
  try {
    response = await fetch(buildApiUrl(path), {
      method: 'POST',
      credentials: 'include',
      headers: buildAuthHeaders(),
      body: JSON.stringify(payload),
    });
  } catch (error) {
    if (error?.message?.includes('đăng nhập')) throw error;
    throw new Error('Không thể kết nối tới máy chủ. Vui lòng thử lại.');
  }

  if (!response.ok) {
    const errorPayload = await parseJsonSafely(response);
    throw new Error(errorPayload?.message || `Yêu cầu thất bại (HTTP ${response.status}).`);
  }

  return response.blob();
}

export function previewStartupPerformanceReport(payload) {
  return requestJson('/api/admin/reports/startup-performance/preview', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function downloadStartupPerformancePdf(payload) {
  return requestBlob('/api/admin/reports/startup-performance/pdf', payload);
}

export function downloadStartupPerformanceExcel(payload) {
  return requestBlob('/api/admin/reports/startup-performance/excel', payload);
}
