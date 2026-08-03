import { createContext, useContext } from "react"



const AppContext = createContext(undefined);

export const AppProvider = ({ children }) => {

  // Auth States
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);


  return (
    <AppContext.Provider value={{}}>
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