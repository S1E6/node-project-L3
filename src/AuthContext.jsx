// AuthContext.js
import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();
  const login = async (username, password) => {
    try {
      const response = await axios.post('http://localhost:8000/api/login/', {
        username,
        password
      });
      const userData = response.data.account;
      setUser(userData);
      setLoggedIn(true)
      localStorage.setItem('account',userData.username)
      localStorage.setItem('token',response.data.token)
      navigate("/home");
    } catch (error) {
      throw new Error('Informations invalides');
    }
  };

  const logout = () => {
    setUser(null);
    setLoggedIn(false)
    localStorage.removeItem('account')
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user,loggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
