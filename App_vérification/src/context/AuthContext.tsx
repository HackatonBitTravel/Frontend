import { createContext, useState, useContext, ReactNode } from 'react';

interface AuthContextType {
  agencyName: string | null;
  login: (name: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [agencyName, setAgencyName] = useState<string | null>(localStorage.getItem('agencyName'));

  const login = (name: string) => {
    setAgencyName(name);
    localStorage.setItem('agencyName', name);
  };

  const logout = () => {
    setAgencyName(null);
    localStorage.removeItem('agencyName');
    localStorage.removeItem('isLoggedIn');
  };

  return (
    <AuthContext.Provider value={{ agencyName, login, logout }}>
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
