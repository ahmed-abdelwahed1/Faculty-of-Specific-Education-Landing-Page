// Initialize Swiper
const heroSwiper = new Swiper('.hero-slider', {
    slidesPerView: 1,
    loop: true,
    effect: 'fade',
    fadeEffect: {
        crossFade: true
    },
    autoplay: {
        delay: 5000,
        disableOnInteraction: false,
    },
    speed: 1000,
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    on: {
        slideChangeTransitionStart: function () {
            const activeSlide = this.slides[this.activeIndex];
            const elements = activeSlide.querySelectorAll('.slide-content > *');

            elements.forEach((element, index) => {
                element.style.animation = 'none';
                element.offsetHeight; // Trigger reflow
                element.style.animation = `fadeInUp 1s ease ${index * 0.2}s`;
            });
        }
    }
});

// Header scroll effect
const header = document.querySelector('header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
});

// Mobile Menu Toggle
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const mainMenu = document.querySelector('.main-menu');

mobileMenuBtn.addEventListener('click', () => {
    mainMenu.classList.toggle('active');
    mobileMenuBtn.querySelector('i').classList.toggle('fa-bars');
    mobileMenuBtn.querySelector('i').classList.toggle('fa-times');
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!mainMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
        mainMenu.classList.remove('active');
        mobileMenuBtn.querySelector('i').classList.add('fa-bars');
        mobileMenuBtn.querySelector('i').classList.remove('fa-times');
    }
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 90;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });

            // Close mobile menu after clicking
            mainMenu.classList.remove('active');
            mobileMenuBtn.querySelector('i').classList.add('fa-bars');
            mobileMenuBtn.querySelector('i').classList.remove('fa-times');
        }
    });
});

// Scroll Progress Bar
const progressBar = document.createElement('div');
progressBar.className = 'scroll-progress';
document.body.appendChild(progressBar);

window.addEventListener('scroll', () => {
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (window.scrollY / windowHeight) * 100;
    progressBar.style.width = `${scrolled}%`;
});

// Intersection Observer for fade-in animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements for fade-in animation
document.querySelectorAll('.department-card, .news-card, .stat-card, .gallery-item, .section-header').forEach(el => {
    el.classList.add('fade-out');
    observer.observe(el);
});

// Form Validation
const contactForm = document.querySelector('.contact-form form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Basic form validation
        const formData = new FormData(contactForm);
        let isValid = true;
        let firstInvalidInput = null;

        for (let [key, value] of formData.entries()) {
            const input = contactForm.querySelector(`[name="${key}"]`);
            if (!value.trim()) {
                isValid = false;
                if (input) {
                    input.classList.add('error');
                    if (!firstInvalidInput) {
                        firstInvalidInput = input;
                    }
                }
            }
        }

        if (isValid) {
            // Show loading state
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalText = submitButton.innerHTML;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الإرسال...';
            submitButton.disabled = true;

            // Simulate form submission (replace with actual form submission)
            setTimeout(() => {
                submitButton.innerHTML = '<i class="fas fa-check"></i> تم الإرسال بنجاح!';
                contactForm.reset();

                // Reset button after 2 seconds
                setTimeout(() => {
                    submitButton.innerHTML = originalText;
                    submitButton.disabled = false;
                }, 2000);
            }, 1500);
        } else {
            // Focus first invalid input
            if (firstInvalidInput) {
                firstInvalidInput.focus();
            }
            alert('يرجى ملء جميع الحقول المطلوبة');
        }
    });

    // Remove error class on input
    contactForm.querySelectorAll('input, textarea').forEach(input => {
        input.addEventListener('input', () => {
            input.classList.remove('error');
        });
    });
}

// Gallery Image Preview
const galleryItems = document.querySelectorAll('.gallery-item');
galleryItems.forEach(item => {
    item.addEventListener('click', () => {
        const imgSrc = item.querySelector('img').src;
        const preview = document.createElement('div');
        preview.className = 'gallery-preview';
        preview.innerHTML = `
            <div class="preview-content">
                <img src="${imgSrc}" alt="Preview">
                <button class="close-preview" aria-label="إغلاق">&times;</button>
            </div>
        `;
        document.body.appendChild(preview);
        document.body.style.overflow = 'hidden';

        // Close preview on click or escape key
        const closePreview = (e) => {
            if (e.target === preview || e.target.className === 'close-preview' || e.key === 'Escape') {
                preview.remove();
                document.body.style.overflow = '';
                document.removeEventListener('keydown', closePreview);
            }
        };

        preview.addEventListener('click', closePreview);
        document.addEventListener('keydown', closePreview);
    });
});

// Add active state to navigation links based on scroll position
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.main-menu a');

const updateActiveLink = () => {
    let current = '';
    const headerOffset = 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= (sectionTop - headerOffset)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
};

window.addEventListener('scroll', updateActiveLink);
window.addEventListener('load', updateActiveLink);

// Add CSS for gallery preview and animations
const style = document.createElement('style');
style.textContent = `
    .gallery-preview {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        animation: fadeIn 0.3s ease;
    }
    
    .preview-content {
        position: relative;
        max-width: 90%;
        max-height: 90%;
        animation: zoomIn 0.3s ease;
    }
    
    .preview-content img {
        max-width: 100%;
        max-height: 90vh;
        object-fit: contain;
        border-radius: 4px;
    }
    
    .close-preview {
        position: absolute;
        top: -40px;
        right: 0;
        background: none;
        border: none;
        color: white;
        font-size: 2rem;
        cursor: pointer;
        transition: transform 0.3s ease;
    }
    
    .close-preview:hover {
        transform: scale(1.1);
    }
    
    .fade-out {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.6s ease-out, transform 0.6s ease-out;
    }
    
    .fade-in {
        opacity: 1;
        transform: translateY(0);
    }
    
    .error {
        border-color: #ff4444 !important;
        animation: shake 0.5s ease;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes zoomIn {
        from { transform: scale(0.9); }
        to { transform: scale(1); }
    }
    
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
`;
document.head.appendChild(style);

// Department cards hover effect
document.querySelectorAll('.department-card').forEach(card => {
    card.addEventListener('mouseenter', function () {
        this.style.transform = 'translateY(-10px)';
    });

    card.addEventListener('mouseleave', function () {
        this.style.transform = 'translateY(0)';
    });
});

// Fade-in effect for About Faculty section
const aboutSection = document.querySelector('.about-faculty');
if (aboutSection) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                aboutSection.classList.add('visible');
                observer.unobserve(aboutSection);
            }
        });
    }, { threshold: 0.2 });
    observer.observe(aboutSection);
}

// Fade-in effect for Contact section
const contactSection = document.querySelector('.contact');
if (contactSection) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                contactSection.classList.add('visible');
                observer.unobserve(contactSection);
            }
        });
    }, { threshold: 0.15 });
    observer.observe(contactSection);
} 