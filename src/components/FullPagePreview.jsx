import { useMemo, useState } from 'react'
import { SandpackLayout, SandpackPreview, SandpackProvider } from '@codesandbox/sandpack-react'
import { detectDependencies } from '../utils/sandpackUtils';
import SandpackErrorMonitor from './SandpackErrorMonitor';


// Vista de previsualización a pantalla completa, de solo lectura (no permite editar código).
// A diferencia de PreviewPanel, aquí no hay estado local tipo liveFiles ni SandpackFileWatcher:
// simplemente recibe "files" como prop y los renderiza tal cual.
const FullPagePreview = ({ files }) => {

  const [showErrorOverlay, setShowErrorOverlay] = useState(true);            // Controla si se muestra el overlay de errores, lo actualiza SandpackErrorMonitor

  // Traduce "files" (formato interno de la app) 
  // al formato que espera Sandpack
  const sandPackFiles = useMemo(() => {
    if (!files) return {}                                                     // Si aún no llegaron archivos, se pasa un objeto vacío a Sandpack
    const spFiles = {}                                                       // Objeto de salida en formato Sandpack: { ruta: { code } }
    for (const [path, content] of Object.entries(files)) {                   // Recorre cada archivo recibido por props
      spFiles[path] = {                                                      // Se construye la entrada para Sandpack
        code: content,                                                       // Contenido del archivo (real o stub)
      }
    }
    return spFiles                                                           // Devuelve el objeto ya listo para pasar a SandpackProvider
  }, [files]);                                                               // Se recalcula solo si cambia la prop files


  // Analiza los imports dentro de files para inferir qué dependencias npm hacen falta
  const dependencies = useMemo(() => {
    if (!files) return {}
    return detectDependencies(files)
  }, [files]);

  return (
    <div className='h-screen w-screen bg-white overflow-hidden'>
      <SandpackProvider
        template="react"
        files={sandPackFiles} // Archivos ya traducidos al formato Sandpack (ver useMemo de arriba)
        customSetup={{ dependencies }}
        options={{
          externalResources: [
            "https://cdn.tailwindcss.com",
            "https://cdnjs.cloudfare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css",
          ],
          logLevel: 0
        }}
        className='h-full w-full'
      >
        <SandpackErrorMonitor
          onErrorChange={setShowErrorOverlay}                                // Notifica si hay errores de compilación/runtime, para mostrar/ocultar el overlay
        />

        <SandpackLayout
          className='w-full h-full border-none! bg-transparent!'
        >
          <SandpackPreview
            showNavigator={false}                                           // Oculta la barra de navegación (URL) del preview
            showRefreshButton={false}                                       // Oculta el botón de refrescar manualmente
            showOpenInCodeSandbox={false}                                   // Oculta el botón para abrir el proyecto en CodeSandbox
            showSandpackErrorOverlay={showErrorOverlay}                     // Muestra u oculta el overlay de error según el estado local
            className='h-full w-full'
          />
        </SandpackLayout>
      </SandpackProvider>
    </div>
  )
}

export default FullPagePreview