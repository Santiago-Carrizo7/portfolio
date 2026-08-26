<?php

// Parámetros de conexión configurables por Variables de Entorno o valores por defecto locales
define('DB_HOST', getenv('DB_HOST') ?: '127.0.0.1');
define('DB_PORT', getenv('DB_PORT') ?: '5432');
define('DB_NAME', getenv('DB_NAME') ?: 'portfolio_db');
define('DB_USER', getenv('DB_USER') ?: 'postgres');
define('DB_PASSWORD', getenv('DB_PASSWORD') !== false ? getenv('DB_PASSWORD') : 'postgres');

/**
 * Obtiene la conexión PDO a PostgreSQL.
 * Implementa manejo seguro de excepciones y configuración óptima de PDO.
 * 
 * @return PDO|null Retorna la instancia de PDO o null si la conexión no pudo establecerse.
 */
function getDBConnection(): ?PDO {
    static $pdo = null;

    if ($pdo !== null) {
        return $pdo;
    }

    $dsn = sprintf(
        "pgsql:host=%s;port=%s;dbname=%s;options='--client_encoding=UTF8'",
        DB_HOST,
        DB_PORT,
        DB_NAME
    );

    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
        PDO::ATTR_TIMEOUT            => 3, 
    ];

    try {
        $pdo = new PDO($dsn, DB_USER, DB_PASSWORD, $options);
        return $pdo;
    } catch (PDOException $e) {
        // Registra el error en el log del servidor sin exponer credenciales al cliente
        error_log("Error de conexión a PostgreSQL: " . $e->getMessage());
        return null;
    }
}

/**
 * Obtiene los proyectos con sus repositorios y tecnologías asociadas.
 * Consulta la base de datos PostgreSQL; si no hay conexión, usa datos de respaldo exactos.
 * 
 * @return array Lista de proyectos estructurada.
 */
function getPortfolioProjects(): array {
    $db = getDBConnection();

    if ($db) {
        try {
            // 1. Obtener proyectos ordenados ($stmt, abreviatura de statement)
            $stmt = $db->query("SELECT * FROM projects ORDER BY sort_order ASC, id ASC");
            $projects = $stmt->fetchAll();

            if (!empty($projects)) {
                // 2. Obtener repositorios
                $repoStmt = $db->query("SELECT * FROM project_repositories ORDER BY project_id, sort_order ASC");
                $repos = $repoStmt->fetchAll();
                $reposByProject = [];
                foreach ($repos as $repo) {
                    $reposByProject[$repo['project_id']][] = $repo; 
                }

                // 3. Obtener tecnologías
                $techStmt = $db->query("SELECT * FROM project_technologies ORDER BY project_id, sort_order ASC");
                $techs = $techStmt->fetchAll();
                $techsByProject = [];
                foreach ($techs as $tech) {
                    $techsByProject[$tech['project_id']][] = $tech['tech_name'];
                }

                // Combinar
                foreach ($projects as &$proj) {
                    $projId = $proj['id'];
                    $proj['repositories'] = $reposByProject[$projId] ?? [];
                    $proj['technologies'] = $techsByProject[$projId] ?? [];
                }
                unset($proj);

                return $projects;
            }
        } catch (PDOException $e) {
            error_log("Error al consultar proyectos en BD: " . $e->getMessage());
        }
    }

    // Datos de respaldo exactos (Fallback de seguridad si PostgreSQL no está levantado)
    return getFallbackProjects();
}

/**
 * Obtiene las habilidades agrupadas por categoría para el visualizador JSON.
 * Consulta la base de datos PostgreSQL; si no hay conexión, usa datos de respaldo exactos.
 * 
 * @return array Lista de habilidades organizadas.
 */
function getPortfolioSkills(): array {
    $db = getDBConnection();

    if ($db) {
        try {
            $stmt = $db->query("SELECT * FROM skills ORDER BY category_key, sort_order ASC, id ASC");
            $skillsRows = $stmt->fetchAll();

            if (!empty($skillsRows)) {
                $skillsES = [];
                $skillsEN = [];

                foreach ($skillsRows as $row) {
                    $catKeyES = $row['category_label_es'];
                    $catKeyEN = $row['category_label_en'];

                    if (!isset($skillsES[$catKeyES])) {
                        $skillsES[$catKeyES] = [];
                    }
                    $skillsES[$catKeyES][] = $row['skill_name_es'];

                    if (!isset($skillsEN[$catKeyEN])) {
                        $skillsEN[$catKeyEN] = [];
                    }
                    $skillsEN[$catKeyEN][] = $row['skill_name_en'];
                }

                return [
                    'es' => $skillsES,
                    'en' => $skillsEN
                ];
            }
        } catch (PDOException $e) {
            error_log("Error al consultar skills en BD: " . $e->getMessage());
        }
    }

    return getFallbackSkills();
}

/**
 * Datos exactos de respaldo de Proyectos.
 */
