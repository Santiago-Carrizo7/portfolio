# Santiago Carrizo — Terminal Portfolio

Portafolio web personal e interactivo con estética y experiencia de terminal Unix / CLI y sistema operativo moderno. Desarrollado con tecnologías web puras (**HTML5 semántico, CSS3 moderno, JavaScript Vanilla ES6+**), integración backend en **PHP puro (PDO)** y base de datos relacional **PostgreSQL**.

---

## 🛠️ Stack Tecnológico

* **Frontend:** 
  - HTML5 Semántico y Accesible (WCAG 2.1 AA compliant)
  - CSS3 Moderno (Custom Properties / Variables, Grid, Flexbox, Fluid Typography con `clamp()`, `100dvh`, Drawer Mobile)
  - Vanilla JavaScript ES6+ (Scrollspy con `IntersectionObserver`, Drawer Controller, Asynchronous Fetch API, Bilingual LocalStorage Engine, Mini CLI Interactiva)
* **Backend:** 
  - PHP 8.x puro sin frameworks
  - Conexión PDO con PostgreSQL
  - Consultas Preparadas (Prepared Statements) contra inyecciones SQL
  - Arquitectura modular y limpia (`config/`, `includes/`, `actions/`)
* **Base de Datos:** 
  - PostgreSQL 14+ / 16+
  - Script DDL / DML con relaciones relacionales y datos iniciales (`database/portfolio.sql`)

---

## ✨ Características Principales

1. **Identidad Visual Terminal & OS:**
   - Interfaz inspirada en consolas Unix (zsh/bash) y editores minimalistas.
   - Banner ASCII responsive sin desbordamiento horizontal.
   - Status bar inferior con monitor dinámico de PostgreSQL y branch git.
2. **Habilidades Dinámicas en Formato JSON:**
   - Consulta dinámica a PostgreSQL agrupada por categorías (`frontend`, `backend`, `bases_de_datos`, `desarrollo_mobile`, `integraciones_y_testing`).
   - Renderizado con syntax highlighting fiel a la estructura de un archivo `.json`.
3. **Proyectos Dinámicos desde Base de Datos:**
   - Carga desde PostgreSQL con soporte para múltiples repositorios por proyecto y enlaces a despliegues en vivo.
4. **Formulario de Contacto Real:**
   - Doble validación estricta (Frontend en JS y Backend en PHP).
   - Simulación progresiva de logs estilo consola (`[ OK ] Validando datos...`, `[ OK ] Conectando a PostgreSQL...`, `[ OK ] Mensaje guardado`).
   - Inserción en la tabla `messages` con captura de timestamp, IP y User-Agent.
5. **Navegación Inteligente y Responsive:**
   - Scroll continuo con detección automática de sección activa (Scrollspy con `IntersectionObserver`).
   - Panel lateral desplegable (Drawer móvil) con overlay táctil y accesibilidad por teclado (`Escape`).
6. **Soporte Bilingüe Instantáneo:**
   - Alternancia rápida entre Español e Inglés con persistencia en `localStorage` y actualización del atributo `lang` en HTML.
7. **Mini Terminal Interactiva:**
   - Input de comandos reales (`help`, `about`, `skills`, `projects`, `contact`, `cv`, `repo`, `whoami`, `clear`).

---

## 📁 Estructura del Proyecto

```text
portfolio/
├── index.php                 # Entrada principal: consulta PostgreSQL y renderiza el portfolio
├── index.html                # Versión estática de respaldo / preview directo
├── config/
│   └── database.php          # Configuración y conexión PDO a PostgreSQL con fallback seguro
├── includes/
│   ├── header.php            # Barra superior de la ventana (controles, título, menú)
│   ├── sidebar.php           # Barra lateral (usuario, navegación, selector de idioma, redes, CV)
│   └── footer.php            # Barra de estado inferior (sesión, PostgreSQL status, branch git)
├── actions/
│   └── send_message.php      # Endpoint AJAX para validar e insertar mensajes en PostgreSQL
├── css/
│   └── style.css             # Estilos completos modernos, variables y responsive
├── js/
│   └── script.js             # Lógica Vanilla JS (Scrollspy, Drawer móvil, Formulario CLI, Idioma)
├── database/
│   └── portfolio.sql         # Script SQL completo de creación e inserción de datos
├── assets/
│   ├── README.md             # Guía de archivos estáticos
│   └── cv_santiago_carrizo.pdf # Currículum Vitae para descarga
├── README.md                 # Documentación técnica completa
└── mensajes.txt              # Registro de respaldo de mensajes
```

---

## 🚀 Puesta en Marcha en Local

### 1. Base de Datos (PostgreSQL)
1. Abrí tu cliente PostgreSQL (pgAdmin, DBeaver o terminal `psql`).
2. Creá una base de datos llamada `portfolio_db`:
   ```sql
   CREATE DATABASE portfolio_db;
   ```
3. Ejecutá el script ubicado en [`database/portfolio.sql`](database/portfolio.sql) para crear las tablas e insertar todos los proyectos y habilidades.

### 2. Configurar Conexión (Opcional)
Por defecto, [`config/database.php`](config/database.php) utiliza:
* Host: `127.0.0.1`
* Puerto: `5432`
* Base de datos: `portfolio_db`
* Usuario: `postgres`
* Contraseña: `postgres`

Si tus credenciales son diferentes, podés modificarlas en `config/database.php` o definirlas como Variables de Entorno (`DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`).

> **Nota de Resiliencia:** Si ejecutás el proyecto sin tener PostgreSQL levantado, el sistema automáticamente usará datos de respaldo exactos para que la interfaz siempre se visualice sin errores.

### 3. Iniciar el Servidor Web PHP
En la terminal, dentro de la carpeta del proyecto:
```bash
php -S localhost:8000
```
Abrí tu navegador en: [http://localhost:8000](http://localhost:8000).
