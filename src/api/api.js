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

export default api;

//export const dummyUser = {                                                    // usuario de ejemplo, no se usa directamente en el adapter
//  _id: "user-1",
//  name: "Alex Rivera",
//  email: "alex@example.com",
//};

//export const initialProjects = [                                              // datos "semilla": se cargan la primera vez si no hay nada en localStorage
//  {
//    _id: "proj-1",
//    name: "SaaSify Landing Page",
//    description:
//      "A modern SaaS landing page with dark mode accents, hero section, bento grid features, pricing table, and testimonials.",
//    version: 1,
//    status: "completed",
//    published: true,
//    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
//    updatedAt: new Date(Date.now() - 3600000 * 3).toISOString(),
//    messages: [ // historial de chat simulado del proyecto
//      {
//        role: "user",
//        content: "Create a modern SaaS landing page for an AI productivity platform called SaaSify",
//        timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
//      },
//      {
//        role: "assistant",
//        content:
//          "I have built the SaaSify landing page with a modern design system including Hero, Features, Pricing, and Testimonial components.",
//        timestamp: new Date(Date.now() - 86400000 * 2 + 5000).toISOString(),
//      },
//    ],
//    files: { // "archivos" del proyecto generado (código React de plantilla, texto plano)
//     "/App.js": `import Header from './components/Header';
//     import Hero from './components/Hero';
//     import Features from './components/Features';
//     import Pricing from './components/Pricing';
//     import Footer from './components/Footer';
// 
//     export default function App() {
//       return (
//         <div className="min-h-screen bg-zinc-950 text-white font-sans">
//           <Header />
//           <main>
//             <Hero />
//             <Features />
//             <Pricing />
//           </main>
//           <Footer />
//         </div>
//       );
//     }`,
//     "/components/Header.js": `export default function Header() {
//   return (
//     <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-zinc-950/80 backdrop-blur border-b border-zinc-800">
//       <div className="flex items-center gap-2">
//         <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white">S</div>
//         <span className="text-lg font-bold tracking-tight text-white">SaaSify</span>
//       </div>
//       <nav className="hidden sm:flex gap-6 text-sm text-zinc-400">
//         <a href="#features" className="hover:text-white transition-colors">Features</a>
//         <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
//       </nav>
//       <button className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 transition-colors">
//         Get Started
//       </button>
//     </header>
//   );
// }`,
//     "/components/Hero.js": `export default function Hero() {
//   return (
//     <section className="relative overflow-hidden px-6 py-28 text-center max-w-4xl mx-auto">
//       <div className="inline-block rounded-full bg-indigo-500/10 border border-indigo-500/20 px-4 py-1.5 text-xs font-semibold text-indigo-400 mb-6">
//         🚀 SaaSify 2.0 is live
//       </div>
//       <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight">
//         Supercharge your productivity with <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">AI Workflows</span>
//       </h1>
//       <p className="mt-6 text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
//         Automate routine tasks, generate actionable insights, and scale your operations faster than ever before.
//       </p>
//       <div className="mt-8 flex items-center justify-center gap-4">
//         <button className="rounded-lg bg-indigo-600 px-6 py-3 text-sm font-medium text-white hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-500/25">
//           Start Free Trial
//         </button>
//         <button className="rounded-lg border border-zinc-800 px-6 py-3 text-sm font-medium text-zinc-300 hover:bg-zinc-900 transition-colors">
//           Book a Demo
//         </button>
//       </div>
//     </section>
//   );
// }`,
//     "/components/Features.js": `const features = [
//   { title: "Smart Automation", desc: "Build workflow triggers and actions powered by custom LLM agents." },
//   { title: "Real-time Analytics", desc: "Monitor performance metrics and system usage with live dashboards." },
//   { title: "Enterprise Security", desc: "SOC2 compliant, end-to-end encryption, and role-based access control." }
// ];

