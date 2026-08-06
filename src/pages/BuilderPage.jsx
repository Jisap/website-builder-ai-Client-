import React, { useEffect, useState } from 'react'
import { useAppContext } from '../context/AppContext'
import { useNavigate, useParams } from 'react-router-dom'
import Loading from '../components/Loading';
import BuilderHeader from '../components/BuilderHeader';
import { FolderTreeIcon, MessageSquareIcon } from 'lucide-react';
import ChatPanel from '../components/ChatPanel';

/**
 * Flujo del BuilderPage:
 * mount → user=null → loadProject() sale sin activeProject → <Loading/>
 *  ↓
 * checkSessions resuelve → user se define → loadProject cambia de referencia
 *  ↓
 * useEffect([id, loadProject]) se dispara de nuevo → fetch real
 *  ↓
 * activeProject poblado → loadingActiveProject=false → <BuilderHeader/>
 *  ↓
 * si status es pending/generating(/revising) → doble polling (1.5s y 2s) hasta que cambie el status
 */

const BuilderPage = () => {

  const { id } = useParams();
  const navigate = useNavigate();
  const [leftTab, setLeftTab] = useState("chat");
  const [publishing, setPublishing] = useState(false);
  const [publishUrl, setPublishUrl] = useState(null);

  const {
    activeProject,
    loadingActiveProject,
    activeFile,
    showCode,
    setActiveFile,
    setShowCode,
    loadProject,
    logout,
    chatLoading,
    handleChat
  } = useAppContext()

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

  const handleOpenPreview = () => {
    if (!id) return;
    window.open(`/preview/${id}`, "_blank")
  }

  const handlePublish = async () => {

  }

  const handleDownload = () => {

  }



  return (
    <div className='h-screen flex flex-col bg-white overflow-hidden text-zinc-900 relative'>
      {/* Top Bar Header */}
      <BuilderHeader
        projectName={activeProject.name}
        version={activeProject.version}
        showCode={showCode}
        publishing={publishing}
        onToggleShowCode={() => setShowCode(!showCode)}
        onOpenPreview={handleOpenPreview}
        onPublish={handlePublish}
        onDownload={handleDownload}
        onBack={() => navigate("/")}
        onLogout={logout}

      />
      {/* Main Layout */}
      <div className='flex-2 flex overflow-hidden'>
        {/* Left Panel */}
        <div className='w-[320px] shrink-0 flex flex-col border-r border-zinc-200 bg-white'>
          {/* Sidebar Tabs */}
          <div className='flex border-b border-zinc-100'>
            <button
              onClick={() => setLeftTab("chat")}
              className={`
                flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium cursor-pointer
                ${leftTab === "chat"
                  ? "text-zinc-900 border-b-2 border-zinc-900"
                  : "text-zinc-400 hover:text-zinc-700"
                }
              `}
            >
              <MessageSquareIcon size={13} /> Chat
            </button>

            <button
              onClick={() => setLeftTab("files")}
              className={`
                flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium cursor-pointer
                ${leftTab === "files"
                  ? "text-zinc-900 border-b-2 border-zinc-900"
                  : "text-zinc-400 hover:text-zinc-700"
                }
              `}
            >
              <FolderTreeIcon size={13} /> Files
            </button>
          </div>

          {/* Sidebar Content */}
          <div className='flex-1 overflow-hidden'>
            {leftTab === "chat" ? (
              <div className='h-full'>
                <ChatPanel
                  messages={activeProject.messages}
                  onSend={handleChat}
                  loading={chatLoading}
                />
              </div>
            ) : (
              <div className='h-full'>
                FileExplorer
              </div>
            )}
          </div>
        </div>


        {/* Preview / Code area */}
      </div>
    </div>
  )
}

export default BuilderPage