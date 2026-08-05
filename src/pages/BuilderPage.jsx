import React, { useEffect, useState } from 'react'
import { useAppContext } from '../context/AppContext'
import { useNavigate, useParams } from 'react-router-dom'
import Loading from '../components/Loading';
import BuilderHeader from '../components/BuilderHeader';

const BuilderPage = () => {

  const { id } = useParams();
  const navigate = useNavigate();
  const [leftTab, setLeftTab] = useState("chat");
  const [publishing, setPublishing] = useState(false);
  const [publishUrl, setPublishUrl] = useState(null);

  const { activeProject, loadingActiveProject, activeFile, showCode, setActiveFile, setShowCode, loadProject, logout } = useAppContext()

  useEffect(() => {
    if (!id) return;
    loadProject(id)
  }, [id, loadProject])

  useEffect(() => {
    if (!id || !activeProject) return;
    if (activeProject.status === "pending" || activeProject.status === "generating") { // Si el projecto tiene status pending o generating, se actualiza cada 1.5 segundos.
      const interval = setInterval(() => {                                           // Cada 1.5s se intentará la carga del proyecto 
        loadProject(id, true)                                                        // Silent=true para que no se muestre el loading.
      }, 1500)
      return () => clearInterval(interval)
    }
  }, [id, loadProject, activeProject])

  if (loadingActiveProject || !activeProject) {
    return (
      <Loading />
    )
  }

  return (
    <div className='h-screen flex flex-col bg-white overflow-hidden text-zinc-900 relative'>
      {/* Top Bar Header */}
      <BuilderHeader
        projectName={activeProject.name}
        version={activeProject.version}
        onBack={() => navigate("/")}
      />
      {/* Main Layout */}
    </div>
  )
}

export default BuilderPage