// export default function Features() {
//  return (
//    <section id="features" className="max-w-5xl mx-auto px-6 py-20 border-t border-zinc-900">
//      <h2 className="text-3xl font-bold text-white text-center mb-12">Everything you need to scale</h2>
//      <div className="grid sm:grid-cols-3 gap-6">
//        {features.map((f) => (
//          <div key={f.title} className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
//            <h3 className="text-lg font-semibold text-white mb-2">{f.title}</h3>
//            <p className="text-sm text-zinc-400 leading-relaxed">{f.desc}</p>
//          </div>
//        ))}
//      </div>
//    </section>
//  );
//}`,
//     "/components/Pricing.js": `export default function Pricing() {
//   return (
//     <section id="pricing" className="max-w-4xl mx-auto px-6 py-20 border-t border-zinc-900 text-center">
//       <h2 className="text-3xl font-bold text-white mb-4">Simple, transparent pricing</h2>
//       <p className="text-zinc-400 mb-12">No hidden fees. Cancel anytime.</p>
//      <div className="grid sm:grid-cols-2 gap-8 text-left">
//        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-8">
//          <h3 className="text-xl font-bold text-white">Starter</h3>
//          <p className="text-3xl font-extrabold text-white mt-4">$29<span className="text-sm font-normal text-zinc-400">/mo</span></p>
//          <button className="w-full mt-6 rounded-lg border border-zinc-700 py-2.5 text-sm font-medium text-white hover:bg-zinc-800 transition-colors">
//            Get Started
//          </button>
//        </div>
//        <div className="rounded-xl border border-indigo-500/50 bg-indigo-950/20 p-8 relative">
//          <span className="absolute -top-3 right-6 bg-indigo-600 text-white text-xs font-semibold px-3 py-1 rounded-full">Popular</span>
//          <h3 className="text-xl font-bold text-white">Pro</h3>
//          <p className="text-3xl font-extrabold text-white mt-4">$79<span className="text-sm font-normal text-zinc-400">/mo</span></p>
//          <button className="w-full mt-6 rounded-lg bg-indigo-600 py-2.5 text-sm font-medium text-white hover:bg-indigo-500 transition-colors">
//            Get Pro Access
//          </button>
//        </div>
//      </div>
//    </section>
//  );
// }`,
//     "/components/Footer.js": `export default function Footer() {
//   return (
//     <footer className="border-t border-zinc-900 py-8 text-center text-sm text-zinc-500">
//       © {new Date().getFullYear()} SaaSify Inc. All rights reserved.
//     </footer>
//   );
// }`,
//     "/styles.css": ``,
//     },
//   },
//  {
//    _id: "proj-2",
//    name: "Personal Portfolio",
//    description: "A clean, minimal personal portfolio with an about section, skills grid, project showcase cards, and a contact form.",
//    version: 3,
//    status: "completed",
//    published: false,
//    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
//    updatedAt: new Date(Date.now() - 3600000 * 1).toISOString(),
//    messages: [
//      {
//        role: "user",
//        content: "Build me a personal portfolio website with about, skills, projects and contact sections",
//        timestamp: new Date(Date.now() - 86400000 * 5).toISOString(),
//      },
//      {
//        role: "assistant",
//        content: "I've created your personal portfolio with a hero section, an about me block, a skills grid, a projects showcase with cards, and a contact form.",
//        timestamp: new Date(Date.now() - 86400000 * 5 + 6000).toISOString(),
//      },
//      {
//        role: "user",
//        content: "Add a dark mode toggle and improve the projects section with hover effects",
//        timestamp: new Date(Date.now() - 86400000 * 3).toISOString(),
//      },
//      {
//        role: "assistant",
//        content: "Done! I've added a dark/light mode toggle in the header and enhanced the project cards with smooth hover lift and shadow transitions.",
//        timestamp: new Date(Date.now() - 86400000 * 3 + 4000).toISOString(),
//      },
//      {
//        role: "user",
//        content: "Make the hero section more eye-catching with a gradient background and animated text",
//        timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
//      },
//      {
//        role: "assistant",
//        content: "Updated! The hero now features a purple-to-indigo gradient, a typewriter animation for the job title, and a subtle floating avatar effect.",
//        timestamp: new Date(Date.now() - 3600000 * 2 + 5000).toISOString(),
//      },
//    ],
//    files: {
//      "/App.js": `import Header from './components/Header';
//import Hero from './components/Hero';
//import About from './components/About';
//import Skills from './components/Skills';
//import Projects from './components/Projects';
//import Contact from './components/Contact';
//import Footer from './components/Footer';

