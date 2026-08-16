/* 
========================================================================
*  Portfolio Website Logic
*  Copyright (c) 2026 Vineet Gawali. All Rights Reserved.
========================================================================
*/

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initNav();
    initSmoothScroll();
    initScrollReveal();
    initProjectFilter();
    initForm();
    initGenerativeCanvas();
    initChatWidget();
});

/* --- Theme Toggle --- */
function initTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const html = document.documentElement;
    const sunIcon = document.querySelector('.sun-icon');
    const moonIcon = document.querySelector('.moon-icon');

    // Check saved theme or system preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark') {
        setTheme('dark');
    } else {
        setTheme('light');
    }

    themeToggle.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-theme');
        setTheme(currentTheme === 'dark' ? 'light' : 'dark');
    });

    function setTheme(theme) {
        html.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);

        if (theme === 'dark') {
            sunIcon.style.display = 'block';
            moonIcon.style.display = 'none';
        } else {
            sunIcon.style.display = 'none';
            moonIcon.style.display = 'block';
        }

        // Dispatch event for canvas to update colors
        window.dispatchEvent(new Event('themeChanged'));
    }
}

/* --- Navigation & Mobile Menu --- */
function initNav() {
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');

        // Toggle mobile styling elements
        const mobileOnly = document.querySelectorAll('.mobile-only');
        mobileOnly.forEach(el => {
            el.style.display = navMenu.classList.contains('active') ? 'block' : 'none';
        });
    });

    // Smooth scroll for anchor links
    const allNavLinks = document.querySelectorAll('.nav-link, .nav-brand');
    allNavLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            if (!targetId || !targetId.startsWith('#')) return;

            e.preventDefault();
            const target = document.querySelector(targetId);
            if (!target) return;

            try {
                const navbarHeight = navbar.getBoundingClientRect().height;
                const rect = target.getBoundingClientRect();
                const currentScrollY = window.getSmoothScrollY ? window.getSmoothScrollY() : window.scrollY;
                const targetPosition = currentScrollY + rect.top - navbarHeight;

                if (window.smoothScrollAPI) {
                    window.smoothScrollAPI.scrollTo(targetPosition);
                } else {
                    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
                    if (prefersReducedMotion) {
                        window.scrollTo(0, targetPosition);
                    } else {
                        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
                    }
                }
            } catch (err) {
                console.warn('Smooth scroll fallback:', err);
                window.location.href = targetId;
            }

            // Close mobile menu
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            const mobileOnly = document.querySelectorAll('.mobile-only');
            mobileOnly.forEach(el => {
                el.style.display = 'none';
            });
        });
    });
}

