"use client";
import { createContext, useContext, useEffect, useState, useCallback } from "react";

const AuthContext = createContext({
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Función helper para obtener token de localStorage
  const getToken = useCallback(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      if (typeof window !== "undefined") {
        const token = getToken();
        
        console.log('Checking token:', { 
          hasToken: !!token 
        });
        
        if (!token) {
          console.log('No token found, setting authenticated to false');
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }

        // Si hay token, asumir que es válido
        console.log('Token found, setting authenticated to true');
        setIsAuthenticated(true);
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = useCallback(() => {
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(() => {
    console.log('Logging out, clearing token from localStorage');
    setIsAuthenticated(false);
    localStorage.removeItem("token");
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
} 