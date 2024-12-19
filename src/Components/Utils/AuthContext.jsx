import { createContext, useState, useEffect, useRef, useCallback, } from 'react';
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const inactivityTimeout = useRef(null);
  const navigate = useNavigate();

  const resetTimer = useCallback(() => {
    if (inactivityTimeout.current) {
      clearTimeout(inactivityTimeout.current);
    }
    inactivityTimeout.current = setTimeout(() => {
      logout();
    }, 6 * 60 * 60 * 1000); // 6 hours
  }, []);

  const setupActivityListeners = useCallback(() => {
    const events = ['mousemove', 'keydown', 'scroll', 'click'];
    events.forEach((event) => {
      window.addEventListener(event, resetTimer);
    });
  }, [resetTimer]);

  const removeActivityListeners = useCallback(() => {
    const events = ['mousemove', 'keydown', 'scroll', 'click'];
    events.forEach((event) => {
      window.removeEventListener(event, resetTimer);
    });
  }, [resetTimer]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      resetTimer();
      setupActivityListeners();
    }

    return () => {
      removeActivityListeners();
      clearTimeout(inactivityTimeout.current);
    };
  }, [resetTimer, setupActivityListeners, removeActivityListeners]);

  const login = (token) => {
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
    resetTimer();
  };

  const logout = useCallback(() => {
    try {
      localStorage.removeItem('token');
      setIsAuthenticated(false);
      clearTimeout(inactivityTimeout.current);
      removeActivityListeners();
      if (window.location.pathname !== "/") {
        navigate("/");
      }
    } catch (error) {
      console.error("Failed to navigate after logout:", error);
    }
  }, [removeActivityListeners, navigate]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
