
SET client_encoding = 'UTF8';

-- 1. TABLA DE MENSAJES DE CONTACTO
DROP TABLE IF EXISTS messages CASCADE;
CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_messages_created_at ON messages(created_at DESC);

-- 2. TABLA DE PROYECTOS
DROP TABLE IF EXISTS projects CASCADE;
CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    slug VARCHAR(50) NOT NULL UNIQUE,
    title VARCHAR(100) NOT NULL,
    desc_es TEXT NOT NULL,
    desc_en TEXT NOT NULL,
    status_key VARCHAR(30) DEFAULT 'deployed',
    status_es VARCHAR(50) DEFAULT '● Web Desplegada',
    status_en VARCHAR(50) DEFAULT '● Live Web',
    demo_url VARCHAR(255),
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_projects_sort_order ON projects(sort_order ASC);

-- 3. TABLA DE REPOSITORIOS DE PROYECTOS (Permite múltiples repos por proyecto, ej. frontend y backend)
DROP TABLE IF EXISTS project_repositories CASCADE;
CREATE TABLE project_repositories (
    id SERIAL PRIMARY KEY,
    project_id INT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    label_es VARCHAR(100) NOT NULL,
    label_en VARCHAR(100) NOT NULL,
    url VARCHAR(255) NOT NULL,
    sort_order INT DEFAULT 0
);

CREATE INDEX idx_project_repositories_project ON project_repositories(project_id, sort_order ASC);

-- 4. TABLA DE TECNOLOGÍAS DE PROYECTOS
DROP TABLE IF EXISTS project_technologies CASCADE;
CREATE TABLE project_technologies (
    id SERIAL PRIMARY KEY,
    project_id INT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    tech_name VARCHAR(50) NOT NULL,
    sort_order INT DEFAULT 0
);

CREATE INDEX idx_project_technologies_project ON project_technologies(project_id, sort_order ASC);

-- 5. TABLA DE HABILIDADES (SKILLS)
DROP TABLE IF EXISTS skills CASCADE;
CREATE TABLE skills (
    id SERIAL PRIMARY KEY,
    category_key VARCHAR(50) NOT NULL,
    category_label_es VARCHAR(50) NOT NULL,
    category_label_en VARCHAR(50) NOT NULL,
    skill_name_es VARCHAR(150) NOT NULL,
    skill_name_en VARCHAR(150) NOT NULL,
    sort_order INT DEFAULT 0
);

CREATE INDEX idx_skills_category ON skills(category_key, sort_order ASC);

-- ============================================================================
-- INSERCIÓN DE DATOS EXACTOS (SEED DATA)
-- ============================================================================

-- INSERCIÓN DE PROYECTOS
INSERT INTO projects (id, slug, title, desc_es, desc_en, status_key, status_es, status_en, demo_url, sort_order) VALUES
(
    1,
    'alma-lectora',
    'alma-lectora',
    'Plataforma web para gestión de catálogo de libros, reseñas literarias y seguimiento de lecturas. Interfaz moderna desarrollada con TypeScript y React.',
    'Web platform for book catalog management, literary reviews, and reading tracking. Modern reactive UI built with TypeScript and React.',
    'deployed',
    '● Web Desplegada',
    '● Live Web',
    'https://alma-lectora.vercel.app',
    1
),
(
    2,
    'gestion-deportiva',
    'gestion-deportiva-fullstack',
    'Sistema integral multitenant para administración de complejos deportivos, reservas de turnos y gestión de clientes. Arquitectura desacoplada (Frontend React, Backend Node.js/Express y App Móvil Flutter con soporte offline-first).',
    'Comprehensive multi-tenant system for sports complex management, shift booking, and client administration. Decoupled architecture (React Frontend, Node.js/Express Backend, Flutter Mobile App with offline-first support).',
    'deployed',
    '● Web Desplegada',
    '● Live Web',
    'https://gestion-deportiva-client.vercel.app/',
    2
),
(
    3,
    'ecommerce',
    'react-express-mysql-ecommerce',
    'Plataforma de comercio electrónico Full Stack con patrón de arquitectura MVC. Catálogo interactivo de productos, carrito de compras, gestión de pedidos y almacenamiento relacional en MySQL.',
    'Full Stack E-commerce platform following MVC architecture pattern. Interactive product catalog, shopping cart, order management, and relational MySQL database.',
    'deployed',
    '● Web Desplegada',
    '● Live Web',
    'https://ecommerce-scarrizo.vercel.app/',
    3
);

-- REINICIAR SECUENCIA DE PROYECTOS
SELECT setval('projects_id_seq', (SELECT MAX(id) FROM projects));

