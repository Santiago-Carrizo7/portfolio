/**
 * ============================================================================
 * SANTIAGO CARRIZO — TERMINAL PORTFOLIO JAVASCRIPT
 * Vanilla JS (ES6+) • Tab Navigation • Bilingüe • Formulario Asíncrono • Mini CLI
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // ------------------------------------------------------------------------
    // 1. SISTEMA BILINGÜE (ES / EN) Y DESCARGA DINÁMICA DE CV
    // ------------------------------------------------------------------------
    const langToggleBtn = document.getElementById('lang-toggle');
    const body = document.body;
    const html = document.documentElement;

    function updateCVLinks(lang) {
        const isEnglish = (lang === 'lang-en');
        const cvPath = isEnglish ? 'assets/CV_Santiago_Carrizo_English.pdf' : 'assets/CV_Santiago_Carrizo.pdf';
        const cvFilename = isEnglish ? 'CV_Santiago_Carrizo_English.pdf' : 'CV_Santiago_Carrizo.pdf';

        const sidebarCvLink = document.getElementById('sidebar-cv-link');
        const aboutCvLink = document.getElementById('about-cv-link');

        if (sidebarCvLink) {
            sidebarCvLink.setAttribute('href', cvPath);
            sidebarCvLink.setAttribute('download', cvFilename);
        }

        if (aboutCvLink) {
            aboutCvLink.setAttribute('href', cvPath);
            aboutCvLink.setAttribute('download', cvFilename);
        }
    }

    const savedLang = localStorage.getItem('portfolio-lang') || 'lang-es';
    body.className = savedLang;
    html.lang = savedLang === 'lang-es' ? 'es' : 'en';
    updateCVLinks(savedLang);

    if (langToggleBtn) {
        langToggleBtn.addEventListener('click', () => {
            if (body.classList.contains('lang-es')) {
                body.classList.replace('lang-es', 'lang-en');
                localStorage.setItem('portfolio-lang', 'lang-en');
                html.lang = 'en';
                updateCVLinks('lang-en');
            } else {
                body.classList.replace('lang-en', 'lang-es');
                localStorage.setItem('portfolio-lang', 'lang-es');
                html.lang = 'es';
                updateCVLinks('lang-es');
            }
        });
    }

    // ------------------------------------------------------------------------
    // 2. NAVEGACIÓN POR PESTAÑAS (Muestra solo la sección activa)
    // ------------------------------------------------------------------------
    const navLinks = document.querySelectorAll('.sidebar-nav .nav-link');
    const sections = document.querySelectorAll('.terminal-section');
    const consoleBody = document.getElementById('console-body');

    function switchSection(targetId) {
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === `#${targetId}`) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        sections.forEach(sec => {
            sec.classList.remove('active-section');
            sec.classList.add('hidden');
        });

        const targetSection = document.getElementById(targetId);
        if (targetSection) {
            targetSection.classList.remove('hidden');
            targetSection.classList.add('active-section');
        }

        if (consoleBody) {
            consoleBody.scrollTop = 0;
        }
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            switchSection(targetId);
            closeMobileDrawer();
        });
    });

    // ------------------------------------------------------------------------
    // 3. CONTROLADOR DEL MENÚ MÓVIL (Drawer / Panel Lateral)
    // ------------------------------------------------------------------------
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const sidebar = document.getElementById('sidebar-nav-container');
    const sidebarCloseBtn = document.getElementById('sidebar-close-btn');
    const sidebarBackdrop = document.getElementById('sidebar-backdrop');

    function openMobileDrawer() {
        if (sidebar && sidebarBackdrop) {
            sidebar.classList.add('open');
            sidebarBackdrop.classList.add('active');
            if (mobileMenuToggle) {
                mobileMenuToggle.setAttribute('aria-expanded', 'true');
            }
            document.body.style.overflow = 'hidden';
        }
    }

    function closeMobileDrawer() {
        if (sidebar && sidebarBackdrop) {
            sidebar.classList.remove('open');
            sidebarBackdrop.classList.remove('active');
            if (mobileMenuToggle) {
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
            }
            document.body.style.overflow = '';
        }
    }

    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', () => {
            const isOpen = sidebar && sidebar.classList.contains('open');
            if (isOpen) {
                closeMobileDrawer();
            } else {
                openMobileDrawer();
            }
        });
    }

    if (sidebarCloseBtn) {
        sidebarCloseBtn.addEventListener('click', closeMobileDrawer);
    }

    if (sidebarBackdrop) {
        sidebarBackdrop.addEventListener('click', closeMobileDrawer);
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && sidebar && sidebar.classList.contains('open')) {
            closeMobileDrawer();
        }
    });

    // ------------------------------------------------------------------------
    // 4. FORMULARIO DE CONTACTO REAL CON LOGS TERMINAL DINÁMICOS
    // ------------------------------------------------------------------------
    const contactForm = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-btn');
    const scriptLog = document.getElementById('script-log');
    const formFeedback = document.getElementById('form-feedback');

    function addLogLine(text, status = 'OK') {
        if (!scriptLog) return;
        const p = document.createElement('p');
        p.className = 'log-line';
        
        let statusHtml = `[ <span class="log-ok">OK</span> ]`;
        if (status === 'ERROR') {
            statusHtml = `[ <span class="log-err">ERROR</span> ]`;
        }

        p.innerHTML = `${statusHtml} ${text}`;
        scriptLog.appendChild(p);
        scriptLog.scrollTop = scriptLog.scrollHeight;
    }

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const isES = body.classList.contains('lang-es');
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const messageInput = document.getElementById('message');

            const name = nameInput.value.trim();
            const email = emailInput.value.trim();
            const message = messageInput.value.trim();

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!name || name.length < 2) {
                addLogLine(isES ? 'Error: El nombre debe tener al menos 2 caracteres.' : 'Error: Name must have at least 2 characters.', 'ERROR');
                nameInput.focus();
                return;
            }

            if (!email || !emailRegex.test(email)) {
                addLogLine(isES ? 'Error: Ingresá un correo electrónico válido.' : 'Error: Please enter a valid email address.', 'ERROR');
                emailInput.focus();
                return;
            }

            if (!message || message.length < 5) {
                addLogLine(isES ? 'Error: El mensaje debe tener al menos 5 caracteres.' : 'Error: Message must have at least 5 characters.', 'ERROR');
                messageInput.focus();
                return;
            }

            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.classList.add('loading');
            }
            if (formFeedback) {
                formFeedback.textContent = '';
                formFeedback.className = 'form-feedback-message';
            }

            addLogLine(isES ? 'Validando datos en cliente...' : 'Validating client data...', 'OK');

            await new Promise(r => setTimeout(r, 150));
            addLogLine(isES ? 'Conectando con endpoint actions/send_message.php...' : 'Connecting to actions/send_message.php endpoint...', 'OK');

            const formData = new FormData(contactForm);

            try {
                const response = await fetch('actions/send_message.php', {
                    method: 'POST',
                    body: formData
                });

                const data = await response.json();

                if (response.ok && data.success) {
                    addLogLine(
                        isES ? 'Mensaje insertado correctamente en PostgreSQL.' : 'Message stored successfully in PostgreSQL.',
                        'OK'
                    );

                    if (formFeedback) {
                        formFeedback.textContent = isES ? '✓ ¡Mensaje enviado con éxito!' : '✓ Message sent successfully!';
                        formFeedback.className = 'form-feedback-message success';
                    }

                    contactForm.reset();
                } else {
                    const errorMsg = data.message || (isES ? 'No se pudo registrar el mensaje.' : 'Failed to process message.');
                    addLogLine(`Fallo en el servidor: ${errorMsg}`, 'ERROR');

                    if (formFeedback) {
                        formFeedback.textContent = `✗ ${errorMsg}`;
                        formFeedback.className = 'form-feedback-message error';
                    }
                }
            } catch (err) {
                console.error('Error de red:', err);
                addLogLine(
                    isES ? 'Error de conexión con el servidor.' : 'Connection error with server.',
                    'ERROR'
                );
                if (formFeedback) {
                    formFeedback.textContent = isES ? '✗ Error al conectar con el servidor.' : '✗ Error connecting to server.';
                    formFeedback.className = 'form-feedback-message error';
                }
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.classList.remove('loading');
                }
            }
        });
    }

    // ------------------------------------------------------------------------
    // 5. MINI TERMINAL CLI INTERACTIVA
    // ------------------------------------------------------------------------
    const cliInput = document.getElementById('cli-input');
    const cliOutput = document.getElementById('cli-output');

    if (cliInput && cliOutput) {
        cliInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const cmd = cliInput.value.trim().toLowerCase();
                if (!cmd) return;

                const isES = body.classList.contains('lang-es');
                cliOutput.classList.add('active');

                let responseHtml = '';

                switch (cmd) {
                    case 'help':
                    case 'ayuda':
                        responseHtml = isES
                            ? `<strong>Comandos disponibles:</strong><br>
                               • <code>about</code> / <code>sobre-mi</code>: Ir a Sobre mí.<br>
                               • <code>skills</code> / <code>habilidades</code>: Ir a Habilidades.<br>
                               • <code>projects</code> / <code>proyectos</code>: Ir a Proyectos.<br>
                               • <code>contact</code> / <code>contacto</code>: Ir a Contacto.<br>
                               • <code>cv</code> / <code>resume</code>: Descargar CV en tu idioma actual.<br>
                               • <code>github</code> / <code>repo</code>: Abrir GitHub.<br>
                               • <code>whoami</code>: Resumen del desarrollador.<br>
                               • <code>clear</code> / <code>cls</code>: Limpiar consola.`
                            : `<strong>Available commands:</strong><br>
                               • <code>about</code>: Go to About.<br>
                               • <code>skills</code>: Go to Skills.<br>
                               • <code>projects</code>: Go to Projects.<br>
                               • <code>contact</code>: Go to Contact.<br>
                               • <code>cv</code> / <code>resume</code>: Download CV in current language.<br>
                               • <code>github</code> / <code>repo</code>: Open GitHub.<br>
                               • <code>whoami</code>: Developer summary.<br>
                               • <code>clear</code> / <code>cls</code>: Clear output.`;
                        break;

                    case 'about':
                    case 'sobre-mi':
                        switchSection('about');
                        responseHtml = isES ? 'Cambiando a ~/sobre-mi...' : 'Switching to ~/about...';
                        break;

                    case 'skills':
                    case 'habilidades':
                        switchSection('skills');
                        responseHtml = isES ? 'Cambiando a ~/habilidades...' : 'Switching to ~/skills...';
                        break;

                    case 'projects':
                    case 'proyectos':
                        switchSection('projects');
                        responseHtml = isES ? 'Cambiando a ~/proyectos...' : 'Switching to ~/projects...';
                        break;

                    case 'contact':
                    case 'contacto':
                        switchSection('contact');
                        responseHtml = isES ? 'Cambiando a ~/contacto...' : 'Switching to ~/contact...';
                        break;

                    case 'cv':
                    case 'resume':
                        const cvFile = isES ? 'assets/CV_Santiago_Carrizo.pdf' : 'assets/CV_Santiago_Carrizo_English.pdf';
                        window.open(cvFile, '_blank');
                        responseHtml = isES ? 'Iniciando descarga de CV_Santiago_Carrizo.pdf...' : 'Starting download of CV_Santiago_Carrizo_English.pdf...';
                        break;

                    case 'github':
                    case 'repo':
                        window.open('https://github.com/Santiago-Carrizo7', '_blank');
                        responseHtml = 'Abriendo GitHub...';
                        break;

                    case 'whoami':
                    case 'quiensoy':
                        responseHtml = '<strong>Santiago Carrizo</strong> — Full Stack Developer (React 19, TypeScript, Node.js, Express 5, PostgreSQL, Flutter)';
                        break;

                    case 'email':
                    case 'correo':
                        responseHtml = isES
                            ? `Email: <a href="mailto:santiago.carrizo.dev@gmail.com" style="color:var(--color-green)">santiago.carrizo.dev@gmail.com</a> (Hacé clic en Copiar Email en el menú)`
                            : `Email: <a href="mailto:santiago.carrizo.dev@gmail.com" style="color:var(--color-green)">santiago.carrizo.dev@gmail.com</a> (Click Copy Email in the sidebar)`;
                        break;

                    case 'clear':
                    case 'cls':
                        cliOutput.innerHTML = '';
                        cliOutput.classList.remove('active');
                        cliInput.value = '';
                        return;

                    default:
                        responseHtml = isES
                            ? `<span style="color:var(--color-red)">Comando no reconocido: <code>${cmd}</code>. Escribí <code>help</code>.</span>`
                            : `<span style="color:var(--color-red)">Command not recognized: <code>${cmd}</code>. Type <code>help</code>.</span>`;
                        break;
                }

                cliOutput.innerHTML = `<div style="margin-bottom:4px;"><span style="color:var(--color-green)">$ ${cmd}</span></div><div>${responseHtml}</div>`;
                cliInput.value = '';
                cliOutput.scrollTop = cliOutput.scrollHeight;
            }
        });
    }

    // ------------------------------------------------------------------------
    // 6. TOAST NOTIFICATIONS HELPER (Estilo Terminal)
    // ------------------------------------------------------------------------
    let toastTimeout = null;
    function showTerminalToast(message) {
        let toast = document.getElementById('terminal-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'terminal-toast';
            toast.className = 'terminal-toast';
            document.body.appendChild(toast);
        }
        toast.textContent = message;
        toast.classList.add('show');

        if (toastTimeout) clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            toast.classList.remove('show');
        }, 2500);
    }

    // ------------------------------------------------------------------------
    // 7. RELOJ Y FECHA DINÁMICOS EN VIVO (STATUS BAR FOOTER)
    // ------------------------------------------------------------------------
    function updateLiveClock() {
        const now = new Date();
        const clockES = document.getElementById('status-clock-es');
        const clockEN = document.getElementById('status-clock-en');

        if (!clockES && !clockEN) return;

        const optionsDateES = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
        const dateStrES = now.toLocaleDateString('es-AR', optionsDateES);

        const optionsDateEN = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
        const dateStrEN = now.toLocaleDateString('en-US', optionsDateEN);

        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const timeStr = `${hours}:${minutes}:${seconds}`;

        if (clockES) {
            clockES.textContent = `sesión activa: ${dateStrES}, ${timeStr} en ttys001`;
        }
        if (clockEN) {
            clockEN.textContent = `active session: ${dateStrEN}, ${timeStr} on ttys001`;
        }
    }

    updateLiveClock();
    setInterval(updateLiveClock, 1000);

    // ------------------------------------------------------------------------
    // 8. COPIAR CORREO ELECTRÓNICO AL PORTAPAPELES
    // ------------------------------------------------------------------------
    const copyEmailButtons = document.querySelectorAll('.copy-email-btn');
    copyEmailButtons.forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.preventDefault();
            const email = btn.getAttribute('data-email') || 'santiago.carrizo.dev@gmail.com';
            const isES = body.classList.contains('lang-es');

            try {
                if (navigator.clipboard && window.isSecureContext) {
                    await navigator.clipboard.writeText(email);
                } else {
                    const tempInput = document.createElement('input');
                    tempInput.value = email;
                    document.body.appendChild(tempInput);
                    tempInput.select();
                    document.execCommand('copy');
                    document.body.removeChild(tempInput);
                }

                btn.classList.add('copied');
                showTerminalToast(isES ? `[ OK ] Email copiado: ${email}` : `[ OK ] Email copied: ${email}`);

                setTimeout(() => {
                    btn.classList.remove('copied');
                }, 2200);
            } catch (err) {
                console.error('Error al copiar email:', err);
                showTerminalToast(isES ? `[ ERROR ] No se pudo copiar email` : `[ ERROR ] Failed to copy email`);
            }
        });
    });

    // ------------------------------------------------------------------------
    // 9. CONTROLES DE VENTANA (HEADER WINDOW BUTTONS)
    // ------------------------------------------------------------------------
    const winBtnClose = document.getElementById('win-btn-close');
    const winBtnMinimize = document.getElementById('win-btn-minimize');
    const winBtnMaximize = document.getElementById('win-btn-maximize');

    if (winBtnMaximize) {
        winBtnMaximize.addEventListener('click', () => {
            const isES = body.classList.contains('lang-es');
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen().then(() => {
                    showTerminalToast(isES ? '[ PANTALLA COMPLETA ACTIVADA ]' : '[ FULLSCREEN ENABLED ]');
                }).catch(() => {
                    showTerminalToast(isES ? '[ INFO ] Modo maximizado' : '[ INFO ] Maximized mode');
                });
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen().then(() => {
                        showTerminalToast(isES ? '[ PANTALLA COMPLETA DESACTIVADA ]' : '[ FULLSCREEN DISABLED ]');
                    });
                }
            }
        });
    }

    if (winBtnMinimize) {
        winBtnMinimize.addEventListener('click', () => {
            const isES = body.classList.contains('lang-es');
            const layout = document.querySelector('.terminal-layout');
            if (layout) {
                layout.classList.toggle('minimized-layout');
                const isMin = layout.classList.contains('minimized-layout');
                showTerminalToast(
                    isES
                        ? (isMin ? '[ MODO FOCO: SIDEBAR OCULTO ]' : '[ VISTA ESTÁNDAR RESTAURADA ]')
                        : (isMin ? '[ FOCUS MODE: SIDEBAR HIDDEN ]' : '[ STANDARD VIEW RESTORED ]')
                );
            }
        });
    }

    if (winBtnClose) {
        winBtnClose.addEventListener('click', () => {
            const isES = body.classList.contains('lang-es');
            switchSection('about');
            if (consoleBody) consoleBody.scrollTop = 0;
            showTerminalToast(isES ? '[ SESIÓN REINICIADA: ~/sobre-mi ]' : '[ SESSION RESTARTED: ~/about ]');
        });
    }
});
