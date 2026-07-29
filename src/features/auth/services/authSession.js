const AUTH_SESSION_KEY = 'fithire.auth.session';
const NEVER_EXPIRES_AT = Number.MAX_SAFE_INTEGER;
const USER_SCOPED_CACHE_KEYS = [
  'fitHire_culturalFit',
  'fitHire_culturalFit_result',
];

function clearUserScopedCache() {
  USER_SCOPED_CACHE_KEYS.forEach((key) => localStorage.removeItem(key));
}

export function resolveHomeByRole(role) {
  return role === 'ADMIN' ? '/admin' : '/';
}

export function saveAuthSession(authPayload) {
  if (!authPayload || !authPayload.accessToken) {
    return null;
  }

  clearUserScopedCache();

  const expiresInSeconds = Number(authPayload.expiresInSeconds) || 0;
  const session = {
    accessToken: authPayload.accessToken,
    tokenType: authPayload.tokenType ?? 'Bearer',
    expiresInSeconds,
    expiresAt: NEVER_EXPIRES_AT,
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
    return {
      ...parsed,
      expiresAt: NEVER_EXPIRES_AT,
    };
  } catch {
    return null;
  }
}

export function isSessionValid(session) {
  return Boolean(session?.accessToken);
}

export function getSessionRole(session) {
  return session?.user?.role ?? null;
}

export function clearAuthSession() {
  clearUserScopedCache();
  localStorage.removeItem(AUTH_SESSION_KEY);
}
