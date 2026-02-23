import type { AuthResponse, LoginCredentials, LogoutResponse, User } from '../types/auth.types';

/**
 * Mock Authentication Service
 *
 * Used for frontend development without backend.
 * Simulates authentication with hardcoded test users.
 *
 * TEST CREDENTIALS:
 * - admin@test.com / password123
 * - analyst@test.com / password123
 */

const MOCK_USERS: Record<string, { password: string; user: User }> = {
  'admin@test.com': {
    password: 'password123',
    user: {
      id: 'mock-user-1',
      email: 'admin@test.com',
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
      companyId: 'mock-company-1',
      companyName: 'TPRM Demo Company',
    },
  },
  'analyst@test.com': {
    password: 'password123',
    user: {
      id: 'mock-user-2',
      email: 'analyst@test.com',
      firstName: 'Analyst',
      lastName: 'User',
      role: 'ANALYST',
      companyId: 'mock-company-1',
      companyName: 'TPRM Demo Company',
    },
  },
};

const STORAGE_KEY = 'mock_session';

/**
 * Get session from sessionStorage (persists during navigation)
 */
function getSession(): User | null {
  if (typeof window === 'undefined') return null;
  const stored = sessionStorage.getItem(STORAGE_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored) as User;
  } catch {
    return null;
  }
}

/**
 * Save session to sessionStorage
 */
function setSession(user: User | null): void {
  if (typeof window === 'undefined') return;
  if (user) {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  } else {
    sessionStorage.removeItem(STORAGE_KEY);
  }
}

/**
 * Simulate network delay
 */
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const authServiceMock = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    await delay(500);

    const mockUser = MOCK_USERS[credentials.email.toLowerCase()];

    if (!mockUser || mockUser.password !== credentials.password) {
      throw new Error('Email ou senha incorretos');
    }

    setSession(mockUser.user);

    return {
      success: true,
      user: mockUser.user,
    };
  },

  async refresh(): Promise<AuthResponse> {
    await delay(200);

    const session = getSession();
    if (!session) {
      throw new Error('Sessão expirada');
    }

    return {
      success: true,
      user: session,
    };
  },

  async logout(): Promise<LogoutResponse> {
    await delay(200);
    setSession(null);

    return {
      success: true,
      message: 'Logout realizado com sucesso',
    };
  },
};
