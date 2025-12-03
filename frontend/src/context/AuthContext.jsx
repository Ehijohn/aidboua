import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // const fetchUser = async () => {
  //   try {
  //     const res = await axios.get("/api/auth/me");
  //     setUser(res.data.user);
  //   } catch (error) {
  //     console.error("Fetch user error:", error);
  //     localStorage.removeItem("token");
  //     delete axios.defaults.headers.common["Authorization"];
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const login = async (email, password) => {
    const res = await axios.post("/api/auth/login", { email, password });
    localStorage.setItem("token", res.data.token);
    axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;
    setUser(res.data.user);
    return res.data;
  };

  const signup = async (userData) => {
    const res = await axios.post("/api/auth/signup", userData);
    localStorage.setItem("token", res.data.token);
    axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;
    setUser(res.data.user);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
  };

  const updateUser = (userData) => {
    setUser((prevUser) => ({ ...prevUser, ...userData }));
  };

  return (
    <AuthContext.Provider
      value={{ user, login, signup, logout, loading, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};
