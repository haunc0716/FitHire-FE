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

function buildAuthHeaders() {
  const session = getAuthSession();
  if (!session?.accessToken || Number(session.expiresAt) <= Date.now()) {
    throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
  }
  return {
    Authorization: `${session.tokenType ?? 'Bearer'} ${session.accessToken}`,
  };
}

async function requestJson(path, options = {}) {
  let response;
  try {
    response = await fetch(buildApiUrl(path), {
      credentials: 'include',
      ...options,
    });
  } catch {
    throw new Error('Không thể kết nối tới máy chủ. Vui lòng thử lại.');
  }

  const payload = await parseJsonSafely(response);
  if (!response.ok) {
    throw new Error(resolveErrorMessage(payload, `Yêu cầu thất bại (HTTP ${response.status}).`));
  }

  return payload;
}

export function fetchPricingPlans() {
  return requestJson('/api/subscriptions/plans', {
    method: 'GET',
  });
}

export function checkoutSubscription(subscriptionCode, autoRenew = false) {
  return requestJson('/api/subscriptions/checkout', {
    method: 'POST',
    headers: {
      ...buildAuthHeaders(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      subscriptionCode,
      autoRenew,
    }),
  });
}

export function simulatePaymentSuccess(paymentId) {
  return requestJson(`/api/subscriptions/payments/${paymentId}/success`, {
    method: 'POST',
    headers: {
      ...buildAuthHeaders(),
    },
  });
}

export function simulatePaymentFailed(paymentId) {
  return requestJson(`/api/subscriptions/payments/${paymentId}/failed`, {
    method: 'POST',
    headers: {
      ...buildAuthHeaders(),
    },
  });
}

export function fetchMySubscriptions() {
  return requestJson('/api/subscriptions/me', {
    method: 'GET',
    headers: {
      ...buildAuthHeaders(),
    },
  });
}

export function fetchMyEntitlements() {
  return requestJson('/api/subscriptions/me/entitlements', {
    method: 'GET',
    headers: {
      ...buildAuthHeaders(),
    },
  });
}

export function fetchPaymentHistory(params = {}) {
  const query = new URLSearchParams(params).toString();
  return requestJson(`/api/payments/me?${query}`, {
    method: 'GET',
    headers: {
      ...buildAuthHeaders(),
    },
  });
}

export function fetchPaymentDetails(paymentId) {
  return requestJson(`/api/payments/${paymentId}`, {
    method: 'GET',
    headers: {
      ...buildAuthHeaders(),
    },
  });
}

export function fetchPaymentByOrderCode(orderCode) {
  const query = new URLSearchParams({ orderCode: String(orderCode) }).toString();
  return requestJson(`/api/payments/by-order-code?${query}`, {
    method: 'GET',
    headers: {
      ...buildAuthHeaders(),
    },
  });
}

export function reportPayment(paymentId) {
  return requestJson(`/api/payments/${paymentId}/report`, {
    method: 'POST',
    headers: {
      ...buildAuthHeaders(),
    },
  });
}
export function cancelPayment(paymentId) {
  return requestJson(`/api/payments/${paymentId}/cancel`, {
    method: 'POST',
    headers: {
      ...buildAuthHeaders(),
    },
  });
}

export function fetchPaymentSummary() {
  return requestJson('/api/payments/me/summary', {
    method: 'GET',
    headers: {
      ...buildAuthHeaders(),
    },
  });
}
