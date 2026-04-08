// ============================================
// ALUMNI DASHBOARD - FULL SPA ENGINE
// All sub-modules are fully interactive
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // ===== ROUTE GUARD: PROTECT DASHBOARD VIEWS =====
    const user = getUser();
    if (!user || !user.loggedIn) {
        window.location.href = '../auth/login.html';
        return; // Stop execution
    }

    const viewContainer = document.getElementById('dashViewContainer');
    const navLinks = document.querySelectorAll('.dash-nav-link[data-view]');
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

    // State
    let chatMessages = [...APP_DATA.chatMessages];
    let activeChatContact = APP_DATA.chatContacts[2]; // Aarav by default
    let registeredEvents = new Set();
    let appliedJobs = new Set();
    let bookmarkedAlumni = new Set();
    let notifications = [...APP_DATA.activities];

    // Identify current page
    const currentPage = viewContainer.dataset.page || 'overview';

    // Init
    renderView(currentPage);
    setupLogout();

    // ===== NAV CLICK HANDLER =====
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Close sidebar on mobile
            document.getElementById('dashSidebar')?.classList.remove('open');
            // Standard navigation handles the rest (href="xyz.html")
        });
    });

    function setActiveNav(view) {
        navLinks.forEach(l => l.classList.remove('active'));
        const target = document.querySelector(`.dash-nav-link[data-view="${view}"]`);
        if (target) target.classList.add('active');
    }

    // ===== GLOBAL NAV FUNCTION =====
    window.navigateTo = function(view) {
        window.location.href = view + '.html';
    };

    // ===== RENDER VIEW =====
    function renderView(view) {
        viewContainer.style.opacity = '0';
        viewContainer.style.transform = 'translateY(10px)';
        setTimeout(() => {
            const renderers = {
                dashboard: renderOverview,
                overview: renderOverview,
                profile: renderProfile,
                network: renderNetwork,
                chat: renderChat,
                notifications: renderNotifications,
                events: renderEvents,
                jobs: renderJobs,
                gallery: renderGallery,
                topalumni: renderTopAlumni,
                mentorship: renderMentorship,
                settings: renderSettings
            };
            viewContainer.innerHTML = (renderers[view] || renderOverview)();
            viewContainer.style.transition = 'all 0.35s ease';
            viewContainer.style.opacity = '1';
            viewContainer.style.transform = 'translateY(0)';

            // Post-render hooks
            if (view === 'chat') setupChatInteractions();
        }, 100);
    }

    // ===== LOGOUT =====
    function setupLogout() {
        document.getElementById('logoutBtn')?.addEventListener('click', (e) => {
            e.preventDefault();
            clearUser();
            showToast('Logged out successfully', 'info');
            setTimeout(() => window.location.href = '../../index.html', 1000);
        });
    }

    // ============================================
    // VIEW: OVERVIEW
    // ============================================
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
                ${statCard('bxs-user-detail', 'purple', APP_DATA.stats.totalAlumni.toLocaleString(), 'Total Alumni')}
                ${statCard('bxs-group', 'blue', APP_DATA.stats.activeMentors, 'Active Mentors')}
                ${statCard('bxs-calendar-star', 'green', APP_DATA.events.length, 'Upcoming Events')}
                ${statCard('bxs-briefcase-alt-2', 'amber', APP_DATA.stats.jobPostings, 'Job Postings')}
            </div>

            <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;">
                <div class="dash-section">
                    <div class="dash-section-header">
                        <h3>📅 Upcoming Events</h3>
                        <button class="btn btn-ghost btn-sm" onclick="navigateTo('events')">View All</button>
                    </div>
                    <div class="dash-section-body">
                        ${APP_DATA.events.map(ev => {
                            const d = formatDate(ev.date);
                            return `<div class="dash-event-item">
                                <div class="ev-date"><span class="ev-day">${d.day}</span><span class="ev-month">${d.month}</span></div>
                                <div class="ev-info"><h4>${ev.title}</h4><p><i class='bx bx-map'></i> ${ev.location}</p></div>
                            </div>`;
                        }).join('')}
                    </div>
                </div>

                <div class="dash-section">
                    <div class="dash-section-header">
                        <h3>🔔 Recent Activity</h3>
                        <button class="btn btn-ghost btn-sm" onclick="navigateTo('notifications')">View All</button>
                    </div>
                    <div class="dash-section-body">
                        <div class="activity-list">
                            ${notifications.slice(0, 4).map(activityItem).join('')}
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
                    <div class="jobs-list">${APP_DATA.jobs.slice(0, 3).map(j => jobCard(j)).join('')}</div>
                </div>
            </div>
        `;
    }

    // ============================================
    // VIEW: PROFILE (Editable)
    // ============================================
    function renderProfile() {
        return `
            <div class="page-title-bar">
                <div><h1>My Profile</h1><p>View and manage your personal and professional information.</p></div>
                <button class="btn btn-primary btn-sm" id="editProfileBtn" onclick="toggleEditProfile()"><i class='bx bx-edit'></i> Edit Profile</button>
            </div>

            <div class="profile-overview">
                <div class="profile-card-main">
                    <img src="https://i.pravatar.cc/150?img=3" alt="Profile" class="profile-avatar">
                    <h3>Shubham Kulkarni</h3>
                    <p class="profile-role">Software Developer</p>
                    <p class="profile-company"><i class='bx bxs-business'></i> Tech Solutions Pvt. Ltd.</p>
                    <div class="profile-stats">
                        <div class="ps-item"><div class="ps-number">45</div><div class="ps-label">Connections</div></div>
                        <div class="ps-item"><div class="ps-number">12</div><div class="ps-label">Messages</div></div>
                        <div class="ps-item"><div class="ps-number">89</div><div class="ps-label">Profile Views</div></div>
                    </div>
                </div>

                <div class="profile-details">
                    <div class="dash-section">
                        <div class="dash-section-header"><h3>👤 Personal Information</h3></div>
                        <div class="dash-section-body">
                            <div class="detail-grid">
                                ${detailItem('bxs-envelope', 'Email', 'shubham.k@email.com', false, 'val-email')}
                                ${detailItem('bxs-phone', 'Phone', '+91 98765 43210', false, 'val-phone')}
                                ${detailItem('bxs-map', 'Location', 'Pune, Maharashtra', false, 'val-location')}
                                ${detailItem('bxs-calendar', 'Date of Birth', '15 March 1998', false, 'val-dob')}
                            </div>
                        </div>
                    </div>

                    <div class="dash-section">
                        <div class="dash-section-header"><h3>🎓 Academic Details</h3></div>
                        <div class="dash-section-body">
                            <div class="detail-grid">
                                ${detailItem('bxs-school', 'Department', 'Computer Engineering', false, 'val-department')}
                                ${detailItem('bxs-graduation', 'Graduation Year', '2020', false, 'val-gradYear')}
                                ${detailItem('bxs-id-card', 'Roll Number', '2020COMP042', false, 'val-rollNumber')}
                                ${detailItem('bxs-user-badge', 'Batch Mentor', 'Prof. R. D. More', false, 'val-mentor')}
                            </div>
                        </div>
                    </div>

                    <div class="dash-section">
                        <div class="dash-section-header"><h3>💼 Professional Details</h3></div>
                        <div class="dash-section-body">
                            <div class="detail-grid">
                                ${detailItem('bxs-briefcase', 'Job Title', 'Software Developer', false, 'val-jobTitle')}
                                ${detailItem('bxs-business', 'Company', 'Tech Solutions Pvt. Ltd.', false, 'val-company')}
                                ${detailItem('bxs-time-five', 'Experience', '2-5 years', false, 'val-experience')}
                                ${detailItem('bxs-wrench', 'Skills', 'Python, Django, React, AWS', false, 'val-skills')}
                            </div>
                        </div>
                    </div>

                    <div class="dash-section">
                        <div class="dash-section-header"><h3>🔗 Social Links</h3></div>
                        <div class="dash-section-body">
                            <div class="detail-grid">
                                ${detailItem('bxl-linkedin', 'LinkedIn', 'linkedin.com/in/shubhamk', true, 'val-linkedin')}
                                ${detailItem('bxl-github', 'GitHub', 'github.com/shubhamk', true, 'val-github')}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    window.toggleEditProfile = function() {
        if (!document.getElementById('editProfileModalBox')) {
            const modalHTML = `
                <div class="edit-modal-overlay" id="editProfileModalBox">
                    <div class="edit-modal">
                        <div class="edit-modal-header">
                            <h3>Edit Complete Profile</h3>
                            <button class="edit-modal-close" onclick="closeEditProfile()"><i class="bx bx-x"></i></button>
                        </div>
                        <div class="edit-modal-body">
                            
                            <div style="border: 2px dashed var(--border); border-radius: var(--radius-lg); padding: 24px 20px; display: flex; flex-direction: column; align-items: center; justify-content: center; margin-bottom: 24px; transition: all 0.3s ease;" id="aiResumeBoxProfile" ondragover="event.preventDefault(); this.style.borderColor='var(--primary)'; this.style.background='rgba(79, 70, 229, 0.05)';" ondragleave="this.style.borderColor='var(--border)'; this.style.background='transparent';" ondrop="handleResumeDropProfile(event)">
                                <i class='bx bx-brain' style="font-size:32px; color:var(--primary); margin-bottom:8px;"></i>
                                <h4 style="color:var(--text-primary); margin-bottom:4px;">Auto-Update Profile via AI</h4>
                                <p style="font-size:13px; color:var(--text-muted); text-align:center;">Drag & Drop your new PDF resume here to auto-fill the fields below!</p>
                                <label class="btn btn-secondary btn-sm" style="margin-top:16px; cursor:pointer;">
                                    Upload Document
                                    <input type="file" accept=".pdf" style="display:none;" onchange="handleResumeDropProfile({target: this, preventDefault:()=>{}})">
                                </label>
                                <div id="aiResumeLoaderProfile" style="display:none; margin-top:16px; color:var(--primary); font-size:13px; font-weight:600;"><i class='bx bx-loader-alt bx-spin'></i> AI is rewriting your profile...</div>
                            </div>

                            <h4 class="edit-modal-section-title">Profile Picture & Document</h4>
                            <div style="display:flex; align-items:center; gap:16px; margin-bottom:24px;">
                                <img id="editProfilePicPreview" src="https://i.pravatar.cc/150?img=3" style="width:72px; height:72px; border-radius:50%; object-fit:cover; border:2px solid var(--border);">
                                <div>
                                    <label class="btn btn-secondary btn-sm" style="cursor:pointer;">
                                        <i class='bx bx-upload'></i> Change Photo
                                        <input type="file" accept="image/*" style="display:none;" onchange="previewEditProfilePic(this)">
                                    </label>
                                    <p style="font-size:12px; color:var(--text-muted); margin-top:4px;">JPG, GIF or PNG. Max size 2MB</p>
                                </div>
                            </div>
                            
                            <div style="display:flex; align-items:center; justify-content:space-between; padding:12px 16px; background:var(--bg-body); border:1px solid var(--border); border-radius:var(--radius-md); margin-bottom:24px;">
                                <div style="display:flex; align-items:center; gap:12px;">
                                    <div style="width:40px; height:40px; background:rgba(239, 68, 68, 0.1); border-radius:8px; display:flex; align-items:center; justify-content:center;">
                                        <i class='bx bxs-file-pdf' style="font-size:24px; color:#ef4444;"></i>
                                    </div>
                                    <div>
                                        <h5 style="font-size:14px; margin:0;">Shubham_Resume_2026.pdf</h5>
                                        <p style="font-size:12px; color:var(--text-muted); margin:0;">Uploaded: 2 months ago &bull; 1.2 MB</p>
                                    </div>
                                </div>
                                <div style="display:flex; gap:8px;">
                                    <button class="topbar-icon-btn" title="Download" onclick="showToast('Downloading resume...', 'info')"><i class='bx bx-download'></i></button>
                                    <button class="topbar-icon-btn" title="Delete" style="color:#ef4444;" onclick="this.parentElement.parentElement.style.display='none'; showToast('Resume deleted', 'success')"><i class='bx bx-trash'></i></button>
                                </div>
                            </div>
                            
                            <h4 class="edit-modal-section-title">Personal Information</h4>
                            <div class="edit-modal-grid">
                                <div class="edit-form-group"><label>Email</label><input type="email" id="editEmail" value="${document.getElementById('val-email')?.textContent || 'shubham.k@email.com'}"></div>
                                <div class="edit-form-group"><label>Phone</label><input type="text" id="editPhone" value="${document.getElementById('val-phone')?.textContent || '+91 98765 43210'}"></div>
                                <div class="edit-form-group"><label>Location</label><input type="text" id="editLocation" value="${document.getElementById('val-location')?.textContent || 'Pune, Maharashtra'}"></div>
                                <div class="edit-form-group"><label>Date of Birth</label><input type="text" id="editDOB" value="${document.getElementById('val-dob')?.textContent || '15 March 1998'}"></div>
                            </div>
                            
                            <h4 class="edit-modal-section-title">Academic Details</h4>
                            <div class="edit-modal-grid">
                                <div class="edit-form-group"><label>Department</label><input type="text" id="editDepartment" value="${document.getElementById('val-department')?.textContent || 'Computer Engineering'}"></div>
                                <div class="edit-form-group"><label>Graduation Year</label><input type="text" id="editGradYear" value="${document.getElementById('val-gradYear')?.textContent || '2020'}"></div>
                                <div class="edit-form-group"><label>Roll Number</label><input type="text" id="editRollNumber" value="${document.getElementById('val-rollNumber')?.textContent || '2020COMP042'}"></div>
                                <div class="edit-form-group"><label>Batch Mentor</label><input type="text" id="editMentor" value="${document.getElementById('val-mentor')?.textContent || 'Prof. R. D. More'}"></div>
                            </div>

                            <h4 class="edit-modal-section-title">Professional Details</h4>
                            <div class="edit-modal-grid">
                                <div class="edit-form-group"><label>Job Title</label><input type="text" id="editJobTitle" value="${document.getElementById('val-jobTitle')?.textContent || 'Software Developer'}"></div>
                                <div class="edit-form-group"><label>Company</label><input type="text" id="editCompany" value="${document.getElementById('val-company')?.textContent || 'Tech Solutions Pvt. Ltd.'}"></div>
                                <div class="edit-form-group"><label>Experience</label><input type="text" id="editExperience" value="${document.getElementById('val-experience')?.textContent || '2-5 years'}"></div>
                                <div class="edit-form-group"><label>Skills</label><input type="text" id="editSkills" value="${document.getElementById('val-skills')?.textContent || 'Python, Django, React, AWS'}"></div>
                            </div>

                            <h4 class="edit-modal-section-title">Social Links</h4>
                            <div class="edit-modal-grid" style="margin-bottom: 0;">
                                <div class="edit-form-group"><label>LinkedIn</label><input type="text" id="editLinkedin" value="${document.getElementById('val-linkedin')?.textContent || 'linkedin.com/in/shubhamk'}"></div>
                                <div class="edit-form-group"><label>GitHub</label><input type="text" id="editGithub" value="${document.getElementById('val-github')?.textContent || 'github.com/shubhamk'}"></div>
                            </div>
                        </div>
                        <div class="edit-modal-footer">
                            <button class="btn btn-secondary" onclick="closeEditProfile()">Cancel</button>
                            <button class="btn btn-primary" onclick="saveEditProfile()">Save Changes</button>
                        </div>
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', modalHTML);
        } else {
            // Update modal values naturally if it already exists
            document.getElementById('editEmail').value = document.getElementById('val-email')?.textContent || '';
            document.getElementById('editPhone').value = document.getElementById('val-phone')?.textContent || '';
            document.getElementById('editLocation').value = document.getElementById('val-location')?.textContent || '';
            document.getElementById('editDOB').value = document.getElementById('val-dob')?.textContent || '';
            document.getElementById('editDepartment').value = document.getElementById('val-department')?.textContent || '';
            document.getElementById('editGradYear').value = document.getElementById('val-gradYear')?.textContent || '';
            document.getElementById('editRollNumber').value = document.getElementById('val-rollNumber')?.textContent || '';
            document.getElementById('editMentor').value = document.getElementById('val-mentor')?.textContent || '';
            document.getElementById('editJobTitle').value = document.getElementById('val-jobTitle')?.textContent || '';
            document.getElementById('editCompany').value = document.getElementById('val-company')?.textContent || '';
            document.getElementById('editExperience').value = document.getElementById('val-experience')?.textContent || '';
            document.getElementById('editSkills').value = document.getElementById('val-skills')?.textContent || '';
            document.getElementById('editLinkedin').value = document.getElementById('val-linkedin')?.textContent || '';
            document.getElementById('editGithub').value = document.getElementById('val-github')?.textContent || '';
        }
        document.getElementById('editProfileModalBox').classList.add('active');
    };

    window.closeEditProfile = function() {
        document.getElementById('editProfileModalBox').classList.remove('active');
    };

    window.saveEditProfile = function() {
        showToast('Profile saved successfully! 🎉', 'success');
        
        // Update Header
        const newJob = document.getElementById('editJobTitle').value;
        const newComp = document.getElementById('editCompany').value;
        const roleEl = document.querySelector('.profile-role');
        const compEl = document.querySelector('.profile-company');
        if (roleEl) roleEl.textContent = newJob;
        if (compEl) compEl.innerHTML = `<i class='bx bxs-business'></i> ${newComp}`;

        // Helper to update text content safely
        const setVal = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
        
        // Personal
        setVal('val-email', document.getElementById('editEmail').value);
        setVal('val-phone', document.getElementById('editPhone').value);
        setVal('val-location', document.getElementById('editLocation').value);
        setVal('val-dob', document.getElementById('editDOB').value);
        
        // Academic
        setVal('val-department', document.getElementById('editDepartment').value);
        setVal('val-gradYear', document.getElementById('editGradYear').value);
        setVal('val-rollNumber', document.getElementById('editRollNumber').value);
        setVal('val-mentor', document.getElementById('editMentor').value);
        
        // Professional
        setVal('val-jobTitle', newJob);
        setVal('val-company', newComp);
        setVal('val-experience', document.getElementById('editExperience').value);
        setVal('val-skills', document.getElementById('editSkills').value);
        
        // Social
        setVal('val-linkedin', document.getElementById('editLinkedin').value);
        setVal('val-github', document.getElementById('editGithub').value);

        closeEditProfile();
    };

    window.handleResumeDropProfile = function(e) {
        e.preventDefault();
        const box = document.getElementById('aiResumeBoxProfile');
        const loader = document.getElementById('aiResumeLoaderProfile');
        box.style.borderColor = 'var(--primary)';
        
        const file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
        if(!file) return;
        if(file.type !== 'application/pdf') {
            showToast('Please upload a PDF document.', 'error');
            box.style.borderColor = 'var(--border)';
            return;
        }

        loader.style.display = 'block';

        setTimeout(() => {
            loader.style.display = 'none';
            box.style.borderColor = '#10b981';
            box.style.background = 'rgba(16, 185, 129, 0.05)';
            box.querySelector('h4').textContent = 'Profile Extracted! ✅';
            box.querySelector('p').textContent = `Parsed data from: ${file.name}`;
            
            // Mock AI Filling logic
            if(document.getElementById('editJobTitle')) document.getElementById('editJobTitle').value = 'Lead AI Architect';
            if(document.getElementById('editCompany')) document.getElementById('editCompany').value = 'OpenAI';
            if(document.getElementById('editExperience')) document.getElementById('editExperience').value = '10+ years';
            if(document.getElementById('editSkills')) document.getElementById('editSkills').value = 'Python, PyTorch, LLMs, Scalable Systems';
            if(document.getElementById('editLocation')) document.getElementById('editLocation').value = 'San Francisco, CA';
            
            showToast('AI magically updated your profile!', 'success');
        }, 2000);
    };

    window.previewEditProfilePic = function(input) {
        if (input.files && input.files[0]) {
            if (input.files[0].size > 2 * 1024 * 1024) {
                showToast('Photo must be less than 2MB', 'error');
                return;
            }
            const reader = new FileReader();
            reader.onload = function(e) {
                document.getElementById('editProfilePicPreview').src = e.target.result;
                const topAvatar = document.querySelector('.profile-avatar');
                if (topAvatar) topAvatar.src = e.target.result;
                showToast('Profile photo updated', 'success');
            };
            reader.readAsDataURL(input.files[0]);
        }
    };

    // ============================================
    // VIEW: ALUMNI NETWORK (Filterable)
    // ============================================
    function renderNetwork() {
        return `
            <div class="page-title-bar">
                <div><h1>Alumni Network</h1><p>Connect with graduates across the globe.</p></div>
                <span id="networkCount" style="color:var(--primary);font-size:15px;font-weight:700;background:var(--bg-secondary);padding:6px 12px;border-radius:20px;border:1px solid var(--border);">${APP_DATA.topAlumni.length} Alumni Found</span>
            </div>

            <div class="filter-bar">
                <div class="filter-input" style="min-width: 250px;">
                    <i class='bx bx-search'></i>
                    <input type="text" placeholder="Search by name, company, or role..." id="networkSearch" oninput="filterNetwork()">
                </div>
                <select id="roleFilter" onchange="filterNetwork()">
                    <option value="">All Roles</option>
                    ${[...new Set(APP_DATA.topAlumni.map(a => a.role))].sort().map(r => `<option value="${r}">${r}</option>`).join('')}
                </select>
                <select id="batchFilter" onchange="filterNetwork()">
                    <option value="">All Batches</option>
                    ${[...new Set(APP_DATA.topAlumni.map(a => a.batch))].sort((x,y)=>y-x).map(b => `<option value="${b}">${b}</option>`).join('')}
                </select>
                <select id="companyFilter" onchange="filterNetwork()">
                    <option value="">All Companies</option>
                    ${[...new Set(APP_DATA.topAlumni.map(a => a.company))].sort().map(c => `<option value="${c}">${c}</option>`).join('')}
                </select>
            </div>

            <div class="network-grid" id="networkGrid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 24px;">
                ${APP_DATA.topAlumni.map(a => networkCard(a)).join('')}
            </div>
        `;
    }
    window.filterNetwork = function() {
        const search = (document.getElementById('networkSearch')?.value || '').toLowerCase();
        const batch = document.getElementById('batchFilter')?.value || '';
        const company = document.getElementById('companyFilter')?.value || '';
        const role = document.getElementById('roleFilter')?.value || '';
        
        document.querySelectorAll('.network-card').forEach(card => {
            const matchSearch = !search || card.dataset.name.includes(search) || card.dataset.company.toLowerCase().includes(search) || (card.dataset.role || '').toLowerCase().includes(search);
            const matchBatch = !batch || card.dataset.batch === batch;
            const matchCompany = !company || card.dataset.company === company;
            const matchRole = !role || card.dataset.role === role;
            card.style.display = (matchSearch && matchBatch && matchCompany && matchRole) ? '' : 'none';
        });
        
        // Update count
        const visibleElements = Array.from(document.querySelectorAll('.network-card')).filter(el => el.style.display !== 'none');
        const visible = visibleElements.length;
        const countSpan = document.getElementById('networkCount');
        if (countSpan) countSpan.textContent = visible + ' Alumni Found';
    };
    window.toggleBookmark = function(id) {
        if (bookmarkedAlumni.has(id)) { bookmarkedAlumni.delete(id); showToast('Removed from bookmarks', 'info'); }
        else { bookmarkedAlumni.add(id); showToast('Added to bookmarks!', 'success'); }
        const btn = document.querySelector(`.bookmark-btn[data-id="${id}"] i`);
        if (btn) btn.className = bookmarkedAlumni.has(id) ? 'bx bxs-bookmark' : 'bx bx-bookmark';
    };
    const CURRENT_USER_BATCH = '2020'; // Mocking user context

    window.connectAlumni = function(name, batch, btn) {
        if (batch !== CURRENT_USER_BATCH) {
            showToast(`Action Denied: You can only connect with alumni from your own batch (${CURRENT_USER_BATCH}).`, 'error');
            return;
        }
        if (btn) {
            btn.innerHTML = '<i class="bx bx-check"></i> Pending';
            btn.classList.add('btn-secondary');
            btn.classList.remove('btn-primary');
            btn.disabled = true;
        }
        showToast(`Connection request sent to ${name}!`, 'success');
    };

    // ============================================
    // VIEW: CHAT (Fully Interactive)
    // ============================================
    function renderChat() {
        return `
            <div class="page-title-bar">
                <div><h1>Messages</h1><p>Chat with batchmates, mentors, and alumni groups.</p></div>
            </div>

            <div class="chat-layout">
                <div class="chat-contacts">
                    <div class="chat-contacts-header">
                        <h3>Conversations</h3>
                        <div class="chat-tabs">
                            <button class="chat-tab active" onclick="filterChatContacts('all', this)">All</button>
                            <button class="chat-tab" onclick="filterChatContacts('group', this)">Groups</button>
                            <button class="chat-tab" onclick="filterChatContacts('direct', this)">Direct</button>
                        </div>
                    </div>
                    <div class="chat-search" style="padding:0 16px 12px;">
                        <div class="filter-input" style="margin:0;">
                            <i class='bx bx-search'></i>
                            <input type="text" placeholder="Search conversations..." oninput="searchChats(this.value)">
                        </div>
                    </div>
                    <div class="chat-list" id="chatContactList">
                        ${APP_DATA.chatContacts
                            .filter(c => !c.isGroup || c.name.includes(CURRENT_USER_BATCH))
                            .map((c, i) => chatContactItem(c, i === 2)).join('')}
                    </div>
                </div>
                <div class="chat-main" id="chatMainArea">
                    ${renderChatMain()}
                </div>
            </div>
        `;
    }

    function renderChatMain() {
        const c = activeChatContact;
        return `
            <div class="chat-main-header">
                <img src="${c.avatar}" alt="${c.name}">
                <div class="ch-info">
                    <h4>${c.name}</h4>
                    <span style="color:${c.online ? '#10b981' : 'var(--text-muted)'};">${c.online ? '● Online' : '○ Offline'}</span>
                </div>
                <div style="margin-left:auto;display:flex;gap:8px;">
                    <button class="topbar-icon-btn" data-tooltip="Voice Call"><i class='bx bxs-phone'></i></button>
                    <button class="topbar-icon-btn" data-tooltip="Video Call"><i class='bx bxs-video'></i></button>
                    <button class="topbar-icon-btn" data-tooltip="More"><i class='bx bx-dots-vertical-rounded'></i></button>
                </div>
            </div>
            <div class="chat-messages" id="chatMessagesContainer">
                <div style="text-align:center;padding:16px;"><span class="badge badge-primary">Today</span></div>
                ${chatMessages.map(msg => chatBubble(msg)).join('')}
            </div>
            <div class="chat-input-area">
                <button class="topbar-icon-btn" data-tooltip="Attach File"><i class='bx bx-paperclip'></i></button>
                <button class="topbar-icon-btn" data-tooltip="Emoji"><i class='bx bx-smile'></i></button>
                <input type="text" placeholder="Type a message..." id="chatInput">
                <button class="send-btn" id="sendMsgBtn"><i class='bx bxs-send'></i></button>
            </div>
        `;
    }

    function setupChatInteractions() {
        const input = document.getElementById('chatInput');
        const sendBtn = document.getElementById('sendMsgBtn');
        if (input && sendBtn) {
            const send = () => {
                const text = input.value.trim();
                if (!text) return;
                const now = new Date();
                const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
                chatMessages.push({ sender: 'me', text, time: timeStr });
                input.value = '';
                const container = document.getElementById('chatMessagesContainer');
                if (container) {
                    container.innerHTML += chatBubble({ sender: 'me', text, time: timeStr });
                    container.scrollTop = container.scrollHeight;
                }
                // Simulate auto-reply after 2s
                setTimeout(() => {
                    const replies = [
                        "That sounds great! Let me check and get back to you.",
                        "Thanks for sharing! I'll look into it.",
                        "Sure, let's discuss this at the next meetup.",
                        "Absolutely! I'll send you the details soon.",
                        "Great to hear from you! 🎉"
                    ];
                    const reply = replies[Math.floor(Math.random() * replies.length)];
                    const replyTime = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
                    chatMessages.push({ sender: 'other', name: activeChatContact.name, text: reply, time: replyTime });
                    if (container) {
                        container.innerHTML += chatBubble({ sender: 'other', name: activeChatContact.name, text: reply, time: replyTime });
                        container.scrollTop = container.scrollHeight;
                    }
                }, 2000);
            };
            sendBtn.addEventListener('click', send);
            input.addEventListener('keypress', (e) => { if (e.key === 'Enter') send(); });
        }
        // Scroll to bottom
        const container = document.getElementById('chatMessagesContainer');
        if (container) container.scrollTop = container.scrollHeight;
    }

    window.selectChatContact = function(id) {
        activeChatContact = APP_DATA.chatContacts.find(c => c.id === id) || activeChatContact;
        chatMessages = [
            { sender: 'other', name: activeChatContact.name, text: `Hey! This is ${activeChatContact.name}.`, time: '10:00 AM' },
            { sender: 'me', text: 'Hi! Great to connect with you here.', time: '10:02 AM' }
        ];
        // Re-render contacts + main
        document.querySelectorAll('.chat-contact-item').forEach(c => c.classList.remove('active'));
        event.currentTarget.classList.add('active');
        const chatMain = document.getElementById('chatMainArea');
        if (chatMain) {
            chatMain.innerHTML = renderChatMain();
            setupChatInteractions();
        }
    };

    window.filterChatContacts = function(type, btn) {
        document.querySelectorAll('.chat-tab').forEach(t => t.classList.remove('active'));
        btn.classList.add('active');
        document.querySelectorAll('.chat-contact-item').forEach(item => {
            if (type === 'all') item.style.display = '';
            else if (type === 'group') item.style.display = item.dataset.group === 'true' ? '' : 'none';
            else item.style.display = item.dataset.group === 'false' ? '' : 'none';
        });
    };

    window.searchChats = function(query) {
        const q = query.toLowerCase();
        document.querySelectorAll('.chat-contact-item').forEach(item => {
            item.style.display = item.dataset.name.toLowerCase().includes(q) ? '' : 'none';
        });
    };

    // ============================================
    // VIEW: NOTIFICATIONS
    // ============================================
    function renderNotifications() {
        return `
            <div class="page-title-bar">
                <div><h1>Notifications</h1><p>Stay updated with the latest alerts and announcements.</p></div>
                <button class="btn btn-secondary btn-sm" onclick="markAllRead()"><i class='bx bx-check-double'></i> Mark All Read</button>
            </div>
            <div class="dash-section">
                <div class="dash-section-body">
                    <div class="activity-list" id="notificationsList">
                        ${notifications.map((act, i) => `
                            <div class="activity-item" id="notif-${i}" style="opacity:1;transition:all 0.3s ease;">
                                <div class="act-icon stat-icon ${act.color}"><i class='bx ${act.icon}'></i></div>
                                <div class="act-content"><h4>${act.title}</h4><p>${act.desc}</p></div>
                                <span class="act-time">${act.time}</span>
                                <button class="topbar-icon-btn" style="margin-left:8px;" onclick="dismissNotif(${i})" data-tooltip="Dismiss"><i class='bx bx-x'></i></button>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }
    window.markAllRead = function() {
        document.querySelectorAll('.activity-item').forEach(item => {
            item.style.opacity = '0.5';
            item.style.filter = 'grayscale(100%)';
        });
        document.querySelectorAll('.nav-badge, .notif-dot').forEach(badge => badge.style.display = 'none');
        showToast('All notifications marked as read', 'success');
    };
    window.dismissNotif = function(i) {
        const el = document.getElementById(`notif-${i}`);
        if (el) { el.style.opacity = '0'; el.style.height = '0'; el.style.overflow = 'hidden'; el.style.padding = '0'; el.style.margin = '0'; }
    };

    // ============================================
    // VIEW: EVENTS (with Registration)
    // ============================================
    function renderEvents() {
        return `
            <div class="page-title-bar">
                <div><h1>Events & Meetups</h1><p>Browse, register, and stay informed about upcoming events.</p></div>
            </div>
            <div class="dash-events-list">
                ${APP_DATA.events.map(ev => {
                    const d = formatDate(ev.date);
                    const isRegistered = registeredEvents.has(ev.id);
                    return `
                        <div class="dash-section" style="margin-bottom:16px;">
                            <div class="dash-section-body" style="display:flex;align-items:center;gap:20px;flex-wrap:wrap;">
                                <div style="width:64px;height:70px;background:var(--primary);border-radius:var(--radius-md);display:flex;flex-direction:column;align-items:center;justify-content:center;color:#fff;min-width:64px;">
                                    <span style="font-size:24px;font-weight:800;line-height:1;">${d.day}</span>
                                    <span style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:1px;opacity:0.8;">${d.month}</span>
                                </div>
                                <div style="flex:1;min-width:200px;">
                                    <h3 style="font-size:18px;font-weight:700;margin-bottom:6px;">${ev.title}</h3>
                                    <p style="font-size:14px;color:var(--text-secondary);margin-bottom:8px;">${ev.description}</p>
                                    <div class="event-meta">
                                        <span><i class='bx bx-time-five'></i> ${ev.time}</span>
                                        <span><i class='bx bx-map'></i> ${ev.location}</span>
                                        <span><i class='bx bx-user-check'></i> ${ev.attendees + (isRegistered ? 1 : 0)} Attending</span>
                                    </div>
                                </div>
                                <button class="btn ${isRegistered ? 'btn-secondary' : 'btn-primary'} btn-sm" id="eventBtn-${ev.id}" onclick="toggleEventReg(${ev.id})">
                                    ${isRegistered ? '<i class="bx bx-check"></i> Registered' : 'Register'}
                                </button>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }
    window.toggleEventReg = function(id) {
        const btn = document.getElementById(`eventBtn-${id}`);
        if (registeredEvents.has(id)) {
            registeredEvents.delete(id);
            showToast('Registration cancelled', 'info');
        } else {
            registeredEvents.add(id);
            showToast('Successfully registered for the event! 🎉', 'success');
        }
        renderView('events');
    };

    // ============================================
    // VIEW: JOBS (with Apply)
    // ============================================
    function renderJobs() {
        return `
            <div class="page-title-bar">
                <div><h1>Job Board</h1><p>Explore career opportunities shared by the alumni network.</p></div>
                <button class="btn btn-primary btn-sm" onclick="togglePostJobModal()"><i class='bx bx-plus'></i> Post a Job</button>
            </div>
            <div class="filter-bar">
                <div class="filter-input">
                    <i class='bx bx-search'></i>
                    <input type="text" placeholder="Search jobs by title, company..." oninput="filterJobs(this.value)">
                </div>
                <select onchange="filterJobsByType(this.value)">
                    <option value="">All Types</option>
                    <option>Full-time</option><option>Internship</option><option>Part-time</option>
                </select>
                <select onchange="filterJobsByExp(this.value)">
                    <option value="">All Experience</option>
                    <option>Fresher</option><option>2-4 yrs</option><option>3-5 yrs</option><option>5-8 yrs</option>
                </select>
            </div>
            <div class="jobs-list" id="jobsList">
                ${APP_DATA.jobs.map(j => jobCard(j, true)).join('')}
            </div>
        `;
    }
    window.applyJob = function(id) {
        if (appliedJobs.has(id)) { showToast('You have already applied', 'info'); return; }
        appliedJobs.add(id);
        const btn = document.getElementById(`applyBtn-${id}`);
        if (btn) { btn.innerHTML = '<i class="bx bx-check"></i> Applied'; btn.className = 'btn btn-secondary btn-sm'; }
        showToast('Application submitted successfully! 🎉', 'success');
    };
    window.filterJobs = function(q) {
        q = q.toLowerCase();
        document.querySelectorAll('.job-card').forEach(card => {
            card.style.display = card.dataset.title.includes(q) || card.dataset.company.includes(q) ? '' : 'none';
        });
    };
    window.filterJobsByType = function(type) {
        document.querySelectorAll('.job-card').forEach(card => {
            card.style.display = (!type || card.dataset.type === type) ? '' : 'none';
        });
    };
    window.filterJobsByExp = function(exp) {
        document.querySelectorAll('.job-card').forEach(card => {
            card.style.display = (!exp || card.dataset.exp === exp) ? '' : 'none';
        });
    };

    window.togglePostJobModal = function() {
        if (!document.getElementById('postJobModalBox')) {
            const modalHTML = `
                <div class="edit-modal-overlay" id="postJobModalBox">
                    <div class="edit-modal">
                        <div class="edit-modal-header">
                            <h3>Post a New Job</h3>
                            <button class="edit-modal-close" onclick="closePostJobModal()"><i class="bx bx-x"></i></button>
                        </div>
                        <div class="edit-modal-body">
                            <h4 class="edit-modal-section-title">Job Details</h4>
                            <div class="edit-modal-grid" style="margin-bottom:0;">
                                <div class="edit-form-group"><label>Job Title</label><input type="text" id="newJobTitle" placeholder="e.g. Frontend Engineer"></div>
                                <div class="edit-form-group"><label>Company</label><input type="text" id="newJobCompany" placeholder="e.g. Google"></div>
                                <div class="edit-form-group"><label>Location</label><input type="text" id="newJobLocation" placeholder="e.g. Remote, India"></div>
                                <div class="edit-form-group"><label>Job Type</label>
                                    <select id="newJobType">
                                        <option>Full-time</option><option>Internship</option><option>Part-time</option><option>Contract</option>
                                    </select>
                                </div>
                                <div class="edit-form-group"><label>Experience Required</label>
                                    <select id="newJobExp">
                                        <option>Fresher</option><option>2-4 yrs</option><option>3-5 yrs</option><option>5-8 yrs</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div class="edit-modal-footer">
                            <button class="btn btn-secondary" onclick="closePostJobModal()">Cancel</button>
                            <button class="btn btn-primary" onclick="submitJobPosting()">Post Job</button>
                        </div>
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', modalHTML);
        }
        document.getElementById('postJobModalBox').classList.add('active');
    };

    window.closePostJobModal = function() {
        const m = document.getElementById('postJobModalBox');
        if (m) m.classList.remove('active');
    };

    window.submitJobPosting = function() {
        const title = document.getElementById('newJobTitle').value;
        const company = document.getElementById('newJobCompany').value;
        const location = document.getElementById('newJobLocation').value;
        const type = document.getElementById('newJobType').value;
        const exp = document.getElementById('newJobExp').value;

        if (!title || !company || !location) {
            showToast('Please fill out all required fields!', 'error');
            return;
        }

        const newJob = {
            id: Date.now(),
            title: title,
            company: company,
            location: location,
            type: type,
            experience: exp,
            postedBy: "You",
            postedDate: "Just Now"
        };

        APP_DATA.jobs.unshift(newJob);
        showToast('Job successfully posted! 🚀', 'success');
        closePostJobModal();
        renderView('jobs');
    };

    // ============================================
    // VIEW: GALLERY (Filterable)
    // ============================================
    function renderGallery() {
        return `
            <div class="page-title-bar"><div><h1>Photo Gallery</h1><p>Memories from events, reunions, and campus life.</p></div></div>
            <div class="gallery-tabs" style="justify-content:flex-start;margin-bottom:24px;">
                ${APP_DATA.galleryCategories.map((cat, i) =>
                    `<button class="gallery-tab ${i === 0 ? 'active' : ''}" onclick="filterDashGallery('${cat}', this)">${cat}</button>`
                ).join('')}
            </div>
            <div class="gallery-grid" id="dashGalleryGrid">
                ${APP_DATA.galleryItems.map(item => `
                    <div class="gallery-item" style="background:linear-gradient(135deg, ${item.color}, ${item.color}bb);" data-category="${item.category}">
                        <i class='bx bxs-image'></i>
                        <div class="gallery-overlay"><span><i class='bx bx-expand'></i> ${item.category}</span></div>
                    </div>
                `).join('')}
            </div>
        `;
    }
    window.filterDashGallery = function(category, btn) {
        document.querySelectorAll('.gallery-tab').forEach(t => t.classList.remove('active'));
        btn.classList.add('active');
        const items = document.querySelectorAll('#dashGalleryGrid .gallery-item');
        items.forEach(item => {
            item.style.opacity = '0';
            item.style.transform = 'scale(0.9)';
            setTimeout(() => {
                if (category === 'All' || item.dataset.category === category) {
                    item.style.display = '';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    item.style.display = 'none';
                }
            }, 300);
        });
    };

    // ============================================
    // VIEW: TOP ALUMNI
    // ============================================
    function renderTopAlumni() {
        return `
            <div class="page-title-bar"><div><h1>🏆 Top Alumni</h1><p>Celebrating our most distinguished graduates.</p></div></div>
            <div class="alumni-cards-grid">
                ${APP_DATA.topAlumni.map(a => `
                    <div class="alumni-card" style="cursor:pointer;" onclick="viewAlumniProfile('${a.name.replace(/'/g, "\\'")}')">
                        <img src="${a.avatar}" alt="${a.name}" class="alumni-avatar">
                        <h3 class="alumni-name">${a.name}</h3>
                        <p class="alumni-role">${a.role}</p>
                        <p class="alumni-company"><i class='bx bxs-business'></i> ${a.company} &bull; Batch ${a.batch}</p>
                        <div class="alumni-tags">${a.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>
                        <div class="card-actions" onclick="event.stopPropagation()">
                            <button class="btn btn-primary btn-sm" onclick="connectAlumni('${a.name.replace(/'/g, "\\'")}', '${a.batch}', this)">Connect</button>
                            <button class="btn btn-secondary btn-sm" onclick="navigateTo('chat')"><i class='bx bx-message-dots'></i></button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    // ============================================
    // VIEW: MENTORSHIP
    // ============================================
    function renderMentorship() {
        return `
            <div class="page-title-bar"><div><h1>Mentorship Program</h1><p>Connect with your batch mentor and receive guidance for career growth.</p></div></div>
            <div class="dash-section">
                <div class="dash-section-header"><h3>👨‍🏫 Your Batch Mentor</h3></div>
                <div class="dash-section-body">
                    <div style="display:flex;align-items:center;gap:20px;flex-wrap:wrap;">
                        <img src="https://ui-avatars.com/api/?name=Prof+R+D+More&background=4f46e5&color=fff&size=80" alt="Mentor" style="width:80px;height:80px;border-radius:50%;">
                        <div>
                            <h3 style="font-size:20px;font-weight:700;">Prof. R. D. More</h3>
                            <p style="color:var(--primary);font-weight:500;">Batch Mentor - Computer Engineering</p>
                            <p style="color:var(--text-muted);font-size:14px;margin-top:4px;">Assigned batches: 2019, 2020, 2021</p>
                            <div style="display:flex;gap:8px;margin-top:12px;">
                                <button class="btn btn-primary btn-sm" onclick="navigateTo('chat')"><i class='bx bxs-envelope'></i> Message Mentor</button>
                                <button class="btn btn-secondary btn-sm" onclick="showToast('Call feature coming soon!', 'info')"><i class='bx bxs-phone'></i> Call</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="dash-section" style="margin-top:24px;">
                <div class="dash-section-header"><h3>📋 Mentor Announcements</h3></div>
                <div class="dash-section-body">
                    <div class="activity-list">
                        ${activityItem({ icon: 'bxs-megaphone', color: 'blue', title: 'Batch 2020 - Career Survey', desc: 'Please fill out the annual career progression survey by May 1st.', time: '2 days ago' })}
                        ${activityItem({ icon: 'bxs-calendar-check', color: 'green', title: 'Monthly Check-in Scheduled', desc: 'Virtual mentorship session on April 20th at 6 PM via Zoom.', time: '5 days ago' })}
                        ${activityItem({ icon: 'bxs-trophy', color: 'amber', title: 'Placement Drive Update', desc: 'Batch 2020 achieved 92% placement rate! Congratulations to everyone.', time: '1 week ago' })}
                    </div>
                </div>
            </div>
            <div class="dash-section" style="margin-top:24px;">
                <div class="dash-section-header"><h3>📅 Mentorship Schedule</h3></div>
                <div class="dash-section-body">
                    <table style="width:100%;border-collapse:collapse;">
                        <thead>
                            <tr style="border-bottom:2px solid var(--border);">
                                <th style="padding:12px;text-align:left;font-size:13px;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px;">Date</th>
                                <th style="padding:12px;text-align:left;font-size:13px;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px;">Topic</th>
                                <th style="padding:12px;text-align:left;font-size:13px;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px;">Mode</th>
                                <th style="padding:12px;text-align:left;font-size:13px;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px;">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr style="border-bottom:1px solid var(--border);">
                                <td style="padding:12px;font-weight:600;">Apr 20, 2026</td>
                                <td style="padding:12px;">Career Progression Review</td>
                                <td style="padding:12px;"><span class="badge badge-primary">Virtual</span></td>
                                <td style="padding:12px;"><span style="color:#10b981;font-weight:600;">Upcoming</span></td>
                            </tr>
                            <tr style="border-bottom:1px solid var(--border);">
                                <td style="padding:12px;font-weight:600;">May 15, 2026</td>
                                <td style="padding:12px;">Alumni Meetup Coordination</td>
                                <td style="padding:12px;"><span class="badge badge-accent">In-Person</span></td>
                                <td style="padding:12px;"><span style="color:#f59e0b;font-weight:600;">Planned</span></td>
                            </tr>
                            <tr>
                                <td style="padding:12px;font-weight:600;">Mar 10, 2026</td>
                                <td style="padding:12px;">Resume Review Workshop</td>
                                <td style="padding:12px;"><span class="badge badge-primary">Virtual</span></td>
                                <td style="padding:12px;"><span style="color:var(--text-muted);font-weight:600;">Completed</span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    // ============================================
    // VIEW: SETTINGS
    // ============================================
    function renderSettings() {
        return `
            <div class="page-title-bar"><div><h1>Settings</h1><p>Manage your account preferences and privacy.</p></div></div>

            <div class="dash-section">
                <div class="dash-section-header"><h3>🔔 Notification Preferences</h3></div>
                <div class="dash-section-body">
                    ${settingToggle('Email Notifications', 'Receive event invites and announcements via email', true)}
                    ${settingToggle('Chat Notifications', 'Get notified for new messages', true)}
                    ${settingToggle('Job Alerts', 'Receive alerts for new job postings', true)}
                    ${settingToggle('Event Reminders', 'Get reminded before upcoming events', false)}
                </div>
            </div>

            <div class="dash-section" style="margin-top:24px;">
                <div class="dash-section-header"><h3>🔒 Privacy</h3></div>
                <div class="dash-section-body">
                    ${settingToggle('Show Profile to Alumni', 'Make your profile visible in the alumni network', true)}
                    ${settingToggle('Show Email', 'Display your email on your public profile', false)}
                    ${settingToggle('Show Phone', 'Display your phone number on your public profile', false)}
                </div>
            </div>

            <div class="dash-section" style="margin-top:24px;">
                <div class="dash-section-header"><h3>🔑 Account Security</h3></div>
                <div class="dash-section-body">
                    <div style="display:flex;gap:12px;flex-wrap:wrap;">
                        <button class="btn btn-secondary btn-sm" onclick="showToast('Password change coming with backend!', 'info')">
                            <i class='bx bx-lock'></i> Change Password
                        </button>
                        <button class="btn btn-secondary btn-sm" onclick="showToast('2FA coming with backend!', 'info')">
                            <i class='bx bx-shield'></i> Enable 2FA
                        </button>
                        <button class="btn btn-secondary btn-sm" style="color:#ef4444;border-color:#ef4444;" onclick="showToast('Account deletion requires admin approval', 'warning')">
                            <i class='bx bx-trash'></i> Delete Account
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    // ============================================
    // SHARED COMPONENT BUILDERS
    // ============================================
    function statCard(icon, color, value, label) {
        return `<div class="dash-stat-card">
            <div class="stat-icon ${color}"><i class='bx ${icon}'></i></div>
            <div class="stat-info"><h3>${value}</h3><p>${label}</p></div>
        </div>`;
    }

    function activityItem(act) {
        return `<div class="activity-item">
            <div class="act-icon stat-icon ${act.color}"><i class='bx ${act.icon}'></i></div>
            <div class="act-content"><h4>${act.title}</h4><p>${act.desc}</p></div>
            <span class="act-time">${act.time}</span>
        </div>`;
    }

    function detailItem(icon, label, value, isLink = false, id = '') {
        return `<div class="detail-item">
            <div class="di-icon"><i class='bx ${icon}'></i></div>
            <div><div class="di-label">${label}</div><div class="di-value" ${id ? `id="${id}"` : ''} ${isLink ? 'style="color:var(--primary);"' : ''}>${value}</div></div>
        </div>`;
    }

    function jobCard(job, showApply = false) {
        const applied = appliedJobs.has(job.id);
        return `<div class="job-card" data-title="${job.title.toLowerCase()}" data-company="${job.company.toLowerCase()}" data-type="${job.type}" data-exp="${job.experience}">
            <div class="job-logo"><i class='bx bxs-buildings'></i></div>
            <div class="job-info">
                <h4>${job.title}</h4>
                <p class="job-company">${job.company} &bull; ${job.location}</p>
                <div class="job-tags">
                    <span>${job.type}</span><span>${job.experience}</span>
                    <span>By ${job.postedBy}</span><span>${job.postedDate}</span>
                </div>
            </div>
            <button class="btn ${applied ? 'btn-secondary' : 'btn-primary'} btn-sm" id="applyBtn-${job.id}" onclick="applyJob(${job.id})">
                ${applied ? '<i class="bx bx-check"></i> Applied' : 'Apply'}
            </button>
        </div>`;
    }

    function networkCard(a) {
        const bookmarked = bookmarkedAlumni.has(a.id);
        return `<div class="network-card" style="cursor:pointer;" onclick="viewAlumniProfile('${a.name.replace(/'/g, "\\'")}')" data-name="${a.name.toLowerCase()}" data-batch="${a.batch}" data-company="${a.company}" data-role="${a.role}">
            <img src="${a.avatar}" alt="${a.name}">
            <div class="nc-info">
                <h4>${a.name}</h4>
                <p>${a.role} at ${a.company}</p>
                <span class="nc-batch">Batch ${a.batch}</span>
            </div>
            <div style="display:flex;gap:6px;margin-left:auto;" onclick="event.stopPropagation()">
                <button class="topbar-icon-btn bookmark-btn" data-id="${a.id}" onclick="toggleBookmark(${a.id})" data-tooltip="Bookmark">
                    <i class='bx ${bookmarked ? 'bxs-bookmark' : 'bx-bookmark'}'></i>
                </button>
                <button class="btn btn-primary btn-sm" onclick="connectAlumni('${a.name.replace(/'/g, "\\'")}', '${a.batch}', this)"><i class='bx bx-user-plus'></i></button>
            </div>
        </div>`;
    }

    function chatContactItem(c, isActive = false) {
        return `<div class="chat-contact-item ${isActive ? 'active' : ''}" onclick="selectChatContact(${c.id})" data-group="${c.isGroup}" data-name="${c.name}">
            <div style="position:relative">
                <img src="${c.avatar}" alt="${c.name}" class="cc-avatar">
                ${c.online ? '<span class="cc-status"></span>' : ''}
            </div>
            <div class="cc-meta">
                <h4>${c.isGroup ? '👥 ' : ''}${c.name}</h4>
                <p>${c.lastMsg}</p>
            </div>
            <span class="cc-time">${c.time}</span>
        </div>`;
    }

    function chatBubble(msg) {
        return `<div class="chat-msg ${msg.sender === 'me' ? 'sent' : 'received'}">
            <div class="msg-bubble">${msg.text}</div>
            <span class="msg-time">${msg.time}</span>
        </div>`;
    }

    function settingToggle(title, desc, checked) {
        const id = title.replace(/\s+/g, '_').toLowerCase();
        return `<div style="display:flex;align-items:center;justify-content:space-between;padding:16px 0;border-bottom:1px solid var(--border);">
            <div>
                <h4 style="font-size:15px;font-weight:600;">${title}</h4>
                <p style="font-size:13px;color:var(--text-muted);">${desc}</p>
            </div>
            <label style="position:relative;display:inline-block;width:48px;height:26px;cursor:pointer;">
                <input type="checkbox" ${checked ? 'checked' : ''} id="${id}" style="opacity:0;width:0;height:0;" onchange="showToast('${title} ' + (this.checked ? 'enabled' : 'disabled'), 'success')">
                <span style="position:absolute;inset:0;background:${checked ? 'var(--primary)' : 'var(--border)'};border-radius:26px;transition:all 0.3s ease;" onclick="this.previousElementSibling.click(); this.style.background = this.previousElementSibling.checked ? 'var(--primary)' : 'var(--border)'; var dot = this.querySelector('span'); if(dot) dot.style.transform = this.previousElementSibling.checked ? 'translateX(22px)' : 'translateX(0)';"><span style="position:absolute;top:3px;left:3px;width:20px;height:20px;background:#fff;border-radius:50%;transition:all 0.3s ease;${checked ? 'transform:translateX(22px);' : ''}"></span></span>
            </label>
        </div>`;
    }

    // ============================================
    // VIEW ALUMNI PROFILE DIALOG
    // ============================================
    window.viewAlumniProfile = function(name) {
        const a = APP_DATA.topAlumni.find(x => x.name === name);
        if(!a) return;
        
        const existing = document.getElementById('viewAlumniModalBox');
        if(existing) existing.remove();

        const modalHTML = `
            <div class="edit-modal-overlay active" id="viewAlumniModalBox" style="align-items:center; justify-content:center;">
                <div class="edit-modal" style="max-width:500px; text-align:center;">
                    <div class="edit-modal-header" style="justify-content: flex-end; border-bottom: none; padding-bottom: 0;">
                        <button class="edit-modal-close" onclick="document.getElementById('viewAlumniModalBox').remove()"><i class="bx bx-x"></i></button>
                    </div>
                    <div class="edit-modal-body" style="padding-top:0;">
                        <img src="${a.avatar}" style="width:100px; height:100px; border-radius:50%; margin-bottom:16px; border:3px solid var(--primary-light);">
                        <h2 style="font-size:24px; margin-bottom:4px; font-weight:700;">${a.name}</h2>
                        <p style="color:var(--primary); font-weight:600; margin-bottom:8px;">${a.role} at ${a.company}</p>
                        <p style="color:var(--text-muted); font-size:14px; margin-bottom:20px;">Class of ${a.batch}</p>
                        
                        <div style="display:flex; flex-wrap:wrap; justify-content:center; gap:8px; margin-bottom:30px;">
                            ${a.tags.map(t => `<span style="background:var(--bg-body); padding:6px 12px; border-radius:20px; font-size:12px; font-weight:600; color:var(--text-secondary); border:1px solid var(--border);">${t}</span>`).join('')}
                        </div>
                        
                        <div style="display:flex; gap:16px; justify-content:center;">
                            <button class="btn btn-primary" onclick="connectAlumni('${a.name.replace(/'/g,"\\'")}', '${a.batch}', this)">
                                <i class='bx bx-user-plus'></i> Connect
                            </button>
                            <button class="btn btn-secondary" onclick="navigateTo('chat'); document.getElementById('viewAlumniModalBox').remove();">
                                <i class='bx bx-message-dots'></i> Message
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    };

    // ============================================
    // AI COPILOT INITIALIZATION
    // ============================================
    function initAICopilot() {
        if(document.getElementById('aiCopilotBtn')) return;
        const aiHTML = `
            <button class="ai-copilot-btn" id="aiCopilotBtn" onclick="document.getElementById('aiCopilotPanel').classList.toggle('active')">
                <i class='bx bxs-bot'></i>
            </button>
            <div class="ai-copilot-panel" id="aiCopilotPanel">
                <div class="ai-header">
                    <h3><i class='bx bxs-magic-wand'></i> AI Copilot</h3>
                    <button class="ai-close" onclick="document.getElementById('aiCopilotPanel').classList.remove('active')"><i class='bx bx-x'></i></button>
                </div>
                <div class="ai-body" id="aiBody">
                    <div class="ai-msg bot">Hello! I can help you find alumni, skills, or companies naturally. Try asking: "Who works at Amazon in Data?"</div>
                </div>
                <div class="ai-footer">
                    <input type="text" id="aiInput" placeholder="Ask AI..." onkeypress="if(event.key==='Enter') executeAIQuery()">
                    <button onclick="executeAIQuery()"><i class='bx bxs-send'></i></button>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', aiHTML);
    }
    
    window.executeAIQuery = function() {
        const input = document.getElementById('aiInput');
        const q = input.value.trim().toLowerCase();
        if(!q) return;
        
        const body = document.getElementById('aiBody');
        body.innerHTML += `<div class="ai-msg user">${input.value}</div>`;
        input.value = '';
        
        // Mock AI Processing Animation
        const loadingId = 'aiLoad_' + Date.now();
        body.innerHTML += `<div class="ai-msg bot" id="${loadingId}"><i class='bx bx-loader-alt bx-spin'></i> AI analyzing network graph...</div>`;
        body.scrollTop = body.scrollHeight;
        
        setTimeout(() => {
            const el = document.getElementById(loadingId);
            if(el) el.remove();
            
            let found = APP_DATA.topAlumni.filter(a => 
                (q.includes(a.company.toLowerCase()) || q.includes(a.role.toLowerCase()) || a.tags.some(t => q.includes(t.toLowerCase())))
            );
            
            let reply = '';
            if(found.length > 0) {
                reply += `<div class="ai-msg bot">I found ${found.length} matching alumni! Here they are:</div>`;
                found.forEach(a => {
                    reply += `
                    <div class="ai-alumni-card">
                        <img src="${a.avatar}" alt="img">
                        <div style="flex:1">
                            <h4>${a.name}</h4>
                            <p>${a.role} @ ${a.company}</p>
                        </div>
                        <button class="btn btn-primary btn-sm" onclick="connectAlumni('${a.name.replace(/'/g, "\\'")}', '${a.batch}', this)" style="padding:4px 8px;font-size:11px;">Connect</button>
                    </div>`;
                });
            } else {
                reply = `<div class="ai-msg bot">I couldn't find anyone specifically matching that request right now. Try searching by company like 'Google' or role like 'Data'.</div>`;
            }
            body.innerHTML += reply;
            body.scrollTop = body.scrollHeight;
        }, 1200);
    };

    // Delay init slightly to ensure DOM is ready
    setTimeout(() => initAICopilot(), 500);
});
