import { createContext, useContext, useState, useEffect, useCallback } from "react"
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
  const loadProjects = async () => {
    if (!user) return;
    setLoadingProjects(true);
    try {
      const { data } = await api.get("/api/projects");
      setProjects(data.projects);
    } catch (error) {
      console.error("Failed to load projects", error);
      toast.error("Failed to load projects");
    } finally {
      setLoadingProjects(false);
    }
  }

  // Silent es un flag para controlar si esa llamada debe mostrar feedback visual al usuario (loading spinner, toasts de error, redirección) o pasar desapercibida.

  const loadProject = async (id, silent = false) => {
    if (!user) return;
    if (!silent) setLoadingActiveProject(true);               // Si no se pasa el parámetro silent, se muestra el loading
    try {
      const { data } = await api.get(`/api/projects/${id}`);
      setActiveProject(data.project);

      // Default file section
      const files = Object.keys(data.files);                  // Obtiene las claves del objeto data.files que son los nombres de los archivos.
      if (files.length > 0) {                                 // Si hay archivos, se establece el archivo activo:
        setActiveFile((prev) => {
          if (files.includes(prev)) return prev;              // Si el archivo activo anterior existe, se mantiene
          if (files.includes("/App.js")) return "/App.js";    // Si no existe el prev, se establece como /App.js
          return files[0];                                    // si no, se establece como el primer archivo existente.
        });
      }
    } catch (error) {
      console.error("Failed to load project", error);
      if (!silent) {
        toast.error("Failed to load project");
        navigate("/")
      }
    } finally {
      if (!silent) setLoadingActiveProject(false);
    }
  }

  /**
   * Refresco de datos de proyecto activo (Poller)
   * 1º El usuario crea o edita un proyecto → el backend responde de inmediato con status: "generating".
   * 2º Este useEffect detecta ese estado y arranca un setInterval que pregunta "¿ya terminaste?" cada 2 segundos.
   * 3º Usa silent=true porque es una consulta rutinaria en segundo plano — no quieres que la pantalla parpadee con el spinner grande de loadingActiveProject ni que salte un toast de error si un solo intento de red falla.
   * 4º Cuando el backend eventualmente cambie el status a "completed" (por ejemplo), activeProject.status cambiará, 
   * el useEffect se volverá a ejecutar, isOngoing será false, y como no entra en el if, ya no se crea un nuevo intervalo → el polling se detiene solo.
   */
  useEffect(() => {
    if (!activeProject?._id || !user) return;                                                           // no hace nada si no hay proyecto activo o no hay sesión

    const isOngoing = activeProject.status === "generating" || activeProject.status === "pending" || activeProject.status === "revising";
    // ^ comprueba si el proyecto está en algún estado "en curso" (la IA todavía está trabajando)

    if (isOngoing) {
      setChatLoading(true);                                                                             // muestra un indicador de "generando..." en la UI de chat
      const interval = setInterval(() => {
        loadProject(activeProject._id, true);                                                           // silent=true: refresca datos cada 2s SIN mostrar loading ni toasts
      }, 2000);
      return () => clearInterval(interval);                                                             // limpia el intervalo al desmontar o cuando cambien las dependencias
    } else {
      setChatLoading(false);                                                                            // deja de mostrar el indicador de "generando..." en la UI de chat
    }
  }, [activeProject?._id, activeProject?.status, loadProject, user])


  const handleGenerate = useCallback(
    async (prompt) => {
      if (!user) return;                                                                                // guard: sin sesión no genera nada
      setGeneratingProject(true);                                                                       // activa loading global de "generando proyecto"
      try {
        const { data } = await api.post("/api/projects", { prompt });
        toast.success("AI Agent is planning structure...");
        navigate(`/builder/${data._id}`)                                                                // redirige al builder del proyecto recién creado
      } catch (error) {
        console.error("Failed to generate project", error);
        toast.error(error?.response?.data?.error || "Failed to generate project")
      } finally {
        setGeneratingProject(false)                                                                     // se desactiva pase lo que pase
      }
    }, [navigate, user]
  )

  const handleDelete = useCallback(
    async (id) => {
      if (!user) return;                                                                                // guard: sin sesión no genera nada

      try {
        await api.delete(`/api/projects/${id}`);
        setProjects((prev) => prev.filter((p) => p._id !== id))
        toast.success("Project deleted successfully")
      } catch (error) {
        console.error("Failed to delete project", error);
        toast.error(error?.response?.data?.error || "Failed to delete project")
      }
    }, [user]
  )



  return (
    <AppContext.Provider value={{
      user,
      loadingUser,
      login,
      register,
      projects,
      loadingProjects,
      activeProject,
      loadingActiveProject,
      chatLoading,
      generatingProject,
      activeFile,
      showCode,
      setActiveFile,
      setShowCode,
      loadProjects,
      loadProject,
      handleGenerate,
      handleDelete,
    }}>
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