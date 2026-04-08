// ============================================
// MODULE 1: HOMEPAGE LOGIC (ADVANCED)
// ============================================

document.addEventListener('DOMContentLoaded', () => {

    // ===== PRELOADER =====
    const preloader = document.getElementById('preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            setTimeout(() => preloader.classList.add('hidden'), 800);
        });
        // Fallback remove after 2.5s
        setTimeout(() => preloader.classList.add('hidden'), 2500);
    }

    // ===== NAVBAR SCROLL EFFECT =====
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // ===== SMOOTH SCROLL FOR NAV LINKS =====
    document.querySelectorAll('.nav-menu a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                document.getElementById('navMenu').classList.remove('active');
            }
        });
    });

    // ===== HERO PARTICLE EFFECT =====
    const particleContainer = document.getElementById('heroParticles');
    if (particleContainer) {
        for (let i = 0; i < 40; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.setProperty('--duration', (Math.random() * 8 + 6) + 's');
            particle.style.animationDelay = Math.random() * 10 + 's';
            particle.style.width = (Math.random() * 4 + 2) + 'px';
            particle.style.height = particle.style.width;
            particle.style.opacity = Math.random() * 0.4 + 0.1;
            particleContainer.appendChild(particle);
        }
    }

    // ===== MARQUEE TICKER =====
    const marqueeContent = document.getElementById('marqueeContent');
    if (marqueeContent && APP_DATA.marqueeItems) {
        const items = APP_DATA.marqueeItems.map(item =>
            `<span><i class='bx bxs-star'></i> ${item}</span>`
        ).join('');
        // Duplicate for seamless loop
        marqueeContent.innerHTML = items + items;
    }

    // ===== RENDER WHY JOIN =====
    const whyJoinGrid = document.getElementById('whyJoinGrid');
    if (whyJoinGrid && APP_DATA.whyJoin) {
        whyJoinGrid.innerHTML = APP_DATA.whyJoin.map((item, i) => `
            <div class="why-card animate-fadeInUp delay-${(i % 3) + 1}">
                <div class="why-icon"><i class='bx ${item.icon}'></i></div>
                <h3>${item.title}</h3>
                <p>${item.desc}</p>
            </div>
        `).join('');
    }

    // ===== RENDER TOP ALUMNI =====
    const alumniGrid = document.getElementById('alumniGrid');
    if (alumniGrid) {
        alumniGrid.innerHTML = APP_DATA.topAlumni.map((a, i) => `
            <div class="alumni-card animate-fadeInUp delay-${(i % 3) + 1}">
                <img src="${a.avatar}" alt="${a.name}" class="alumni-avatar">
                <h3 class="alumni-name">${a.name}</h3>
                <p class="alumni-role">${a.role}</p>
                <p class="alumni-company"><i class='bx bxs-business'></i> ${a.company} &bull; Batch ${a.batch}</p>
                <div class="alumni-tags">
                    ${a.tags.map(t => `<span class="tag">${t}</span>`).join('')}
                </div>
                <div class="card-actions">
                    <a href="dashboard.html" class="btn btn-primary btn-sm">View Profile</a>
                    <a href="${a.linkedin}" class="btn btn-secondary btn-sm" data-tooltip="LinkedIn"><i class='bx bxl-linkedin'></i></a>
                </div>
            </div>
        `).join('');
    }

    // ===== RENDER EVENTS =====
    const eventsGrid = document.getElementById('eventsGrid');
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    if (eventsGrid) {
        const gradients = [
            ['#4f46e5','#6366f1'],
            ['#7c3aed','#a78bfa'],
            ['#0ea5e9','#38bdf8']
        ];
        eventsGrid.innerHTML = APP_DATA.events.map((ev, i) => {
            const d = new Date(ev.date);
            const [g1, g2] = gradients[i % gradients.length];
            return `
                <div class="event-card animate-fadeInUp delay-${(i % 3) + 1}">
                    <div class="event-banner" style="background: linear-gradient(135deg, ${g1}, ${g2})">
                        <i class='bx bxs-calendar-event'></i>
                        <div class="event-date-badge">
                            <span class="day">${String(d.getDate()).padStart(2,'0')}</span>
                            <span class="month">${months[d.getMonth()]}</span>
                        </div>
                    </div>
                    <div class="event-body">
                        <h3 class="event-title">${ev.title}</h3>
                        <p class="event-desc">${ev.description}</p>
                        <div class="event-meta">
                            <span><i class='bx bx-time-five'></i> ${ev.time}</span>
                            <span><i class='bx bx-map'></i> ${ev.location}</span>
                            <span><i class='bx bx-user-check'></i> ${ev.attendees} Attending</span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    // ===== RENDER GALLERY =====
    const galleryTabs = document.getElementById('galleryTabs');
    const galleryGrid = document.getElementById('galleryGrid');
    if (galleryTabs && galleryGrid) {
        galleryTabs.innerHTML = APP_DATA.galleryCategories.map((cat, i) =>
            `<button class="gallery-tab ${i === 0 ? 'active' : ''}" data-category="${cat}">${cat}</button>`
        ).join('');

        function renderGallery(category) {
            const items = category === 'All' ? APP_DATA.galleryItems : APP_DATA.galleryItems.filter(g => g.category === category);
            galleryGrid.innerHTML = items.map(item => `
                <div class="gallery-item" style="background: linear-gradient(135deg, ${item.color}, ${item.color}aa)">
                    <i class='bx bxs-image'></i>
                    <div class="gallery-overlay">
                        <span><i class='bx bx-expand'></i> ${item.category}</span>
                    </div>
                </div>
            `).join('');
        }
        renderGallery('All');

        galleryTabs.addEventListener('click', (e) => {
            if (e.target.classList.contains('gallery-tab')) {
                document.querySelectorAll('.gallery-tab').forEach(t => t.classList.remove('active'));
                e.target.classList.add('active');
                renderGallery(e.target.dataset.category);
            }
        });
    }

    // ===== RENDER TESTIMONIALS =====
    const testimonialsTrack = document.getElementById('testimonialsTrack');
    if (testimonialsTrack && APP_DATA.testimonials) {
        testimonialsTrack.innerHTML = APP_DATA.testimonials.map(t => `
            <div class="testimonial-card">
                <div class="testimonial-stars">
                    ${'<i class="bx bxs-star"></i>'.repeat(t.rating)}
                    ${'<i class="bx bx-star" style="color:var(--text-muted)"></i>'.repeat(5 - t.rating)}
                </div>
                <p class="testi-text">${t.text}</p>
                <div class="testi-author">
                    <img src="${t.avatar}" alt="${t.name}">
                    <div>
                        <div class="testi-name">${t.name}</div>
                        <div class="testi-role">${t.role}</div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // ===== RENDER SEARCH SUGGESTIONS =====
    const searchSuggestions = document.getElementById('searchSuggestions');
    if (searchSuggestions) {
        const suggestionsHTML = APP_DATA.topAlumni.slice(0, 4).map(a => `
            <div class="suggestion-item">
                <img src="${a.avatar}" alt="${a.name}">
                <div class="s-info">
                    <h5>${a.name}</h5>
                    <p>${a.role} at ${a.company}</p>
                </div>
            </div>
        `).join('');
        searchSuggestions.innerHTML = '<h4>Suggested Alumni</h4>' + suggestionsHTML;
    }

    // Global search input filter
    const globalSearchInput = document.getElementById('globalSearchInput');
    if (globalSearchInput) {
        globalSearchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            const filtered = APP_DATA.topAlumni.filter(a =>
                a.name.toLowerCase().includes(query) ||
                a.company.toLowerCase().includes(query) ||
                a.role.toLowerCase().includes(query) ||
                a.batch.includes(query)
            );
            const suggestionsHTML = filtered.slice(0, 5).map(a => `
                <div class="suggestion-item" onclick="window.location.href='dashboard.html'">
                    <img src="${a.avatar}" alt="${a.name}">
                    <div class="s-info">
                        <h5>${a.name}</h5>
                        <p>${a.role} at ${a.company} &bull; Batch ${a.batch}</p>
                    </div>
                </div>
            `).join('');
            if (searchSuggestions) {
                searchSuggestions.innerHTML = `<h4>${query ? 'Search Results' : 'Suggested Alumni'}</h4>` +
                    (suggestionsHTML || '<p style="color:var(--text-muted);padding:12px 0;">No alumni found matching your search.</p>');
            }
        });
    }

    // ===== SCROLL TO TOP BUTTON =====
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    if (scrollTopBtn) {
        window.addEventListener('scroll', () => {
            scrollTopBtn.classList.toggle('visible', window.scrollY > 600);
        });
    }

    // ===== ANIMATED COUNTERS =====
    const statNumbers = document.querySelectorAll('.stat-number');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const text = el.textContent;
                const numMatch = text.match(/[\d,]+/);
                if (numMatch) {
                    const target = parseInt(numMatch[0].replace(/,/g, ''));
                    const suffix = text.replace(numMatch[0], '');
                    animateCounter(el, target, suffix);
                }
                counterObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(el => counterObserver.observe(el));

    function animateCounter(el, target, suffix) {
        let current = 0;
        const increment = target / 60;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            el.textContent = Math.floor(current).toLocaleString() + suffix;
        }, 25);
    }

    // ===== INTERSECTION OBSERVER FOR ANIMATIONS =====
    const animatedElements = document.querySelectorAll('.animate-fadeInUp, .animate-fadeIn, .animate-slideInRight');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    animatedElements.forEach(el => {
        el.style.animationPlayState = 'paused';
        observer.observe(el);
    });

    // ===== ACTIVE NAV LINK ON SCROLL =====
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
        const scrollPos = window.scrollY + 150;
        sections.forEach(sec => {
            const top = sec.offsetTop;
            const height = sec.offsetHeight;
            const id = sec.getAttribute('id');
            const navLink = document.querySelector(`.nav-menu a[href="#${id}"]`);
            if (navLink) {
                if (scrollPos >= top && scrollPos < top + height) {
                    document.querySelectorAll('.nav-menu a').forEach(l => l.classList.remove('active'));
                    navLink.classList.add('active');
                }
            }
        });
    });

    // ===== KEYBOARD SHORTCUTS =====
    document.addEventListener('keydown', (e) => {
        // Ctrl+K or / to open search
        if ((e.ctrlKey && e.key === 'k') || (e.key === '/' && document.activeElement === document.body)) {
            e.preventDefault();
            const overlay = document.getElementById('searchOverlay');
            if (overlay) {
                overlay.classList.add('active');
                setTimeout(() => document.getElementById('globalSearchInput')?.focus(), 100);
            }
        }
        // Escape to close search
        if (e.key === 'Escape') {
            document.getElementById('searchOverlay')?.classList.remove('active');
        }
    });
});

// ===== TESTIMONIAL SCROLL (Global) =====
function scrollTestimonials(dir) {
    const track = document.getElementById('testimonialsTrack');
    if (track) {
        track.scrollBy({ left: dir * 400, behavior: 'smooth' });
    }
}
