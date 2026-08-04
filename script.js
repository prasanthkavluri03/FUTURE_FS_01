
document.addEventListener('DOMContentLoaded', () => {
    initPageLoader();
    initCustomCursor();
    initCanvasParticles();
    initTypingEffect();
    initMobileMenu();
    initScrollNavbar();
    initScrollActiveLinks();
    initScrollCounters();
    initSkillBarsReveal();
    initSwiperCertificates();
    initLightbox();
    initContactForm();
});

/* --- 1. PAGE LOADER & GSAP REGISTRATION --- */
function initPageLoader() {
    // Register GSAP ScrollTrigger globally at the start
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
    }

    const loader = document.getElementById('page-loader');
    if (loader) {
        const fadeOut = () => {
            setTimeout(() => {
                loader.style.opacity = '0';
                loader.style.visibility = 'hidden';
                // Trigger initial GSAP hero animations after loading
                animateHeroEntrance();
            }, 500);
        };

        if (document.readyState === 'complete') {
            fadeOut();
        } else {
            window.addEventListener('load', fadeOut);
        }
    } else {
        animateHeroEntrance();
    }
}

/* --- 2. CUSTOM CURSOR TRACKER --- */
function initCustomCursor() {
    const dot = document.querySelector('.custom-cursor-dot');
    const outline = document.querySelector('.custom-cursor-outline');
    
    if (!dot || !outline) return;

    let mouseX = 0, mouseY = 0;
    let outlineX = 0, outlineY = 0;
    
    // Smooth outline follow lag
    const speed = 0.15;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        dot.style.left = mouseX + 'px';
        dot.style.top = mouseY + 'px';
    });

    function animateOutline() {
        let distX = mouseX - outlineX;
        let distY = mouseY - outlineY;
        
        outlineX += distX * speed;
        outlineY += distY * speed;
        
        outline.style.left = outlineX + 'px';
        outline.style.top = outlineY + 'px';
        
        requestAnimationFrame(animateOutline);
    }
    animateOutline();

    // Cursor hover effects on links and buttons
    const interactiveElements = document.querySelectorAll('a, button, .interactive, input, textarea, .swiper-button-next, .swiper-button-prev');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            document.body.classList.add('cursor-hover');
        });
        el.addEventListener('mouseleave', () => {
            document.body.classList.remove('cursor-hover');
        });
    });
}

