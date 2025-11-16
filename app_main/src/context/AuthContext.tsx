import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  isLoggedIn: boolean;
  user: any;
  token: string | null;
  isLoading: boolean; // ✅ Ajouté
  login: (userData: any, token: string, role: 'client' | 'agency') => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check for token in localStorage on initial load
    const storedToken = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      // Vérifier si le token est expiré
      try {
        const payload = JSON.parse(atob(storedToken.split('.')[1]));
        const now = Math.floor(Date.now() / 1000);
        
        if (payload.exp && now > payload.exp) {
          console.log("AuthContext: Token expired, clearing session");
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
          setIsLoading(false);
          return;
        }
        
        console.log("AuthContext: Found valid token:", storedToken);
        setIsLoggedIn(true);
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      } catch (error) {
        console.error("AuthContext: Error parsing token:", error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
      }
    } else {
      console.log("AuthContext: No stored token found.");
    }
    
    setIsLoading(false);
  }, []);

  const login = (userData: any, newToken: string, role: 'client' | 'agency') => {
    localStorage.setItem('authToken', newToken);
    const userWithRole = { ...userData, role };
    localStorage.setItem('user', JSON.stringify(userWithRole));
    console.log("AuthContext: Storing new token:", newToken, "with role:", role);
    setIsLoggedIn(true);
    setUser(userWithRole);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, token, isLoading, login, logout }}>
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