/* --- Smooth Scroll --- */
function initSmoothScroll() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const wrapper = document.getElementById('smooth-scroll-wrapper');
    const navbar = document.getElementById('navbar');
    if (!wrapper || !navbar) return;

    let target = 0;
    let current = 0;
    let rafId = null;
    const ease = 0.08;

    function getMaxScroll() {
        return wrapper.scrollHeight - window.innerHeight;
    }

    function animate() {
        if (prefersReducedMotion) {
            current = target;
            wrapper.style.transform = `translate3d(0, ${-current}px, 0)`;
            rafId = null;
            return;
        }

        current += (target - current) * ease;

        if (Math.abs(target - current) < 0.5) {
            current = target;
            wrapper.style.transform = `translate3d(0, ${-current}px, 0)`;
            rafId = null;
            return;
        }

        wrapper.style.transform = `translate3d(0, ${-current}px, 0)`;

        // Update navbar state
        if (current > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Update active nav link
        updateActiveLinkFromPosition(current);

        rafId = requestAnimationFrame(animate);
    }

    function startAnimation() {
        if (!rafId) {
            rafId = requestAnimationFrame(animate);
        }
    }

    function scrollToPosition(position) {
        target = Math.max(0, Math.min(position, getMaxScroll()));
        if (prefersReducedMotion) {
            current = target;
            wrapper.style.transform = `translate3d(0, ${-current}px, 0)`;
        } else {
            startAnimation();
        }
    }

    // Expose API globally
    window.smoothScrollAPI = {
        scrollTo: scrollToPosition,
        getScrollY: () => current
    };
    window.getSmoothScrollY = () => current;

    // Wheel event
    if (!prefersReducedMotion) {
        window.addEventListener('wheel', (e) => {
            e.preventDefault();
            target += e.deltaY;
            target = Math.max(0, Math.min(target, getMaxScroll()));
            startAnimation();
        }, { passive: false });
    }

    // Touch support
    let touchStartY = 0;
    let touchLastY = 0;

    window.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
        touchLastY = touchStartY;
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
        if (prefersReducedMotion) return;
        const touchY = e.touches[0].clientY;
        const deltaY = touchLastY - touchY;
        touchLastY = touchY;
        target += deltaY;
        target = Math.max(0, Math.min(target, getMaxScroll()));
        startAnimation();
    }, { passive: true });

    // Keyboard navigation
    window.addEventListener('keydown', (e) => {
        const key = e.key;
        let delta = 0;

        if (key === 'ArrowDown' || key === 'ArrowRight') {
            delta = 100;
        } else if (key === 'ArrowUp' || key === 'ArrowLeft') {
            delta = -100;
        } else if (key === ' ' || key === 'PageDown') {
            delta = window.innerHeight;
            e.preventDefault();
        } else if (key === 'PageUp') {
            delta = -window.innerHeight;
        } else if (key === 'Home') {
            scrollToPosition(0);
            return;
        } else if (key === 'End') {
            scrollToPosition(getMaxScroll());
            return;
        }

        if (delta !== 0) {
            scrollToPosition(target + delta);
        }
    });

    // Handle resize
    window.addEventListener('resize', () => {
        target = Math.max(0, Math.min(target, getMaxScroll()));
        current = target;
        wrapper.style.transform = `translate3d(0, ${-current}px, 0)`;
        updateActiveLinkFromPosition(current);
    });

    // Initial hash scroll
    const hash = window.location.hash;
    if (hash) {
        const targetEl = document.querySelector(hash);
        if (targetEl) {
            const navbarHeight = navbar.getBoundingClientRect().height;
            const rect = targetEl.getBoundingClientRect();
            const position = rect.top + current - navbarHeight;
            target = Math.max(0, Math.min(position, getMaxScroll()));
            current = target;
            wrapper.style.transform = `translate3d(0, ${-current}px, 0)`;
        }
    }
}

function updateActiveLinkFromPosition(scrollY) {
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');
    const navbarHeight = navbar.getBoundingClientRect().height;

    let current = '';
    sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= navbarHeight && rect.bottom > navbarHeight) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

/* --- Scroll Reveal & Skill Bars --- */
function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');
    const skillBars = document.querySelectorAll('.skill-bar-fill');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');

                // If it's a skill bar container, animate the bars inside
                if (entry.target.classList.contains('skill-category')) {
                    const bars = entry.target.querySelectorAll('.skill-bar-fill');
                    bars.forEach(bar => {
                        const width = bar.getAttribute('data-width');
                        bar.style.transform = `scaleX(${parseInt(width) / 100})`;
                    });
                }
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    reveals.forEach(reveal => observer.observe(reveal));

    // Initialize skill bars to 0
    skillBars.forEach(bar => {
        bar.style.transform = 'scaleX(0)';
    });
}

/* --- Project Filtering --- */
function initProjectFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projects = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            projects.forEach(project => {
                // First fade out
                project.style.opacity = '0';
                project.style.transform = 'scale(0.95)';

                setTimeout(() => {
                    const categories = project.getAttribute('data-category').split(' ');

                    if (filter === 'all' || categories.includes(filter)) {
                        project.style.display = 'flex';
                        // Small delay before fade in to allow display:flex to apply
                        setTimeout(() => {
                            project.style.opacity = '1';
                            project.style.transform = 'scale(1)';
                        }, 50);
                    } else {
                        project.style.display = 'none';
                    }
                }, 300); // Wait for fade out transition
            });
        });
    });
}

