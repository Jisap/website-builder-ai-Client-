import React, { useEffect, useMemo, useRef, useState } from 'react'          // FIX 1: se añade useRef al import
import { SandpackProvider, useSandpack } from '@codesandbox/sandpack-react'
import { detectDependencies } from '../utils/sandpackUtils';
import { useAppContext } from '../context/AppContext';

/**
 * Flujo de datos entre project.files, liveFiles y Sandpack.
 * OJO: es un CICLO, no un flujo lineal — hay retroalimentación desde
 * el editor de vuelta hacia liveFiles y, opcionalmente, hacia el servidor.
 *
 *   project.files (servidor/BD)
 *         │
 *         │ copia inicial (useState)
 *         ▼
 *      liveFiles ◄────────────────────────┐
 *         │                               │ setLiveFiles
 *         │ useMemo                       │ (si cambió)
 *         ▼                               │
 *    sandPackFiles                        │
 *         │                               │
 *         ▼                               │
 *   SandpackProvider                      │
 *         │                               │
 *         │ usuario escribe               │
 *         ▼                               │
 *   SandpackFileWatcher ───────────────────┘
 *         │
 *         │ updateProjectFiles (si hay cambios)
 *         ▼
 *   project.files (persiste en servidor/BD)
 */


// Componente "espía": vive dentro de SandpackProvider y detecta cuando el usuario
// edita código en el editor, para propagar esos cambios hacia fuera (estado local y BD)
const SandpackFileWatcher = ({ onLiveFilesChange }) => {
  const { sandpack } = useSandpack();                                        // Acceso al estado interno de Sandpack (incluye los archivos tal como están en el editor)
  const { files } = sandpack;                                                // Archivos actuales del editor, se actualizan en cada pulsación de tecla
  const { activeProject, updateProjectFiles } = useAppContext();             // Proyecto activo y función para persistir cambios en el contexto/BD

  const activeProjectRef = useRef(activeProject);                            // Ref que guarda la última versión de activeProject sin provocar renders

  useEffect(() => {
    activeProjectRef.current = activeProject;                                // Mantiene la ref sincronizada cada vez que cambia activeProject
  }, [activeProject]);

  useEffect(() => {
    const project = activeProjectRef.current;
    if (!project) return;                                                    // Si aún no hay proyecto cargado, no hace nada
    const updatedFiles = {}                                                  // Objeto plano { ruta: contenido } que se irá reconstruyendo desde Sandpack
    let hasChanges = false;                                                  // Marca si algún archivo difiere del original (para decidir si hay que persistir)

    for (const [path, fileObj] of Object.entries(files)) {                   // Recorre todos los archivos que Sandpack tiene en este momento
      const fileCode = fileObj.code;                                         // Contenido actual del archivo según el editor
      updatedFiles[path] = fileCode;                                         // Se copia al objeto plano de salida
      const originalContent = typeof project.files[path] === "string" ? project.files[path] : project.files[path]?.content;  // Normaliza el contenido original (puede venir como string u objeto)
      if (originalContent !== undefined && originalContent !== fileCode) {   // Compara contenido original vs actual
        hasChanges = true                                                    // Si difieren, se marca que hay cambios pendientes de guardar
      }
    }

    // Se notifica al padre el estado "en vivo" de los archivos, 
    // haya o no cambios reales
    onLiveFilesChange(updatedFiles)
    if (hasChanges) {                                                        // Solo si hubo cambios respecto al proyecto original...
      updateProjectFiles(updatedFiles)                                       // ...se persiste en el contexto/BD
    }
    return null;
  }, [files])                                                               // Se ejecuta cada vez que cambian los archivos dentro de Sandpack
}

