// ============================================
// MODULE 4: ALUMNI DASHBOARD SPA ENGINE
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    const viewContainer = document.getElementById('dashViewContainer');
    const navLinks = document.querySelectorAll('.dash-nav-link[data-view]');
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

    // Initialize with overview
    renderView('overview');

    // Nav click handler
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const view = e.currentTarget.dataset.view;
            navLinks.forEach(l => l.classList.remove('active'));
            e.currentTarget.classList.add('active');
            renderView(view);
        });
    });

    function renderView(view) {
        viewContainer.style.animation = 'none';
        viewContainer.offsetHeight;
        viewContainer.style.animation = 'fadeInUp 0.4s ease-out forwards';

        const renderers = {
            overview: renderOverview,
            profile: renderProfile,
            network: renderNetwork,
            chat: renderChat,
            notifications: renderNotifications,
            events: renderEvents,
            jobs: renderJobs,
            gallery: renderGallery,
            topalumni: renderTopAlumni,
            mentorship: renderMentorship
        };

        const renderer = renderers[view] || renderOverview;
        viewContainer.innerHTML = renderer();
    }

    // ===== OVERVIEW =====
    function renderOverview() {
        return `
            <div class="page-title-bar">
                <div>
                    <h1>Welcome back, Shubham! 👋</h1>
                    <p>Here's what's happening in your alumni network today.</p>
                </div>
                <button class="btn btn-primary btn-sm" onclick="navigateTo('profile')">
                    <i class='bx bx-edit'></i> Edit Profile
                </button>
            </div>

            <div class="dash-stats-row">
                <div class="dash-stat-card">
                    <div class="stat-icon purple"><i class='bx bxs-user-detail'></i></div>
                    <div class="stat-info">
                        <h3>${APP_DATA.stats.totalAlumni.toLocaleString()}</h3>
                        <p>Total Alumni</p>
                    </div>
                </div>
                <div class="dash-stat-card">
                    <div class="stat-icon blue"><i class='bx bxs-group'></i></div>
                    <div class="stat-info">
                        <h3>${APP_DATA.stats.activeMentors}</h3>
                        <p>Active Mentors</p>
                    </div>
                </div>
                <div class="dash-stat-card">
                    <div class="stat-icon green"><i class='bx bxs-calendar-star'></i></div>
                    <div class="stat-info">
                        <h3>${APP_DATA.events.length}</h3>
                        <p>Upcoming Events</p>
                    </div>
                </div>
                <div class="dash-stat-card">
                    <div class="stat-icon amber"><i class='bx bxs-briefcase-alt-2'></i></div>
                    <div class="stat-info">
                        <h3>${APP_DATA.stats.jobPostings}</h3>
                        <p>Job Postings</p>
                    </div>
                </div>
            </div>

            <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;">
                <div class="dash-section">
                    <div class="dash-section-header">
                        <h3>📅 Upcoming Events</h3>
                        <button class="btn btn-ghost btn-sm" onclick="navigateTo('events')">View All</button>
                    </div>
                    <div class="dash-section-body">
                        <div class="dash-events-list">
                            ${APP_DATA.events.map(ev => {
                                const d = new Date(ev.date);
                                return `
                                    <div class="dash-event-item">
                                        <div class="ev-date">
                                            <span class="ev-day">${String(d.getDate()).padStart(2,'0')}</span>
                                            <span class="ev-month">${months[d.getMonth()]}</span>
                                        </div>
                                        <div class="ev-info">
                                            <h4>${ev.title}</h4>
                                            <p><i class='bx bx-map'></i> ${ev.location}</p>
                                        </div>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    </div>
                </div>

                <div class="dash-section">
                    <div class="dash-section-header">
                        <h3>🔔 Recent Activity</h3>
                        <button class="btn btn-ghost btn-sm" onclick="navigateTo('notifications')">View All</button>
                    </div>
                    <div class="dash-section-body">
                        <div class="activity-list">
                            ${APP_DATA.activities.slice(0, 4).map(act => `
                                <div class="activity-item">
                                    <div class="act-icon stat-icon ${act.color}"><i class='bx ${act.icon}'></i></div>
                                    <div class="act-content">
                                        <h4>${act.title}</h4>
                                        <p>${act.desc}</p>
                                    </div>
                                    <span class="act-time">${act.time}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>

            <div class="dash-section" style="margin-top:24px;">
                <div class="dash-section-header">
                    <h3>💼 Latest Job Postings</h3>
                    <button class="btn btn-ghost btn-sm" onclick="navigateTo('jobs')">View All</button>
                </div>
                <div class="dash-section-body">
                    <div class="jobs-list">
                        ${APP_DATA.jobs.slice(0, 3).map(job => `
                            <div class="job-card">
                                <div class="job-logo"><i class='bx bxs-buildings'></i></div>
                                <div class="job-info">
                                    <h4>${job.title}</h4>
                                    <p class="job-company">${job.company} &bull; ${job.location}</p>
                                    <div class="job-tags">
                                        <span>${job.type}</span>
                                        <span>${job.experience}</span>
                                        <span>Posted ${job.postedDate}</span>
                                    </div>
                                </div>
                                <button class="btn btn-primary btn-sm">Apply</button>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    // ===== PROFILE =====
    function renderProfile() {
        return `
            <div class="page-title-bar">
                <div>
                    <h1>My Profile</h1>
                    <p>View and manage your personal and professional information.</p>
                </div>
                <button class="btn btn-primary btn-sm"><i class='bx bx-edit'></i> Edit Profile</button>
            </div>

            <div class="profile-overview">
                <div class="profile-card-main">
                    <img src="https://i.pravatar.cc/150?img=3" alt="Profile" class="profile-avatar">
                    <h3>Shubham Kulkarni</h3>
                    <p class="profile-role">Software Developer</p>
                    <p class="profile-company"><i class='bx bxs-business'></i> Tech Solutions Pvt. Ltd.</p>
                    <div class="profile-stats">
                        <div class="ps-item">
                            <div class="ps-number">45</div>
                            <div class="ps-label">Connections</div>
                        </div>
                        <div class="ps-item">
                            <div class="ps-number">12</div>
                            <div class="ps-label">Messages</div>
                        </div>
                        <div class="ps-item">
                            <div class="ps-number">89</div>
                            <div class="ps-label">Profile Views</div>
                        </div>
                    </div>
                </div>

                <div class="profile-details">
                    <div class="dash-section">
                        <div class="dash-section-header"><h3>👤 Personal Information</h3></div>
                        <div class="dash-section-body">
                            <div class="detail-grid">
                                <div class="detail-item">
                                    <div class="di-icon"><i class='bx bxs-envelope'></i></div>
                                    <div><div class="di-label">Email</div><div class="di-value">shubham.k@email.com</div></div>
                                </div>
                                <div class="detail-item">
                                    <div class="di-icon"><i class='bx bxs-phone'></i></div>
                                    <div><div class="di-label">Phone</div><div class="di-value">+91 98765 43210</div></div>
                                </div>
                                <div class="detail-item">
                                    <div class="di-icon"><i class='bx bxs-map'></i></div>
                                    <div><div class="di-label">Location</div><div class="di-value">Pune, Maharashtra</div></div>
                                </div>
                                <div class="detail-item">
                                    <div class="di-icon"><i class='bx bxs-calendar'></i></div>
                                    <div><div class="di-label">Date of Birth</div><div class="di-value">15 March 1998</div></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="dash-section">
                        <div class="dash-section-header"><h3>🎓 Academic Details</h3></div>
                        <div class="dash-section-body">
                            <div class="detail-grid">
                                <div class="detail-item">
                                    <div class="di-icon"><i class='bx bxs-school'></i></div>
                                    <div><div class="di-label">Department</div><div class="di-value">Computer Engineering</div></div>
                                </div>
                                <div class="detail-item">
                                    <div class="di-icon"><i class='bx bxs-graduation'></i></div>
                                    <div><div class="di-label">Graduation Year</div><div class="di-value">2020</div></div>
                                </div>
                                <div class="detail-item">
                                    <div class="di-icon"><i class='bx bxs-id-card'></i></div>
                                    <div><div class="di-label">Roll Number</div><div class="di-value">2020COMP042</div></div>
                                </div>
                                <div class="detail-item">
                                    <div class="di-icon"><i class='bx bxs-user-badge'></i></div>
                                    <div><div class="di-label">Batch Mentor</div><div class="di-value">Prof. R. D. More</div></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="dash-section">
                        <div class="dash-section-header"><h3>💼 Professional Details</h3></div>
                        <div class="dash-section-body">
                            <div class="detail-grid">
                                <div class="detail-item">
                                    <div class="di-icon"><i class='bx bxs-briefcase'></i></div>
                                    <div><div class="di-label">Job Title</div><div class="di-value">Software Developer</div></div>
                                </div>
                                <div class="detail-item">
                                    <div class="di-icon"><i class='bx bxs-business'></i></div>
                                    <div><div class="di-label">Company</div><div class="di-value">Tech Solutions Pvt. Ltd.</div></div>
                                </div>
                                <div class="detail-item">
                                    <div class="di-icon"><i class='bx bxs-time-five'></i></div>
                                    <div><div class="di-label">Experience</div><div class="di-value">2-5 years</div></div>
                                </div>
                                <div class="detail-item">
                                    <div class="di-icon"><i class='bx bxs-wrench'></i></div>
                                    <div><div class="di-label">Skills</div><div class="di-value">Python, Django, React, AWS</div></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="dash-section">
                        <div class="dash-section-header"><h3>🔗 Social Links</h3></div>
                        <div class="dash-section-body">
                            <div class="detail-grid">
                                <div class="detail-item">
                                    <div class="di-icon"><i class='bx bxl-linkedin'></i></div>
                                    <div><div class="di-label">LinkedIn</div><div class="di-value" style="color:var(--primary);">linkedin.com/in/shubhamk</div></div>
                                </div>
                                <div class="detail-item">
                                    <div class="di-icon"><i class='bx bxl-github'></i></div>
                                    <div><div class="di-label">GitHub</div><div class="di-value" style="color:var(--primary);">github.com/shubhamk</div></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // ===== ALUMNI NETWORK =====
    function renderNetwork() {
        return `
            <div class="page-title-bar">
                <div>
                    <h1>Alumni Network</h1>
                    <p>Connect with graduates across the globe.</p>
                </div>
            </div>

            <div class="filter-bar">
                <div class="filter-input">
                    <i class='bx bx-search'></i>
                    <input type="text" placeholder="Search by name, company, or role..." id="networkSearch" oninput="filterNetwork()">
                </div>
                <select id="batchFilter" onchange="filterNetwork()">
                    <option value="">All Batches</option>
                    <option>2013</option><option>2014</option><option>2015</option>
                    <option>2016</option><option>2017</option><option>2018</option>
                    <option>2019</option><option>2020</option>
                </select>
                <select id="companyFilter" onchange="filterNetwork()">
                    <option value="">All Companies</option>
                    <option>Google</option><option>Microsoft</option><option>Netflix</option>
                    <option>Amazon Web Services</option><option>Adobe</option><option>TechNova Solutions</option>
                </select>
            </div>

            <div class="network-grid" id="networkGrid">
                ${APP_DATA.topAlumni.map(a => `
                    <div class="network-card" data-name="${a.name.toLowerCase()}" data-batch="${a.batch}" data-company="${a.company}">
                        <img src="${a.avatar}" alt="${a.name}">
                        <div class="nc-info">
                            <h4>${a.name}</h4>
                            <p>${a.role} at ${a.company}</p>
                            <span class="nc-batch">Batch ${a.batch}</span>
                        </div>
                        <button class="btn btn-primary btn-sm" style="margin-left:auto;"><i class='bx bx-user-plus'></i></button>
                    </div>
                `).join('')}
            </div>
        `;
    }

    // ===== CHAT =====
    function renderChat() {
        return `
            <div class="page-title-bar">
                <div>
                    <h1>Messages</h1>
                    <p>Chat with batchmates, mentors, and alumni groups.</p>
                </div>
            </div>

            <div class="chat-layout">
                <div class="chat-contacts">
                    <div class="chat-contacts-header">
                        <h3>Conversations</h3>
                        <div class="chat-tabs">
                            <button class="chat-tab active">All</button>
                            <button class="chat-tab">Groups</button>
                            <button class="chat-tab">Direct</button>
                        </div>
                    </div>
                    <div class="chat-list">
                        ${APP_DATA.chatContacts.map((c, i) => `
                            <div class="chat-contact-item ${i === 2 ? 'active' : ''}" onclick="selectChat(${c.id})">
                                <div style="position:relative">
                                    <img src="${c.avatar}" alt="${c.name}" class="cc-avatar">
                                    ${c.online ? '<span class="cc-status"></span>' : ''}
                                </div>
                                <div class="cc-meta">
                                    <h4>${c.isGroup ? '👥 ' : ''}${c.name}</h4>
                                    <p>${c.lastMsg}</p>
                                </div>
                                <span class="cc-time">${c.time}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
                <div class="chat-main">
                    <div class="chat-main-header">
                        <img src="https://i.pravatar.cc/150?img=11" alt="Aarav">
                        <div class="ch-info">
                            <h4>Aarav Patel</h4>
                            <span>● Online</span>
                        </div>
                        <div style="margin-left:auto;display:flex;gap:8px;">
                            <button class="topbar-icon-btn"><i class='bx bxs-phone'></i></button>
                            <button class="topbar-icon-btn"><i class='bx bxs-video'></i></button>
                            <button class="topbar-icon-btn"><i class='bx bx-dots-vertical-rounded'></i></button>
                        </div>
                    </div>
                    <div class="chat-messages">
                        ${APP_DATA.chatMessages.map(msg => `
                            <div class="chat-msg ${msg.sender === 'me' ? 'sent' : 'received'}">
                                <div class="msg-bubble">${msg.text}</div>
                                <span class="msg-time">${msg.time}</span>
                            </div>
                        `).join('')}
                    </div>
                    <div class="chat-input-area">
                        <button class="topbar-icon-btn"><i class='bx bx-paperclip'></i></button>
                        <input type="text" placeholder="Type a message..." id="chatInput">
                        <button class="send-btn"><i class='bx bxs-send'></i></button>
                    </div>
                </div>
            </div>
        `;
    }

    // ===== NOTIFICATIONS =====
    function renderNotifications() {
        return `
            <div class="page-title-bar">
                <div>
                    <h1>Notifications</h1>
                    <p>Stay updated with the latest alerts and announcements.</p>
                </div>
                <button class="btn btn-secondary btn-sm"><i class='bx bx-check-double'></i> Mark All Read</button>
            </div>

            <div class="dash-section">
                <div class="dash-section-body">
                    <div class="activity-list">
                        ${APP_DATA.activities.map(act => `
                            <div class="activity-item">
                                <div class="act-icon stat-icon ${act.color}"><i class='bx ${act.icon}'></i></div>
                                <div class="act-content">
                                    <h4>${act.title}</h4>
                                    <p>${act.desc}</p>
                                </div>
                                <span class="act-time">${act.time}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    // ===== EVENTS =====
    function renderEvents() {
        return `
            <div class="page-title-bar">
                <div>
                    <h1>Events & Meetups</h1>
                    <p>Browse, register, and stay informed about upcoming events.</p>
                </div>
            </div>

            <div class="dash-events-list">
                ${APP_DATA.events.map(ev => {
                    const d = new Date(ev.date);
                    return `
                        <div class="dash-section" style="margin-bottom:16px;">
                            <div class="dash-section-body" style="display:flex;align-items:center;gap:20px;">
                                <div class="ev-date" style="width:64px;height:70px;background:var(--primary);border-radius:var(--radius-md);display:flex;flex-direction:column;align-items:center;justify-content:center;color:#fff;min-width:64px;">
                                    <span style="font-size:24px;font-weight:800;line-height:1;">${String(d.getDate()).padStart(2,'0')}</span>
                                    <span style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:1px;opacity:0.8;">${months[d.getMonth()]}</span>
                                </div>
                                <div style="flex:1;">
                                    <h3 style="font-size:18px;font-weight:700;margin-bottom:6px;">${ev.title}</h3>
                                    <p style="font-size:14px;color:var(--text-secondary);margin-bottom:8px;">${ev.description}</p>
                                    <div class="event-meta">
                                        <span><i class='bx bx-time-five'></i> ${ev.time}</span>
                                        <span><i class='bx bx-map'></i> ${ev.location}</span>
                                        <span><i class='bx bx-user-check'></i> ${ev.attendees} Attending</span>
                                    </div>
                                </div>
                                <button class="btn btn-primary btn-sm">Register</button>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }

    // ===== JOBS =====
    function renderJobs() {
        return `
            <div class="page-title-bar">
                <div>
                    <h1>Job Board</h1>
                    <p>Explore career opportunities shared by the alumni network.</p>
                </div>
                <button class="btn btn-primary btn-sm"><i class='bx bx-plus'></i> Post a Job</button>
            </div>

            <div class="filter-bar">
                <div class="filter-input">
                    <i class='bx bx-search'></i>
                    <input type="text" placeholder="Search jobs by title, company...">
                </div>
                <select>
                    <option>All Types</option>
                    <option>Full-time</option>
                    <option>Internship</option>
                    <option>Part-time</option>
                </select>
                <select>
                    <option>All Experience</option>
                    <option>Fresher</option>
                    <option>0-2 yrs</option>
                    <option>3-5 yrs</option>
                    <option>5+ yrs</option>
                </select>
            </div>

            <div class="jobs-list">
                ${APP_DATA.jobs.map(job => `
                    <div class="job-card">
                        <div class="job-logo"><i class='bx bxs-buildings'></i></div>
                        <div class="job-info">
                            <h4>${job.title}</h4>
                            <p class="job-company">${job.company} &bull; ${job.location}</p>
                            <div class="job-tags">
                                <span>${job.type}</span>
                                <span>${job.experience}</span>
                                <span>By ${job.postedBy}</span>
                                <span>${job.postedDate}</span>
                            </div>
                        </div>
                        <button class="btn btn-primary btn-sm">Apply</button>
                    </div>
                `).join('')}
            </div>
        `;
    }

    // ===== GALLERY =====
    function renderGallery() {
        return `
            <div class="page-title-bar">
                <div>
                    <h1>Photo Gallery</h1>
                    <p>Memories from events, reunions, and campus life.</p>
                </div>
            </div>

            <div class="gallery-tabs" style="justify-content:flex-start;margin-bottom:24px;">
                ${APP_DATA.galleryCategories.map((cat, i) =>
                    `<button class="gallery-tab ${i === 0 ? 'active' : ''}" onclick="filterGallery('${cat}', this)">${cat}</button>`
                ).join('')}
            </div>

            <div class="gallery-grid" id="dashGalleryGrid">
                ${APP_DATA.galleryItems.map(item => `
                    <div class="gallery-item" style="background:linear-gradient(135deg, ${item.color}, ${item.color}bb);" data-category="${item.category}">
                        <i class='bx bxs-image'></i>
                        <div class="gallery-overlay">
                            <span><i class='bx bx-expand'></i> ${item.category}</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    // ===== TOP ALUMNI =====
    function renderTopAlumni() {
        return `
            <div class="page-title-bar">
                <div>
                    <h1>🏆 Top Alumni</h1>
                    <p>Celebrating our most distinguished graduates.</p>
                </div>
            </div>

            <div class="alumni-cards-grid">
                ${APP_DATA.topAlumni.map(a => `
                    <div class="alumni-card">
                        <img src="${a.avatar}" alt="${a.name}" class="alumni-avatar">
                        <h3 class="alumni-name">${a.name}</h3>
                        <p class="alumni-role">${a.role}</p>
                        <p class="alumni-company"><i class='bx bxs-business'></i> ${a.company} &bull; Batch ${a.batch}</p>
                        <div class="alumni-tags">
                            ${a.tags.map(t => `<span class="tag">${t}</span>`).join('')}
                        </div>
                        <div class="card-actions">
                            <button class="btn btn-primary btn-sm">View Profile</button>
                            <button class="btn btn-secondary btn-sm"><i class='bx bxl-linkedin'></i></button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    // ===== MENTORSHIP =====
    function renderMentorship() {
        return `
            <div class="page-title-bar">
                <div>
                    <h1>Mentorship Program</h1>
                    <p>Connect with your batch mentor and receive guidance.</p>
                </div>
            </div>

            <div class="dash-section">
                <div class="dash-section-header"><h3>👨‍🏫 Your Batch Mentor</h3></div>
                <div class="dash-section-body">
                    <div style="display:flex;align-items:center;gap:20px;">
                        <img src="https://ui-avatars.com/api/?name=Prof+R+D+More&background=4f46e5&color=fff&size=80" alt="Mentor" style="width:80px;height:80px;border-radius:50%;">
                        <div>
                            <h3 style="font-size:20px;font-weight:700;">Prof. R. D. More</h3>
                            <p style="color:var(--primary);font-weight:500;">Batch Mentor - Computer Engineering</p>
                            <p style="color:var(--text-muted);font-size:14px;margin-top:4px;">Assigned batches: 2019, 2020, 2021</p>
                            <div style="display:flex;gap:8px;margin-top:12px;">
                                <button class="btn btn-primary btn-sm"><i class='bx bxs-envelope'></i> Contact Mentor</button>
                                <button class="btn btn-secondary btn-sm"><i class='bx bxs-phone'></i> Call</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="dash-section" style="margin-top:24px;">
                <div class="dash-section-header"><h3>📋 Mentor Announcements</h3></div>
                <div class="dash-section-body">
                    <div class="activity-list">
                        <div class="activity-item">
                            <div class="act-icon stat-icon blue"><i class='bx bxs-megaphone'></i></div>
                            <div class="act-content">
                                <h4>Batch 2020 - Career Survey</h4>
                                <p>Please fill out the annual career progression survey by May 1st.</p>
                            </div>
                            <span class="act-time">2 days ago</span>
                        </div>
                        <div class="activity-item">
                            <div class="act-icon stat-icon green"><i class='bx bxs-calendar-check'></i></div>
                            <div class="act-content">
                                <h4>Monthly Check-in Scheduled</h4>
                                <p>Virtual mentorship session on April 20th at 6 PM via Zoom.</p>
                            </div>
                            <span class="act-time">5 days ago</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // ===== GLOBAL HELPERS =====
    window.navigateTo = function(view) {
        navLinks.forEach(l => {
            l.classList.remove('active');
            if (l.dataset.view === view) l.classList.add('active');
        });
        renderView(view);
    };

    window.filterNetwork = function() {
        const search = document.getElementById('networkSearch')?.value.toLowerCase() || '';
        const batch = document.getElementById('batchFilter')?.value || '';
        const company = document.getElementById('companyFilter')?.value || '';

        document.querySelectorAll('.network-card').forEach(card => {
            const name = card.dataset.name;
            const cardBatch = card.dataset.batch;
            const cardCompany = card.dataset.company;

            const matchSearch = !search || name.includes(search) || cardCompany.toLowerCase().includes(search);
            const matchBatch = !batch || cardBatch === batch;
            const matchCompany = !company || cardCompany === company;

            card.style.display = (matchSearch && matchBatch && matchCompany) ? '' : 'none';
        });
    };

    window.filterGallery = function(category, btn) {
        document.querySelectorAll('.gallery-tab').forEach(t => t.classList.remove('active'));
        btn.classList.add('active');
        document.querySelectorAll('#dashGalleryGrid .gallery-item').forEach(item => {
            item.style.display = (category === 'All' || item.dataset.category === category) ? '' : 'none';
        });
    };

    window.selectChat = function(id) {
        // Placeholder for future real chat selection logic
        document.querySelectorAll('.chat-contact-item').forEach(c => c.classList.remove('active'));
        event.currentTarget.classList.add('active');
    };
});
