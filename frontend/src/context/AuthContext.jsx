import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API_URL from "../config";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    const storedUser =
      localStorage.getItem("user") || sessionStorage.getItem("user");

    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [token, setToken] = useState(
    () => localStorage.getItem("token") || sessionStorage.getItem("token"),
  );

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("token");
    navigate("/");
  }, [navigate]);

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.data?.message?.includes("blocked")) {
          logout();
        }

        return Promise.reject(error);
      },
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, [logout]);

  const login = async (email, password) => {
    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, {
        email,
        password,
      });
      const { token: authenticatedToken, user: authenticatedUser } = res.data;

      setToken(authenticatedToken);
      setUser(authenticatedUser);
      localStorage.setItem("token", authenticatedToken);
      localStorage.setItem("user", JSON.stringify(authenticatedUser));

      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Login denied or failed",
      };
    }
  };

  const register = async (userData) => {
    try {
      const res = await axios.post(`${API_URL}/api/auth/register`, userData);
      return { success: true, message: res.data.message };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Registration failed",
      };
    }
  };

  const refreshUser = async () => {
    if (!token) return;

    try {
      const res = await axios.get(`${API_URL}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.success) {
        const updatedUser = res.data.user;
        setUser(updatedUser);
        const storage = localStorage.getItem("user")
          ? localStorage
          : sessionStorage;
        storage.setItem("user", JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error("Failed to refresh user:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        token,
        setToken,
        logout,
        login,
        register,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
