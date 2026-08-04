import axios from "axios";

/**
 * mock de API hecho con Axios: 
 * simula un backend real interceptando las peticiones y devolviendo datos guardados en localStorage, 
 * sin necesidad de un servidor de verdad.
 */


const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL || "",                             // URL base real (si existiera backend)
  withCredentials: true,                                                    // enviaría cookies si hubiera peticiones reales
});

export const dummyUser = {                                                    // usuario de ejemplo, no se usa directamente en el adapter
  _id: "user-1",
  name: "Alex Rivera",
  email: "alex@example.com",
};

export const initialProjects = [                                              // datos "semilla": se cargan la primera vez si no hay nada en localStorage
  {
    _id: "proj-1",
    name: "SaaSify Landing Page",
    description:
      "A modern SaaS landing page with dark mode accents, hero section, bento grid features, pricing table, and testimonials.",
    version: 1,
    status: "completed",
    published: true,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    messages: [ // historial de chat simulado del proyecto
      {
        role: "user",
        content: "Create a modern SaaS landing page for an AI productivity platform called SaaSify",
        timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
      },
      {
        role: "assistant",
        content:
          "I have built the SaaSify landing page with a modern design system including Hero, Features, Pricing, and Testimonial components.",
        timestamp: new Date(Date.now() - 86400000 * 2 + 5000).toISOString(),
      },
    ],
    files: { // "archivos" del proyecto generado (código React de plantilla, texto plano)
      "/App.js": `... (contenido igual, sin cambios) ...`,
      "/components/Header.js": `... (contenido igual, sin cambios) ...`,
      "/components/Hero.js": `... (contenido igual, sin cambios) ...`,
      "/components/Features.js": `... (contenido igual, sin cambios) ...`,
      "/components/Pricing.js": `... (contenido igual, sin cambios) ...`,
      "/components/Footer.js": `... (contenido igual, sin cambios) ...`,
      "/styles.css": `... (contenido igual, sin cambios) ...`,
    },
  },
  {
    _id: "proj-2", // segundo proyecto de ejemplo (mismo patrón)
    name: "Personal Portfolio",
    // ... resto igual
    files: {
      "/App.js": `... (contenido igual, sin cambios) ...`,
      "/styles.css": `... (contenido igual, sin cambios) ...`,
    },
  },
];

// ====== AQUÍ EMPIEZA LO IMPORTANTE: el adapter que sustituye las peticiones HTTP reales ======