-- INSERCIÓN DE REPOSITORIOS DE PROYECTOS
INSERT INTO project_repositories (project_id, label_es, label_en, url, sort_order) VALUES
(1, '[ Repositorio Público ]', '[ Public Repo ]', 'https://github.com/Santiago-Carrizo7/alma-lectora-showcase', 1),
(2, '[ Repositorio Público ]', '[ Public Repo ]', 'https://github.com/Santiago-Carrizo7/gestion-deportiva-showcase', 1),
(3, '[ Repositorio Público ]', '[ Public Repo ]', 'https://github.com/Santiago-Carrizo7/react-express-mysql-ecommerce', 1);

-- INSERCIÓN DE TECNOLOGÍAS DE PROYECTOS
INSERT INTO project_technologies (project_id, tech_name, sort_order) VALUES
-- alma-lectora
(1, 'TypeScript', 1),
(1, 'React', 2),
(1, 'Node.js', 3),
(1, 'CSS3', 4),

-- gestion-deportiva-fullstack
(2, 'TypeScript', 1),
(2, 'React 19', 2),
(2, 'Node.js', 3),
(2, 'Express 5', 4),
(2, 'PostgreSQL / Prisma', 5),
(2, 'Flutter / Dart', 6),

-- react-express-mysql-ecommerce
(3, 'React', 1),
(3, 'Node.js', 2),
(3, 'Express', 3),
(3, 'MySQL', 4),
(3, 'TypeScript', 5);

-- INSERCIÓN DE HABILIDADES (SKILLS)
INSERT INTO skills (category_key, category_label_es, category_label_en, skill_name_es, skill_name_en, sort_order) VALUES
-- Frontend
('frontend', 'frontend', 'frontend', 'React 19 & React Router', 'React 19 & React Router', 1),
('frontend', 'frontend', 'frontend', 'TypeScript / JavaScript (ES6+)', 'TypeScript / JavaScript (ES6+)', 2),
('frontend', 'frontend', 'frontend', 'Tailwind CSS / HTML5 & CSS3', 'Tailwind CSS / HTML5 & CSS3', 3),
('frontend', 'frontend', 'frontend', 'TanStack Query & Zustand', 'TanStack Query & Zustand', 4),

-- Backend
('backend', 'backend', 'backend', 'Node.js & Express 5', 'Node.js & Express 5', 1),
('backend', 'backend', 'backend', 'Diseño de APIs RESTful', 'RESTful API Design', 2),
('backend', 'backend', 'backend', 'Arquitectura SaaS Multi-Tenant & MVC', 'Multi-Tenant SaaS Architecture & MVC', 3),
('backend', 'backend', 'backend', 'JWT & Refresh Token Rotation', 'JWT & Refresh Token Rotation', 4),

-- Bases de Datos
('bases_de_datos', 'bases_de_datos', 'databases', 'PostgreSQL & Prisma ORM', 'PostgreSQL & Prisma ORM', 1),
('bases_de_datos', 'bases_de_datos', 'databases', 'MySQL', 'MySQL', 2),
('bases_de_datos', 'bases_de_datos', 'databases', 'Búsquedas Difusas (pg_trgm) & Transacciones ACID', 'Fuzzy Search (pg_trgm) & ACID Transactions', 3),

-- Desarrollo Mobile
('desarrollo_mobile', 'desarrollo_mobile', 'mobile_development', 'Flutter & Dart', 'Flutter & Dart', 1),
('desarrollo_mobile', 'desarrollo_mobile', 'mobile_development', 'Persistencia Local (SQLite - Offline-First)', 'Local Persistence (SQLite - Offline-First)', 2),
('desarrollo_mobile', 'desarrollo_mobile', 'mobile_development', 'Sincronización Idempotente por Lotes', 'Batch Idempotent Synchronization', 3),

-- Integraciones y Testing
('integraciones_y_testing', 'integraciones_y_testing', 'integrations_and_testing', 'Mercado Pago API', 'Mercado Pago API', 1),
('integraciones_y_testing', 'integraciones_y_testing', 'integrations_and_testing', 'Firebase FCM (Push Notifications)', 'Firebase FCM (Push Notifications)', 2),
('integraciones_y_testing', 'integraciones_y_testing', 'integrations_and_testing', 'Docker, Vitest & Playwright', 'Docker, Vitest & Playwright', 3),
('integraciones_y_testing', 'integraciones_y_testing', 'integrations_and_testing', 'Git / GitHub Workflow & Postman', 'Git / GitHub Workflow & Postman', 4);
