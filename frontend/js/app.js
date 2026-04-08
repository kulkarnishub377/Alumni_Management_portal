// ============================================
// MODULE 1: HOMEPAGE LOGIC
// ============================================

document.addEventListener('DOMContentLoaded', () => {

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
                // Close mobile menu if open
                document.getElementById('navMenu').classList.remove('active');
            }
        });
    });

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
                    <a href="${a.linkedin}" class="btn btn-secondary btn-sm"><i class='bx bxl-linkedin'></i></a>
                </div>
            </div>
        `).join('');
    }

    // ===== RENDER EVENTS =====
    const eventsGrid = document.getElementById('eventsGrid');
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    if (eventsGrid) {
        eventsGrid.innerHTML = APP_DATA.events.map((ev, i) => {
            const d = new Date(ev.date);
            return `
                <div class="event-card animate-fadeInUp delay-${(i % 3) + 1}">
                    <div class="event-banner" style="background: linear-gradient(135deg, ${['#4f46e5','#7c3aed','#0ea5e9'][i % 3]}, ${['#6366f1','#a78bfa','#38bdf8'][i % 3]})">
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

    // ===== RENDER GALLERY TABS =====
    const galleryTabs = document.getElementById('galleryTabs');
    const galleryGrid = document.getElementById('galleryGrid');
    if (galleryTabs && galleryGrid) {
        // Render tabs
        galleryTabs.innerHTML = APP_DATA.galleryCategories.map((cat, i) =>
            `<button class="gallery-tab ${i === 0 ? 'active' : ''}" data-category="${cat}">${cat}</button>`
        ).join('');

        // Render gallery items
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

        // Tab click handler
        galleryTabs.addEventListener('click', (e) => {
            if (e.target.classList.contains('gallery-tab')) {
                document.querySelectorAll('.gallery-tab').forEach(t => t.classList.remove('active'));
                e.target.classList.add('active');
                renderGallery(e.target.dataset.category);
            }
        });
    }

    // ===== INTERSECTION OBSERVER FOR ANIMATIONS =====
    const animatedElements = document.querySelectorAll('.animate-fadeInUp, .animate-fadeIn');
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
});