api.defaults.adapter = async (config) => {
  // Axios llamará a esta función CADA VEZ que hagas api.get/post/put/delete
  // "config" trae la url, method, data (body), headers, etc. de esa llamada

  await new Promise((resolve) => setTimeout(resolve, 150));                                                    // simula latencia de red (150ms) para que se sienta "real"

  const method = (config.method || "get").toLowerCase();                                                       // normaliza el método: GET, POST, PUT, DELETE...
  const url = config.url || "";                                                                                // la ruta pedida, ej: "/api/projects/proj-1"
  const body = config.data ? (typeof config.data === "string" ? JSON.parse(config.data) : config.data) : {};
  // ^ el body puede llegar como string JSON o como objeto, aquí se normaliza a objeto

  const getProjects = () => {                                                                                  // lee la "base de datos" de proyectos desde localStorage
    try {
      const saved = localStorage.getItem("mock_projects");
      return saved ? JSON.parse(saved) : initialProjects;                                                  // si no hay nada guardado, usa los datos semilla
    } catch {
      return initialProjects;                                                                              // fallback si el JSON está corrupto
    }
  };

  const saveProjects = (projects) => {                                                                         // persiste la lista completa de proyectos
    localStorage.setItem("mock_projects", JSON.stringify(projects));
  };

  const getUser = () => {                                                                                      // lee el usuario "logueado" actual
    try {
      const saved = localStorage.getItem("mock_user");
      return saved ? JSON.parse(saved) : null; // null = no hay sesión
    } catch {
      return null;
    }
  };

  const saveUser = (user) => {                                                                                 // guarda o borra el usuario según login/logout
    if (user) {
      localStorage.setItem("mock_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("mock_user"); // logout: se elimina la clave
    }
  };

  let responseData = null;                     // lo que se devolverá como "response.data"
  let status = 200;                            // código HTTP simulado, por defecto OK

  // ---- A partir de aquí: un gran if/else que actúa como "router" de un backend ----
  // Cada bloque compara url + method y decide qué hacer, imitando distintos endpoints REST

  // 1. Auth routes
  if (url === "/api/auth/me") { // equivale a "quién soy" / comprobar sesión
    const user = getUser();
    if (user) {
      responseData = { user };
    } else {
      status = 401; // no autenticado
      responseData = { error: "Unauthorized" };
    }
  } else if (url === "/api/auth/login") {
    const loggedInUser = { _id: "user-1", name: body.email?.split("@")[0] || "User", email: body.email };
    // ^ NO valida contraseña real, "loguea" a cualquiera creando un usuario ficticio con el email enviado
    saveUser(loggedInUser);
    responseData = { user: loggedInUser };
  } else if (url === "/api/auth/register") {
    const newUser = { _id: `user-${Date.now()}`, name: body.name || "User", email: body.email };
    // ^ id único basado en timestamp, sin validaciones
    saveUser(newUser);
    responseData = { user: newUser };
  } else if (url === "/api/auth/logout") {
    saveUser(null); // borra sesión
    responseData = { message: "Logged out" };
  }

  // 2. Project routes
  else if (url === "/api/projects" && method === "get") { // listar proyectos
    const projects = getProjects();
    responseData = projects.map((p) => ({ // devuelve solo campos resumidos (sin files/messages, como haría un backend real para listados)
      _id: p._id,
      name: p.name,
      description: p.description,
      version: p.version,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    }));
  } else if (url === "/api/projects" && method === "post") { // crear proyecto nuevo
    const prompt = body.prompt || "New Project";
    const projName = prompt.length > 28 ? prompt.slice(0, 28) + "..." : prompt; // trunca el nombre si el prompt es largo
    const newProject = {
      _id: `proj-${Date.now()}`, // id único
      name: projName,
      description: prompt,
      version: 1,
      status: "completed",
      published: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [ // simula la conversación inicial con la "IA"
        { role: "user", content: prompt, timestamp: new Date().toISOString() },
        {
          role: "assistant",
          content: `Generated custom website structure for: "${prompt}".`,
          timestamp: new Date().toISOString(),
        },
      ],
      files: { // genera archivos de plantilla usando el prompt/nombre como texto dinámico
        "/App.js": `...`,
        "/components/Header.js": `...`,
        "/components/Hero.js": `...`,
        "/components/Footer.js": `...`,
        "/styles.css": `...`,
      },
    };

    const projects = getProjects();
    const updated = [newProject, ...projects]; // el nuevo proyecto va primero en la lista
    saveProjects(updated);
    responseData = newProject;
    status = 201; // "Created"
  } else if (url.match(/\/api\/projects\/public\/[^/]+$/) && method === "get") {
    // ^ regex: detecta rutas tipo /api/projects/public/proj-1 (vista pública de un proyecto)
    const id = url.split("/").pop(); // extrae el id del final de la url
    const projects = getProjects();
    const found = projects.find((p) => p._id === id);
    if (found) {
      responseData = found;
    } else {
      status = 404;
      responseData = { error: "Website unavailable or not published yet" };
    }
  } else if (url.match(/\/api\/projects\/[^/]+\/chat$/) && method === "post") {
    // ^ regex: /api/projects/:id/chat -> simula enviar un mensaje al "asistente" para modificar el proyecto
    const id = url.split("/")[3]; // en esta ruta el id está en la posición 3 del path
    const prompt = body.prompt || "";
    const projects = getProjects();
    const foundIndex = projects.findIndex((p) => p._id === id);
    if (foundIndex !== -1) {
      const found = projects[foundIndex];
      const updatedMessages = [
        ...found.messages,
        { role: "user", content: prompt, timestamp: new Date().toISOString() },
        {
          role: "assistant", // respuesta "falsa" de la IA, texto fijo/genérico
          content: `Updated project for: "${prompt}". Applied layout and component adjustments!`,
          timestamp: new Date().toISOString(),
        },
      ];
      const updatedProject = {
        ...found,
        version: found.version + 1, // incrementa versión al "editar"
        status: "completed",
        updatedAt: new Date().toISOString(),
        messages: updatedMessages,
      };
      projects[foundIndex] = updatedProject; // reemplaza el proyecto en el array
      saveProjects(projects);
      responseData = updatedProject;
    } else {
      status = 404;
      responseData = { error: "Project not found" };
    }
  } else if (url.match(/\/api\/projects\/[^/]+\/publish$/) && method === "post") {
    // /api/projects/:id/publish -> marca el proyecto como publicado
    const id = url.split("/")[3];
    const projects = getProjects();
    const foundIndex = projects.findIndex((p) => p._id === id);
    if (foundIndex !== -1) {
      projects[foundIndex].published = true;
      saveProjects(projects);
      responseData = { published: true };
    } else {
      status = 404;
      responseData = { error: "Project not found" };
    }
  } else if (url.match(/\/api\/projects\/[^/]+\/files$/) && method === "put") {
    // /api/projects/:id/files -> sobrescribe todos los archivos del proyecto (ej: tras editar código)
    const id = url.split("/")[3];
    const files = body.files;
    const projects = getProjects();
    const foundIndex = projects.findIndex((p) => p._id === id);
    if (foundIndex !== -1) {
      projects[foundIndex].files = files; // reemplazo completo, no parcial
      projects[foundIndex].updatedAt = new Date().toISOString();
      saveProjects(projects);
      responseData = { success: true };
    } else {
      status = 404;
      responseData = { error: "Project not found" };
    }
  } else if (url.match(/\/api\/projects\/[^/]+$/) && method === "get") {
    // /api/projects/:id -> obtener un proyecto completo (con files y messages)
    const id = url.split("/").pop();
    const projects = getProjects();
    const found = projects.find((p) => p._id === id);
    if (found) {
      responseData = found;
    } else {
      status = 404;
      responseData = { error: "Project not found" };
    }
  } else if (url.match(/\/api\/projects\/[^/]+$/) && method === "delete") {
    // /api/projects/:id -> eliminar proyecto
    const id = url.split("/").pop();
    const projects = getProjects();
    const filtered = projects.filter((p) => p._id !== id); // se guarda todo MENOS el borrado
    saveProjects(filtered);
    responseData = { message: "Project deleted" };
  }

  if (status >= 400) { // si algún bloque de arriba marcó error...
    const err = new Error(responseData?.error || "Request failed");
    err.response = { data: responseData, status, headers: {}, config }; // imita la forma de un error real de Axios
    throw err; // así tu código puede seguir usando try/catch(err) { err.response.data }
  }

  return { // forma exacta que Axios espera de cualquier adapter, real o falso
    data: responseData,
    status,
    statusText: "OK",
    headers: {},
    config,
  };
};

export default api;