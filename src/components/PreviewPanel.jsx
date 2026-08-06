import React, { useEffect, useMemo, useState } from 'react'
import { SandpackProvider, useSandpack } from '@codesandbox/sandpack-react'
import { detectDependencies } from '../utils/sandpackUtils';
import { useAppContext } from '../context/AppContext';


// Watches for file edits inside Sandpack editor and saves changes to DB & live state
const SandpackFileWatcher = ({ onliveFilesChange }) => {
  const { sandpack } = useSandpack();
  const { files } = sandpack;
  const { activeProject, updateProjectFiles } = useAppContext();

  const activeProjectRef = useRef(activeProject);

  useEffect(() => {
    activeProjectRef.current = activeProject;
  }, [activeProject]);

  useEffect(() => {
    const project = activeProject.current;
    if (!project) return;
    const updatedFiles = {}
    let hasChanges = false;

    for (const [path, fileObj] of Object.entries(files)) {
      const fileCode = fileObj.code;
      updatedFiles[path] = fileCode;
      const originalContent = typeof project.files[path] === "string" ? project.files[path] : project.files[path]?.content;
      if (originalContent !== undefined && originalContent !== fileCode) {
        hasChanges = true
      }
    }

    // Sync live files to parent
    onliveFilesChange(updatedFiles)
    if (hasChanges) {
      updateProjectFiles(updatedFiles)
    }
    return null;
  }, [files])
}

const PreviewPanel = ({ project, activeFile, showCode }) => {

  // keep local state of files that updates as user types
  const [showErrorOverlay, setShowErrorOverlay] = useState(true);                                // Indica si se debe mostrar el error overlay.
  const [liveFiles, setLiveFiles] = useState(project.files);                                     // Estado local de archivos que se actualiza a medida que el usuario escribe.
  const [prevProjectkey, setPrevProjectkey] = useState(`${project._id}-${project.version}`);     // Key del proyecto que se utiliza para detectar cambios en el proyecto o en la version.

  const currentKey = `${project._id}-${project.version}`;                                        // Key del proyecto actual.

  if (prevProjectkey !== currentKey) {  // Si cambia el proyecto o la version, se actualiza el estado.
    setPrevProjectkey(currentKey);      // Actualiza la key del proyecto.
    setLiveFiles(project.files);        // Actualiza los archivos del proyecto.
  }

  // Esta funcion recibe los archivos del proyecto y los compara con el estado actual.
  // si encuentra cambios, actualiza el estado local.
  // si no hay cambios, devuelve los archivos anteriores para evitar re-renderizar.
  const handleLiveFilesChange = (newFiles) => {
    setLiveFiles((prev) => {
      let changed = false;
      for (const [p, code] of Object.entries(newFiles)) {
        if (prev[p] !== code) {
          changed = true;
        }
      }
      return changed ? newFiles : prev
    });
  }

  // Convert liveFiles to Sandpack format
  const sandPackFiles = useMemo(() => {
    const spFiles = {}
    for (const [path, content] of Object.entries(liveFiles)) {
      const fileCode = typeof content === "string"
        ? content
        : content?.content || ""
      spFiles[path] = {
        code: fileCode,
        active: path === activeFile,
      }
    }
    return spFiles
  }, [liveFiles, activeFile]);

  // Detect dependecies from import statements using liveFiles
  const dependencies = useMemo(() => {
    return detectDependencies(liveFiles)
  }, [liveFiles])

  return (
    <div className='h-full w-full'>
      <SandpackProvider
        key={project._id}
        template="react"
        files={sandPackFiles}
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
        <SandpackFileWatcher onLiveFilesChange={handleLiveFilesChange} />
        <p>SandpackErrorMonitor</p>
      </SandpackProvider>
    </div>
  )
}

export default PreviewPanel