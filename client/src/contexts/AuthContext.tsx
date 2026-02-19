import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  username: string;
  role: 'user' | 'admin' | 'dev';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check if user is stored in localStorage on mount
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        // Ensure special rule: user 'gerrik' is always admin
        if (parsed && parsed.username === 'gerrik') {
          parsed.role = 'admin';
        }
        setUser(parsed);
      } catch (err) {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
  }, []);

  const login = (newUser: User) => {
    // Enforce rule: 'gerrik' gets admin role
    const u = { ...newUser };
    if (u.username === 'gerrik') u.role = 'admin';
    setUser(u);
    try {
      localStorage.setItem('user', JSON.stringify(u));
    } catch (_) {}
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
