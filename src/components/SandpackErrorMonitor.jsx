import { useSandpack } from "@codesandbox/sandpack-react"
import { useEffect } from "react";


const SandpackErrorMonitor = ({ onErrorChange }) => { // Se recibe la prop onErrorChange que es un estado para mostrar u ocultar el overlay de errores

  const { sandpack } = useSandpack(); // Hook para acceder al estado interno de Sandpack (incluye errores)
  const { error } = sandpack;         // Error actual detectado por Sandpack

  //Si el error tiene un msg de la lista, se ignora, si no se muestra
  useEffect(() => {
    if (error) {
      // Usamos optional chaining porque Sandpack puede devolver un objeto Error
      // con .message read-only (frozen), lo que lanzaría un TypeError al intentar leerlo directamente
      const msg = error?.message ?? "";
      const isNetworkError =
        msg.includes("Failed to fetch") ||
        msg.includes("col.csbops.io") ||
        msg.includes("ERR_CONNECTION_TIMED_OUT") ||
        msg.includes("net::ERR")

      if (isNetworkError) {
        onErrorChange(false);
        return
      }
    }
    onErrorChange(true);
  }, [error, onErrorChange])

  return null;
}

export default SandpackErrorMonitor