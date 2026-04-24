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
      } else {
        // invalid token → remove
        localStorage.removeItem("isAuth");
        setIsAuth(null);
      }
    } else {
      setIsAuth(null);
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