//export default function App() {
//  return (
//    <div className="min-h-screen bg-zinc-950">
//      <Header />
//      <main>
//        <Hero />
//        <About />
//        <Skills />
//        <Projects />
//        <Contact />
//      </main>
//      <Footer />
//    </div>
//  );
//}`,
//      "/components/Header.js": `import { useState } from 'react';

//export default function Header() {
//  const [dark, setDark] = useState(true);
//  return (
//    <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-zinc-950/80 backdrop-blur border-b border-zinc-800">
//      <span className="text-lg font-semibold tracking-tight text-white">Alex Rivera</span>
//      <nav className="hidden sm:flex gap-6 text-sm text-zinc-400">
//        <a href="#about" className="hover:text-white transition-colors">About</a>
//        <a href="#skills" className="hover:text-white transition-colors">Skills</a>
//        <a href="#projects" className="hover:text-white transition-colors">Projects</a>
//        <a href="#contact" className="hover:text-white transition-colors">Contact</a>
//      </nav>
//      <button
//        onClick={() => setDark(!dark)}
//        className="w-9 h-9 flex items-center justify-center rounded-full bg-zinc-900 border border-zinc-800 hover:border-zinc-600 transition-colors"
//      >
//        {dark ? '☀️' : '🌙'}
//      </button>
//    </header>
//  );
//}`,
//      "/components/Hero.js": `export default function Hero() {
//  return (
//    <section className="relative overflow-hidden bg-gradient-to-br from-violet-700 via-indigo-700 to-indigo-900 px-6 py-32 text-center">
//      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.08),_transparent_60%)]" />
//      <div className="relative max-w-2xl mx-auto">
//        <h1 className="text-4xl sm:text-6xl font-bold text-white tracking-tight">
//          Hi, I'm <span className="text-violet-300">Alex Rivera</span>
//        </h1>
//        <p className="mt-4 text-lg text-indigo-100">
//          Full-Stack Developer · UI Enthusiast · Open Source Contributor
//        </p>
//        <div className="mt-8 flex items-center justify-center gap-4">
//          <a href="#projects" className="rounded-lg bg-white px-6 py-3 text-sm font-medium text-indigo-900 hover:bg-indigo-50 transition-colors">
//            View My Work
//          </a>
//          <a href="#contact" className="rounded-lg border border-white/40 px-6 py-3 text-sm font-medium text-white hover:bg-white/10 transition-colors">
//            Get In Touch
//          </a>
//        </div>
//      </div>
//    </section>
//  );
//}`,
//      "/components/About.js": `export default function About() {
//  return (
//    <section id="about" className="max-w-3xl mx-auto px-6 py-20">
//      <h2 className="text-3xl font-bold text-white mb-6">About Me</h2>
//      <p className="text-zinc-400 leading-relaxed">
//        I'm a passionate full-stack developer with 5+ years of experience building
//        modern web applications. I love turning complex problems into elegant,
//        user-friendly solutions.
//      </p>
//    </section>
//  );
//}`,
//      "/components/Skills.js": `const skills = ['React', 'Node.js', 'TypeScript', 'Python', 'GraphQL', 'PostgreSQL', 'Docker', 'AWS'];

//export default function Skills() {
//  return (
//    <section id="skills" className="max-w-3xl mx-auto px-6 py-20">
//      <h2 className="text-3xl font-bold text-white mb-6">Skills</h2>
//      <div className="flex flex-wrap gap-2">
//        {skills.map(s => (
//          <span
//            key={s}
//            className="rounded-full border border-zinc-800 bg-zinc-900 px-4 py-1.5 text-sm text-zinc-300"
//          >
//            {s}
//          </span>
//        ))}
//      </div>
//    </section>
//  );
//}`,
//      "/components/Projects.js": `const projects = [
//  { title: 'TaskFlow', desc: 'A drag-and-drop project management tool built with React and Firebase.', stack: ['React', 'Firebase'] },
//  { title: 'DevBlog', desc: 'A markdown-powered developer blog with syntax highlighting and dark mode.', stack: ['Next.js', 'MDX'] },
//  { title: 'ShopQuick', desc: 'An e-commerce storefront with cart, checkout, and Stripe integration.', stack: ['Node.js', 'Stripe'] },
//];

