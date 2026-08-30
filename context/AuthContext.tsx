import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Platform } from 'react-native';
import { MOCK_USER, SelectedProperty } from '@/data/mockData';

const TOKEN_KEY = 'rentresolve_token';
const USER_KEY = 'rentresolve_user';
const PROPERTY_KEY = 'rentresolve_selected_property';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  propertyId: string;
  unit: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  onboardingCompleted: boolean;
  selectedProperty: SelectedProperty | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
  setSelectedProperty: (property: SelectedProperty | null) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  onboardingCompleted: false,
  selectedProperty: null,
  login: async () => ({ success: false }),
  logout: async () => {},
  completeOnboarding: () => {},
  resetOnboarding: () => {},
  setSelectedProperty: () => {},
});

let SecureStoreModule: typeof import('expo-secure-store') | null = null;

async function loadSecureStore() {
  if (Platform.OS !== 'web' && !SecureStoreModule) {
    try {
      SecureStoreModule = require('expo-secure-store');
    } catch {}
  }
}

async function saveItem(key: string, value: string) {
  if (Platform.OS === 'web') {
    try { localStorage.setItem(key, value); } catch {}
    return;
  }
  await loadSecureStore();
  if (SecureStoreModule) {
    await SecureStoreModule.setItemAsync(key, value);
  }
}

async function getItem(key: string): Promise<string | null> {
  if (Platform.OS === 'web') {
    try { return localStorage.getItem(key); } catch { return null; }
  }
  await loadSecureStore();
  if (SecureStoreModule) {
    return SecureStoreModule.getItemAsync(key);
  }
  return null;
}

async function deleteItem(key: string) {
  if (Platform.OS === 'web') {
    try { localStorage.removeItem(key); } catch {}
    return;
  }
  await loadSecureStore();
  if (SecureStoreModule) {
    await SecureStoreModule.deleteItemAsync(key);
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);
  const [selectedProperty, setSelectedPropertyState] = useState<SelectedProperty | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const savedToken = await getItem(TOKEN_KEY);
        const savedUser = await getItem(USER_KEY);
        const savedProperty = await getItem(PROPERTY_KEY);
        if (savedToken && savedUser) {
          setToken(savedToken);
          setUser(JSON.parse(savedUser));
          if (savedProperty) {
            setSelectedPropertyState(JSON.parse(savedProperty));
            // Restored session: onboarding was already completed previously.
            setOnboardingCompleted(true);
          }
        }
      } catch {}
      setIsLoading(false);
    })();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    if (email === 'tenant@example.com' && password === 'password123') {
      const mockToken = 'mock_jwt_token_' + Date.now();
      await saveItem(TOKEN_KEY, mockToken);
      await saveItem(USER_KEY, JSON.stringify(MOCK_USER));
      setToken(mockToken);
      setUser(MOCK_USER);
      // Fresh login: onboarding must be shown again (mock behavior).
      setOnboardingCompleted(false);
      setSelectedPropertyState(null);
      return { success: true };
    }
    return { success: false, error: 'Invalid email or password' };
  }, []);

  const logout = useCallback(async () => {
    await deleteItem(TOKEN_KEY);
    await deleteItem(USER_KEY);
    await deleteItem(PROPERTY_KEY);
    setToken(null);
    setUser(null);
    setOnboardingCompleted(false);
    setSelectedPropertyState(null);
  }, []);

  const completeOnboarding = useCallback(() => {
    setOnboardingCompleted(true);
  }, []);

  const resetOnboarding = useCallback(() => {
    setOnboardingCompleted(false);
    setSelectedPropertyState(null);
  }, []);

  const setSelectedProperty = useCallback(async (property: SelectedProperty | null) => {
    setSelectedPropertyState(property);
    if (property) {
      await saveItem(PROPERTY_KEY, JSON.stringify(property));
    } else {
      await deleteItem(PROPERTY_KEY);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isLoading,
        onboardingCompleted,
        selectedProperty,
        login,
        logout,
        completeOnboarding,
        resetOnboarding,
        setSelectedProperty,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
