import { getAuthSession } from '../../auth/services/authSession';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '');

function buildApiUrl(path) {
  return path.startsWith('/') ? `${API_BASE_URL}${path}` : `${API_BASE_URL}/${path}`;
}

const buildAuthHeaders = () => {
    const session = getAuthSession();
    return {
        Authorization: `Bearer ${session?.accessToken}`,
        'Content-Type': 'application/json',
    };
};

export const fetchAssessmentQuestions = async () => {
    const response = await fetch(buildApiUrl('/api/assessments/questions'), {
        headers: buildAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch questions');
    return response.json();
};

export const submitAssessment = async (answers) => {
    const response = await fetch(buildApiUrl('/api/assessments/submit'), {
        method: 'POST',
        headers: buildAuthHeaders(),
        body: JSON.stringify({ answers }),
    });
    if (!response.ok) throw new Error('Failed to submit assessment');
    return response.json();
};

