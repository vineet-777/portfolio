/* 
========================================================================
*  Portfolio Website Logic
*  Designed & Developed by: Vineet Gawali
*  Copyright (c) 2025 Vineet Gawali. All Rights Reserved.
========================================================================
*/

console.log(
    "%c Developed by Vineet Gawali ",
    "background: #3b82f6; color: white; padding: 10px; border-radius: 5px; font-weight: bold; font-size: 14px;"
);

// Initialize AOS (Entrance Animations)
AOS.init({
    duration: 800,
    easing: 'ease-out',
    once: true, // Animations happen only once
    offset: 50
});

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

// Initialize Swiper for Certifications
const initSwiper = () => {
    new Swiper(".mySwiper", {
        effect: "coverflow",
        grabCursor: true,
        centeredSlides: true,
        slidesPerView: "auto", // automatic width based on CSS
        loop: true, // Enable infinite loop
        loop: true, // Enable infinite loop
        loopedSlides: 6, // Adjusted buffer for stability
        observer: true,
        observeParents: true,
        coverflowEffect: {
            rotate: 0, // No rotation for cleaner look
            stretch: 0,
            depth: 200, // Increased depth for better 3D perception
            modifier: 2.5,
            slideShadows: false, // Disable shadows for glassmorphism cleanliness
        },
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
        },
        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
        },
    });
};

document.addEventListener('DOMContentLoaded', () => {
    initSwiper();
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
    card.addEventListener('mouseenter', function () {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });

    card.addEventListener('mouseleave', function () {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Enhanced social links hover effects
document.querySelectorAll('.social-link').forEach(link => {
    link.addEventListener('mouseenter', function () {
        this.style.transform = 'translateY(-5px) scale(1.1) rotate(5deg)';
    });

    link.addEventListener('mouseleave', function () {
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
    return function () {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
};

// Terminal Typewriter Effect
const typeTerminal = () => {
    const text = "initiate_project_view_protocol.exe";
    const speed = 50;
    const element = document.getElementById("typewriter-text");
    const actionDiv = document.querySelector(".terminal-action");
    let i = 0;

    if (!element) return;

    function typeWriter() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(typeWriter, speed);
        } else {
            // Animation complete
            setTimeout(() => {
                actionDiv.classList.remove("hidden");
            }, 500);
        }
    }

    // Trigger animation when terminal is visible
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Only run once
                if (element.innerHTML === "") {
                    setTimeout(typeWriter, 500);
                }
            }
        });
    }, { threshold: 0.5 });

    observer.observe(document.querySelector(".terminal-section"));
};



// Holographic 3D Tilt Effect
const initHolographicTilt = () => {
    const cards = document.querySelectorAll(".project-card");

    cards.forEach(card => {
        // Disable transition on enter for instant tracking
        card.addEventListener("mouseenter", () => {
            card.style.transition = "none";
        });

        card.addEventListener("mousemove", (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            // Calculate rotation (max -15 to +15 deg)
            const rotateX = ((y - centerY) / centerY) * -15;
            const rotateY = ((x - centerX) / centerX) * 15;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
        });

        card.addEventListener("mouseleave", () => {
            // Restore transition for smooth reset
            card.style.transition = "transform 0.5s ease";
            card.style.transform = "perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)";
        });
    });
};

// Universal Details Modal (Certs + Planets)
const initCertModal = () => {
    const modal = document.getElementById("certModal");
    const closeBtn = document.querySelector(".close-modal");
    const modalImg = document.getElementById("modalImg");
    const modalTitle = document.getElementById("modalTitle");
    const modalDesc = document.getElementById("modalDesc");
    const slides = document.querySelectorAll(".swiper-slide");
    const planets = document.querySelectorAll(".orbit-planet");

    if (!modal) return;

    const openModal = (imgSrc, titleText, descText) => {
        modalImg.src = imgSrc;
        modalTitle.innerText = titleText;
        modalDesc.innerText = descText;
        modal.classList.add("active");
    };

    // Certifications Click
    slides.forEach(slide => {
        slide.addEventListener("click", () => {
            const img = slide.querySelector("img").src;
            const title = slide.querySelector(".cert-title").innerText;
            const desc = slide.querySelector(".cert-description").innerText;
            openModal(img, title, desc);
        });
    });

    // Orbit Planets Click
    planets.forEach(planet => {
        planet.addEventListener("click", () => {
            const img = planet.dataset.img;
            const title = planet.dataset.title;
            const desc = planet.dataset.desc;

            if (img && title && desc) {
                openModal(img, title, desc);
            }
        });
    });

    // Close Logic
    const closeModal = () => {
        modal.classList.remove("active");
    };

    closeBtn.addEventListener("click", closeModal);

    window.addEventListener("click", (e) => {
        if (e.target === modal) closeModal();
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modal.classList.contains("active")) closeModal();
    });
};

document.addEventListener("DOMContentLoaded", () => {
    typeTerminal();
    initHolographicTilt();
    initCertModal();
});