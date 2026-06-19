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
  if (!contentType.includes('application/json')) {
    return null;
  }

  try {
    return await response.json();
  } catch {
    return null;
  }
}

function buildRequestError(response, payload) {
  const message = payload?.message?.trim?.() || `Yêu cầu thất bại (HTTP ${response.status}).`;
  const error = new Error(message);
  error.status = response.status;
  error.code = payload?.errorCode?.trim?.() || payload?.code?.trim?.() || '';
  return error;
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
    throw buildRequestError(response, payload);
  }

  return payload;
}

async function requestBlob(path, options = {}) {
  let response;

  try {
    response = await fetch(buildApiUrl(path), {
      credentials: 'include',
      ...options,
    });
  } catch {
    throw new Error('Không thể kết nối tới máy chủ. Vui lòng thử lại.');
  }

  if (!response.ok) {
    const payload = await parseJsonSafely(response);
    throw buildRequestError(response, payload);
  }

  return response.blob();
}

export function fetchMyProfile() {
  return requestJson('/api/users/me', {
    method: 'GET',
    headers: buildAuthHeaders(),
  });
}

export function fetchMyCulturalFitResult() {
  return requestJson('/api/assessments/me/result', {
    method: 'GET',
    headers: buildAuthHeaders(),
  });
}

export function updateMyProfile({ fullName, avatarUrl }) {
  return requestJson('/api/users/me', {
    method: 'PUT',
    headers: buildAuthHeaders(),
    body: JSON.stringify({ fullName, avatarUrl }),
  });
}

export function fetchMyEntitlements() {
  return requestJson('/api/subscriptions/me/entitlements', {
    method: 'GET',
    headers: buildAuthHeaders(),
  });
}

export function fetchMySubscriptions() {
  return requestJson('/api/subscriptions/me', {
    method: 'GET',
    headers: buildAuthHeaders(),
  });
}

export function fetchMyCvs() {
  return requestJson('/api/cv', {
    method: 'GET',
    headers: buildAuthHeaders(),
  });
}

export function scoreCv(file) {
  const formData = new FormData();
  formData.append('file', file);

  return requestJson('/api/cv-scoring', {
    method: 'POST',
    headers: buildAuthHeaders({ json: false }),
    body: formData,
  });
}

export function fetchCvScoringHistory({ page = 0, size = 10 } = {}) {
  const params = new URLSearchParams({
    page: String(page),
    size: String(size),
    sort: 'createdAt,desc',
  });

  return requestJson(`/api/cv-scoring/history?${params.toString()}`, {
    method: 'GET',
    headers: buildAuthHeaders(),
  });
}

export function fetchCvScoringDetail(sessionId) {
  return requestJson(`/api/cv-scoring/${sessionId}`, {
    method: 'GET',
    headers: buildAuthHeaders(),
  });
}

export function startMockInterviewSession(payload) {
  return requestJson('/api/mock-interview/sessions', {
    method: 'POST',
    headers: buildAuthHeaders(),
    body: JSON.stringify(payload),
  });
}

export function submitMockInterviewAnswer(sessionId, payload) {
  return requestJson(`/api/mock-interview/sessions/${sessionId}/answers`, {
    method: 'POST',
    headers: buildAuthHeaders(),
    body: JSON.stringify(payload),
  });
}

export async function transcribeMockInterviewVoice({ file, sessionId, questionId, audioDurationMs }) {
  const formData = new FormData();
  formData.append('file', file);

  if (sessionId) {
    formData.append('sessionId', sessionId);
  }

  if (questionId) {
    formData.append('questionId', questionId);
  }

  if (audioDurationMs != null) {
    formData.append('audioDurationMs', String(audioDurationMs));
  }

  const payload = await requestJson('/api/speech/transcribe', {
    method: 'POST',
    headers: buildAuthHeaders({ json: false }),
    body: formData,
  });

  if (payload?.success === false) {
    const error = new Error(payload?.message || 'Transcription failed.');
    error.code = payload?.errorCode || '';
    throw error;
  }

  return payload?.data ?? payload;
}

export function speakMockInterviewText({ text, voice }) {
  return requestBlob('/api/mock-interview/voice/speak', {
    method: 'POST',
    headers: buildAuthHeaders(),
    body: JSON.stringify({ text, voice }),
  });
}

export function fetchMockInterviewAnswerAudio(answerId) {
  return requestBlob(`/api/mock-interview/answers/${answerId}/audio`, {
    method: 'GET',
    headers: buildAuthHeaders({ json: false }),
  });
}

export function completeMockInterviewSession(sessionId) {
  return requestJson(`/api/mock-interview/sessions/${sessionId}/complete`, {
    method: 'POST',
    headers: buildAuthHeaders(),
  });
}

export function cancelMockInterviewSession(sessionId) {
  return requestJson(`/api/mock-interview/sessions/${sessionId}/cancel`, {
    method: 'POST',
    headers: buildAuthHeaders(),
  });
}

export function fetchMockInterviewHistory({ page = 0, size = 10 } = {}) {
  const params = new URLSearchParams({
    page: String(page),
    size: String(size),
    sort: 'createdAt,desc',
  });

  return requestJson(`/api/mock-interview/sessions/history?${params.toString()}`, {
    method: 'GET',
    headers: buildAuthHeaders(),
  });
}

export function fetchMockInterviewDetail(sessionId) {
  return requestJson(`/api/mock-interview/sessions/${sessionId}`, {
    method: 'GET',
    headers: buildAuthHeaders(),
  });
}