//export default function Projects() {
//  return (
//    <section id="projects" className="max-w-5xl mx-auto px-6 py-20">
//      <h2 className="text-3xl font-bold text-white mb-8">Projects</h2>
//      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
//        {projects.map(p => (
//          <div
//            key={p.title}
//            className="group rounded-xl border border-zinc-800 bg-zinc-900 p-6 transition-all hover:-translate-y-1 hover:border-violet-700 hover:shadow-xl hover:shadow-violet-900/20"
//          >
//            <h3 className="text-lg font-semibold text-white">{p.title}</h3>
//            <p className="mt-2 text-sm text-zinc-400 leading-relaxed">{p.desc}</p>
//            <div className="mt-4 flex flex-wrap gap-2">
//              {p.stack.map(t => (
//                <span key={t} className="rounded-md bg-zinc-800 px-2.5 py-1 text-xs text-zinc-300">
//                  {t}
//                </span>
//              ))}
//            </div>
//          </div>
//        ))}
//      </div>
//    </section>
//  );
//}`,
//      "/components/Contact.js": `export default function Contact() {
//  return (
//    <section id="contact" className="max-w-xl mx-auto px-6 py-20">
//      <h2 className="text-3xl font-bold text-white mb-6">Get In Touch</h2>
//      <form className="flex flex-col gap-4">
//        <input
//          type="text"
//          placeholder="Your Name"
//          className="rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-violet-600"
//        />
//        <input
//          type="email"
//          placeholder="Your Email"
//          className="rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-violet-600"
//        />
//        <textarea
//          rows={5}
//          placeholder="Your Message"
//          className="rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-violet-600"
//        />
//        <button
//          type="submit"
//          className="rounded-lg bg-violet-600 px-6 py-3 text-sm font-medium text-white hover:bg-violet-500 transition-colors"
//        >
//          Send Message
//        </button>
//      </form>
//    </section>
//  );
//}`,
//      "/components/Footer.js": `export default function Footer() {
//  return (
//    <footer className="border-t border-zinc-800 py-8 text-center text-sm text-zinc-500">
//      © {new Date().getFullYear()} Alex Rivera · Built with React
//    </footer>
//  );
//}`,
//      "/styles.css": ``,
//    },
//  },
//];

//api.defaults.adapter = async (config) => {
// Axios llamará a esta función CADA VEZ que hagas api.get/post/put/delete
// "config" trae la url, method, data (body), headers, etc. de esa llamada

//  await new Promise((resolve) => setTimeout(resolve, 150));                                                    // simula latencia de red (150ms) para que se sienta "real"

//  const method = (config.method || "get").toLowerCase();                                                       // normaliza el método: GET, POST, PUT, DELETE...
//  const url = config.url || "";                                                                                // la ruta pedida, ej: "/api/projects/proj-1"
//  const body = config.data ? (typeof config.data === "string" ? JSON.parse(config.data) : config.data) : {};
// ^ el body puede llegar como string JSON o como objeto, aquí se normaliza a objeto

//  const getProjects = () => {                                                                                  // lee la "base de datos" de proyectos desde localStorage
//    try {
//      const saved = localStorage.getItem("mock_projects");
//      return saved ? JSON.parse(saved) : initialProjects;                                                  // si no hay nada guardado, usa los datos semilla
//    } catch {
//      return initialProjects;                                                                              // fallback si el JSON está corrupto
//    }
//  };

//  const saveProjects = (projects) => {                                                                         // persiste la lista completa de proyectos
//    localStorage.setItem("mock_projects", JSON.stringify(projects));
//  };

