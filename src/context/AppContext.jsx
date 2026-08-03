import { createContext, useContext, useState, useEffect } from "react"
import api from "../api/api";

const AppContext = createContext(undefined);

export const AppProvider = ({ children }) => {

  // Auth States
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

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
  }, []);

  return (
    <AppContext.Provider value={{ user, loadingUser }}>
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