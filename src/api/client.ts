import type { DailyCheckIn, Homework, StudentProfile } from '@/types';

const DEFAULT_BACKEND_URL =
  import.meta.env.VITE_MENTOR_BACKEND_URL?.replace(/\/$/, '') || 'http://localhost:8000';
const SSE_PREFIX = 'data:';
const DONE_MARKER = '[DONE]';

type Nullable<T> = T | null;

export type StudentProfileRecord = Partial<StudentProfile> & {
  id: string;
  onboardingComplete?: boolean;
};

export type StudentGoalsPayload = Partial<
  Pick<StudentProfile, 'currentGoals' | 'shortTermGoals' | 'longTermGoals' | 'interests' | 'careerAspirations' | 'dreamJob'>
>;

interface GoalsResponse {
  goals: StudentGoalsPayload | null;
}

interface HomeworkResponse {
  homework: Homework[];
}

const ensureResponseBody = (response: Response): ReadableStream<Uint8Array> => {
  if (!response.body) {
    throw new Error('Backend response is missing a readable body');
  }
  return response.body;
};

const normalizeSseLine = (line: string): string | null => {
  const trimmed = line.trim();
  if (!trimmed) {
    return null;
  }
  if (trimmed === DONE_MARKER) {
    return DONE_MARKER;
  }
  return trimmed.startsWith(SSE_PREFIX) ? trimmed.slice(SSE_PREFIX.length).trim() : trimmed;
};

const apiUrl = (path: string): string => `${DEFAULT_BACKEND_URL}${path.startsWith('/') ? path : `/${path}`}`;

export async function getStudentProfile(token: string): Promise<Nullable<StudentProfileRecord>> {
  const response = await fetch(apiUrl('/profile'), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to load profile (${response.status}): ${errorText}`);
  }

  return (await response.json()) as StudentProfileRecord;
}

interface StreamOnboardingChatOptions {
  token: string;
  message: string;
  onData: (chunk: string) => void;
  onComplete?: () => void;
  signal?: AbortSignal;
}

export async function streamOnboardingChat({
  token,
  message,
  onData,
  onComplete,
  signal,
}: StreamOnboardingChatOptions): Promise<void> {
  const response = await fetch(apiUrl('/onboarding/chat'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ message }),
    signal,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Onboarding chat failed (${response.status}): ${errorText}`);
  }

  const reader = ensureResponseBody(response).getReader();
  const decoder = new TextDecoder('utf-8');
  let buffer = '';
  let streamComplete = false;

  const flushBuffer = (): void => {
    let newlineIndex = buffer.indexOf('\n');
    while (newlineIndex !== -1) {
      const line = buffer.slice(0, newlineIndex);
      buffer = buffer.slice(newlineIndex + 1);
      const normalized = normalizeSseLine(line);
      if (normalized === DONE_MARKER) {
        streamComplete = true;
        onComplete?.();
        return;
      }
      if (normalized) {
        onData(normalized);
      }
      newlineIndex = buffer.indexOf('\n');
    }
  };

  while (true) {
    const { value, done } = await reader.read();
    if (done) {
      buffer += decoder.decode();
      flushBuffer();
      break;
    }

    buffer += decoder.decode(value, { stream: true });
    flushBuffer();
    if (streamComplete) {
      break;
    }
  }

  if (!streamComplete) {
    onComplete?.();
  }
}

export async function updateProfile(token: string, data: Record<string, unknown>): Promise<StudentProfileRecord> {
  const response = await fetch(apiUrl('/profile/update'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to update profile (${response.status}): ${errorText}`);
  }

  return (await response.json()) as StudentProfileRecord;
}

export async function postCheckIn(token: string, data: Record<string, unknown>): Promise<DailyCheckIn> {
  const response = await fetch(apiUrl('/checkin'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to submit check-in (${response.status}): ${errorText}`);
  }

  return (await response.json()) as DailyCheckIn;
}

export async function getGoals(token: string): Promise<GoalsResponse> {
  const response = await fetch(apiUrl('/goals'), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to load goals (${response.status}): ${errorText}`);
  }

  return (await response.json()) as GoalsResponse;
}

export async function updateGoals(token: string, goals: StudentGoalsPayload): Promise<GoalsResponse> {
  const response = await fetch(apiUrl('/goal'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ goals }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to save goals (${response.status}): ${errorText}`);
  }

  return (await response.json()) as GoalsResponse;
}

export async function getHomework(token: string): Promise<HomeworkResponse> {
  const response = await fetch(apiUrl('/homework'), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to load homework (${response.status}): ${errorText}`);
  }

  return (await response.json()) as HomeworkResponse;
}

