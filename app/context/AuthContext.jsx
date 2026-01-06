// app/context/AuthContext.jsx
"use client";

import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('🔍 AuthContext: Checking localStorage for user');
    const storedUser = localStorage.getItem('bio-user');
    console.log('🔍 AuthContext: Stored user:', storedUser);
    
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        console.log('🔍 AuthContext: Parsed user:', parsedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('🔍 AuthContext: Error parsing user data:', error);
        localStorage.removeItem('bio-user');
      }
    } else {
      console.log('🔍 AuthContext: No user found in localStorage');
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    console.log('🔍 AuthContext: Logging in user:', userData);
    setUser(userData);
    localStorage.setItem('bio-user', JSON.stringify(userData));
    console.log('🔍 AuthContext: User saved to localStorage');
  };

  const logout = () => {
    console.log('🔍 AuthContext: Logging out');
    setUser(null);
    localStorage.removeItem('bio-user');
  };

  const isAdmin = () => {
    if (!user) {
      console.log('🔍 AuthContext: isAdmin - No user');
      return false;
    }
    
    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "admin@edpharma.com";
    console.log('🔍 AuthContext: isAdmin checking - User email:', user.email);
    console.log('🔍 AuthContext: isAdmin checking - Admin email:', adminEmail);
    console.log('🔍 AuthContext: isAdmin result:', user.email === adminEmail);
    
    return user.email === adminEmail;
  };

  console.log('🔍 AuthContext: Current state - user:', user, 'loading:', loading);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    console.error('🔍 useAuth: Must be used within an AuthProvider');
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};