const PreviewPanel = ({ project, activeFile, showCode }) => {

  // Mantiene un estado local de archivos que se va actualizando 
  // a medida que el usuario escribe en el editor
  const [showErrorOverlay, setShowErrorOverlay] = useState(true);                                // Controla si se muestra el overlay de errores de Sandpack
  const [liveFiles, setLiveFiles] = useState(project.files);                                     // 1º Copia local "en vivo" de los archivos, inicializada con los del proyecto
  const [prevProjectkey, setPrevProjectkey] = useState(`${project._id}-${project.version}`);     // Guarda la key del proyecto para detectar cuándo cambia el proyecto o su versión

  const currentKey = `${project._id}-${project.version}`;                                        // Key derivada del proyecto actual, se recalcula en cada render

  if (prevProjectkey !== currentKey) {   // 2º Si el proyecto o su versión cambiaron desde el último render...
    setPrevProjectkey(currentKey);       // ...se actualiza la key guardada...
    setLiveFiles(project.files);         // ...y se reinicia liveFiles con los archivos del nuevo proyecto (descarta ediciones previas)
  }

  // Recibe los archivos "en vivo" que llegan desde SandpackFileWatcher y actualiza el estado local
  // solo si detecta diferencias reales, para evitar renders innecesarios cuando no cambió nada.
  const handleLiveFilesChange = (newFiles) => {
    setLiveFiles((prev) => {
      let changed = false;
      for (const [p, code] of Object.entries(newFiles)) {          // Compara cada archivo nuevo contra el estado previo
        if (prev[p] !== code) {
          changed = true;                                          // Si algún archivo difiere, se considera que hubo cambio
        }
      }
      return changed ? newFiles : prev                             // Solo se reemplaza el estado si realmente cambió algo
    });
  }

  // 3º Traduce liveFiles (formato interno de la app) al formato que espera Sandpack
  const sandPackFiles = useMemo(() => {
    const spFiles = {}                                              // Objeto de salida en formato Sandpack: { ruta: { code, active } }
    for (const [path, content] of Object.entries(liveFiles)) {      // Recorre cada archivo del estado liveFiles
      const fileCode = typeof content === "string"                  // Normaliza el contenido, que puede venir como...
        ? content                                                   // ...string plano...
        : content?.content || ""                                    // ...o como objeto con propiedad content
      spFiles[path] = {                                             // Se construye la entrada para Sandpack
        code: fileCode,                                             // Contenido del archivo
        active: path === activeFile,                                // Marca como activo (abierto en el editor) el archivo seleccionado
      }
    }
    return spFiles                                                  // Devuelve el objeto ya listo para pasar a SandpackProvider
  }, [liveFiles, activeFile]);                                      // Se recalcula solo si cambian liveFiles o el archivo activo

  // Analiza los imports dentro de liveFiles para inferir qué dependencias npm hacen falta
  const dependencies = useMemo(() => {
    return detectDependencies(liveFiles)
  }, [liveFiles])

  return (
    <div className='h-full w-full'>
      <SandpackProvider
        key={project._id}
        template="react"
        files={sandPackFiles} // 4º Recibe la copia local de los archivos listos para Sandpack
        customSetup={{ dependencies }}
        options={{
          externalResources: [
            "https://cdn.tailwindcss.com",
            "https://cdnjs.cloudfare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css",
          ],
          classes: {
            "sp-wrapper": "sp-wrapper",
            "sp-layout": "sp-layout",
            "sp-preview": "sp-preview",
          },
          logLevel: 0
        }}
        theme={{
          colors: {
            surface1: "#ffffff",
            surface2: "#f4f4f5",
            surface3: "#e4e4e7",
            clickable: "#71717a",
            base: "#09090b",
            disabled: "#a1a1aa",
            hover: "#181811b",
            accent: "#18181b",
            error: "#ef4444",
            errorSurface: "#fef2f2",
          },
          font: {
            body: "'Urbanist', system-ui, apple-system, sans-serif",
            mono: "'Geist Mono', ui-monospace, monospace",
            size: "13px",
            lineHeight: "1.6",
          }
        }}
      >
        {/* 5º Componente "espía" que detecta los cambios del editor y actualiza liveFiles */}
        <SandpackFileWatcher onLiveFilesChange={handleLiveFilesChange} />
        <p>SandpackErrorMonitor</p>
      </SandpackProvider>
    </div>
  )
}

export default PreviewPanel