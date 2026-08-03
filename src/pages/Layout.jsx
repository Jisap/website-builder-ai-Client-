
import { Navigate, Outlet } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import Loading from '../components/Loading';

// 
export const AuthLayout = () => {                       // Rutas protegidas que requieren autenticación
  const { user, loadingUser } = useAppContext();
  if (loadingUser) return <Loading />;
  if (!user) return <Navigate to="/login" replace />

  return (
    <Outlet />
  )
}


//
export const GuestLayout = () => {                     // Rutas públicas que no requieren autenticación
  const { user, loadingUser } = useAppContext();
  if (loadingUser) return <Loading />;
  if (user) return <Navigate to="/" replace />

  return (
    <Outlet />
  )
}

