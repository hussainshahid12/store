"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { api } from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuth, setIsAuth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // On mount, check if user is authenticated by calling /api/me
    async function checkAuth() {
      try {
        console.log("ne");
        const res = await api.get("api/me");
        if (res.data && res.data.user) {
          setIsAuth(res.data.user);
        } else {
          setIsAuth(null);
        }
      } catch (e) {
        setIsAuth(null);
      }
      setLoading(false);
    }
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuth, setIsAuth, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
