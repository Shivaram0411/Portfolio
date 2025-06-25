document.addEventListener('DOMContentLoaded', () => {
    // ===== HEADER SCROLL EFFECT =====
    const header = document.querySelector('header');

    const handleScroll = () => {
        header.classList.toggle('scrolled', window.scrollY > 20);
    };

    // Initialize and listen to scroll
    handleScroll();
    window.addEventListener('scroll', handleScroll);

    // ===== INTERSECTION OBSERVER FOR ANIMATIONS =====
    const animateElements = () => {
        // Configure the observer
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        // Callback function
        const observerCallback = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Special case for home section pseudo-element
                    if (entry.target.id === 'home') {
                        entry.target.classList.add('in-view');
                    } else {
                        entry.target.classList.add('in-view');
                        // Unobserve after animation triggers (optional)
                        // observer.unobserve(entry.target);
                    }
                }
            });
        };

        // Create observer
        const observer = new IntersectionObserver(observerCallback, observerOptions);

        // Elements to observe
        const elementsToAnimate = [
            document.getElementById('home'),
            ...document.querySelectorAll('.section-header'),
            ...document.querySelectorAll('.project-card'),
            ...document.querySelectorAll('#about p'),
            ...document.querySelectorAll('.experience-item'),
            document.querySelector('.contact-form')
        ].filter(el => el); // Filter out null elements

        // Start observing
        elementsToAnimate.forEach(el => observer.observe(el));
    };

    // Initialize animations
    animateElements();

    // ===== SMOOTH ANCHOR LINKS =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });

                // Update URL without jumping
                if (history.pushState) {
                    history.pushState(null, null, targetId);
                } else {
                    location.hash = targetId;
                }
            }
        });
    });

    // ===== PROJECT CARD HOVER EFFECTS =====
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            if (window.innerWidth > 768) { // Desktop only
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const angleX = (y - centerY) / 20;
                const angleY = (centerX - x) / 20;

                card.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg)`;
            }
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
        });
    });

    // ===== FORM SUBMISSION HANDLING (Formspree compatible JSON) =====
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;

        // Get values from form inputs
        const formData = {
            name: contactForm.querySelector('input[name="name"]').value,
            email: contactForm.querySelector('input[name="email"]').value,
            message: contactForm.querySelector('textarea[name="message"]').value
        };

        try {
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;

            // Send JSON data to Formspree
            const response = await fetch('https://formspree.io/f/xpwropzr', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                submitButton.textContent = '✓ Sent!';
                contactForm.reset();
            } else {
                throw new Error('Formspree error');
            }

            setTimeout(() => {
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            }, 2000);

        } catch (error) {
            console.error(error);
            submitButton.textContent = 'Error!';
            setTimeout(() => {
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            }, 2000);
        }
    });
}


    // ===== MOBILE MENU TOGGLE (OPTIONAL) =====
    const mobileMenuToggle = document.createElement('button');
    mobileMenuToggle.className = 'mobile-menu-toggle';
    mobileMenuToggle.innerHTML = '<span></span><span></span><span></span>';
    mobileMenuToggle.addEventListener('click', () => {
        document.body.classList.toggle('menu-open');
    });

    // Insert toggle button if mobile
    if (window.innerWidth <= 768) {
        header.appendChild(mobileMenuToggle);
        const nav = document.querySelector('nav');
        nav.classList.add('mobile-nav');
    }
});

// ===== WINDOW RESIZE HANDLER =====
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        // Re-initialize animations if needed
        document.querySelectorAll('.in-view').forEach(el => {
            el.classList.remove('in-view');
        });
        document.querySelector('#home').classList.add('in-view');
    }, 200);
});
