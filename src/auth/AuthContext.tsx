import React, { createContext, useContext, useEffect, useState } from 'react';
import { fetchAuthSession, signOut } from 'aws-amplify/auth';

interface AuthContextType {
  isAuthenticated: boolean;
  userGroups: string[];
  email: string | null;
  phoneNumber: string | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  userGroups: [],
  email: null,
  phoneNumber: null,
  loading: true,
  logout: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userGroups, setUserGroups] = useState<string[]>([]);
  const [email, setEmail] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const session = await fetchAuthSession();
        const idToken = session.tokens?.idToken?.toString();

        if (!idToken) {
          setIsAuthenticated(false);
          setUserGroups([]);
          setEmail(null);
          setPhoneNumber(null);
        } else {
          const [, payloadBase64] = idToken.split('.');
          const payload = JSON.parse(atob(payloadBase64));

          setIsAuthenticated(true);
          setUserGroups(payload['cognito:groups'] || []);
          setEmail(payload.email || null);
          setPhoneNumber(payload.phone_number || null);
        }
      } catch (e) {
        console.error('Auth check failed', e);
        setIsAuthenticated(false);
        setUserGroups([]);
        setEmail(null);
        setPhoneNumber(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const logout = async () => {
    try {
      await signOut({ global: true });
      setIsAuthenticated(false);
      setUserGroups([]);
      setEmail(null);
      setPhoneNumber(null);
    } catch (e) {
      console.error('Logout failed', e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        userGroups,
        email,
        phoneNumber,
        loading,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