/* --- Contact Form (Input CTA + Formspree AJAX) --- */
function initForm() {
    const stage1 = document.getElementById('contact-stage-1');
    const ctaInput = document.getElementById('contact-cta-input');
    const ctaSend = document.getElementById('contact-cta-send');
    const formWrapper = document.getElementById('contact-form-wrapper');
    const form = document.getElementById('contact-form');
    const messageInput = document.getElementById('message');
    const backButton = document.getElementById('contact-back-btn');
    const status = document.getElementById('form-status');

    if (!stage1 || !ctaInput || !ctaSend || !formWrapper || !form || !messageInput || !backButton || !status) {
        return;
    }

    function updateCtaButton() {
        ctaSend.classList.toggle('contact-send-btn-hidden', !ctaInput.value.trim());
    }

    function showForm() {
        if (!ctaInput.value.trim()) return;

        stage1.classList.add('hidden');
        formWrapper.classList.add('active');
        messageInput.value = ctaInput.value;
        requestAnimationFrame(() => messageInput.focus());
    }

    function showCta(message = '') {
        formWrapper.classList.remove('active');
        ctaInput.value = message;
        updateCtaButton();
        stage1.classList.remove('hidden');
    }

    ctaInput.addEventListener('input', updateCtaButton);
    ctaInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            showForm();
        }
    });
    ctaSend.addEventListener('click', showForm);
    backButton.addEventListener('click', () => showCta(messageInput.value));

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        status.textContent = 'Sending...';
        status.className = 'form-status';
        status.style.opacity = '1';

        try {
            const response = await fetch(form.action, {
                method: form.method,
                body: new FormData(form),
                headers: { Accept: 'application/json' }
            });

            if (!response.ok) {
                throw new Error('Submission failed');
            }

            status.textContent = "Thanks! I'll get back to you personally by email.";
            status.className = 'form-status success';
            form.reset();
            setTimeout(() => showCta(), 1800);
        } catch (error) {
            status.textContent = 'Oops! There was a problem submitting your form.';
            status.className = 'form-status error';
        }
    });

    updateCtaButton();
}