function getFallbackProjects(): array {
    return [
        [
            'id' => 1,
            'slug' => 'alma-lectora',
            'title' => 'alma-lectora',
            'desc_es' => 'Plataforma web para gestión de catálogo de libros, reseñas literarias y seguimiento de lecturas. Interfaz moderna desarrollada con TypeScript y React.',
            'desc_en' => 'Web platform for book catalog management, literary reviews, and reading tracking. Modern reactive UI built with TypeScript and React.',
            'status_key' => 'deployed',
            'status_es' => '● Web Desplegada',
            'status_en' => '● Live Web',
            'demo_url' => 'https://alma-lectora.vercel.app',
            'repositories' => [
                [
                    'label_es' => '[ Repositorio Público ]',
                    'label_en' => '[ Public Repo ]',
                    'url' => 'https://github.com/Santiago-Carrizo7/alma-lectora-showcase'
                ]
            ],
            'technologies' => ['TypeScript', 'React', 'Node.js', 'CSS3']
        ],
        [
            'id' => 2,
            'slug' => 'gestion-deportiva',
            'title' => 'gestion-deportiva-fullstack',
            'desc_es' => 'Sistema integral multitenant para administración de complejos deportivos, reservas de turnos y gestión de clientes. Arquitectura desacoplada (Frontend React, Backend Node.js/Express y App Móvil Flutter con soporte offline-first).',
            'desc_en' => 'Comprehensive multi-tenant system for sports complex management, shift booking, and client administration. Decoupled architecture (React Frontend, Node.js/Express Backend, Flutter Mobile App with offline-first support).',
            'status_key' => 'deployed',
            'status_es' => '● Web Desplegada',
            'status_en' => '● Live Web',
            'demo_url' => 'https://gestion-deportiva-client.vercel.app/',
            'repositories' => [
                [
                    'label_es' => '[ Repositorio Público ]',
                    'label_en' => '[ Public Repo ]',
                    'url' => 'https://github.com/Santiago-Carrizo7/gestion-deportiva-showcase'
                ]
            ],
            'technologies' => ['TypeScript', 'React 19', 'Node.js', 'Express 5', 'PostgreSQL / Prisma', 'Flutter / Dart']
        ],
        [
            'id' => 3,
            'slug' => 'ecommerce',
            'title' => 'react-express-mysql-ecommerce',
            'desc_es' => 'Plataforma de comercio electrónico Full Stack con patrón de arquitectura MVC. Catálogo interactivo de productos, carrito de compras, gestión de pedidos y almacenamiento relacional en MySQL.',
            'desc_en' => 'Full Stack E-commerce platform following MVC architecture pattern. Interactive product catalog, shopping cart, order management, and relational MySQL database.',
            'status_key' => 'deployed',
            'status_es' => '● Web Desplegada',
            'status_en' => '● Live Web',
            'demo_url' => 'https://ecommerce-scarrizo.vercel.app/',
            'repositories' => [
                [
                    'label_es' => '[ Repositorio Público ]',
                    'label_en' => '[ Public Repo ]',
                    'url' => 'https://github.com/Santiago-Carrizo7/react-express-mysql-ecommerce'
                ]
            ],
            'technologies' => ['React', 'Node.js', 'Express', 'MySQL', 'TypeScript']
        ]
    ];
}

/**
 * Datos exactos de respaldo de Habilidades.
 */
function getFallbackSkills(): array {
    return [
        'es' => [
            'frontend' => [
                'React 19 & React Router',
                'TypeScript / JavaScript (ES6+)',
                'Tailwind CSS / HTML5 & CSS3',
                'TanStack Query & Zustand'
            ],
            'backend' => [
                'Node.js & Express 5',
                'Diseño de APIs RESTful',
                'Arquitectura SaaS Multi-Tenant & MVC',
                'JWT & Refresh Token Rotation'
            ],
            'bases_de_datos' => [
                'PostgreSQL & Prisma ORM',
                'MySQL',
                'Búsquedas Difusas (pg_trgm) & Transacciones ACID'
            ],
            'desarrollo_mobile' => [
                'Flutter & Dart',
                'Persistencia Local (SQLite - Offline-First)',
                'Sincronización Idempotente por Lotes'
            ],
            'integraciones_y_testing' => [
                'Mercado Pago API',
                'Firebase FCM (Push Notifications)',
                'Docker, Vitest & Playwright',
                'Git / GitHub Workflow & Postman'
            ]
        ],
        'en' => [
            'frontend' => [
                'React 19 & React Router',
                'TypeScript / JavaScript (ES6+)',
                'Tailwind CSS / HTML5 & CSS3',
                'TanStack Query & Zustand'
            ],
            'backend' => [
                'Node.js & Express 5',
                'RESTful API Design',
                'Multi-Tenant SaaS Architecture & MVC',
                'JWT & Refresh Token Rotation'
            ],
            'databases' => [
                'PostgreSQL & Prisma ORM',
                'MySQL',
                'Fuzzy Search (pg_trgm) & ACID Transactions'
            ],
            'mobile_development' => [
                'Flutter & Dart',
                'Local Persistence (SQLite - Offline-First)',
                'Batch Idempotent Synchronization'
            ],
            'integrations_and_testing' => [
                'Mercado Pago API',
                'Firebase FCM (Push Notifications)',
                'Docker, Vitest & Playwright',
                'Git / GitHub Workflow & Postman'
            ]
        ]
    ];
}
