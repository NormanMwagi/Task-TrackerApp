import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) =>
{
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() =>
  {
    // Check if user is logged in from localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser)
    {
      try
      {
        const parsed = JSON.parse(savedUser);
        // Only accept safe fields
        const safeUser = {
          id: parsed.id,
          name: parsed.name,
          email: parsed.email,
          token: parsed.token,
        };
        setUser(safeUser);
      }
      catch (err)
      {
        console.error('Failed to parse saved user', err);
      }
    }
    setLoading(false);
  }, []);

  const login = (userData) =>
  {
    // Only persist safe subset of the user (never store password)
    const safeUser = {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      token: userData.token,
    };
    setUser(safeUser);
    localStorage.setItem('user', JSON.stringify(safeUser));
  };

  const logout = () =>
  {
    setUser(null);
    localStorage.removeItem('user');
  };

  const value = {
    user,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};