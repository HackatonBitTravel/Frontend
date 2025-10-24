import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  isLoggedIn: boolean;
  user: any; // You might want to define a more specific user type
  token: string | null; // Add token here
  login: (userData: any, token: string, role: 'client' | 'agency') => void; // Add role parameter
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null); // Add token state

  useEffect(() => {
    // Check for token in localStorage on initial load
    const storedToken = localStorage.getItem('authToken'); // Rename to avoid conflict
    const storedUser = localStorage.getItem('user');
    if (storedToken && storedUser) {
      console.log("AuthContext: Found stored token:", storedToken); // Log token
      setIsLoggedIn(true);
      setUser(JSON.parse(storedUser));
      setToken(storedToken); // Set token state
    } else {
      console.log("AuthContext: No stored token found."); // Log if no token
    }
  }, []);

  const login = (userData: any, newToken: string, role: 'client' | 'agency') => { // Add role parameter
    localStorage.setItem('authToken', newToken);
    const userWithRole = { ...userData, role }; // Use the passed role
    localStorage.setItem('user', JSON.stringify(userWithRole));
    console.log("AuthContext: Storing new token:", newToken, "with role:", role); // Log token and role
    setIsLoggedIn(true);
    setUser(userWithRole);
    setToken(newToken); // Set token state
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
    setToken(null); // Clear token state
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
