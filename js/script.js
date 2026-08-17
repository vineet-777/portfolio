/* 
========================================================================
*  Portfolio Website Logic
*  Copyright (c) 2026 Vineet Gawali. All Rights Reserved.
========================================================================
*/

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initNav();
    initScrollReveal();
    initProjectFilter();
    initForm();
    initGenerativeCanvas();
    initPeekingBot();
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
    const sections = document.querySelectorAll('section');

    // Scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        updateActiveLink();
    });

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

    // Close mobile menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Update active nav link based on scroll position
    function updateActiveLink() {
        let current = '';
        const scrollY = window.scrollY;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
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
    const grid = document.querySelector('.projects-grid');

    function updateGridCount() {
        if (!grid) return;
        const visible = Array.from(projects).filter(p => p.style.display !== 'none').length;
        grid.dataset.count = visible || 1;
    }

    // Initial count
    updateGridCount();

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            projects.forEach(project => {
                project.style.opacity = '0';
                project.style.transform = 'scale(0.95)';

                setTimeout(() => {
                    const categories = project.getAttribute('data-category').split(' ');

                    if (filter === 'all' || categories.includes(filter)) {
                        project.style.display = 'flex';
                        setTimeout(() => {
                            project.style.opacity = '1';
                            project.style.transform = 'scale(1)';
                        }, 50);
                    } else {
                        project.style.display = 'none';
                    }
                    updateGridCount();
                }, 300);
            });
        });
    });
}