//  const getUser = () => {                                                                                      // lee el usuario "logueado" actual
//    try {
//      const saved = localStorage.getItem("mock_user");
//      return saved ? JSON.parse(saved) : null; // null = no hay sesión
//    } catch {
//      return null;
//    }
//  };

//  const saveUser = (user) => {                                                                                 // guarda o borra el usuario según login/logout
//    if (user) {
//      localStorage.setItem("mock_user", JSON.stringify(user));
//    } else {
//      localStorage.removeItem("mock_user"); // logout: se elimina la clave
//    }
//  };

//  let responseData = null;                     // lo que se devolverá como "response.data"
//  let status = 200;                            // código HTTP simulado, por defecto OK

// ---- A partir de aquí: un gran if/else que actúa como "router" de un backend ----
// Cada bloque compara url + method y decide qué hacer, imitando distintos endpoints REST

// 1. Auth routes
//  if (url === "/api/auth/me") { // equivale a "quién soy" / comprobar sesión
//    const user = getUser();
//    if (user) {
//      responseData = { user };
//    } else {
//      status = 401; // no autenticado
//      responseData = { error: "Unauthorized" };
//    }
//  } else if (url === "/api/auth/login") {
//    const loggedInUser = { _id: "user-1", name: body.email?.split("@")[0] || "User", email: body.email };
// ^ NO valida contraseña real, "loguea" a cualquiera creando un usuario ficticio con el email enviado
//    saveUser(loggedInUser);
//    responseData = { user: loggedInUser };
//  } else if (url === "/api/auth/register") {
//    const newUser = { _id: `user-${Date.now()}`, name: body.name || "User", email: body.email };
// ^ id único basado en timestamp, sin validaciones
//    saveUser(newUser);
//    responseData = { user: newUser };
//  } else if (url === "/api/auth/logout") {
//    saveUser(null); // borra sesión
//    responseData = { message: "Logged out" };
//  }

// 2. Project routes
//  else if (url === "/api/projects" && method === "get") { // listar proyectos
//    const projects = getProjects();
//    responseData = projects.map((p) => ({ // devuelve solo campos resumidos (sin files/messages, como haría un backend real para listados)
//      _id: p._id,
//      name: p.name,
//      description: p.description,
//      version: p.version,
//      createdAt: p.createdAt,
//      updatedAt: p.updatedAt,
//    }));
//  } else if (url === "/api/projects" && method === "post") { // crear proyecto nuevo
//    const prompt = body.prompt || "New Project";
//    const projName = prompt.length > 28 ? prompt.slice(0, 28) + "..." : prompt; // trunca el nombre si el prompt es largo
//    const newProject = {
//      _id: `proj-${Date.now()}`, // id único
//      name: projName,
//      description: prompt,
//      version: 1,
//      status: "completed",
//      published: false,
//      createdAt: new Date().toISOString(),
//      updatedAt: new Date().toISOString(),
//      messages: [ // simula la conversación inicial con la "IA"
//        { role: "user", content: prompt, timestamp: new Date().toISOString() },
//        {
//          role: "assistant",
//          content: `Generated custom website structure for: "${prompt}".`,
//          timestamp: new Date().toISOString(),
//        },
//      ],
//      files: { // genera archivos de plantilla usando el prompt/nombre como texto dinámico
//        "/App.js": `...`,
//        "/components/Header.js": `...`,
//        "/components/Hero.js": `...`,
//        "/components/Footer.js": `...`,
//        "/styles.css": `...`,
//      },
//    };

