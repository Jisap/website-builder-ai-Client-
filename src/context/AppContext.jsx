import { createContext, useContext, useState, useEffect } from "react"
import api from "../api/api";
import toast from "react-hot-toast";
import { Navigate, useNavigate } from "react-router-dom";

const AppContext = createContext(undefined);

export const AppProvider = ({ children }) => {

  const navigate = useNavigate();

  // Auth States
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // States
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [activeProject, setActiveProject] = useState(null);
  const [loadingActiveProject, setLoadingActiveProject] = useState(true);
  const [chatLoading, setChatLoading] = useState(false);
  const [generatingProject, setGeneratingProject] = useState(false);
  const [activeFile, setActiveFile] = useState("/App.js");
  const [showCode, setShowCode] = useState(false);

  // Auth actions
  const checkSessions = async () => {
    try {
      const { data } = await api.get("/api/auth/me");
      setUser(data.user)
    } catch (error) {
      setUser(null)
    } finally {
      setLoadingUser(false)
    }
  }

  useEffect(() => {
    checkSessions()
  }, []); // No se pone chekSession en las dependencias para evitar un bucle infinito. checkSession -> setUser -> AppProvider se renderiza de nuevo -> nuevo checkSession -> ... infinito.

  const login = async (email, password) => {
    try {
      const { data } = await api.post("/api/auth/login", { email, password });
      setUser(data.user);
      toast.success(`Welcome back!, ${data.user.name}`);
      navigate("/");
    } catch (error) {
      console.error("Login failed", error);
      const errMsg = error?.response?.data?.error || "Login failed. Invalid email or password. Please try again.";
      toast.error(errMsg);
      throw new Error(errMsg);
    }
  }

  const register = async (name, email, password) => {
    try {
      const { data } = await api.post("/api/auth/register", { name, email, password });
      setUser(data.user);
      toast.success("Account created successfully");
      navigate("/");
    } catch (error) {
      console.error("Registration failed", error);
      const errMsg = error?.response?.data?.error || "Registration failed.";
      toast.error(errMsg);
      throw new Error(errMsg);
    }
  }

  const logout = async () => {
    try {
      await api.post("/api/auth/logout")
      setUser(null);
      setProjects([]);
      setActiveProject(null);
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      console.error("Logout failed", error);
      toast.error("Failed to logout");
    }
  }

  // Projects Actions



  return (
    <AppContext.Provider value={{ user, loadingUser, login, register }}>
      {children}
    </AppContext.Provider>
  )
}

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
}