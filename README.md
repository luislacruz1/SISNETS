# 🌐 Networking de Trabajadores Sociales (Arquitectura SISGEIN Core)

Este proyecto ha sido reestructurado utilizando **el mismo stack tecnológico, arquitectura de componentes, diseño y dependencias que tu sistema SISGEIN**:

---

## 🛠️ Stack Tecnológico Idéntico a SISGEIN

| Módulo / Librería | Versión | Propósito en el Sistema |
| :--- | :--- | :--- |
| **React** | `^19.2.0` | Biblioteca de UI de última generación |
| **Vite** | `^7.2.4` | Bundler y servidor de desarrollo ultra-rápido |
| **Tailwind CSS** | `^4.1.18` (`@tailwindcss/postcss`) | Sistema de diseño de clases utilitarias de última generación con soporte de tokens `@theme` |
| **Framer Motion** | `^12.24.12` | Animaciones fluidas de entrada, salida y modales (`motion.div`, `AnimatePresence`) |
| **Lucide React** | `^0.562.0` | Colección oficial de iconos vectoriales |
| **SweetAlert2** | `^11.26.18` | Alertas interactivas y notificaciones modales |
| **ThemeContext** | Nativo React Context | Cambio dinámico entre **Modo Claro** y **Modo Oscuro** instantáneo |
| **Google Identity Services** | OAuth 2.0 | Botón e integración oficial de Google Sign-In |

---

## 🎨 Paleta de Color: Azul Noche & Blanco

* **Azul Noche Profundo (`#0A1128` / `#050B18`)**:
  - Panel izquierdo institucional con partículas de red interactivas (`DynamicNetworkCanvas`).
  - Botón principal de acceso (*"ENTRAR AL SISTEMA →"*).
  - Títulos principales en tracking y uppercase.
* **Blanco Puro (`#FFFFFF`) / Dark Mode (`#0F172A`)**:
  - Contenedor de formulario con bordes curvos `rounded-[2.5rem]`, sombras profundas `shadow-[0_50px_150px_-20px_rgba(0,10,30,0.35)]`.
  - Tarjetas de campos de entrada con anillos de foco azul/cyan.
* **Acentos Cyan y Azul (`#06B6D4` / `#3B82F6`)**:
  - Nodos de conexión entre profesionales, estados activos e iconos destacados.

---

## 📂 Estructura del Código Fuente

```text
Networking/
├── package.json                   # Dependencias idénticas a SISGEIN (React 19, Tailwind v4, etc.)
├── vite.config.js                 # Configuración Vite con React Plugin
├── postcss.config.js              # Configuración PostCSS con @tailwindcss/postcss
├── index.html                     # Entry point HTML5 con SDK Google Identity
├── run-networking.bat             # Iniciador rápido por consola (idéntico a run-simec.bat)
└── src/
    ├── main.jsx                   # Montaje ReactDOM
    ├── App.jsx                    # Configuración de Rutas, ThemeProvider y AuthProvider
    ├── index.css                  # Tailwind v4 (@import "tailwindcss"; @theme; glassmorphism)
    ├── context/
    │   ├── ThemeContext.jsx       # Selector dinámico Modo Claro / Modo Oscuro
    │   └── AuthContext.jsx        # Estado global de usuario, login y logout
    ├── components/
    │   └── DynamicNetworkCanvas.jsx # Canvas interactivo con red de conexiones
    └── pages/
        └── Login.jsx              # Vista de Login con Google OAuth, Correo, Registro y Modal
```

---

## 🚀 ¿Cómo Ejecutar el Proyecto?

### Opción 1: Con el iniciador automático
Haz doble clic en **[run-networking.bat](file:///c:/Users/Luis/Desktop/Networking/run-networking.bat)**.
El script detectará si faltan dependencias, ejecutará `npm install` si es necesario e iniciará el servidor de desarrollo en `http://localhost:5180`.

### Opción 2: Desde la terminal
```bash
npm install
npm run dev
```
Luego abre `http://localhost:5180` en tu navegador.
