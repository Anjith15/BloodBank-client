// src/contexts/AuthContext.js
import React, { createContext, useState, useEffect } from "react";
import { toast } from 'react-toastify';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  // check if token exists on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    
    if (token) {
      setIsLoggedIn(true);
      
      // If user data exists in localStorage, parse and set it
      if (userData) {
        try {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
        } catch (error) {
          console.error("Error parsing user data:", error);
          localStorage.removeItem("user");
        }
      }
    }
  }, []);

  const login = (token, userData) => {
    localStorage.setItem("token", token);
    setIsLoggedIn(true);
    
    if (userData) {
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
    }
    
    toast.success("Logged in successfully");
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser(null);
    
    toast.info("Logged out successfully");
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, user }}>
      {children}
    </AuthContext.Provider>
  );
}
