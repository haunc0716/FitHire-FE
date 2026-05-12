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

async function postJson(path, body) {
  let response;
  try {
    response = await fetch(buildApiUrl(path), {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body ?? {}),
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

export async function loginWithGoogle(idToken) {
  if (!idToken) {
    throw new Error('Không nhận được Google ID token.');
  }

  return postJson('/api/auth/google', { idToken });
}

export async function loginWithEmailPassword({ email, password }) {
  if (!email || !password) {
    throw new Error('Vui lòng nhập email và mật khẩu.');
  }

  return postJson('/api/auth/login', { email, password });
}

export async function registerWithEmailPassword({ fullName, email, password }) {
  if (!fullName || !email || !password) {
    throw new Error('Vui lòng nhập đầy đủ thông tin đăng ký.');
  }

  return postJson('/api/auth/register', { fullName, email, password });
}

export async function verifyEmail({ email, code }) {
  if (!email || !code) {
    throw new Error('Vui lòng nhập email và mã xác thực.');
  }

  return postJson('/api/auth/verify-email', { email, code });
}

export async function resendVerificationCode(email) {
  if (!email) {
    throw new Error('Vui lòng nhập email để gửi lại mã xác thực.');
  }

  return postJson('/api/auth/resend-verification-code', { email });
}
