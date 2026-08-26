<?php
/**
 * ============================================================================
 * SANTIAGO CARRIZO — TERMINAL PORTFOLIO
 * Full Stack Developer | TypeScript • React • Node.js • PostgreSQL • Flutter
 * ============================================================================
 */

require_once __DIR__ . '/config/database.php';

// Conexión y consulta dinámica a PostgreSQL (con respaldo resiliente)
$db = getDBConnection();
$projects = getPortfolioProjects();
$skillsData = getPortfolioSkills();

/**
 * Función auxiliar para formatear array de skills a JSON con syntax highlighting
 */
function renderJsonSkillsBlock(array $categories, string $developerName, string $location, string $institution): string {
    $html = "{\n";
    $html .= "  <span class=\"json-key\">\"developer\"</span>: <span class=\"json-string\">\"" . htmlspecialchars($developerName) . "\"</span>,\n";
    $html .= "  <span class=\"json-key\">\"location\"</span>: <span class=\"json-string\">\"" . htmlspecialchars($location) . "\"</span>,\n";
    $html .= "  <span class=\"json-key\">\"education\"</span>: <span class=\"json-string\">\"" . htmlspecialchars($institution) . "\"</span>,\n\n";

    $totalCats = count($categories);
    $catIdx = 0;

    foreach ($categories as $catName => $skillsList) {
        $catIdx++;
        $html .= "  <span class=\"json-key\">\"" . htmlspecialchars($catName) . "\"</span>: [\n";
        $totalSkills = count($skillsList);
        $skillIdx = 0;
        foreach ($skillsList as $skill) {
            $skillIdx++;
            $comma = ($skillIdx < $totalSkills) ? "," : "";
            $html .= "    <span class=\"json-string\">\"" . htmlspecialchars($skill) . "\"</span>" . $comma . "\n";
        }
        $catComma = ($catIdx < $totalCats) ? ",\n\n" : "\n";
        $html .= "  ]" . $catComma;
    }

    $html .= "}";
    return $html;
}

