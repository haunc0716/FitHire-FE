const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '');

function buildApiUrl(path) {
  if (!path.startsWith('/')) {
    return `${API_BASE_URL}/${path}`;
  }
  return `${API_BASE_URL}${path}`;
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

  if (!response.ok) {
    let message = `Yêu cầu thất bại (HTTP ${response.status}).`;
    try {
      const payload = await response.json();
      message = payload?.message || message;
    } catch {
      // Ignore
    }
    throw new Error(message);
  }

  try {
    return await response.json();
  } catch {
    return null;
  }
}

export async function markPaymentSuccess(paymentId) {
  return requestJson(`/api/admin/payments/${paymentId}/success`, {
    method: 'POST',
  });
}

export async function markPaymentFailed(paymentId) {
  return requestJson(`/api/admin/payments/${paymentId}/failed`, {
    method: 'POST',
  });
}
