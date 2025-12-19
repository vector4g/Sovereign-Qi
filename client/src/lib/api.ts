// API client with session management

const API_BASE = "/api";

// Session management
let sessionId: string | null = localStorage.getItem("sovereign_qi_session");

export function setSessionId(id: string | null) {
  sessionId = id;
  if (id) {
    localStorage.setItem("sovereign_qi_session", id);
  } else {
    localStorage.removeItem("sovereign_qi_session");
  }
}

export function getSessionId() {
  return sessionId;
}

async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> || {}),
  };

  if (sessionId) {
    headers["x-session-id"] = sessionId;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Request failed" }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
}

// Auth API
export const authApi = {
  async login(email: string) {
    const data = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    }).then(res => res.json());
    
    setSessionId(data.sessionId);
    return data;
  },

  async logout() {
    if (sessionId) {
      await fetch(`${API_BASE}/auth/logout`, {
        method: "POST",
        headers: { "x-session-id": sessionId },
      });
    }
    setSessionId(null);
  },

  async me() {
    return fetchWithAuth(`${API_BASE}/auth/me`);
  },
};

// Pilots API
export const pilotsApi = {
  async list() {
    return fetchWithAuth(`${API_BASE}/pilots`);
  },

  async create(pilot: any) {
    return fetchWithAuth(`${API_BASE}/pilots`, {
      method: "POST",
      body: JSON.stringify(pilot),
    });
  },

  async get(id: string) {
    return fetchWithAuth(`${API_BASE}/pilots/${id}`);
  },

  async runSimulation(id: string) {
    return fetchWithAuth(`${API_BASE}/pilots/${id}/run`, {
      method: "POST",
    });
  },
};
