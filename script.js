// Contact Form Handling
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const formStatus = document.getElementById('formStatus');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Show loading state
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;
            
            // Get form data
            const formData = new FormData(contactForm);
            const data = {
                name: formData.get('name'),
                email: formData.get('email'),
                message: formData.get('message')
            };

            // Send email using Formspree (you need to replace 'your-form-id' with actual Formspree form ID)
            fetch('https://formspree.io/f/your-form-id', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(data => {
                if (data.ok) {
                    showFormStatus('Message sent successfully! I\'ll get back to you soon.', 'success');
                    contactForm.reset();
                } else {
                    showFormStatus('Sorry, there was an error sending your message. Please try again.', 'error');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showFormStatus('Sorry, there was an error sending your message. Please try again.', 'error');
            })
            .finally(() => {
                // Hide loading state
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
            });
        });
    }

    function showFormStatus(message, type) {
        formStatus.textContent = message;
        formStatus.className = `form-status ${type}`;
        formStatus.style.display = 'block';
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            formStatus.style.display = 'none';
        }, 5000);
    }


});

// Enhanced Navigation Toggle with Mobile Support
const navToggle = document.querySelector('.nav-toggle');
const siteNav = document.querySelector('.site-nav');
const body = document.body;

if (navToggle && siteNav) {
    navToggle.addEventListener('click', function() {
        const isExpanded = this.getAttribute('aria-expanded') === 'true';
        this.setAttribute('aria-expanded', !isExpanded);
        siteNav.classList.toggle('open');
        
        // Prevent body scroll when menu is open on mobile
        if (siteNav.classList.contains('open')) {
            body.style.overflow = 'hidden';
        } else {
            body.style.overflow = '';
        }
    });
    
    // Close menu when clicking on nav links
    const navLinks = siteNav.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            siteNav.classList.remove('open');
            navToggle.setAttribute('aria-expanded', 'false');
            body.style.overflow = '';
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!navToggle.contains(e.target) && !siteNav.contains(e.target)) {
            siteNav.classList.remove('open');
            navToggle.setAttribute('aria-expanded', 'false');
            body.style.overflow = '';
        }
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && siteNav.classList.contains('open')) {
            siteNav.classList.remove('open');
            navToggle.setAttribute('aria-expanded', 'false');
            body.style.overflow = '';
            navToggle.focus();
        }
    });
}

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Enhanced Back to Top Button
const backToTopBtn = document.getElementById('backToTop');

if (backToTopBtn) {
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Add keyboard support
    backToTopBtn.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    });
}

// Update Year in Footer
const yearSpan = document.getElementById('year');
if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
}

// This observer is now handled in the mobile enhancements section above

// Typewriter Effect
function typeWriter(element, phrases, speed = 100) {
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    
    function type() {
        const currentPhrase = phrases[phraseIndex];
        
        if (isDeleting) {
            element.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
        } else {
            element.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
        }
        
        let typeSpeed = speed;
        
        if (isDeleting) {
            typeSpeed /= 2;
        }
        
        if (!isDeleting && charIndex === currentPhrase.length) {
            typeSpeed = 2000; // Pause at end
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typeSpeed = 500; // Pause before next phrase
        }
        
        setTimeout(type, typeSpeed);
    }
    
    type();
}

// Initialize Typewriter
const typewriterElement = document.querySelector('.typewriter');
if (typewriterElement) {
    const phrases = typewriterElement.getAttribute('data-phrases');
    if (phrases) {
        const phrasesArray = JSON.parse(phrases);
        typeWriter(typewriterElement, phrasesArray);
    }
}

// Mobile-specific enhancements
function initMobileEnhancements() {
    // Add touch feedback for interactive elements
    const interactiveElements = document.querySelectorAll('.btn, .social-link, .skills-list li, .project-card, .about-card');
    
    interactiveElements.forEach(element => {
        element.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.98)';
        }, { passive: true });
        
        element.addEventListener('touchend', function() {
            this.style.transform = '';
        }, { passive: true });
        
        element.addEventListener('touchcancel', function() {
            this.style.transform = '';
        }, { passive: true });
    });
    
    // Optimize scroll performance on mobile
    let ticking = false;
    
    function updateScrollElements() {
        // Back to top button
        if (backToTopBtn) {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        }
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateScrollElements);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick, { passive: true });
    
    // Handle orientation change
    window.addEventListener('orientationchange', function() {
        // Close mobile menu on orientation change
        if (siteNav && siteNav.classList.contains('open')) {
            siteNav.classList.remove('open');
            if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
            body.style.overflow = '';
        }
        
        // Recalculate viewport height for mobile browsers
        setTimeout(() => {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        }, 100);
    });
    
    // Set initial viewport height
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

// Initialize mobile enhancements when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMobileEnhancements);
} else {
    initMobileEnhancements();
}

// Intersection Observer for better performance on mobile
function createOptimizedObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                // Stop observing once revealed for better performance
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    return observer;
}

// Replace the existing observer with optimized version
const optimizedObserver = createOptimizedObserver();
document.querySelectorAll('[data-reveal]').forEach(el => {
    optimizedObserver.observe(el);
});