//    const projects = getProjects();
//    const updated = [newProject, ...projects]; // el nuevo proyecto va primero en la lista
//    saveProjects(updated);
//    responseData = newProject;
//    status = 201; // "Created"
//  } else if (url.match(/\/api\/projects\/public\/[^/]+$/) && method === "get") {
// ^ regex: detecta rutas tipo /api/projects/public/proj-1 (vista pública de un proyecto)
//    const id = url.split("/").pop(); // extrae el id del final de la url
//    const projects = getProjects();
//    const found = projects.find((p) => p._id === id);
//    if (found) {
//      responseData = found;
//    } else {
//      status = 404;
//      responseData = { error: "Website unavailable or not published yet" };
//    }
//  } else if (url.match(/\/api\/projects\/[^/]+\/chat$/) && method === "post") {
// ^ regex: /api/projects/:id/chat -> simula enviar un mensaje al "asistente" para modificar el proyecto
//    const id = url.split("/")[3]; // en esta ruta el id está en la posición 3 del path
//    const prompt = body.prompt || "";
//    const projects = getProjects();
//    const foundIndex = projects.findIndex((p) => p._id === id);
//    if (foundIndex !== -1) {
//      const found = projects[foundIndex];
//      const updatedMessages = [
//        ...found.messages,
//        { role: "user", content: prompt, timestamp: new Date().toISOString() },
//        {
//          role: "assistant", // respuesta "falsa" de la IA, texto fijo/genérico
//          content: `Updated project for: "${prompt}". Applied layout and component adjustments!`,
//          timestamp: new Date().toISOString(),
//        },
//      ];
//      const updatedProject = {
//        ...found,
//        version: found.version + 1, // incrementa versión al "editar"
//        status: "completed",
//        updatedAt: new Date().toISOString(),
//        messages: updatedMessages,
//      };
//      projects[foundIndex] = updatedProject; // reemplaza el proyecto en el array
//      saveProjects(projects);
//      responseData = updatedProject;
//    } else {
//      status = 404;
//      responseData = { error: "Project not found" };
//    }
//  } else if (url.match(/\/api\/projects\/[^/]+\/publish$/) && method === "post") {
// /api/projects/:id/publish -> marca el proyecto como publicado
//    const id = url.split("/")[3];
//    const projects = getProjects();
//    const foundIndex = projects.findIndex((p) => p._id === id);
//    if (foundIndex !== -1) {
//      projects[foundIndex].published = true;
//      saveProjects(projects);
//      responseData = { published: true };
//    } else {
//      status = 404;
//      responseData = { error: "Project not found" };
//    }
//  } else if (url.match(/\/api\/projects\/[^/]+\/files$/) && method === "put") {
// /api/projects/:id/files -> sobrescribe todos los archivos del proyecto (ej: tras editar código)
//    const id = url.split("/")[3];
//    const files = body.files;
//    const projects = getProjects();
//    const foundIndex = projects.findIndex((p) => p._id === id);
//    if (foundIndex !== -1) {
//      projects[foundIndex].files = files; // reemplazo completo, no parcial
//      projects[foundIndex].updatedAt = new Date().toISOString();
//      saveProjects(projects);
//      responseData = { success: true };
//    } else {
//      status = 404;
//      responseData = { error: "Project not found" };
//    }
//  } else if (url.match(/\/api\/projects\/[^/]+$/) && method === "get") {
// /api/projects/:id -> obtener un proyecto completo (con files y messages)
//    const id = url.split("/").pop();
//    const projects = getProjects();
//    const found = projects.find((p) => p._id === id);
//    if (found) {
//      responseData = found;
//    } else {
//      status = 404;
//      responseData = { error: "Project not found" };
//    }
//  } else if (url.match(/\/api\/projects\/[^/]+$/) && method === "delete") {
// /api/projects/:id -> eliminar proyecto
//    const id = url.split("/").pop();
//    const projects = getProjects();
//    const filtered = projects.filter((p) => p._id !== id); // se guarda todo MENOS el borrado
//    saveProjects(filtered);
//    responseData = { message: "Project deleted" };
//  }

//  if (status >= 400) { // si algún bloque de arriba marcó error...
//    const err = new Error(responseData?.error || "Request failed");
//    err.response = { data: responseData, status, headers: {}, config }; // imita la forma de un error real de Axios
//    throw err; // así tu código puede seguir usando try/catch(err) { err.response.data }
//  }

//  return { // forma exacta que Axios espera de cualquier adapter, real o falso
//    data: responseData,
//    status,
//    statusText: "OK",
//    headers: {},
//    config,
//  };
//};

//export default api;