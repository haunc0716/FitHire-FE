const AUTH_SESSION_KEY = 'fithire.auth.session';

export function resolveHomeByRole(role) {
  return role === 'ADMIN' ? '/admin' : '/user';
}

export function saveAuthSession(authPayload) {
  if (!authPayload || !authPayload.accessToken) {
    return null;
  }

  const expiresInSeconds = Number(authPayload.expiresInSeconds) || 0;
  const expiresAt = Date.now() + expiresInSeconds * 1000;

  const session = {
    accessToken: authPayload.accessToken,
    tokenType: authPayload.tokenType ?? 'Bearer',
    expiresInSeconds,
    expiresAt,
    user: authPayload.user ?? null,
  };

  localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
  return session;
}

export function getAuthSession() {
  const raw = localStorage.getItem(AUTH_SESSION_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw);
    if (!parsed?.accessToken) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function isSessionValid(session) {
  return Boolean(session?.accessToken && Number(session?.expiresAt) > Date.now());
}

export function getSessionRole(session) {
  return session?.user?.role ?? null;
}

export function clearAuthSession() {
  localStorage.removeItem(AUTH_SESSION_KEY);
}
