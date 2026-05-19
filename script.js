document.addEventListener('DOMContentLoaded', () => {
    // 1. Sticky Header & Scroll Reveal
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 2. Animated Counters
    const counters = document.querySelectorAll('.counter');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-target'));
                let count = 0;
                const speed = 2000 / target;

                const updateCount = () => {
                    const increment = target / 100;
                    if (count < target) {
                        count += increment;
                        counter.innerText = Math.ceil(count);
                        setTimeout(updateCount, speed);
                    } else {
                        counter.innerText = target;
                    }
                };
                updateCount();
                counterObserver.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));

    // 3. Multi-language Support
    const langToggle = document.getElementById('lang-switch');
    const translatableElements = document.querySelectorAll('[data-en]');
    const langEn = document.querySelector('.lang-text.en');
    const langKn = document.querySelector('.lang-text.kn');

    const updateLanguage = (lang) => {
        translatableElements.forEach(el => {
            const translation = el.getAttribute(`data-${lang}`);
            if (!translation) return;

            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = translation;
            } else {
                el.innerHTML = translation;
            }
        });

        // Update Toggle UI
        if (lang === 'en') {
            langToggle.classList.remove('kn');
            langEn.classList.add('active');
            langKn.classList.remove('active');
        } else {
            langToggle.classList.add('kn');
            langEn.classList.remove('active');
            langKn.classList.add('active');
        }
    };

    let currentLang = localStorage.getItem('tcc-lang') || 'en';

    langToggle.addEventListener('click', () => {
        currentLang = currentLang === 'en' ? 'kn' : 'en';
        updateLanguage(currentLang);
        localStorage.setItem('tcc-lang', currentLang);
    });

    // Initial Load
    updateLanguage(currentLang);

    // 4. Dark/Light Mode
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const themeIcon = themeToggle.querySelector('i');

    const toggleTheme = () => {
        const isDark = body.getAttribute('data-theme') === 'dark';
        body.setAttribute('data-theme', isDark ? 'light' : 'dark');
        themeIcon.className = isDark ? 'fas fa-moon' : 'fas fa-sun';
        localStorage.setItem('tcc-theme', isDark ? 'light' : 'dark');
    };

    themeToggle.addEventListener('click', toggleTheme);

    // Load saved theme
    const savedTheme = localStorage.getItem('tcc-theme');
    if (savedTheme) {
        body.setAttribute('data-theme', savedTheme);
        themeIcon.className = savedTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }

    // 5. Scroll Animations
    const revealElements = document.querySelectorAll('.course-card, .faculty-card, .about-content, .contact-info, .contact-form-box, .process-step, .testimonial-card, .gallery-item');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease-out';
        revealObserver.observe(el);
    });

    // 6. Contact Form Submission (Mock)
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Thank you for your interest! We will contact you soon.');
            contactForm.reset();
        });
    }

    // 7. Active Navigation Link Highlighting on Scroll
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    const updateActiveLink = () => {
        let current = '';
        const scrollPos = window.scrollY + 250; // Increased offset for better detection

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollPos >= sectionTop && scrollPos < (sectionTop + sectionHeight)) {
                current = section.getAttribute('id');
            }
        });

        // Fallback for top of page
        if (window.scrollY < 50) current = 'home';
        // Fallback for bottom of page
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 50) current = 'contact';

        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === `#${current}`) {
                link.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', updateActiveLink);
    window.addEventListener('load', updateActiveLink);

    // Manual click handling for immediate feedback
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });

    // 8. Dynamic Scroll-Driven Horizontal Card Shift (Parallax)
    const coursesWrapper = document.querySelector('.courses-wrapper');
    const coursesGrid = document.querySelector('.courses-grid');
    if (coursesWrapper && coursesGrid) {
        window.addEventListener('scroll', () => {
            const rect = coursesWrapper.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            if (rect.top < viewportHeight && rect.bottom > 0) {
                // Smooth scroll-driven translation offset
                const scrollFactor = (viewportHeight - rect.top) * 0.18; // multiplier controls parallax speed
                coursesGrid.style.setProperty('--scroll-offset', `${-scrollFactor}px`);
            }
        });
    }

    // 9. Premium Interactive 3D Tilt Effect for Course Cards
    const cards = document.querySelectorAll('.course-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; 
            const y = e.clientY - rect.top;  
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Limit tilt angle to max 12 degrees
            const rotateX = ((centerY - y) / centerY) * 12;
            const rotateY = ((x - centerX) / centerX) * 12;
            
            card.style.transform = `translateY(-12px) scale(1.03) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            card.style.transition = 'transform 0.08s ease-out'; // Fast tracking during hover
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
            card.style.transition = 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)'; // Smooth float/wave recovery
        });
    });
});
