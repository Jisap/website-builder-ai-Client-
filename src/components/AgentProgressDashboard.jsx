import { CheckCircle2Icon, CircleIcon, Loader2Icon } from "lucide-react";

// Componente que muestra el progreso de un agente de IA mientras genera
// los archivos de un proyecto (checklist + barra de progreso + estado).
export default function AgentProgressDashboard({ project }) {


  const planned = project.filesPlanned || [];                           // Lista de archivos que el agente tiene previsto generar. Cada elemento incluye { path, description }.

  const completed = project.filesGenerated || [];                       // Lista de "path" de los archivos que ya se han generado con éxito.

  const current = project.currentFile;                                  // Path del archivo que se está generando en este momento (o undefined).

  const isFailed = project.status === "failed";                         // Flag booleano derivado del estado del proyecto: true si el proceso falló.

  return (
    <div className="h-full w-full bg-zinc-50 flex flex-col items-center justify-center p-6 md:p-12 overflow-y-auto">
      <div className="max-w-xl w-full bg-white border border-zinc-200 rounded-2xl p-6 md:p-8 relative overflow-hidden">

        {/* Cabecera: título y subtítulo que cambian según el estado del proceso */}
        <div className="flex items-center gap-4 mb-6">
          <div>
            <h2 className="text-base font-medium text-zinc-800">
              {isFailed
                ? "Generation Failed" // Estado de error
                : project.status === "pending"
                  ? "Planning Architecture..." // Aún no ha empezado a generar archivos
                  : "AI Agent is Building..."} {/* Estado por defecto: generando */}
            </h2>

            <p className="text-xs text-zinc-500 mt-0.5">
              {isFailed ? "An error occurred during build" : "Writing production-ready React codebase"}
            </p>
          </div>
        </div>

        {/* Bloque de error: solo se muestra si falló Y existe un mensaje de error */}
        {isFailed && project.error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-lg text-sm text-red-700 font-medium">
            Error: {project.error}
          </div>
        )}

        {/* Barra de progreso global */}
        {/* Condición: solo se renderiza si ya hay archivos planificados y el proceso no ha fallado */}
        {planned.length > 0 && !isFailed && (
          <div className="mb-6">
            <div className="flex justify-between text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
              <span>Progress</span>
              {/* Porcentaje = archivos completados / archivos planificados, redondeado */}
              <span>{Math.round((completed.length / planned.length) * 100)}%</span>
            </div>

            <div className="w-full h-1.5 bg-zinc-200 rounded-full overflow-hidden">
              {/* El ancho de la barra interna se calcula con el mismo porcentaje */}
              <div
                className="h-full bg-zinc-700 transition-all duration-500 ease-out"
                style={{ width: `${(completed.length / planned.length) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Checklist de archivos: solo se muestra si ya existe una lista planificada */}
        {planned.length > 0 ? (
          <div>
            <span className="block text-[10px] font-semibold text-zinc-400 uppercase tracking-widest mb-3">
              Planned Files ({completed.length}/{planned.length})
            </span>

            <div className="space-y-2.5 max-h-75 overflow-y-auto pr-1">
              {planned.map((file) => {
                // Comprueba si este archivo concreto ya está en la lista de completados
                const isCompleted = completed.includes(file.path);
                // Comprueba si este archivo es el que se está generando ahora mismo
                const isGenerating = current === file.path;

                return (
                  <div
                    key={file.path} // Se asume que "path" es único por archivo
                    // Estilos condicionales según el estado de la fila:
                    // generando > completado > pendiente (atenuado con opacity-60)
                    className={`flex items-center gap-3 p-2.5 rounded-lg border transition-all ${isGenerating
                      ? "bg-zinc-50/50 border-zinc-300"
                      : isCompleted
                        ? "bg-white border-zinc-100"
                        : "bg-white border-zinc-100 opacity-60"
                      }`}
                  >
                    {/* Icono según el estado: completado (check verde) > generando (spinner) > pendiente (círculo vacío) */}
                    {isCompleted ? (
                      <CheckCircle2Icon size={16} className="text-emerald-500 shrink-0" />
                    ) : isGenerating ? (
                      <Loader2Icon size={16} className="animate-spin text-zinc-900 shrink-0" />
                    ) : (
                      <CircleIcon size={16} className="text-zinc-300 shrink-0" />
                    )}

                    {/* Nombre del archivo y descripción corta */}
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-xs font-medium truncate ${isGenerating ? "text-zinc-800" : "text-zinc-700"}`}
                      >
                        {file.path}
                      </p>
                      <p className="text-[10px] text-zinc-400 truncate mt-0.5">{file.description}</p>
                    </div>

                    {/* Etiqueta "Active" solo visible en el archivo que se está generando ahora */}
                    {isGenerating && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-600 font-semibold animate-pulse uppercase tracking-wider">
                        Active
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          // Estado inicial: todavía no hay lista de archivos planificados y no ha fallado
          !isFailed && (
            <div className="flex flex-col items-center justify-center py-6 text-zinc-400">
              <Loader2Icon size={24} className="animate-spin mb-2" />
              <p className="text-xs">Analyzing requirements and designing project structure...</p>
            </div>
          )
        )}
      </div>
    </div>
  );
}