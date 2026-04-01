"use client";

import { createContext, useContext, useState, useEffect } from "react";
import decode from "../../utils/tokenDecoded/decoded";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuth, setIsAuth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("isAuth");

    if (token) {
      const decoded = decode(token);
      if (decoded) {
        setIsAuth(decoded);
      }
    }

    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuth, setIsAuth, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
