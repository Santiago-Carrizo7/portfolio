
document.addEventListener('DOMContentLoaded', () => {

    const langToggleBtn = document.getElementById('lang-toggle');
    const body = document.body;

    const savedLang = localStorage.getItem('portfolio-lang');
    if (savedLang) {
        body.className = savedLang;
    }

    if (langToggleBtn) {
        langToggleBtn.addEventListener('click', () => {
            if (body.classList.contains('lang-es')) {
                body.classList.replace('lang-es', 'lang-en');
                localStorage.setItem('portfolio-lang', 'lang-en');
            } else {
                body.classList.replace('lang-en', 'lang-es');
                localStorage.setItem('portfolio-lang', 'lang-es');
            }
        });
    }

    const navLinks = document.querySelectorAll('.sidebar-nav .nav-link');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            navLinks.forEach(l => l.classList.remove('active'));
            
            link.classList.add('active');
        });
    });

    const contactForm = document.querySelector('.terminal-form');
    const scriptLog = document.querySelector('.script-log');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault(); 

            const nameInput = document.getElementById('name').value;

            const logSuccess = document.createElement('p');
            logSuccess.style.color = 'var(--color-green)';
            logSuccess.style.marginTop = '8px';
            
            logSuccess.innerHTML = `
                [ <span class="log-ok">OK</span> ] 
                <span class="lang-es">¡Gracias ${nameInput}! Mensaje enviado correctamente a la terminal.</span>
                <span class="lang-en">Thank you ${nameInput}! Message sent successfully to terminal.</span>
            `;

            scriptLog.appendChild(logSuccess);

            contactForm.reset();
        });
    }

});
