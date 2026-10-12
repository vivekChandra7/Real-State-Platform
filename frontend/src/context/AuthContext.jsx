import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  // load user initially
  const [user, setUser] = useState(() => {
    const storedUser =
      localStorage.getItem("user") ||
      sessionStorage.getItem("user");

    return storedUser ? JSON.parse(storedUser) : null;
  });

  // logout
  const logout = () => {
    setUser(null);

    localStorage.removeItem("user");
    sessionStorage.removeItem("user");
  };

  useEffect(() => {

    // axios interceptor
    const interceptor = axios.interceptors.response.use(
      (response) => response,

      (error) => {

        if (
          error.response?.data?.message?.includes("blocked")
        ) {
          logout();
        }

        return Promise.reject(error);
      }
    );

    // cleanup
    return () => {
      axios.interceptors.response.eject(interceptor);
    };

  }, [token]);

  // login 
  const login = async (email, password,) => {
    try {
      const res = await axios.post(`${API_URL}/api/auth/login`,
        { email, password },
      )
      const { token, user } = res.data;
      setToken(token);
      setUser(user);

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      return { success: true };

    }
    catch (err) {
      return {
        success: false,
        message: err.res?.data?.message || "Login denied or failed"
      };
    }
  }

  // register 

  const register = async (userData) => {

  }


  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);