import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useLocation } from "wouter";
import { authApi, setSessionId, getSessionId } from "./api";

interface AuthContextType {
  user: string | null;
  login: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Check if we have a valid session on mount
    const sessionId = getSessionId();
    if (sessionId) {
      authApi.me()
        .then((data) => {
          setUser(data.email);
        })
        .catch(() => {
          // Session invalid, clear it
          setSessionId(null);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string) => {
    const data = await authApi.login(email);
    setUser(data.email);
    setLocation("/dashboard");
  };

  const logout = async () => {
    await authApi.logout();
    setUser(null);
    setLocation("/");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