function renderJsonSkillsBlockES(array $categories): string {
    $html = "{\n";
    $html .= "  <span class=\"json-key\">\"desarrollador\"</span>: <span class=\"json-string\">\"Santiago Carrizo\"</span>,\n";
    $html .= "  <span class=\"json-key\">\"ubicacion\"</span>: <span class=\"json-string\">\"Salta, Argentina\"</span>,\n";
    $html .= "  <span class=\"json-key\">\"institucion\"</span>: <span class=\"json-string\">\"Universidad Nacional de Salta (UNSa)\"</span>,\n\n";

    $totalCats = count($categories);
    $catIdx = 0;

    foreach ($categories as $catName => $skillsList) {
        $catIdx++;
        $html .= "  <span class=\"json-key\">\"" . htmlspecialchars($catName) . "\"</span>: [\n";
        $totalSkills = count($skillsList);
        $skillIdx = 0;
        foreach ($skillsList as $skill) {
            $skillIdx++;
            $comma = ($skillIdx < $totalSkills) ? "," : "";
            $html .= "    <span class=\"json-string\">\"" . htmlspecialchars($skill) . "\"</span>" . $comma . "\n";
        }
        $catComma = ($catIdx < $totalCats) ? ",\n\n" : "\n";
        $html .= "  ]" . $catComma;
    }

    $html .= "}";
    return $html;
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
    <meta name="description" content="Portfolio profesional de Santiago Carrizo — Desarrollador Full Stack especializado en TypeScript, React, Node.js, PostgreSQL y Flutter.">
    <meta name="theme-color" content="#0b0e14">
    <title>Santiago Carrizo | Terminal Portfolio</title>
    
    <!-- Tipografías Oficiales -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;600&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
    
    <!-- Estilos CSS -->
    <link rel="stylesheet" href="css/style.css">
</head>
<body class="lang-es">

    <!-- Header de Ventana de Terminal -->
    <?php include __DIR__ . '/includes/header.php'; ?>

    <div class="terminal-layout">

        <!-- Sidebar / Drawer de Navegación -->
        <?php include __DIR__ . '/includes/sidebar.php'; ?>

        <!-- Consola Principal / Contenido -->
        <main class="console-body" id="console-body" tabindex="-1">
            
            <!-- SECCIÓN: SOBRE MÍ (ACTIVA POR DEFECTO) -->
            <section id="about" class="terminal-section active-section" aria-labelledby="about-heading">
                <div class="ascii-container" aria-hidden="true">
                    <pre class="ascii-logo">
    ____  ____  ____  ______ _____ ____  __    ____ ____ 
   / __ \/ __ \/ __ \/_  __// ____/ __ \/ /   /  _// __ \
  / /_/ / / / / /_/ / / /  / /_  / / / / /    / / / / / /
 / ____/ /_/ / _, _/ / /  / __/ / /_/ / /____/ / / /_/ / 
/_/    \____/_/ |_| /_/  /_/    \____/_____/___/ \____/  
                    </pre>
                </div>

                <div class="system-welcome">
                    <p class="lang-es">Último inicio de sesión: Mié Oct 25 14:20:01 en ttys001</p>
                    <p class="lang-en">Last login: Wed Oct 25 14:20:01 on ttys001</p>
                    <p class="lang-es">Bienvenido a PortfolioOS v1.0.0 — Santiago Carrizo (Salta, Argentina)</p>
                    <p class="lang-en">Welcome to PortfolioOS v1.0.0 — Santiago Carrizo (Salta, Argentina)</p>
                </div>

                <article class="command-block">
                    <p class="prompt">
                        <span class="lang-es">guest@portfolio : ~/sobre-mi $ <code>quiensoy</code></span>
                        <span class="lang-en">guest@portfolio : ~/about $ <code>whoami</code></span>
                    </p>
                    <div class="command-output bio-output">
                        <h1 id="about-heading">Santiago Carrizo — Full Stack Developer</h1>
                        <p class="lang-es">
                            ¡Hola! Soy Desarrollador Full Stack enfocado en construir aplicaciones web y móviles completas, robustas y orientadas a producto. 
                            Mi experiencia se centra en el ecosistema TypeScript/JavaScript (React 19, Node.js, Express 5) y desarrollo móvil cross-platform con Flutter. 
                            Me apasiona diseñar sistemas que resuelven problemas reales de negocio: desde digitalizar la gestión física de inventarios hasta construir arquitecturas SaaS multi-tenant con soporte offline-first.
                        </p>
                        <p class="lang-en">
                            Hi! I'm a Full Stack Developer focused on building complete, robust, product-oriented web and mobile applications. 
                            My core expertise centers on the TypeScript/JavaScript ecosystem (React 19, Node.js, Express 5) and cross-platform mobile development with Flutter. 
                            I'm passionate about designing systems that solve real business problems: from digitalizing physical inventory management to building multi-tenant SaaS architectures with offline-first support.
                        </p>
                    </div>
                </article>

                <article class="command-block">
                    <p class="prompt">
                        <span class="lang-es">guest@portfolio : ~/sobre-mi $ <code>cat ./formacion_e_intereses.txt</code></span>
                        <span class="lang-en">guest@portfolio : ~/about $ <code>cat ./education_and_interests.txt</code></span>
                    </p>
                    <div class="command-output info-card">
                        <div class="info-group">
                            <h2>
                                <span class="lang-es">Formación Académica & Certificaciones</span>
                                <span class="lang-en">Education & Certifications</span>
                            </h2>
                            <ul>
                                <li>
                                    <strong class="text-green">Tecnicatura Universitaria en Programación (UNSa)</strong> 
                                    <br>
                                    <span class="lang-es">Universidad Nacional de Salta — Formación en arquitecturas web, paradigmas de programación, bases de datos relacionales y desarrollo Full Stack.</span>
                                    <span class="lang-en">National University of Salta — Focus on web architecture, programming paradigms, relational databases, and Full Stack development.</span>
                                </li>
                                <li>
                                    <strong class="text-yellow">JSCamp (InfoJobs) — Dictado por MiduDev</strong> 
                                    <br>
                                    <span class="lang-es">Formación intensiva en desarrollo Full Stack moderno (JavaScript, TypeScript, React, Node.js y arquitectura web avanzada).</span>
                                    <span class="lang-en">Intensive Full Stack modern web development course (JavaScript, TypeScript, React, Node.js, and advanced web architecture).</span>
                                </li>
                            </ul>
                        </div>

                        <div class="info-group">
                            <h2>
                                <span class="lang-es">Lo que aporto en mis proyectos</span>
                                <span class="lang-en">Key Technical Value</span>
                            </h2>
                            <ul>
                                <li>
                                    <strong class="text-cyan">Backend & DB:</strong> 
                                    <span class="lang-es">Diseño de APIs RESTful con Node.js y Express 5, modelado relacional con PostgreSQL y Prisma ORM, consultas complejas indexadas (búsquedas difusas con pg_trgm) y transacciones ACID.</span>
                                    <span class="lang-en">RESTful API design with Node.js & Express 5, relational modeling with PostgreSQL & Prisma ORM, indexed fuzzy search (pg_trgm), and ACID transactions.</span>
                                </li>
                                <li>
                                    <strong class="text-cyan">Frontend Web:</strong> 
                                    <span class="lang-es">Creación de SPAs rápidas e interactivas con React 19, TypeScript, Tailwind CSS, y gestión eficiente del estado asíncrono con TanStack Query y Zustand.</span>
                                    <span class="lang-en">Building fast, interactive SPAs with React 19, TypeScript, Tailwind CSS, and efficient async state management with TanStack Query and Zustand.</span>
                                </li>
                                <li>
                                    <strong class="text-cyan">Desarrollo Móvil:</strong> 
                                    <span class="lang-es">Construcción de apps en Flutter/Dart con persistencia local en SQLite para funcionamiento sin conexión y sincronización idempotente por lotes.</span>
                                    <span class="lang-en">Building Flutter/Dart mobile apps with local SQLite persistence for offline capability and batch idempotent synchronization.</span>
                                </li>
                                <li>
                                    <strong class="text-cyan">Seguridad & Integraciones:</strong> 
                                    <span class="lang-es">Autenticación JWT con Refresh Token Rotation, cookies seguras HTTPOnly, protección IDOR por tenant e integración de pasarelas de pago (Mercado Pago API) y notificaciones push (Firebase FCM).</span>
                                    <span class="lang-en">JWT Authentication with Refresh Token Rotation, HTTPOnly secure cookies, tenant IDOR protection, payment gateways (Mercado Pago API), and push notifications (Firebase FCM).</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </article>

                <article class="command-block">
                    <p class="prompt">
                        <span class="lang-es">guest@portfolio : ~/sobre-mi $ <code>./descargar_cv.sh</code></span>
                        <span class="lang-en">guest@portfolio : ~/about $ <code>./download_resume.sh</code></span>
                    </p>
                    <div class="command-output">
                        <p class="lang-es mb-sm">Podés descargar mi Currículum Vitae en formato PDF:</p>
                        <p class="lang-en mb-sm">You can download a complete PDF version of my Resume:</p>
                        
                        <a href="assets/CV_Santiago_Carrizo.pdf" download="CV_Santiago_Carrizo.pdf" id="about-cv-link" class="cv-button">
                            <span class="lang-es">[ DESCARGAR_CV.PDF ]</span>
                            <span class="lang-en">[ DOWNLOAD_RESUME.PDF ]</span>
                        </a>
                    </div>
                </article>

                <div class="prompt-line" aria-hidden="true">
                    <span class="lang-es">guest@portfolio : ~/sobre-mi $ <span class="cursor">█</span></span>
                    <span class="lang-en">guest@portfolio : ~/about $ <span class="cursor">█</span></span>
                </div>
            </section>

            <!-- SECCIÓN: HABILIDADES (SKILLS DINÁMICAS EN FORMATO JSON VISUAL) -->
            <section id="skills" class="terminal-section hidden" aria-labelledby="skills-heading">
                <article class="command-block">
                    <p class="prompt">
                        <span class="lang-es">guest@portfolio : ~/habilidades $ <code>cat ./habilidades.json</code></span>
                        <span class="lang-en">guest@portfolio : ~/skills $ <code>cat ./skills.json</code></span>
                    </p>
                    
                    <div class="json-viewer">
                        <div class="lang-es">
                            <pre class="json-content"><code><?= renderJsonSkillsBlockES($skillsData['es']) ?></code></pre>
                        </div>
                        <div class="lang-en">
                            <pre class="json-content"><code><?= renderJsonSkillsBlock($skillsData['en'], 'Santiago Carrizo', 'Salta, Argentina', 'National University of Salta (UNSa)') ?></code></pre>
                        </div>
                    </div>
                </article>

                <div class="prompt-line" aria-hidden="true">
                    <span class="lang-es">guest@portfolio : ~/habilidades $ <span class="cursor">█</span></span>
                    <span class="lang-en">guest@portfolio : ~/skills $ <span class="cursor">█</span></span>
                </div>
            </section>

            <!-- SECCIÓN: PROYECTOS (DINÁMICOS DESDE POSTGRESQL) -->
            <section id="projects" class="terminal-section hidden" aria-labelledby="projects-heading">
                <article class="command-block">
                    <p class="prompt">
                        <span class="lang-es">guest@portfolio : ~/proyectos $ <code>cat ./proyectos.json</code></span>
                        <span class="lang-en">guest@portfolio : ~/projects $ <code>cat ./projects.json</code></span>
                    </p>

                    <div class="projects-grid">
                        <?php foreach ($projects as $project): ?>
                            <article class="project-card" id="<?= htmlspecialchars($project['slug']) ?>">
                                <div class="project-header">
                                    <h2 class="project-title"><?= htmlspecialchars($project['title']) ?></h2>
                                    <span class="status-badge <?= htmlspecialchars($project['status_key']) ?>">
                                        <span class="lang-es"><?= htmlspecialchars($project['status_es']) ?></span>
                                        <span class="lang-en"><?= htmlspecialchars($project['status_en']) ?></span>
                                    </span>
                                </div>

                                <p class="project-desc lang-es"><?= htmlspecialchars($project['desc_es']) ?></p>
                                <p class="project-desc lang-en"><?= htmlspecialchars($project['desc_en']) ?></p>

                                <?php if (!empty($project['technologies'])): ?>
                                    <div class="project-techs" aria-label="Tecnologías utilizadas">
                                        <?php foreach ($project['technologies'] as $tech): ?>
                                            <span class="tech-tag"><?= htmlspecialchars($tech) ?></span>
                                        <?php endforeach; ?>
                                    </div>
                                <?php endif; ?>

                                <div class="project-links">
                                    <?php if (!empty($project['repositories'])): ?>
                                        <?php foreach ($project['repositories'] as $repo): ?>
                                            <a href="<?= htmlspecialchars($repo['url']) ?>" target="_blank" rel="noopener noreferrer" class="project-link">
                                                <span class="lang-es"><?= htmlspecialchars($repo['label_es']) ?></span>
                                                <span class="lang-en"><?= htmlspecialchars($repo['label_en']) ?></span>
                                            </a>
                                        <?php endforeach; ?>
                                    <?php endif; ?>

                                    <?php if (!empty($project['demo_url'])): ?>
                                        <a href="<?= htmlspecialchars($project['demo_url']) ?>" target="_blank" rel="noopener noreferrer" class="project-link demo-link">
                                            <span class="lang-es">[ Ir a la Web ]</span>
                                            <span class="lang-en">[ Visit Web ]</span>
                                        </a>
                                    <?php endif; ?>
                                </div>
                            </article>
                        <?php endforeach; ?>
                    </div>
                </article>

                <div class="prompt-line" aria-hidden="true">
                    <span class="lang-es">guest@portfolio : ~/proyectos $ <span class="cursor">█</span></span>
                    <span class="lang-en">guest@portfolio : ~/projects $ <span class="cursor">█</span></span>
                </div>
            </section>

            <!-- SECCIÓN: CONTACTO (FORMULARIO REAL CON VALIDACIÓN Y LOGS TERMINAL) -->
            <section id="contact" class="terminal-section hidden" aria-labelledby="contact-heading">
                <article class="command-block">
                    <p class="prompt">
                        <span class="lang-es">guest@portfolio : ~/contacto $ <code>./contacto.sh</code></span>
                        <span class="lang-en">guest@portfolio : ~/contact $ <code>./contact.sh</code></span>
                    </p>

                    <div class="script-log" id="script-log" aria-live="polite">
                        <p class="log-line">[ <span class="log-ok">OK</span> ] 
                            <span class="lang-es">Secuencia de inicialización completa.</span>
                            <span class="lang-en">Initialization sequence complete.</span>
                        </p>
                        <p class="log-line">[ <span class="log-ok">OK</span> ] 
                            <span class="lang-es">Estableciendo conexión segura...</span>
                            <span class="lang-en">Establishing secure connection...</span>
                        </p>
                        <p class="log-line">
                            <span class="lang-es">Iniciando protocolo de contacto v1.0.4</span>
                            <span class="lang-en">Starting contact protocol v1.0.4</span>
                        </p>
                    </div>

                    <form action="actions/send_message.php" method="POST" class="terminal-form" id="contact-form" novalidate>
                        <!-- Campo Honeypot Antispam (Invisible para usuarios reales) -->
                        <div class="form-honeypot" aria-hidden="true" style="display:none !important; position:absolute; left:-9999px; width:0; height:0; overflow:hidden;">
                            <label for="website">Website</label>
                            <input type="text" id="website" name="website" tabindex="-1" autocomplete="off">
                        </div>

                        <div class="form-row">
                            <label for="name">
                                <span class="lang-es">Ingresá tu nombre: &gt;</span>
                                <span class="lang-en">Enter your name: &gt;</span>
                            </label>
                            <input type="text" id="name" name="name" required minlength="2" maxlength="100" placeholder="John Doe" autocomplete="name">
                        </div>

                        <div class="form-row">
                            <label for="email">
                                <span class="lang-es">Ingresá tu email: &gt;</span>
                                <span class="lang-en">Enter your email: &gt;</span>
                            </label>
                            <input type="email" id="email" name="email" required maxlength="150" placeholder="john@example.com" autocomplete="email">
                        </div>

                        <div class="form-row">
                            <label for="message">
                                <span class="lang-es">Mensaje: &gt;</span>
                                <span class="lang-en">Message: &gt;</span>
                            </label>
                            <textarea id="message" name="message" rows="4" required minlength="5" maxlength="3000" placeholder="Escribí tu mensaje aquí... / Type your message here..."></textarea>
                        </div>

                        <div class="form-actions">
                            <button type="submit" class="submit-btn" id="submit-btn">
                                <span class="btn-text lang-es">[ ENVIAR_MENSAJE ]</span>
                                <span class="btn-text lang-en">[ SEND_MESSAGE ]</span>
                                <span class="btn-spinner" aria-hidden="true"></span>
                            </button>
                            <span class="form-feedback-message" id="form-feedback"></span>
                        </div>
                    </form>

                    <div class="env-variables">
                        <h3>
                            <span class="lang-es"># Variables de Entorno (Redes Sociales)</span>
                            <span class="lang-en"># Environment Variables (Social Links)</span>
                        </h3>
                        <p>EXPORT GITHUB="<a href="https://github.com/Santiago-Carrizo7" target="_blank" rel="noopener noreferrer">github.com/Santiago-Carrizo7</a>"</p>
                        <p>EXPORT LINKEDIN="<a href="https://linkedin.com/in/santiago-carrizo-dev" target="_blank" rel="noopener noreferrer">linkedin.com/in/santiago-carrizo-dev</a>"</p>
                        <p>EXPORT EMAIL="<a href="mailto:santiago.carrizo.dev@gmail.com">santiago.carrizo.dev@gmail.com</a>" <button type="button" class="copy-email-btn" id="contact-copy-email-btn" data-email="santiago.carrizo.dev@gmail.com" title="Copiar correo electrónico" aria-label="Copiar email"><span class="lang-es">[ Copiar ]</span><span class="lang-en">[ Copy ]</span></button></p>
                    </div>
                </article>

                <!-- Mini CLI Terminal Interactiva -->
                <div class="interactive-cli-box">
                    <div class="cli-header">
                        <span class="cli-dot"></span>
                        <span class="lang-es">Terminal Interactiva (Escribí <code>help</code> para ver comandos)</span>
                        <span class="lang-en">Interactive Terminal (Type <code>help</code> for commands)</span>
                    </div>
                    <div class="cli-input-wrapper">
                        <span class="cli-prompt">guest@portfolio:~$</span>
                        <input type="text" id="cli-input" class="cli-input" placeholder="help, about, skills, projects, contact, cv, clear..." autocomplete="off" spellcheck="false">
                    </div>
                    <div class="cli-output" id="cli-output"></div>
                </div>

                <div class="prompt-line" aria-hidden="true">
                    <span class="lang-es">guest@portfolio : ~/contacto $ <span class="cursor">█</span></span>
                    <span class="lang-en">guest@portfolio : ~/contact $ <span class="cursor">█</span></span>
                </div>
            </section>

        </main>
    </div>

    <!-- Barra de Estado Inferior -->
    <?php include __DIR__ . '/includes/footer.php'; ?>

    <!-- Lógica Vanilla JavaScript -->
    <script src="js/script.js"></script>
</body>
</html>
