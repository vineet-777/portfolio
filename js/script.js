// Smooth scrolling for navigation links
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

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile menu toggle
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Certifications slider
class CertificationSlider {
    constructor() {
        this.slider = document.querySelector('.slider-container');
        this.slides = document.querySelectorAll('.certification-card');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.currentIndex = 0;
        this.slideWidth = 370; // 350px + 20px gap
        this.slidesPerView = this.getSlidesPerView();
        
        this.init();
    }

    init() {
        this.updateSlider();
        this.prevBtn.addEventListener('click', () => this.prevSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());
        
        // Auto-play
        this.startAutoPlay();
        
        // Pause auto-play on hover
        this.slider.addEventListener('mouseenter', () => this.stopAutoPlay());
        this.slider.addEventListener('mouseleave', () => this.startAutoPlay());
        
        // Handle window resize
        window.addEventListener('resize', () => {
            this.slidesPerView = this.getSlidesPerView();
            this.updateSlider();
        });
    }

    getSlidesPerView() {
        const containerWidth = this.slider.parentElement.offsetWidth;
        return Math.floor(containerWidth / this.slideWidth);
    }

    updateSlider() {
        const translateX = -this.currentIndex * this.slideWidth;
        this.slider.style.transform = `translateX(${translateX}px)`;
    }

    nextSlide() {
        const maxIndex = this.slides.length - this.slidesPerView;
        this.currentIndex = this.currentIndex >= maxIndex ? 0 : this.currentIndex + 1;
        this.updateSlider();
    }

    prevSlide() {
        const maxIndex = this.slides.length - this.slidesPerView;
        this.currentIndex = this.currentIndex <= 0 ? maxIndex : this.currentIndex - 1;
        this.updateSlider();
    }

    startAutoPlay() {
        this.autoPlayInterval = setInterval(() => {
            this.nextSlide();
        }, 4000);
    }

    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
        }
    }
}

// Initialize slider when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CertificationSlider();
});

// Simple AOS (Animate On Scroll) implementation
class SimpleAOS {
    constructor() {
        this.elements = document.querySelectorAll('[data-aos]');
        this.init();
    }

    init() {
        this.observe();
        window.addEventListener('scroll', () => this.handleScroll());
        // Initial check
        this.handleScroll();
    }

    observe() {
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.animateElement(entry.target);
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });

            this.elements.forEach(el => observer.observe(el));
        } else {
            // Fallback for older browsers
            this.handleScroll();
        }
    }

    handleScroll() {
        this.elements.forEach(el => {
            if (this.isElementInViewport(el)) {
                this.animateElement(el);
            }
        });
    }

    isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    animateElement(el) {
        const delay = el.getAttribute('data-aos-delay') || 0;
        setTimeout(() => {
            el.classList.add('aos-animate');
        }, delay);
    }
}

// Initialize AOS
document.addEventListener('DOMContentLoaded', () => {
    new SimpleAOS();
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroContent = document.querySelector('.hero-content');
    const heroVideo = document.querySelector('.hero-video');
    
    if (heroContent && heroVideo) {
        const rate = scrolled * -0.5;
        heroContent.style.transform = `translateY(${rate}px)`;
        heroVideo.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
});

// Smooth reveal animations for stats
const animateStats = () => {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    statNumbers.forEach(stat => {
        const finalValue = stat.textContent;
        const isNumber = !isNaN(parseInt(finalValue));
        
        if (isNumber) {
            const finalNum = parseInt(finalValue);
            let currentNum = 0;
            const increment = finalNum / 50;
            
            const timer = setInterval(() => {
                currentNum += increment;
                if (currentNum >= finalNum) {
                    stat.textContent = finalValue;
                    clearInterval(timer);
                } else {
                    stat.textContent = Math.floor(currentNum);
                }
            }, 30);
        }
    });
};

// Trigger stats animation when section is visible
const statsSection = document.querySelector('.stats');
if (statsSection) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStats();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    observer.observe(statsSection);
}

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Preload critical images
const preloadImages = () => {
    const images = [
        'assets/images/python-logo-notext.svg-1-800x800.webp',
        'assets/images/tic-tac-toe.svg-1-815x724.webp',
        'assets/images/my20learning20-20nvidia-1-480x621.webp'
    ];
    
    images.forEach(src => {
        const img = new Image();
        img.src = src;
    });
};

preloadImages();

// Enhanced scroll indicator
const updateScrollIndicator = () => {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        const scrolled = window.pageYOffset;
        const opacity = Math.max(0, 1 - scrolled / 300);
        scrollIndicator.style.opacity = opacity;
    }
};

window.addEventListener('scroll', updateScrollIndicator);

// Add smooth transitions for project cards
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Enhanced social links hover effects
document.querySelectorAll('.social-link').forEach(link => {
    link.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px) scale(1.1) rotate(5deg)';
    });
    
    link.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1) rotate(0deg)';
    });
});

// Keyboard navigation support
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

// Performance optimization: Throttle scroll events
const throttle = (func, limit) => {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
};

// Apply throttling to scroll events
window.addEventListener('scroll', throttle(() => {
    updateScrollIndicator();
}, 16)); // ~60fps