/* --- Generative Canvas (Synaptic Flow) --- */
function initGenerativeCanvas() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;

    // Respect reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
    }

    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    let animationId;

    // Theme colors
    let config = {
        bg: '#0a0e17',
        particleCount: window.innerWidth < 768 ? 60 : 120,
        colors: ['#6ee7b7', '#38bdf8', '#059669']
    };

    function updateColors() {
        const theme = document.documentElement.getAttribute('data-theme');
        if (theme === 'dark') {
            config.bg = '#0a0e17';
            config.colors = ['rgba(110, 231, 183, 0.4)', 'rgba(56, 189, 248, 0.4)'];
        } else {
            config.bg = '#f8f9fc';
            config.colors = ['rgba(5, 150, 105, 0.3)', 'rgba(2, 132, 199, 0.3)'];
        }
    }

    window.addEventListener('themeChanged', updateColors);
    updateColors();

    // Mouse interaction
    let mouse = { x: -1000, y: -1000, radius: 150 };

    window.addEventListener('mousemove', (e) => {
        // Only track if in top portion of screen
        if (e.clientY < window.innerHeight) {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        } else {
            mouse.x = -1000;
        }
    });

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        initParticles();
    }

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 1;
            this.vy = (Math.random() - 0.5) * 1;
            this.baseX = this.x;
            this.baseY = this.y;
            this.size = Math.random() * 2 + 1;
            this.color = config.colors[Math.floor(Math.random() * config.colors.length)];
            this.density = (Math.random() * 30) + 1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        }

        update() {
            // Flow movement
            this.x += this.vx;
            this.y += this.vy;

            // Boundary wrap
            if (this.x < 0) this.x = width;
            if (this.x > width) this.x = 0;
            if (this.y < 0) this.y = height;
            if (this.y > height) this.y = 0;

            // Mouse interaction
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < mouse.radius) {
                // Repel
                let forceDirectionX = dx / distance;
                let forceDirectionY = dy / distance;
                let force = (mouse.radius - distance) / mouse.radius;

                let directionX = forceDirectionX * force * this.density * 0.05;
                let directionY = forceDirectionY * force * this.density * 0.05;

                this.x -= directionX;
                this.y -= directionY;
            }
        }
    }

    function initParticles() {
        particles = [];
        for (let i = 0; i < config.particleCount; i++) {
            particles.push(new Particle());
        }
    }

    function drawConnections() {
        for (let a = 0; a < particles.length; a++) {
            for (let b = a; b < particles.length; b++) {
                let dx = particles[a].x - particles[b].x;
                let dy = particles[a].y - particles[b].y;
                let distance = dx * dx + dy * dy;

                if (distance < 12000) {
                    let opacity = 1 - (distance / 12000);
                    ctx.beginPath();
                    const theme = document.documentElement.getAttribute('data-theme');
                    if (theme === 'dark') {
                        ctx.strokeStyle = `rgba(110, 231, 183, ${opacity * 0.15})`;
                    } else {
                        ctx.strokeStyle = `rgba(5, 150, 105, ${opacity * 0.15})`;
                    }
                    ctx.lineWidth = 1;
                    ctx.moveTo(particles[a].x, particles[a].y);
                    ctx.lineTo(particles[b].x, particles[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        animationId = requestAnimationFrame(animate);

        const scrollY = window.getSmoothScrollY ? window.getSmoothScrollY() : window.scrollY;

        // Stop animation if hero is out of view
        if (scrollY > height) return;

        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
        }
        drawConnections();
    }

    window.addEventListener('resize', () => {
        clearTimeout(window.resizeTimer);
        window.resizeTimer = setTimeout(resize, 200);
    });

    resize();
    animate();
}

/* --- AI Chat Widget --- */
function initChatWidget() {
    const chatToggle = document.getElementById('chat-toggle');
    const chatClose = document.getElementById('chat-close');
    const chatPanel = document.getElementById('chat-panel');
    const chatLauncher = document.getElementById('open-ai-assistant');
    const chatInput = document.getElementById('chat-input');
    const chatSend = document.getElementById('chat-send');
    const chatMessages = document.getElementById('chat-messages');

    if (!chatToggle || !chatPanel) return;

    function setChatOpen(isOpen) {
        chatPanel.classList.toggle('active', isOpen);
        chatToggle.setAttribute('aria-expanded', String(isOpen));
        if (chatLauncher) chatLauncher.setAttribute('aria-expanded', String(isOpen));

        if (isOpen) {
            chatInput.focus();
        }
    }

    // Toggle panel from the floating assistant button.
    chatToggle.addEventListener('click', () => {
        setChatOpen(!chatPanel.classList.contains('active'));
    });

    chatClose.addEventListener('click', () => {
        setChatOpen(false);
    });

    // Open the assistant directly from the hero call-to-action.
    chatLauncher?.addEventListener('click', () => setChatOpen(true));

    // Send message on click
    chatSend.addEventListener('click', handleSendMessage);

    // Send message on Enter
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    });

    async function handleSendMessage() {
        const message = chatInput.value.trim();
        if (!message) return;

        // 1. Add user message to UI
        appendMessage(message, 'user-message');
        chatInput.value = '';

        // 2. Disable input and button
        setChatState(false);

        // 3. Show typing indicator
        const typingId = showTypingIndicator();

        try {
            // 4. Send to Worker
            const response = await fetch('https://worker-plain-union-782d.vineetgavali24.workers.dev', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message: message })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();

            // Extract reply
            const reply = data?.reply || data?.error || "I'm sorry, I couldn't process that response.";

            // 5. Remove typing indicator & show reply
            removeMessage(typingId);
            appendMessage(reply, 'system-message');

        } catch (error) {
            console.error('Chat error:', error);
            removeMessage(typingId);
            appendMessage("Sorry, I'm having trouble connecting right now. Please try again later.", 'system-message');
        } finally {
            // 6. Re-enable input
            setChatState(true);
            chatInput.focus();
        }
    }

    function appendMessage(text, className, id = null) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${className}`;

        if (className === 'system-message') {
            // Assistant replies may contain Markdown — parse then sanitize before inserting
            const rawHtml = marked.parse(text);
            msgDiv.innerHTML = DOMPurify.sanitize(rawHtml);
        } else {
            // User messages: always plain text, never parsed as HTML/Markdown
            msgDiv.textContent = text;
        }

        if (id) msgDiv.id = id;

        chatMessages.appendChild(msgDiv);
        scrollToBottom();
        return msgDiv;
    }

    function showTypingIndicator() {
        const id = 'typing-' + Date.now();
        const msgDiv = document.createElement('div');
        msgDiv.className = 'message system-message';
        msgDiv.id = id;

        msgDiv.innerHTML = `
            <div class="typing-indicator">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
        `;

        chatMessages.appendChild(msgDiv);
        scrollToBottom();
        return id;
    }

    function removeMessage(id) {
        const el = document.getElementById(id);
        if (el) el.remove();
    }

    function scrollToBottom() {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function setChatState(enabled) {
        chatInput.disabled = !enabled;
        chatSend.disabled = !enabled;
    }
}
