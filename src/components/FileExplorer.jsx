import { FolderOpenIcon } from "lucide-react";
import { useMemo } from "react"


const buildTree = (paths) => {                                    // Recibe un array de rutas de archivo (strings) y construye una estructura de árbol
  const root = [];                                                  // Array que representará el nivel raíz del árbol (carpetas/archivos de primer nivel)
  for (const filePath of paths.sort()) {                            // Se ordenan alfabéticamente las rutas para que el árbol quede consistente
    const parts = filePath.split("/").filter(Boolean)               // Se descompone la ruta en segmentos, eliminando strings vacíos (p.ej. por barras iniciales)
    let current = root;                                             // Puntero que irá descendiendo por el árbol a medida que se procesan los segmentos

    for (let i = 0; i < parts.length; i++) {                        // Se recorre cada segmento de la ruta para ir creando/localizando los nodos correspondientes
      const name = parts[i]                                         // Nombre del nodo (carpeta o archivo) en este nivel
      const isLast = i === parts.length - 1;                        // Si es el último segmento, el nodo es un archivo; si no, es una carpeta intermedia
      const fullPath = "/" + parts.slice(0, i + 1).join("/")        // Reconstruye la ruta completa acumulada hasta este segmento (para identificar el nodo de forma única)
      let existing = current.find(n => n.name === name)             // Comprueba si el nodo ya fue creado antes (evita duplicar carpetas compartidas por varias rutas)

      if (!existing) {                                              // Si el nodo no existe todavía en este nivel, se crea uno nuevo
        existing = {                                                // Objeto que representa el nodo (archivo o carpeta) dentro del árbol
          name,                                                     // Nombre a mostrar del nodo
          path: fullPath,                                           // Ruta completa asociada al nodo, útil para identificarlo o referenciarlo después
          isDir: !isLast,                                           // Indica si el nodo es una carpeta (true) o un archivo (false)
          children: [],                                             // Array donde se almacenarán los nodos hijos (vacío si es un archivo)
        };
        current.push(existing);                                   // Se añade el nuevo nodo al nivel actual del árbol
      }
      current = existing.children;                                // Se desciende al siguiente nivel, usando los hijos del nodo actual como nuevo punto de partida
    }
  }
  return root;                                                    // Devuelve el árbol completo ya construido a partir de todas las rutas
}

const TreeItem = ({ node, activeFile, onFileSelect }) => {
  const isActive = node.path === activeFile;

  if (node.isDir) {
    return (
      <div>
        <div
          className="flex items-center gap-2 py-1 px-2 text-xs text-zinc-400 select-none"
          style={{
            paddingLeft: `${depth * 12 + 8}px`
          }}
        >
          <FolderOpenIcon size={34} className="text-zinc-800 opacity-60" />
          <span className="truncate">{node.name}</span>
        </div>
        {node.children.map((child) => (
          <TreeItem
            key={child.path}
            node={child}
            activeFile={activeFile}
            onFileSelect={onFileSelect}
            depth={depth + 1}
          />
        ))}
      </div>
    )
  }

}

const FileExplorer = ({ files, activeFile, onFileSelect }) => {

  const tree = useMemo(() => buildTree(Object.keys(files)), [])

  return (
    <div className="py-2 overflow-y-auto hide-scrollbar">
      <p className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-zinc-400">
        Files
      </p>

      {tree.map((node) => (
        <TreeItem
          key={node.path}
          node={node}
          activeFile={activeFile}
          onFileSelect={onFileSelect}
          depth={0}
        />
      ))}
    </div>
  )
}

export default FileExplorer