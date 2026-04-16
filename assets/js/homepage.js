// ============================================
// ALUMNI PORTAL - HOMEPAGE ENGINE (Light Theme)
// ============================================

document.addEventListener('DOMContentLoaded', function() {

    // ===== NAVBAR SCROLL =====
    var navbar = document.getElementById('hpNavbar');
    window.addEventListener('scroll', function() {
        if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 50);
        var st = document.getElementById('hpScrollTop');
        if (st) st.classList.toggle('visible', window.scrollY > 600);
    });

    // ===== MOBILE MENU =====
    window.toggleHpMobile = function() {
        var m = document.getElementById('hpMobileMenu');
        var btn = document.getElementById('hpMobileToggle');
        if (!m || !btn) return;
        m.classList.toggle('open');
        btn.innerHTML = m.classList.contains('open')
            ? "<i class='bx bx-x'></i>"
            : "<i class='bx bx-menu'></i>";
    };

    // ===== HERO FEED =====
    var feedData = [
        { img: 'https://i.pravatar.cc/150?img=11', name: 'Aarav Patel', action: 'joined as Senior Engineer', sub: 'Google - Batch 2015', tag: 'New', tagBg: 'rgba(16,185,129,0.1)', tagColor: '#10b981' },
        { img: 'https://i.pravatar.cc/150?img=5', name: 'Sneha Kulkarni', action: 'posted a job opening', sub: 'Microsoft - Batch 2016', tag: 'Job', tagBg: 'rgba(79,70,229,0.1)', tagColor: '#4f46e5' },
        { img: 'https://i.pravatar.cc/150?img=8', name: 'Vikram Joshi', action: 'shared an event update', sub: 'Amazon - Batch 2018', tag: 'Event', tagBg: 'rgba(245,158,11,0.1)', tagColor: '#f59e0b' }
    ];
    var heroFeed = document.getElementById('hpHeroFeed');
    if (heroFeed) {
        heroFeed.innerHTML = feedData.map(function(f) {
            return '<div class="hp-feed-row">'
                + '<img src="' + f.img + '" alt="' + f.name + '">'
                + '<div style="flex:1;min-width:0;">'
                + '<div class="fr-name">' + f.name + ' <span class="fr-action">' + f.action + '</span></div>'
                + '<div class="fr-sub">' + f.sub + '</div>'
                + '</div>'
                + '<span class="fr-tag" style="background:' + f.tagBg + ';color:' + f.tagColor + ';">' + f.tag + '</span>'
                + '</div>';
        }).join('');
    }

    // ===== MARQUEE =====
    var companies = ['Google', 'Microsoft', 'Amazon', 'Infosys', 'Wipro', 'TCS', 'Tech Mahindra', 'Cognizant', 'HDFC Bank', 'Reliance', 'Flipkart'];
    var icons = ['bxl-google', 'bxl-microsoft', 'bxl-amazon', 'bx-code-alt', 'bx-chip', 'bx-server', 'bx-cloud', 'bx-brain', 'bx-credit-card', 'bx-atom', 'bx-store'];
    var marquee = document.getElementById('hpMarqueeTrack');
    if (marquee) {
        var items = companies.map(function(c, i) {
            return '<div class="hp-marquee-item"><i class="bx ' + icons[i % icons.length] + '"></i>' + c + '</div>';
        });
        marquee.innerHTML = items.join('') + items.join('');
    }

    // ===== WHY JOIN =====
    var benefits = [
        { icon: 'bxs-network-chart', color: '#4f46e5', bg: 'rgba(79,70,229,0.08)', title: 'Professional Network', desc: 'Connect with 12,500+ verified alumni across 350+ companies worldwide. Build lifelong professional bonds.' },
        { icon: 'bxs-briefcase-alt-2', color: '#06b6d4', bg: 'rgba(6,182,212,0.08)', title: 'Exclusive Job Board', desc: 'Access alumni-sourced job postings. Every opportunity is verified, relevant, and from your own trusted network.' },
        { icon: 'bxs-user-voice', color: '#10b981', bg: 'rgba(16,185,129,0.08)', title: 'Expert Mentorship', desc: 'Get matched with senior alumni who guide you through your career with personalized, one-on-one mentorship.' },
        { icon: 'bxs-calendar-event', color: '#f59e0b', bg: 'rgba(245,158,11,0.08)', title: 'Events & Reunions', desc: 'Reunions, tech talks, placement drives, and industry summits. Stay connected and keep growing.' },
        { icon: 'bxs-message-dots', color: '#8b5cf6', bg: 'rgba(139,92,246,0.08)', title: 'Real-time Messaging', desc: 'Direct messaging with batchmates, mentors, and coordinators. Group chats for your entire batch community.' },
        { icon: 'bxs-trophy', color: '#ef4444', bg: 'rgba(239,68,68,0.08)', title: 'Alumni Spotlight', desc: 'Celebrate achievements of distinguished graduates and nominate rising stars from your batch to be featured.' }
    ];
    var whyGrid = document.getElementById('hpWhyGrid');
    if (whyGrid) {
        whyGrid.innerHTML = benefits.map(function(b, i) {
            return '<div class="hp-why-card fade-up" style="transition-delay:' + (i * 0.08) + 's;">'
                + '<div class="hp-why-icon" style="background:' + b.bg + ';color:' + b.color + ';"><i class="bx ' + b.icon + '"></i></div>'
                + '<h3>' + b.title + '</h3>'
                + '<p>' + b.desc + '</p>'
                + '</div>';
        }).join('');
    }

    // ===== ALUMNI GRID =====
    var alumniGrid = document.getElementById('hpAlumniGrid');
    if (alumniGrid && window.APP_DATA && APP_DATA.topAlumni) {
        alumniGrid.innerHTML = APP_DATA.topAlumni.slice(0, 8).map(function(a) {
            var safeName = a.name.replace(/'/g, "\\'");
            return '<div class="hp-alumni-card fade-up" onclick="openHpAlumniModal(\'' + safeName + '\')">'
                + '<img class="ac-avatar" src="' + a.avatar + '" alt="' + a.name + '">'
                + '<div class="ac-name">' + a.name + '</div>'
                + '<div class="ac-role">' + a.role + '</div>'
                + '<div class="ac-company"><i class="bx bxs-buildings" style="font-size:13px;"></i> ' + a.company + '</div>'
                + '<div class="ac-batch">Batch ' + a.batch + '</div>'
                + '<div class="ac-tags">' + (a.tags || []).map(function(t) { return '<span class="ac-tag">' + t + '</span>'; }).join('') + '</div>'
                + '<button class="ac-btn"><i class="bx bx-user-plus"></i> Connect</button>'
                + '</div>';
        }).join('');
    }

    // ===== JOBS GRID =====
    var jobsGrid = document.getElementById('hpJobsGrid');
    if (jobsGrid && window.APP_DATA && APP_DATA.jobs) {
        var badgeMap = { 'Full-time': 'ft', 'Internship': 'intern', 'Part-time': 'pt' };
        jobsGrid.innerHTML = APP_DATA.jobs.slice(0, 6).map(function(j) {
            var bc = badgeMap[j.type] || 'ft';
            return '<div class="hp-job-card fade-up">'
                + '<div class="hp-jc-header">'
                + '<div class="hp-jc-logo"><i class="bx bxs-buildings"></i></div>'
                + '<span class="hp-jc-badge ' + bc + '">' + (j.type || 'Full-time') + '</span>'
                + '</div>'
                + '<h3>' + j.title + '</h3>'
                + '<div class="jc-company">' + j.company + '</div>'
                + '<div class="hp-jc-meta">'
                + '<span><i class="bx bx-map"></i> ' + (j.location || 'India') + '</span>'
                + '<span><i class="bx bx-time-five"></i> ' + (j.experience || 'Fresher') + '</span>'
                + '<span><i class="bx bx-user"></i> ' + (j.postedBy || 'Alumni') + '</span>'
                + '</div>'
                + '<button class="hp-jc-apply" onclick="window.location.href=\'pages/auth/register.html\'"><i class="bx bx-link-external"></i> View & Apply</button>'
                + '</div>';
        }).join('');
    }

    // ===== EVENTS GRID =====
    var eventsGrid = document.getElementById('hpEventsGrid');
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    if (eventsGrid && window.APP_DATA && APP_DATA.events) {
        eventsGrid.innerHTML = APP_DATA.events.slice(0, 4).map(function(ev) {
            var d = new Date(ev.date);
            var day = isNaN(d.getTime()) ? '?' : d.getDate();
            var month = isNaN(d.getTime()) ? 'TBA' : months[d.getMonth()];
            var year = isNaN(d.getTime()) ? '' : d.getFullYear();
            return '<div class="hp-event-card fade-up">'
                + '<div class="hp-ev-date">'
                + '<div class="ev-month">' + month + '</div>'
                + '<div class="ev-day">' + day + '</div>'
                + '<div class="ev-year">' + year + '</div>'
                + '</div>'
                + '<div class="hp-ev-body">'
                + '<h3>' + ev.title + '</h3>'
                + '<p class="ev-desc">' + (ev.description || 'An exciting event for alumni to connect and grow together.') + '</p>'
                + '<div class="hp-ev-meta">'
                + '<span><i class="bx bx-time-five"></i> ' + (ev.time || 'TBA') + '</span>'
                + '<span><i class="bx bx-map"></i> ' + (ev.location || 'Campus') + '</span>'
                + '<span><i class="bx bx-user-check"></i> ' + (ev.attendees || 0) + ' Attending</span>'
                + '</div>'
                + '<button class="hp-ev-register" onclick="window.location.href=\'pages/auth/register.html\'"><i class="bx bx-calendar-check"></i> Register Now</button>'
                + '</div>'
                + '</div>';
        }).join('');
    }

    // ===== TESTIMONIALS =====
    var testimonials = [
        { name: 'Aarav Patel', role: 'Senior Engineer, Google', batch: 'Batch 2015', img: 'https://i.pravatar.cc/150?img=11', quote: 'The alumni network helped me land my dream job at Google. The mentorship I received from senior alumni was absolutely invaluable to my career journey.' },
        { name: 'Sneha Kulkarni', role: 'Product Manager, Microsoft', batch: 'Batch 2016', img: 'https://i.pravatar.cc/150?img=5', quote: 'Within weeks of joining, I connected with mentors who guided me through my PM transition. This portal is a game-changer for DVVPCOE graduates.' },
        { name: 'Rohit Sharma', role: 'Founder, TechNova Solutions', batch: 'Batch 2013', img: 'https://i.pravatar.cc/150?img=12', quote: 'I found my first two employees through this network. The alumni here are incredibly supportive and the platform makes networking effortless.' },
        { name: 'Priya Deshmukh', role: 'Data Scientist, Flipkart', batch: 'Batch 2019', img: 'https://i.pravatar.cc/150?img=9', quote: 'The job board is full of legitimate opportunities from people who genuinely care about our college. Got placed within 3 weeks of registering!' }
    ];
    var tTrack = document.getElementById('hpTestTrack');
    if (tTrack) {
        tTrack.innerHTML = testimonials.map(function(t) {
            return '<div class="hp-test-card">'
                + '<div class="hp-tc-stars"><i class="bx bxs-star"></i><i class="bx bxs-star"></i><i class="bx bxs-star"></i><i class="bx bxs-star"></i><i class="bx bxs-star"></i></div>'
                + '<p class="hp-tc-quote">"' + t.quote + '"</p>'
                + '<div class="hp-tc-author">'
                + '<img src="' + t.img + '" alt="' + t.name + '">'
                + '<div>'
                + '<div class="hp-tc-author-name">' + t.name + '</div>'
                + '<div class="hp-tc-author-role">' + t.role + ' - ' + t.batch + '</div>'
                + '</div></div></div>';
        }).join('');
    }

    window.scrollHpTestimonials = function(dir) {
        var track = document.getElementById('hpTestTrack');
        if (track) track.scrollBy({ left: dir * 380, behavior: 'smooth' });
    };

    // ===== ANIMATED COUNTERS =====
    var counterObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (!entry.isIntersecting) return;
            var el = entry.target;
            var text = el.textContent;
            var numMatch = text.match(/[\d,]+/);
            if (numMatch) {
                var target = parseInt(numMatch[0].replace(/,/g, ''));
                var suffix = text.replace(numMatch[0], '');
                var current = 0;
                var increment = target / 50;
                var timer = setInterval(function() {
                    current += increment;
                    if (current >= target) { current = target; clearInterval(timer); }
                    el.textContent = Math.floor(current).toLocaleString() + suffix;
                }, 30);
            }
            counterObserver.unobserve(el);
        });
    }, { threshold: 0.6 });
    document.querySelectorAll('.stat-number').forEach(function(el) { counterObserver.observe(el); });

    // ===== FADE UP ANIMATIONS =====
    var fadeObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                fadeObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    document.querySelectorAll('.fade-up').forEach(function(el) { fadeObserver.observe(el); });

    // Run hero fades immediately
    setTimeout(function() {
        document.querySelectorAll('.hp-hero .fade-up').forEach(function(el, i) {
            setTimeout(function() { el.classList.add('visible'); }, 100 + i * 80);
        });
    }, 50);

    // ===== ALUMNI MODAL =====
    window.openHpAlumniModal = function(name) {
        if (!window.APP_DATA || !APP_DATA.topAlumni) return;
        var a = APP_DATA.topAlumni.find(function(x) { return x.name === name; });
        if (!a) return;
        var mc = document.getElementById('hpModalContent');
        if (!mc) return;
        mc.innerHTML =
            '<img src="' + a.avatar + '" style="width:90px;height:90px;border-radius:50%;margin-bottom:16px;border:3px solid #eef2ff;box-shadow:0 4px 20px rgba(79,70,229,0.2);">'
            + '<h2 style="font-size:22px;font-weight:800;margin-bottom:6px;color:#0f172a;">' + a.name + '</h2>'
            + '<p style="color:#4f46e5;font-weight:700;font-size:14px;margin-bottom:4px;">' + a.role + '</p>'
            + '<p style="color:#94a3b8;font-size:13px;margin-bottom:18px;">' + a.company + ' - Batch ' + a.batch + '</p>'
            + '<div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin-bottom:24px;">'
            + (a.tags || []).map(function(t) { return '<span style="background:#eef2ff;color:#4f46e5;padding:5px 12px;border-radius:14px;font-size:12px;font-weight:700;">' + t + '</span>'; }).join('')
            + '</div>'
            + '<div style="background:#f8fafc;border-radius:14px;padding:20px;border:1px solid #e2e8f0;margin-bottom:20px;">'
            + '<p style="font-size:14px;color:#475569;margin-bottom:16px;"><strong>Want to connect with ' + a.name.split(' ')[0] + '?</strong><br>Join the alumni network to message, get mentored, and explore full profiles.</p>'
            + '<a href="pages/auth/register.html" class="hp-btn hp-btn-primary" style="width:100%;justify-content:center;"><i class="bx bxs-rocket"></i> Join Free to Connect</a>'
            + '</div>';
        document.getElementById('hpAlumniModal').classList.add('active');
    };
    window.closeHpAlumniModal = function() {
        document.getElementById('hpAlumniModal').classList.remove('active');
    };
    var modalOverlay = document.getElementById('hpAlumniModal');
    if (modalOverlay) {
        modalOverlay.addEventListener('click', function(e) {
            if (e.target === this) closeHpAlumniModal();
        });
    }

    // ===== SEARCH OVERLAY =====
    window.openHpSearch = function() {
        document.getElementById('hpSearchOverlay').classList.add('active');
        setTimeout(function() {
            var input = document.getElementById('hpSearchInput');
            if (input) input.focus();
        }, 100);
        renderHpSearchResults(APP_DATA.topAlumni.slice(0, 5));
    };
    window.closeHpSearch = function() {
        document.getElementById('hpSearchOverlay').classList.remove('active');
    };
    window.closeHpSearchBg = function(e) {
        if (e.target.id === 'hpSearchOverlay') closeHpSearch();
    };

    function renderHpSearchResults(list) {
        var r = document.getElementById('hpSearchResults');
        if (!r) return;
        if (!list || list.length === 0) {
            r.innerHTML = '<div style="padding:30px 24px;text-align:center;color:#94a3b8;font-size:14px;">No alumni found matching your search.</div>';
            return;
        }
        r.innerHTML = list.map(function(a) {
            var safeName = a.name.replace(/'/g, "\\'");
            return '<div class="hp-sr-item" onclick="openHpAlumniModal(\'' + safeName + '\');closeHpSearch();">'
                + '<img src="' + a.avatar + '" alt="' + a.name + '">'
                + '<div><h5>' + a.name + '</h5><p>' + a.role + ' at ' + a.company + ' - Batch ' + a.batch + '</p></div>'
                + '</div>';
        }).join('');
    }

    var searchInput = document.getElementById('hpSearchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            var q = e.target.value.toLowerCase();
            if (!window.APP_DATA || !APP_DATA.topAlumni) return;
            var filtered = q ? APP_DATA.topAlumni.filter(function(a) {
                return a.name.toLowerCase().indexOf(q) !== -1
                    || a.company.toLowerCase().indexOf(q) !== -1
                    || a.role.toLowerCase().indexOf(q) !== -1
                    || a.batch.indexOf(q) !== -1;
            }) : APP_DATA.topAlumni.slice(0, 5);
            renderHpSearchResults(filtered);
        });
    }

    // ===== KEYBOARD SHORTCUTS =====
    document.addEventListener('keydown', function(e) {
        if ((e.ctrlKey && e.key === 'k') || (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA')) {
            e.preventDefault();
            openHpSearch();
        }
        if (e.key === 'Escape') {
            closeHpSearch();
            closeHpAlumniModal();
        }
    });

    // ===== ACTIVE NAV ON SCROLL =====
    var sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', function() {
        var sp = window.scrollY + 200;
        sections.forEach(function(sec) {
            var link = document.querySelector('.hp-nav-menu a[href="#' + sec.id + '"]');
            if (link) {
                link.classList.toggle('active', sp >= sec.offsetTop && sp < sec.offsetTop + sec.offsetHeight);
            }
        });
    });

});