/* --- 3. CANVAS PARTICLES ENGINE --- */
function initCanvasParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let particlesArray = [];
    const maxParticles = 65;
    
    let mouse = {
        x: null,
        y: null,
        radius: 120
    };

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.x;
        mouse.y = e.y;
    });

    window.addEventListener('mouseout', () => {
        mouse.x = null;
        mouse.y = null;
    });

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initParticles();
    }
    
    window.addEventListener('resize', resizeCanvas);
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    class Particle {
        constructor(x, y, directionX, directionY, size, color) {
            this.x = x;
            this.y = y;
            this.directionX = directionX;
            this.directionY = directionY;
            this.size = size;
            this.color = color;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            ctx.fillStyle = this.color;
            ctx.fill();
        }

        update() {
            // Check boundaries
            if (this.x > canvas.width || this.x < 0) {
                this.directionX = -this.directionX;
            }
            if (this.y > canvas.height || this.y < 0) {
                this.directionY = -this.directionY;
            }

            // Mouse interact (push away)
            if (mouse.x != null && mouse.y != null) {
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < mouse.radius + this.size) {
                    if (mouse.x < this.x && this.x < canvas.width - this.size * 10) {
                        this.x += 3;
                    }
                    if (mouse.x > this.x && this.x > this.size * 10) {
                        this.x -= 3;
                    }
                    if (mouse.y < this.y && this.y < canvas.height - this.size * 10) {
                        this.y += 3;
                    }
                    if (mouse.y > this.y && this.y > this.size * 10) {
                        this.y -= 3;
                    }
                }
            }

            this.x += this.directionX;
            this.y += this.directionY;
            this.draw();
        }
    }

    function initParticles() {
        particlesArray = [];
        let numberOfParticles = (canvas.width * canvas.height) / 22000;
        numberOfParticles = Math.min(numberOfParticles, maxParticles);

        for (let i = 0; i < numberOfParticles; i++) {
            let size = (Math.random() * 2) + 1.2;
            let x = (Math.random() * ((canvas.width - size * 2) - (size * 2)) + size * 2);
            let y = (Math.random() * ((canvas.height - size * 2) - (size * 2)) + size * 2);
            let directionX = (Math.random() * 0.4) - 0.2;
            let directionY = (Math.random() * 0.4) - 0.2;
            
            // Random color from theme gradients
            const colors = ['rgba(6, 182, 212, 0.4)', 'rgba(124, 58, 237, 0.3)', 'rgba(37, 99, 235, 0.3)'];
            let color = colors[Math.floor(Math.random() * colors.length)];

            particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
        }
    }

    function connect() {
        let opacityValue = 1;
        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a; b < particlesArray.length; b++) {
                let dx = particlesArray[a].x - particlesArray[b].x;
                let dy = particlesArray[a].y - particlesArray[b].y;
                let distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < (canvas.width / 8) * (canvas.height / 8) / 1800) {
                    opacityValue = 1 - (distance / 110);
                    ctx.strokeStyle = `rgba(124, 58, 237, ${opacityValue * 0.12})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
        }
        connect();
        requestAnimationFrame(animate);
    }

    initParticles();
    animate();
}

/* --- 4. TYPING TEXT HERO EFFECT --- */
function initTypingEffect() {
    const textEl = document.getElementById('typing-text');
    if (!textEl) return;

    const roles = [
        "Full Stack Python Developer",
        "Python Developer",
        "Django Developer",
        "Data Science Enthusiast"
    ];
    
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function type() {
        const currentRole = roles[roleIndex];
        
        if (isDeleting) {
            textEl.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            textEl.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 120;
        }

        if (!isDeleting && charIndex === currentRole.length) {
            isDeleting = true;
            typingSpeed = 2000; // Pause at full word
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typingSpeed = 500; // Pause before starting next
        }

        setTimeout(type, typingSpeed);
    }

    setTimeout(type, 1000);
}

/* --- 5. MOBILE MENU NAV --- */
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-link');

    if (!hamburger || !navLinks) return;

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    links.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
}

/* --- 6. SCROLL NAVBAR SCALER --- */
function initScrollNavbar() {
    const navbar = document.querySelector('.navbar');
    const backToTop = document.querySelector('.back-to-top');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        if (window.scrollY > 600) {
            backToTop.classList.add('active');
        } else {
            backToTop.classList.remove('active');
        }
    });

    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

/* --- 7. ACTIVE NAV MENU HIGHLIGHT --- */
function initScrollActiveLinks() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });
}

/* --- 8. INCREMENTING SCROLL COUNTERS --- */
function initScrollCounters() {
    const counters = document.querySelectorAll('.counter-num');
    if (counters.length === 0) return;

    const options = {
        threshold: 0.5,
        rootMargin: "0px"
    };

    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const targetVal = parseInt(target.getAttribute('data-target'));
                const duration = 2000; // 2 seconds animation
                const stepTime = Math.abs(Math.floor(duration / targetVal));
                
                let currentVal = 0;
                const timer = setInterval(() => {
                    currentVal += Math.ceil(targetVal / 50); // Increment size
                    if (currentVal >= targetVal) {
                        target.textContent = targetVal + '+';
                        clearInterval(timer);
                    } else {
                        target.textContent = currentVal + '+';
                    }
                }, stepTime);

                observer.unobserve(target);
            }
        });
    }, options);

    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

/* --- 9. SKILL BARS REVEAL --- */
function initSkillBarsReveal() {
    const progressBars = document.querySelectorAll('.skill-bar-fill');
    if (progressBars.length === 0) return;

    const options = {
        threshold: 0.1,
        rootMargin: "0px"
    };

    const skillsObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const percent = bar.getAttribute('data-percent');
                bar.style.width = percent + '%';
                observer.unobserve(bar);
            }
        });
    }, options);

    progressBars.forEach(bar => {
        skillsObserver.observe(bar);
    });
}

/* --- 10. SWIPER CERTIFICATES GALLERY --- */
function initSwiperCertificates() {
    if (typeof Swiper !== 'undefined') {
        new Swiper('.cert-swiper', {
            slidesPerView: 1,
            spaceBetween: 0,
            loop: true,
            autoplay: {
                delay: 3000,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.cert-swiper .swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '#cert-next',
                prevEl: '#cert-prev',
            }
        });
    }
}

/* --- 11. LIGHTBOX PREVIEWER --- */
function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.querySelector('.lightbox-close');
    const cards = document.querySelectorAll('.certificate-slide-card');

    if (!lightbox || !lightboxImg || !lightboxClose) return;

    // Toggle flip on card click (for touch / mobile devices)
    cards.forEach(card => {
        card.addEventListener('click', (e) => {
            // If "View Certificate" button was clicked, open lightbox instead
            if (e.target.closest('.view-cert-btn')) return;
            card.classList.toggle('flipped');
        });
    });

    // "View Certificate" button opens the lightbox
    document.querySelectorAll('.view-cert-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const card = btn.closest('.certificate-slide-card');
            const img = card ? card.querySelector('.certificate-img-container img') : null;
            if (img) {
                lightboxImg.src = img.src;
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    const closeLightbox = () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    };

    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });
}

/* --- 12. CONTACT FORM SUBMISSION --- */
function initContactForm() {
    const form = document.getElementById('contact-form');
    const statusMsg = document.getElementById('form-status');
    const submitBtnText = document.querySelector('.submit-btn-text');
    const submitBtnIcon = document.querySelector('.submit-btn i');

    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('form-name').value;
        const email = document.getElementById('form-email').value;
        const subject = document.getElementById('form-subject').value;
        const message = document.getElementById('form-message').value;

        if (!name || !email || !subject || !message) {
            showStatus('Please fill in all form fields.', 'error');
            return;
        }

        // Show loading state
        submitBtnText.textContent = 'Sending Message...';
        submitBtnIcon.className = 'fa-solid fa-circle-notch fa-spin';

        // Simulate API call
        setTimeout(() => {
            submitBtnText.textContent = 'Send Message';
            submitBtnIcon.className = 'fa-solid fa-paper-plane';
            
            showStatus('Thank you! Your message was sent successfully.', 'success');
            
            // Trigger confetti
            if (typeof confetti === 'function') {
                confetti({
                    particleCount: 120,
                    spread: 80,
                    origin: { y: 0.6 },
                    colors: ['#2563EB', '#7C3AED', '#06B6D4', '#10B981']
                });
            }

            form.reset();
        }, 1500);
    });

    function showStatus(text, type) {
        statusMsg.textContent = text;
        statusMsg.className = `form-status ${type}`;
        
        setTimeout(() => {
            statusMsg.style.display = 'none';
        }, 5000);
    }
}

/* --- 13. GSAP HERO ENTRANCE --- */
function animateHeroEntrance() {
    if (typeof gsap !== 'undefined') {
        const tl = gsap.timeline();
        
        tl.from('.navbar', {
            y: -50,
            opacity: 0,
            duration: 1,
            ease: 'power3.out'
        });
        
        tl.from('.hero-badge', {
            scale: 0.8,
            opacity: 0,
            duration: 0.6,
            ease: 'back.out(1.7)'
        }, '-=0.6');

        tl.from('.hero-title', {
            y: 30,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out'
        }, '-=0.4');

        tl.from('.hero-subtitle', {
            y: 20,
            opacity: 0,
            duration: 0.6,
            ease: 'power3.out'
        }, '-=0.4');

        tl.from('.hero-desc', {
            y: 20,
            opacity: 0,
            duration: 0.6,
            ease: 'power3.out'
        }, '-=0.4');

        tl.from('.hero-buttons', {
            y: 20,
            opacity: 0,
            duration: 0.6,
            ease: 'power3.out'
        }, '-=0.4');

        tl.from('.hero-socials', {
            x: -20,
            opacity: 0,
            duration: 0.6,
            ease: 'power3.out'
        }, '-=0.4');

        tl.from('.profile-glow-circle', {
            scale: 0.7,
            opacity: 0,
            duration: 1.2,
            ease: 'elastic.out(1, 0.75)'
        }, '-=1.2');

        // ScrollTrigger Animations for sections reveal
        // ScrollTrigger.refresh() will be called to ensure accurate positions after rendering
        setTimeout(() => {
            if (typeof ScrollTrigger !== 'undefined') {
                ScrollTrigger.refresh();
            }
        }, 1000);
        gsap.fromTo('#about .about-image-wrapper', 
            { x: -60, opacity: 0, transition: 'none' },
            {
                scrollTrigger: {
                    trigger: '#about',
                    start: 'top 80%',
                },
                x: 0,
                opacity: 1,
                duration: 1,
                ease: 'power3.out',
                clearProps: 'all'
            }
        );

        gsap.fromTo('#about .about-info', 
            { x: 60, opacity: 0, transition: 'none' },
            {
                scrollTrigger: {
                    trigger: '#about',
                    start: 'top 80%',
                },
                x: 0,
                opacity: 1,
                duration: 1,
                ease: 'power3.out',
                clearProps: 'all'
            }
        );

        gsap.fromTo('.skills-category', 
            { y: 50, opacity: 0, transition: 'none' },
            {
                scrollTrigger: {
                    trigger: '#skills',
                    start: 'top 80%',
                },
                y: 0,
                opacity: 1,
                stagger: 0.15,
                duration: 0.8,
                ease: 'power3.out',
                clearProps: 'all'
            }
        );

        gsap.fromTo('.project-card', 
            { y: 60, opacity: 0, transition: 'none' },
            {
                scrollTrigger: {
                    trigger: '#projects',
                    start: 'top 80%',
                },
                y: 0,
                opacity: 1,
                stagger: 0.15,
                duration: 0.8,
                ease: 'power3.out',
                clearProps: 'all'
            }
        );

        gsap.fromTo('.certificate-slide-card', 
            { scale: 0.8, opacity: 0, transition: 'none' },
            {
                scrollTrigger: {
                    trigger: '#certificates',
                    start: 'top 80%',
                },
                scale: 1,
                opacity: 1,
                stagger: 0.15,
                duration: 0.8,
                ease: 'power3.out',
                clearProps: 'all'
            }
        );

        gsap.fromTo('.profile-card', 
            { y: 40, opacity: 0, transition: 'none' },
            {
                scrollTrigger: {
                    trigger: '#profiles',
                    start: 'top 80%',
                },
                y: 0,
                opacity: 1,
                stagger: 0.12,
                duration: 0.8,
                ease: 'power3.out',
                clearProps: 'all'
            }
        );

        gsap.fromTo('.counter-card', 
            { y: 40, opacity: 0, transition: 'none' },
            {
                scrollTrigger: {
                    trigger: '#achievements',
                    start: 'top 85%',
                },
                y: 0,
                opacity: 1,
                stagger: 0.1,
                duration: 0.8,
                ease: 'power3.out',
                clearProps: 'all'
            }
        );

        gsap.fromTo('.contact-info-card', 
            { x: -50, opacity: 0, transition: 'none' },
            {
                scrollTrigger: {
                    trigger: '#contact',
                    start: 'top 80%',
                },
                x: 0,
                opacity: 1,
                stagger: 0.15,
                duration: 0.8,
                ease: 'power3.out',
                clearProps: 'all'
            }
        );

        gsap.fromTo('.contact-form-card', 
            { x: 50, opacity: 0, transition: 'none' },
            {
                scrollTrigger: {
                    trigger: '#contact',
                    start: 'top 80%',
                },
                x: 0,
                opacity: 1,
                duration: 0.8,
                ease: 'power3.out',
                clearProps: 'all'
            }
        );
    }
}
