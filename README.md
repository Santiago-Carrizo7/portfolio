# Santiago Carrizo — Terminal Portfolio

Portafolio web personal e interactivo con estética y experiencia de terminal Unix / CLI y sistema operativo moderno. Desarrollado con tecnologías web puras (**HTML5 semántico, CSS3 moderno, JavaScript Vanilla ES6+ y datos en JSON**), optimizado para despliegues estáticos rápidos en plataformas como Vercel.

---

## 🛠️ Stack Tecnológico

* **Frontend:** 
  - **HTML5 Semántico y Accesible:** Estructura limpia compatible con lectores de pantalla y directrices WCAG 2.1 AA.
  - **CSS3 Moderno:** Custom Properties / Variables de diseño, Layouts Flexbox & Grid, Fluid Typography (`clamp()`), drawer móvil responsive y estética terminal Unix.
  - **Vanilla JavaScript ES6+:** Navegación por pestañas reactivas, controlador de drawer móvil, motor bilingüe con persistencia en `localStorage`, mini CLI de comandos y controles de ventana.
  - **Datos Estructurados (JSON):** Modelado desacoplado en archivos JSON (`data/skills.json`, `data/projects.json`, `data/certificates.json`, `data/profile.json`).

---

## ✨ Características Principales

1. **Identidad Visual Terminal & OS:**
   - Interfaz inspirada en consolas Unix (`zsh`/`bash`) y editores de código modernos.
   - Banner ASCII responsive sin desbordamiento horizontal.
   - Tarjeta de perfil con foto avatar, badge interactivo de disponibilidad y metadatos de carrera.
   - Barra de estado inferior con reloj dinámico en vivo, sesión activa y protocolo HTTP/2.0.
2. **Soporte Bilingüe Instantáneo (ES / EN):**
   - Alternancia en un clic entre Español e Inglés con persistencia en `localStorage`.
   - Cambio automático del enlace de descarga del CV (`CV_Santiago_Carrizo.pdf` / `CV_Santiago_Carrizo_English.pdf`).
3. **Visor de Habilidades en Formato JSON:**
   - Visualización con resaltado de sintaxis JSON de habilidades frontend, backend, bases de datos, desarrollo móvil e integraciones.
4. **Tarjetas de Proyectos en Vivo:**
   - Proyectos con badges de estado, descripción bilingüe, lista de tecnologías, enlaces a repositorios públicos y demostraciones desplegadas en producción.
5. **Módulo de Certificaciones Profesionales:**
   - Visualización de credenciales y certificaciones técnicas con capturas gráficas de alta calidad, emisor, descripción y enlaces directos a los certificados en formato PDF.
6. **Contacto Directo:**
   - Formulario de contacto con validación en tiempo real y logs interactivos.
   - Botón directo de copiado de correo al portapapeles con toast de confirmación.

---

## 📁 Estructura del Proyecto

```text
portfolio/
├── index.html                # Entrada principal: estructura HTML5 semántica y accesible
├── css/
│   └── style.css             # Estilos completos modernos, variables de diseño y responsive
├── js/
│   └── script.js             # Lógica Vanilla JS (Navegación, Drawer móvil, Bilingüe, CLI)
├── data/
│   ├── profile.json          # Datos de perfil, biografía y educación bilingüe
│   ├── projects.json         # Catálogo de proyectos, repositorios y demos
│   ├── skills.json           # Matriz de habilidades técnicas estructuradas
│   └── certificates.json     # Catálogo de certificaciones profesionales
├── assets/
│   ├── img/
│   │   └── foto-perfil.jpg   # Fotografía de perfil del desarrollador
│   ├── certificates/         # Capturas e imágenes de certificados y PDFs
│   │   ├── aprendesql-certificado.jpg
│   │   ├── aprendesql-certificado.pdf
│   │   ├── desarrollo-con-ia-certificado.jpg
│   │   └── desarrollo-con-ia-certificado.pdf
│   ├── CV_Santiago_Carrizo.pdf         # CV en Español actualizado
│   └── CV_Santiago_Carrizo_English.pdf # CV en Inglés actualizado
└── README.md                 # Documentación técnica del proyecto
```

