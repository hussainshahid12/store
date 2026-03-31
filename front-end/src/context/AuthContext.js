"use client";

import { createContext, useContext, useState, useEffect } from "react";
import decode from "../../utils/tokenDecoded/decoded";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Only run on client
    if (typeof window !== "undefined") {
      const auth = decode();
      console.log("auth context", auth);
      if (auth?.status) {
        setIsAuth(true);
      }
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isAuth, setIsAuth, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

