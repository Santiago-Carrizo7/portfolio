/**
 * ============================================================================
 * SANTIAGO CARRIZO — TERMINAL PORTFOLIO JAVASCRIPT
 * Vanilla JS (ES6+) • Client-Side Navigation • Bilingüe • Terminal CLI
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
    // 1.5 CARGA DINÁMICA DE ARCHIVOS JSON (profile, skills, projects, certificates)
    // ------------------------------------------------------------------------
    function escapeHtml(str) {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    function formatJsonWithHighlight(obj) {
        const entries = Object.entries(obj);
        const lines = entries.map(([key, val], idx) => {
            const isLast = idx === entries.length - 1;
            const comma = isLast ? '' : ',';
            const keyHtml = `  <span class="json-key">"${escapeHtml(key)}"</span>: `;

            if (Array.isArray(val)) {
                const items = val.map((item, i) => {
                    const itemComma = i === val.length - 1 ? '' : ',';
                    return `    <span class="json-string">"${escapeHtml(item)}"</span>${itemComma}`;
                }).join('\n');
                return `\n${keyHtml}[\n${items}\n  ]${comma}`;
            } else {
                return `${keyHtml}<span class="json-string">"${escapeHtml(val)}"</span>${comma}`;
            }
        });
        return `{\n${lines.join('\n')}\n}`;
    }

    async function loadPortfolioData() {
        try {
            // 1. Cargar data/skills.json
            const skillsRes = await fetch('data/skills.json', { cache: 'no-store' });
            if (skillsRes.ok) {
                const skillsData = await skillsRes.json();
                const codeEs = document.querySelector('#skills .json-viewer .lang-es code');
                const codeEn = document.querySelector('#skills .json-viewer .lang-en code');
                if (codeEs && skillsData.es) {
                    codeEs.innerHTML = formatJsonWithHighlight(skillsData.es);
                }
                if (codeEn && skillsData.en) {
                    codeEn.innerHTML = formatJsonWithHighlight(skillsData.en);
                }
            }

            // 2. Cargar data/projects.json
            const projectsRes = await fetch('data/projects.json', { cache: 'no-store' });
            if (projectsRes.ok) {
                const projectsData = await projectsRes.json();
                const projectsGrid = document.querySelector('#projects .projects-grid');
                if (projectsGrid && Array.isArray(projectsData)) {
                    projectsGrid.innerHTML = projectsData.map(proj => {
                        const statusClass = proj.status?.key || 'deployed';
                        const statusEs = escapeHtml(proj.status?.es || '● En producción');
                        const statusEn = escapeHtml(proj.status?.en || '● Live');
                        const techsHtml = (proj.technologies || [])
                            .map(t => `<span class="tech-tag">${escapeHtml(t)}</span>`)
                            .join('');
                        const reposHtml = (proj.repositories || [])
                            .map(r => `
                                <a href="${escapeHtml(r.url)}" target="_blank" rel="noopener noreferrer" class="project-link">
                                    <span class="lang-es">${escapeHtml(r.label?.es || '[ Repositorio ]')}</span>
                                    <span class="lang-en">${escapeHtml(r.label?.en || '[ Repo ]')}</span>
                                </a>`)
                            .join('');
                        const demoHtml = proj.demo_url ? `
                                <a href="${escapeHtml(proj.demo_url)}" target="_blank" rel="noopener noreferrer" class="project-link demo-link">
                                    <span class="lang-es">[ Ir a la Web ]</span>
                                    <span class="lang-en">[ Visit Web ]</span>
                                </a>` : '';

                        return `
                        <article class="project-card" id="${escapeHtml(proj.slug || proj.id)}">
                            <div class="project-header">
                                <h2 class="project-title">${escapeHtml(proj.title)}</h2>
                                <span class="status-badge ${escapeHtml(statusClass)}">
                                    <span class="lang-es">${statusEs}</span>
                                    <span class="lang-en">${statusEn}</span>
                                </span>
                            </div>
                            <p class="project-desc lang-es">${escapeHtml(proj.description?.es || '')}</p>
                            <p class="project-desc lang-en">${escapeHtml(proj.description?.en || '')}</p>
                            <div class="project-techs" aria-label="Tecnologías utilizadas">
                                ${techsHtml}
                            </div>
                            <div class="project-links">
                                ${reposHtml}
                                ${demoHtml}
                            </div>
                        </article>`;
                    }).join('');
                }
            }

            // 3. Cargar data/certificates.json
            const certsRes = await fetch('data/certificates.json', { cache: 'no-store' });
            if (certsRes.ok) {
                const certsData = await certsRes.json();
                const certsGrid = document.querySelector('#certificates .certificates-grid');
                if (certsGrid && Array.isArray(certsData)) {
                    certsGrid.innerHTML = certsData.map(cert => {
                        const skillsHtml = (cert.skills || [])
                            .map(s => `<span class="tech-tag">${escapeHtml(s)}</span>`)
                            .join('');
                        const titleEs = escapeHtml(cert.title?.es || '');
                        const titleEn = escapeHtml(cert.title?.en || '');

                        return `
                        <article class="certificate-card" id="cert-${escapeHtml(cert.id)}">
                            <div class="certificate-preview">
                                <img src="${escapeHtml(cert.image)}" alt="${titleEs}" class="certificate-img" width="600" height="420" loading="lazy" decoding="async">
                            </div>
                            <div class="certificate-body">
                                <div class="certificate-header">
                                    <h2 class="certificate-title">
                                        <span class="lang-es">${titleEs}</span>
                                        <span class="lang-en">${titleEn}</span>
                                    </h2>
                                    <span class="certificate-issuer-badge">${escapeHtml(cert.issuer || '')}</span>
                                </div>
                                <p class="certificate-desc lang-es">${escapeHtml(cert.description?.es || '')}</p>
                                <p class="certificate-desc lang-en">${escapeHtml(cert.description?.en || '')}</p>
                                <div class="certificate-tags" aria-label="Habilidades asociadas">
                                    ${skillsHtml}
                                </div>
                                <div class="certificate-actions">
                                    <a href="${escapeHtml(cert.pdf)}" target="_blank" rel="noopener noreferrer" class="project-link demo-link">
                                        <span class="lang-es">[ Ver Certificado (PDF) ]</span>
                                        <span class="lang-en">[ View Certificate (PDF) ]</span>
                                    </a>
                                </div>
                            </div>
                        </article>`;
                    }).join('');
                }
            }

            // 4. Cargar data/profile.json
            const profileRes = await fetch('data/profile.json', { cache: 'no-store' });
            if (profileRes.ok) {
                const profile = await profileRes.json();
                const aboutHeading = document.getElementById('about-heading');
                if (aboutHeading && profile.title) {
                    aboutHeading.innerHTML = `
                        <span class="lang-es">${escapeHtml(profile.title.es || profile.name)}</span>
                        <span class="lang-en">${escapeHtml(profile.title.en || profile.name)}</span>
                    `;
                }

                const bioContainer = document.querySelector('#about .bio-output');
                if (bioContainer && profile.bio) {
                    const bioEs = bioContainer.querySelector('p.lang-es');
                    const bioEn = bioContainer.querySelector('p.lang-en');
                    if (bioEs && profile.bio.es) bioEs.textContent = profile.bio.es;
                    if (bioEn && profile.bio.en) bioEn.textContent = profile.bio.en;
                }

                const infoGroups = document.querySelectorAll('#about .info-card .info-group ul');
                if (infoGroups[0] && Array.isArray(profile.education)) {
                    infoGroups[0].innerHTML = profile.education.map(ed => `
                        <li>
                            <strong class="${escapeHtml(ed.color || 'text-green')}">${escapeHtml(ed.title)}</strong>
                            <br>
                            <span class="lang-es">${escapeHtml(ed.desc?.es || '')}</span>
                            <span class="lang-en">${escapeHtml(ed.desc?.en || '')}</span>
                        </li>
                    `).join('');
                }
                if (infoGroups[1] && Array.isArray(profile.technical_value)) {
                    infoGroups[1].innerHTML = profile.technical_value.map(item => `
                        <li>
                            <strong class="text-cyan">
                                <span class="lang-es">${escapeHtml(item.label?.es || '')}</span>
                                <span class="lang-en">${escapeHtml(item.label?.en || '')}</span>
                            </strong>
                            <span class="lang-es">${escapeHtml(item.desc?.es || '')}</span>
                            <span class="lang-en">${escapeHtml(item.desc?.en || '')}</span>
                        </li>
                    `).join('');
                }

                const availBadge = document.querySelector('#about .avatar-status-badge');
                if (availBadge && profile.availability) {
                    const availEs = availBadge.querySelector('.lang-es');
                    const availEn = availBadge.querySelector('.lang-en');
                    if (availEs && profile.availability.es) availEs.textContent = profile.availability.es;
                    if (availEn && profile.availability.en) availEn.textContent = profile.availability.en;
                }

                const profileName = document.querySelector('#about .profile-name');
                if (profileName && profile.name) profileName.textContent = profile.name;

                const profileRole = document.querySelector('#about .profile-role');
                if (profileRole && profile.degree) {
                    const degEs = profileRole.querySelector('.lang-es');
                    const degEn = profileRole.querySelector('.lang-en');
                    if (degEs && profile.degree.es) degEs.textContent = profile.degree.es;
                    if (degEn && profile.degree.en) degEn.textContent = profile.degree.en;
                }

                const metaValues = document.querySelectorAll('#about .profile-meta-grid .meta-value');
                if (metaValues[0] && profile.location) {
                    metaValues[0].textContent = profile.location;
                }
                if (metaValues[1] && profile.role) {
                    metaValues[1].innerHTML = `
                        <span class="lang-es">${escapeHtml(profile.role.es || '')}</span>
                        <span class="lang-en">${escapeHtml(profile.role.en || '')}</span>
                    `;
                }
                if (metaValues[2] && profile.status) {
                    metaValues[2].innerHTML = `
                        <span class="lang-es">${escapeHtml(profile.status.es || '')}</span>
                        <span class="lang-en">${escapeHtml(profile.status.en || '')}</span>
                    `;
                }
            }
        } catch (err) {
            console.error('Error cargando datos JSON del portfolio:', err);
        }
    }

    loadPortfolioData();

    // ------------------------------------------------------------------------
    // 2. NAVEGACIÓN POR PESTAÑAS (Sidebar + Barra de Pestañas Móvil)
    // ------------------------------------------------------------------------
    const allNavLinks = document.querySelectorAll('.sidebar-nav .nav-link, .mobile-tabs-bar .mobile-tab-link');
    const sections = document.querySelectorAll('.terminal-section');
    const consoleBody = document.getElementById('console-body');

    function switchSection(targetId) {
        if (!sections.length) return;

        allNavLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === `#${targetId}` || href === `/#${targetId}`) {
                link.classList.add('active');
                link.setAttribute('aria-current', 'page');
                if (link.classList.contains('mobile-tab-link')) {
                    link.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
                }
            } else {
                link.classList.remove('active');
                link.removeAttribute('aria-current');
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
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    allNavLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                switchSection(targetId);
                closeMobileDrawer();
                history.replaceState(null, '', `#${targetId}`);
            }
        });
    });

    if (window.location.hash && sections.length > 0) {
        const initialSec = window.location.hash.substring(1);
        if (document.getElementById(initialSec)) {
            switchSection(initialSec);
        }
    }

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
    // 4. FORMULARIO DE CONTACTO DIRECTO (Web3Forms API — Sin abrir app de correo)
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
            const keyInput = document.getElementById('web3forms-key');
            const botcheckInput = document.getElementById('botcheck');

            if (botcheckInput && botcheckInput.checked) {
                return;
            }

            const name = nameInput ? nameInput.value.trim() : '';
            const email = emailInput ? emailInput.value.trim() : '';
            const message = messageInput ? messageInput.value.trim() : '';
            const accessKey = keyInput ? keyInput.value.trim() : '';

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!name || name.length < 2) {
                addLogLine(isES ? 'Error: El nombre debe tener al menos 2 caracteres.' : 'Error: Name must have at least 2 characters.', 'ERROR');
                if (nameInput) nameInput.focus();
                return;
            }

            if (!email || !emailRegex.test(email)) {
                addLogLine(isES ? 'Error: Ingresá un correo electrónico válido.' : 'Error: Please enter a valid email address.', 'ERROR');
                if (emailInput) emailInput.focus();
                return;
            }

            if (!message || message.length < 5) {
                addLogLine(isES ? 'Error: El mensaje debe tener al menos 5 caracteres.' : 'Error: Message must have at least 5 characters.', 'ERROR');
                if (messageInput) messageInput.focus();
                return;
            }

            if (!accessKey || accessKey === 'TU_ACCESS_KEY_AQUI') {
                addLogLine(
                    isES
                        ? 'Falta configurar tu Access Key gratuita de Web3Forms en index.html (id="web3forms-key").'
                        : 'Missing Web3Forms Access Key in index.html (id="web3forms-key").',
                    'ERROR'
                );
                if (formFeedback) {
                    formFeedback.textContent = isES ? '⚠ Configurá tu Access Key en index.html' : '⚠ Set your Access Key in index.html';
                    formFeedback.className = 'form-feedback-message error';
                }
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

            addLogLine(isES ? 'Validando datos de entrada...' : 'Validating input data...', 'OK');
            addLogLine(isES ? 'Transmitiendo paquete encriptado al servidor de correo...' : 'Transmitting encrypted payload to mail server...', 'OK');

            try {
                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        access_key: accessKey,
                        name: name,
                        email: email,
                        message: message,
                        subject: `Portfolio Contact: Mensaje de ${name}`,
                        from_name: 'Portfolio Terminal'
                    })
                });

                const result = await response.json();

                if (response.status === 200 && result.success) {
                    addLogLine(
                        isES
                            ? '¡Mensaje enviado con éxito! Santiago recibirá tu correo en breve.'
                            : 'Message sent successfully! Santiago will receive your email shortly.',
                        'OK'
                    );
                    if (formFeedback) {
                        formFeedback.textContent = isES ? '✓ ¡Mensaje enviado con éxito!' : '✓ Message sent successfully!';
                        formFeedback.className = 'form-feedback-message success';
                    }
                    contactForm.reset();
                } else {
                    throw new Error(result.message || 'Error en el servidor de correo');
                }
            } catch (error) {
                console.error('Error al enviar formulario:', error);
                addLogLine(
                    isES
                        ? 'No se pudo enviar el mensaje. Podés escribir directamente a santiago.carrizo.dev@gmail.com'
                        : 'Could not send message. You can write directly to santiago.carrizo.dev@gmail.com',
                    'ERROR'
                );
                if (formFeedback) {
                    formFeedback.textContent = isES ? '✕ Error al enviar. Intentá de nuevo.' : '✕ Failed to send. Please try again.';
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
    // 5. TOAST NOTIFICATIONS HELPER (Estilo Terminal)
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
    // 6. RELOJ Y FECHA DINÁMICOS EN VIVO (STATUS BAR FOOTER & SOBRE MÍ)
    // ------------------------------------------------------------------------
    function updateLiveClock() {
        const now = new Date();
        const clockES = document.getElementById('status-clock-es');
        const clockEN = document.getElementById('status-clock-en');
        const lastLoginES = document.getElementById('last-login-es');
        const lastLoginEN = document.getElementById('last-login-en');

        const optionsDateES = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
        const dateStrES = now.toLocaleDateString('es-AR', optionsDateES);

        const optionsDateEN = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
        const dateStrEN = now.toLocaleDateString('en-US', optionsDateEN);

        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const timeStr = `${hours}:${minutes}:${seconds}`;

        // Footer status bar
        if (clockES) {
            clockES.textContent = `sesión activa: ${dateStrES}, ${timeStr} en ttys001`;
        }
        if (clockEN) {
            clockEN.textContent = `active session: ${dateStrEN}, ${timeStr} on ttys001`;
        }

        // Sección Sobre Mí (último inicio de sesión sincronizado en vivo)
        if (lastLoginES) {
            lastLoginES.textContent = `Último inicio de sesión: ${dateStrES}, ${timeStr} en ttys001`;
        }
        if (lastLoginEN) {
            lastLoginEN.textContent = `Last login: ${dateStrEN}, ${timeStr} on ttys001`;
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
});