/* --- Contact Form (Input CTA + Formspree AJAX) --- */
function initForm() {
    const stage1 = document.getElementById('contact-stage-1');
    const ctaInput = document.getElementById('contact-cta-input');
    const ctaSend = document.getElementById('contact-cta-send');
    const ctaClick = document.getElementById('contact-cta-click-btn');
    const formWrapper = document.getElementById('contact-form-wrapper');
    const form = document.getElementById('contact-form');
    const messageInput = document.getElementById('message');
    const backButton = document.getElementById('contact-back-btn');
    const status = document.getElementById('form-status');

    if (!stage1 || !ctaInput || !ctaSend || !ctaClick || !formWrapper || !form || !messageInput || !backButton || !status) {
        return;
    }

    function updateCtaButton() {
        const hasInput = !!ctaInput.value.trim();
        ctaSend.classList.toggle('contact-send-btn-hidden', !hasInput);
        ctaClick.classList.toggle('contact-cta-click-btn-hidden', hasInput);
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

        // Stop animation if hero is out of view
        if (window.scrollY > height) return;

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

/* --- Peeking Bot --- */
function initPeekingBot() {
    const bot = document.getElementById('peeking-bot');
    const botImage = document.getElementById('peeking-bot-image');
    const chatClose = document.getElementById('chat-close');
    const chatPanel = document.getElementById('chat-panel');
    const chatLauncher = document.getElementById('open-ai-assistant');
    const chatInput = document.getElementById('chat-input');
    const chatSend = document.getElementById('chat-send');
    const chatMessages = document.getElementById('chat-messages');

    if (!bot || !chatPanel) return;

    // Rate-limit countdown state (survives panel open/close)
    let rateLimitCountdownInterval = null;
    let originalPlaceholder = chatInput?.placeholder ?? 'Ask a question...';

    function clearRateLimitCountdown() {
        if (rateLimitCountdownInterval) {
            clearInterval(rateLimitCountdownInterval);
            rateLimitCountdownInterval = null;
        }
    }

    function startRateLimitCountdown(seconds) {
        clearRateLimitCountdown();
        
        if (!chatInput) return;
        
        originalPlaceholder = chatInput.placeholder;
        setChatState(false);
        
        const updatePlaceholder = () => {
            if (seconds <= 0) {
                clearRateLimitCountdown();
                setChatState(true);
                chatInput.placeholder = originalPlaceholder;
                chatInput.focus();
                return;
            }
            const mins = Math.floor(seconds / 60);
            const secs = seconds % 60;
            const timeStr = mins > 0 ? `${mins}:${secs.toString().padStart(2, '0')}` : `0:${secs.toString().padStart(2, '0')}`;
            chatInput.placeholder = `You can send another message in ${timeStr}...`;
            seconds--;
        };
        
        updatePlaceholder(); // immediate first render
        rateLimitCountdownInterval = setInterval(updatePlaceholder, 1000);
    }

    function openChat() {
        chatPanel.classList.add('active');
        bot.classList.add('hidden-by-chat');
        document.body.classList.add('chat-open');
        if (chatLauncher) chatLauncher.setAttribute('aria-expanded', 'true');
        if (chatInput) setTimeout(() => chatInput.focus(), 100);
    }

    function closeChat() {
        chatPanel.classList.remove('active');
        bot.classList.remove('hidden-by-chat');
        document.body.classList.remove('chat-open');
        if (chatLauncher) chatLauncher.setAttribute('aria-expanded', 'false');
    }

    botImage.addEventListener('click', openChat);

    botImage.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openChat();
        }
    });

    if (chatClose) {
        chatClose.addEventListener('click', closeChat);
    }

    if (chatLauncher) {
        chatLauncher.addEventListener('click', openChat);
    }

    // Send message on click
    if (chatSend) {
        chatSend.addEventListener('click', handleSendMessage);
    }

    // Send message on Enter
    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleSendMessage();
            }
        });
    }

    // Entrance animation
    setTimeout(() => {
        bot.classList.add('visible');
    }, 600);

    /** Safely parse JSON, returning null on failure. */
    async function safeJsonParse(response) {
        try { return await response.json(); } catch { return null; }
    }

    /** Parse Retry-After header (seconds or HTTP-date) and return human-readable suffix. */
    function parseRetryAfter(header) {
        if (!header) return null;
        const seconds = Number(header);
        if (!Number.isNaN(seconds) && seconds > 0) return seconds;
        const date = new Date(header);
        if (!Number.isNaN(date.valueOf())) {
            const diff = Math.ceil((date - Date.now()) / 1000);
            return diff > 0 ? diff : null;
        }
        return null;
    }

    /** Format seconds into human-readable duration string. */
    function formatDuration(seconds) {
        if (seconds < 60) return `${seconds} second${seconds === 1 ? '' : 's'}`;
        const minutes = Math.ceil(seconds / 60);
        return `${minutes} minute${minutes === 1 ? '' : 's'}`;
    }

    /** Build user-friendly message with optional retry hint. */
    function enhanceWithRetryAfter(baseMsg, retryAfterHeader) {
        const seconds = parseRetryAfter(retryAfterHeader);
        if (seconds) return `${baseMsg} (try again in about ${formatDuration(seconds)})`;
        return baseMsg;
    }

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

        let isRateLimited = false;

        try {
            // 4. Send to Worker
            const response = await fetch('https://worker-plain-union-782d.vineetgavali24.workers.dev', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message })
            });

            if (response.status === 429) {
                isRateLimited = true;
                const errorData = await safeJsonParse(response);
                const baseMsg = errorData?.error ?? 'Too many requests. Please slow down and try again shortly.';
                const retryAfterHeader = response.headers.get('Retry-After');
                console.log('[RateLimit] Retry-After header:', retryAfterHeader);
                const seconds = parseRetryAfter(retryAfterHeader);
                console.log('[RateLimit] Parsed seconds:', seconds);
                
                let finalMsg = baseMsg;
                if (seconds) {
                    const mins = Math.floor(seconds / 60);
                    const secs = seconds % 60;
                    if (mins > 0 && secs > 0) {
                        finalMsg = `${baseMsg} (try again in ${mins} minute${mins === 1 ? '' : 's'} ${secs} second${secs === 1 ? '' : 's'})`;
                    } else if (mins > 0) {
                        finalMsg = `${baseMsg} (try again in ${mins} minute${mins === 1 ? '' : 's'})`;
                    } else {
                        finalMsg = `${baseMsg} (try again in ${secs} second${secs === 1 ? '' : 's'})`;
                    }
                } else {
                    // Fallback: show generic message but still start a reasonable countdown
                    finalMsg = `${baseMsg} (try again shortly)`;
                }
                
                removeMessage(typingId);
                appendMessage(finalMsg, 'system-message');
                
                // Start countdown with parsed seconds or default fallback (60s)
                const countdownSeconds = seconds ?? 60;
                startRateLimitCountdown(countdownSeconds);
                return;
            }

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            const reply = data?.reply ?? data?.error ?? "I'm sorry, I couldn't process that response.";
            removeMessage(typingId);
            appendMessage(reply, 'system-message');

        } catch (error) {
            console.error('Chat error:', error);
            removeMessage(typingId);
            appendMessage("Sorry, I'm having trouble connecting right now. Please try again later.", 'system-message');
        } finally {
            if (!isRateLimited) {
                setChatState(true);
                chatInput.focus();
            }
        }
    }

    function appendMessage(text, className, id = null) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${className}`;

        if (className === 'system-message') {
            // Assistant replies may contain Markdown — parse then sanitize before inserting
            const rawHtml = marked.parse(text);
            const cleanHtml = DOMPurify.sanitize(rawHtml);
            
            // Create temp container to manipulate tables
            const temp = document.createElement('div');
            temp.innerHTML = cleanHtml;
            
            // Wrap each table for containment + responsive labels
            temp.querySelectorAll('table').forEach(table => {
                // 1. Add header labels to cells for mobile card view
                const headers = Array.from(table.querySelectorAll('th')).map(th => th.textContent.trim());
                table.querySelectorAll('tbody td').forEach((td, i) => {
                    const colIndex = i % headers.length;
                    if (headers[colIndex]) td.setAttribute('data-label', headers[colIndex]);
                });
                
                // 2. Wrap in scrolling container
                const wrapper = document.createElement('div');
                wrapper.className = 'chat-table-wrapper';
                table.parentNode.insertBefore(wrapper, table);
                wrapper.appendChild(table);
            });
            
            msgDiv.innerHTML = temp.innerHTML;
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
