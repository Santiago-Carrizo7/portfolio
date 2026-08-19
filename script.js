
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

    const sections = document.querySelectorAll('.terminal-section');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            navLinks.forEach(l => l.classList.remove('active'));

            const targetSection = document.querySelector(link.getAttribute('href'));

            sections.forEach(sec => {
                if(sec.classList.contains('active-section')){
                    sec.classList.remove('active-section')
                }
                sec.classList.add('hidden')
            });
            
            if (targetSection) {
                targetSection.classList.add('active-section');
            }
            
            link.classList.add('active');
        });
    });


    const contactForm = document.querySelector('.terminal-form');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault(); 

            

            const formData = new FormData(contactForm);

            try {
                const res = await fetch('send_message.php', {
                    method: 'POST',
                    body: formData
                });

                if(res.ok){
                    contactForm.reset();
                }
                
                const data = await res.json();
                console.log('Respuesta del servidor:', data);
            } catch (error) {
                console.error('Error al enviar:', error);
            }

        });
    }
});
