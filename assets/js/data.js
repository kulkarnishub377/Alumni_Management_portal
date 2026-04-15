// ============================================
// ALUMNI MANAGEMENT PORTAL - MOCK DATA STORE
// ============================================
// This data will be replaced by real API calls when the backend is connected.

const APP_DATA = {

    // College Info
    college: {
        name: "Dr. Vithalrao Vikhe Patil College of Engineering",
        shortName: "DVVPCOE",
        tagline: "Connect. Grow. Inspire.",
        address: "Vilad Ghat, Ahmednagar, Maharashtra 414004",
        email: "alumni@dvvpcoe.edu.in",
        phone: "+91 0241-2778669",
        website: "https://dvvpcoe.edu.in",
        vision: "To be a center of excellence in engineering education, fostering innovation, ethics, and global competence.",
        mission: "To provide quality education, promote research, and develop industry-ready professionals committed to societal progress."
    },

    // Statistics
    stats: {
        totalAlumni: 12500,
        companiesHiring: 350,
        studentsPlaced: 8700,
        eventsConducted: 120,
        activeMentors: 84,
        jobPostings: 24
    },

    // Top Alumni
    topAlumni: [
        {
            id: 1,
            name: "Aarav Patel",
            role: "Senior Software Engineer",
            company: "Google",
            batch: "2015",
            department: "Computer Engineering",
            avatar: "https://i.pravatar.cc/150?img=11",
            tags: ["AI/ML", "Cloud"],
            linkedin: "#"
        },
        {
            id: 2,
            name: "Sneha Kulkarni",
            role: "Product Manager",
            company: "Microsoft",
            batch: "2016",
            department: "Computer Engineering",
            avatar: "https://i.pravatar.cc/150?img=5",
            tags: ["Product", "Strategy"],
            linkedin: "#"
        },
        {
            id: 3,
            name: "Rohit Sharma",
            role: "Founder & CEO",
            company: "TechNova Solutions",
            batch: "2013",
            department: "Information Technology",
            avatar: "https://i.pravatar.cc/150?img=12",
            tags: ["Startup", "Leadership"],
            linkedin: "#"
        },
        {
            id: 4,
            name: "Priya Deshmukh",
            role: "Data Scientist",
            company: "Netflix",
            batch: "2018",
            department: "Computer Engineering",
            avatar: "https://i.pravatar.cc/150?img=9",
            tags: ["Data", "Analytics"],
            linkedin: "#"
        },
        {
            id: 5,
            name: "Vikram Joshi",
            role: "Cloud Architect",
            company: "Amazon Web Services",
            batch: "2014",
            department: "Information Technology",
            avatar: "https://i.pravatar.cc/150?img=8",
            tags: ["AWS", "DevOps"],
            linkedin: "#"
        },
        {
            id: 6,
            name: "Meera Naik",
            role: "UX Lead Designer",
            company: "Adobe",
            batch: "2017",
            department: "Computer Engineering",
            avatar: "https://i.pravatar.cc/150?img=1",
            tags: ["Design", "Research"],
            linkedin: "#"
        },
        { id: 7, name: "Prashant Patil", role: "Software Engineer II", company: "Amazon", batch: "2019", department: "Computer Engineering", avatar: "https://i.pravatar.cc/150?img=15", tags: ["Backend", "Java"], linkedin: "#", email: "prashant.p@example.com", phone: "+91 9876543221" },
        { id: 8, name: "Kavita Deshmukh", role: "Data Engineer", company: "TCS", batch: "2020", department: "Computer Engineering", avatar: "https://i.pravatar.cc/150?img=16", tags: ["Big Data", "Python"], linkedin: "#", email: "kavita.d@example.com", phone: "+91 9876543222" },
        { id: 9, name: "Rahul Jadhav", role: "DevOps Engineer", company: "Wipro", batch: "2019", department: "Information Technology", avatar: "https://i.pravatar.cc/150?img=17", tags: ["CI/CD", "AWS"], linkedin: "#", email: "rahul.j@example.com", phone: "+91 9876543223" },
        { id: 10, name: "Anita Mane", role: "Frontend Developer", company: "Infosys", batch: "2020", department: "Computer Engineering", avatar: "https://i.pravatar.cc/150?img=18", tags: ["React", "UI"], linkedin: "#", email: "anita.m@example.com", phone: "+91 9876543224" },
        { id: 11, name: "Siddharth Wakchaure", role: "Security Analyst", company: "Cognizant", batch: "2020", department: "Computer Engineering", avatar: "https://i.pravatar.cc/150?img=19", tags: ["Cybersec", "Network"], linkedin: "#", email: "sid.w@example.com", phone: "+91 9876543225" }
    ],

    // Events
    events: [
        {
            id: 1,
            title: "Annual Alumni Meetup 2026",
            date: "2026-05-15",
            time: "10:00 AM - 4:00 PM",
            location: "Main Campus Auditorium",
            description: "Join fellow alumni for a day of networking, panel discussions, and nostalgia. Guest speakers from top tech companies.",
            attendees: 150,
            category: "meetup"
        },
        {
            id: 2,
            title: "Tech Industry Mentorship Session",
            date: "2026-06-02",
            time: "6:00 PM - 8:00 PM",
            location: "Virtual (Zoom)",
            description: "Connect with industry mentors for career guidance, resume reviews, and mock interviews.",
            attendees: 45,
            category: "mentorship"
        },
        {
            id: 3,
            title: "Startup Pitch & Networking Night",
            date: "2026-06-20",
            time: "5:30 PM - 9:00 PM",
            location: "Innovation Hub, Pune",
            description: "Alumni entrepreneurs pitch their startups. Network with investors and fellow founders.",
            attendees: 80,
            category: "networking"
        }
    ],

    // Announcements
    announcements: [
        {
            id: 1,
            title: "Alumni Registration Drive 2026",
            message: "All alumni from batch 2010-2025 are encouraged to register on the portal for access to exclusive networking events and job opportunities.",
            date: "2026-04-01",
            type: "important"
        },
        {
            id: 2,
            title: "Campus Placement Report Released",
            message: "The 2025-26 placement report is now available. Over 85% placement achieved this year!",
            date: "2026-03-28",
            type: "news"
        }
    ],

    // Gallery Categories
    galleryCategories: ["All", "Campus", "Alumni Meet", "Achievements", "Events"],

    // Gallery Items
    galleryItems: [
        { id: 1, category: "Campus", color: "#4f46e5" },
        { id: 2, category: "Alumni Meet", color: "#7c3aed" },
        { id: 3, category: "Achievements", color: "#0ea5e9" },
        { id: 4, category: "Events", color: "#10b981" },
        { id: 5, category: "Campus", color: "#f43f5e" },
        { id: 6, category: "Alumni Meet", color: "#d97706" },
        { id: 7, category: "Events", color: "#6366f1" },
        { id: 8, category: "Achievements", color: "#0d9488" }
    ],

    // Jobs data
    jobs: [
        {
            id: 1,
            title: "Senior React Developer",
            company: "TCS Digital",
            location: "Pune, MH",
            type: "Full-time",
            experience: "3-5 yrs",
            postedBy: "Aarav Patel",
            postedDate: "2 days ago"
        },
        {
            id: 2,
            title: "Data Science Intern",
            company: "Infosys BPM",
            location: "Bangalore, KA",
            type: "Internship",
            experience: "Fresher",
            postedBy: "Priya Deshmukh",
            postedDate: "5 days ago"
        },
        {
            id: 3,
            title: "Cloud Solutions Architect",
            company: "Wipro",
            location: "Hyderabad, TG",
            type: "Full-time",
            experience: "5-8 yrs",
            postedBy: "Vikram Joshi",
            postedDate: "1 week ago"
        },
        {
            id: 4,
            title: "UI/UX Designer",
            company: "Persistent Systems",
            location: "Pune, MH",
            type: "Full-time",
            experience: "2-4 yrs",
            postedBy: "Meera Naik",
            postedDate: "3 days ago"
        }
    ],

    // Chat Messages (Mock)
    chatContacts: [
        { id: 1, name: "Batch 2020 Group", lastMsg: "Anyone attending the meetup?", time: "2m ago", avatar: "https://ui-avatars.com/api/?name=B20&background=4f46e5&color=fff", online: true, isGroup: true },
        { id: 2, name: "Batch 2019 Group", lastMsg: "Congrats on the new role, Rohit!", time: "1h ago", avatar: "https://ui-avatars.com/api/?name=B19&background=7c3aed&color=fff", online: true, isGroup: true },
        { id: 3, name: "Aarav Patel", lastMsg: "Thanks for the referral link!", time: "3h ago", avatar: "https://i.pravatar.cc/150?img=11", online: true, isGroup: false },
        { id: 4, name: "Sneha Kulkarni", lastMsg: "Let's connect at the event.", time: "5h ago", avatar: "https://i.pravatar.cc/150?img=5", online: false, isGroup: false },
        { id: 5, name: "Prof. R. D. More", lastMsg: "Your batch results are excellent.", time: "1d ago", avatar: "https://ui-avatars.com/api/?name=RD&background=0ea5e9&color=fff", online: false, isGroup: false }
    ],

    chatMessages: [
        { sender: "other", name: "Aarav Patel", text: "Hey! How are you doing?", time: "10:30 AM" },
        { sender: "me", text: "Hi Aarav! I'm great, thanks. How about you?", time: "10:32 AM" },
        { sender: "other", name: "Aarav Patel", text: "Doing well! Just wanted to let you know we have openings in my team at Google.", time: "10:33 AM" },
        { sender: "me", text: "That's amazing! Can you share the job link?", time: "10:35 AM" },
        { sender: "other", name: "Aarav Patel", text: "Sure! I'll DM you the referral link. Also, are you coming to the alumni meetup next month?", time: "10:36 AM" },
        { sender: "me", text: "Thanks for the referral link! Yes, I've already registered for the meetup.", time: "10:38 AM" }
    ],

    // Activities
    activities: [
        { icon: "bxs-user-plus", color: "purple", title: "New Alumni Registered", desc: "Rohit Sharma from Batch 2022 joined the network.", time: "2 mins ago" },
        { icon: "bxs-calendar-check", color: "green", title: "Event Reminder", desc: "Annual Alumni Meetup 2026 is in 37 days.", time: "1 hour ago" },
        { icon: "bxs-briefcase", color: "blue", title: "New Job Posted", desc: "Senior React Developer at TCS Digital by Aarav Patel.", time: "3 hours ago" },
        { icon: "bxs-bell-ring", color: "amber", title: "Admin Announcement", desc: "Registration drive for batch 2010-2025 is now open.", time: "5 hours ago" },
        { icon: "bxs-message-dots", color: "red", title: "New Message", desc: "Sneha Kulkarni sent you a message.", time: "1 day ago" }
    ],

    // Why Join Reasons
    whyJoin: [
        { icon: "bxs-network-chart", title: "Professional Network", desc: "Build meaningful connections with 12,500+ alumni working across 350+ companies globally." },
        { icon: "bxs-briefcase-alt-2", title: "Career Opportunities", desc: "Access exclusive job postings, internships, and referral programs from alumni insiders." },
        { icon: "bxs-user-voice", title: "Mentorship Access", desc: "Get guidance from experienced professionals who walked the same path as you." },
        { icon: "bxs-calendar-star", title: "Exclusive Events", desc: "Attend reunions, workshops, tech talks, and networking nights designed for alumni." },
        { icon: "bxs-group", title: "Batch Communities", desc: "Auto-join your batch group for instant connections with classmates." },
        { icon: "bxs-trophy", title: "Recognition Platform", desc: "Showcase your achievements and get featured in the Top Alumni Hall of Fame." }
    ],

    // Testimonials
    testimonials: [
        {
            name: "Aarav Patel",
            role: "Senior Software Engineer, Google",
            avatar: "https://i.pravatar.cc/150?img=11",
            text: "The alumni portal helped me reconnect with my batchmates and even led to a collaboration on an open-source project. The networking features are incredible.",
            rating: 5
        },
        {
            name: "Sneha Kulkarni",
            role: "Product Manager, Microsoft",
            avatar: "https://i.pravatar.cc/150?img=5",
            text: "I found my first mentor through this platform. The mentorship program is phenomenal and actually helped shape my career trajectory at Microsoft.",
            rating: 5
        },
        {
            name: "Priya Deshmukh",
            role: "Data Scientist, Netflix",
            avatar: "https://i.pravatar.cc/150?img=9",
            text: "The job board is a game changer. I got referred to my current role at Netflix through an alumni connection from this portal. Highly recommend!",
            rating: 5
        },
        {
            name: "Vikram Joshi",
            role: "Cloud Architect, AWS",
            avatar: "https://i.pravatar.cc/150?img=8",
            text: "The batch group chat feature made it so easy to stay in touch with old friends. We even organized an offline meetup after years of being disconnected!",
            rating: 4
        },
        {
            name: "Rohit Sharma",
            role: "Founder & CEO, TechNova",
            avatar: "https://i.pravatar.cc/150?img=12",
            text: "As a startup founder, the alumni network has been invaluable. I found co-founders, early employees, and even angel investors through this community.",
            rating: 5
        }
    ],

    // Marquee Items
    marqueeItems: [
        "12,500+ Alumni Registered",
        "350+ Partner Companies",
        "85% Placement Rate",
        "120+ Events Conducted",
        "84 Active Mentors",
        "24 Open Job Positions",
        "6 Departments Connected",
        "Real-time Chat System"
    ],

    // ============================================
    // ROLE-BASED SYSTEM DATA
    // ============================================

    // Departments
    departments: [
        { id: 1, name: "Computer Engineering", code: "COMP", coordinator: "Dr. Anjali Mehta", coordinatorAvatar: "https://i.pravatar.cc/150?img=47", totalAlumni: 3200, totalMentors: 4, status: "active" },
        { id: 2, name: "Information Technology", code: "IT", coordinator: "Dr. Rajesh Patil", coordinatorAvatar: "https://i.pravatar.cc/150?img=52", totalAlumni: 2800, totalMentors: 3, status: "active" },
        { id: 3, name: "Mechanical Engineering", code: "MECH", coordinator: "Dr. Suresh Jadhav", coordinatorAvatar: "https://i.pravatar.cc/150?img=53", totalAlumni: 2500, totalMentors: 3, status: "active" },
        { id: 4, name: "Civil Engineering", code: "CIVIL", coordinator: "Dr. Priya Kulkarni", coordinatorAvatar: "https://i.pravatar.cc/150?img=44", totalAlumni: 2000, totalMentors: 2, status: "active" },
        { id: 5, name: "Electronics & Telecom", code: "ENTC", coordinator: "Dr. Nitin Deshmukh", coordinatorAvatar: "https://i.pravatar.cc/150?img=54", totalAlumni: 1500, totalMentors: 2, status: "active" },
        { id: 6, name: "Electrical Engineering", code: "ELEC", coordinator: "Dr. Kavita Shinde", coordinatorAvatar: "https://i.pravatar.cc/150?img=45", totalAlumni: 500, totalMentors: 1, status: "inactive" }
    ],

    // Batch Mentors (Teachers)
    mentors: [
        { id: 1, name: "Prof. R. D. More", department: "Computer Engineering", batches: ["2019", "2020"], avatar: "https://ui-avatars.com/api/?name=RD+More&background=4f46e5&color=fff", email: "rd.more@dvvpcoe.edu.in", phone: "+91 9876543201", specialization: "Data Structures & Algorithms", status: "active", alumniCount: 120 },
        { id: 2, name: "Prof. S. K. Pawar", department: "Computer Engineering", batches: ["2021", "2022"], avatar: "https://ui-avatars.com/api/?name=SK+Pawar&background=7c3aed&color=fff", email: "sk.pawar@dvvpcoe.edu.in", phone: "+91 9876543202", specialization: "Machine Learning", status: "active", alumniCount: 95 },
        { id: 3, name: "Prof. M. A. Shah", department: "Computer Engineering", batches: ["2023", "2024"], avatar: "https://ui-avatars.com/api/?name=MA+Shah&background=0ea5e9&color=fff", email: "ma.shah@dvvpcoe.edu.in", phone: "+91 9876543203", specialization: "Web Technologies", status: "active", alumniCount: 110 },
        { id: 4, name: "Prof. V. N. Jagtap", department: "Computer Engineering", batches: ["2017", "2018"], avatar: "https://ui-avatars.com/api/?name=VN+Jagtap&background=10b981&color=fff", email: "vn.jagtap@dvvpcoe.edu.in", phone: "+91 9876543204", specialization: "Database Systems", status: "active", alumniCount: 85 },
        { id: 5, name: "Prof. A. B. Desai", department: "Information Technology", batches: ["2019", "2020"], avatar: "https://ui-avatars.com/api/?name=AB+Desai&background=f59e0b&color=fff", email: "ab.desai@dvvpcoe.edu.in", phone: "+91 9876543205", specialization: "Networking & Security", status: "active", alumniCount: 100 },
        { id: 6, name: "Prof. K. R. Mane", department: "Information Technology", batches: ["2021", "2022"], avatar: "https://ui-avatars.com/api/?name=KR+Mane&background=ef4444&color=fff", email: "kr.mane@dvvpcoe.edu.in", phone: "+91 9876543206", specialization: "Cloud Computing", status: "active", alumniCount: 78 },
        { id: 7, name: "Prof. D. S. Patil", department: "Information Technology", batches: ["2023", "2024"], avatar: "https://ui-avatars.com/api/?name=DS+Patil&background=8b5cf6&color=fff", email: "ds.patil@dvvpcoe.edu.in", phone: "+91 9876543207", specialization: "IoT & Embedded Systems", status: "active", alumniCount: 65 },
        { id: 8, name: "Prof. G. H. Nikam", department: "Mechanical Engineering", batches: ["2019", "2020", "2021"], avatar: "https://ui-avatars.com/api/?name=GH+Nikam&background=06b6d4&color=fff", email: "gh.nikam@dvvpcoe.edu.in", phone: "+91 9876543208", specialization: "Thermodynamics", status: "active", alumniCount: 130 },
        { id: 9, name: "Prof. P. L. Wagh", department: "Mechanical Engineering", batches: ["2022", "2023", "2024"], avatar: "https://ui-avatars.com/api/?name=PL+Wagh&background=d97706&color=fff", email: "pl.wagh@dvvpcoe.edu.in", phone: "+91 9876543209", specialization: "Fluid Mechanics", status: "active", alumniCount: 90 },
        { id: 10, name: "Prof. T. U. More", department: "Mechanical Engineering", batches: ["2015", "2016", "2017"], avatar: "https://ui-avatars.com/api/?name=TU+More&background=14b8a6&color=fff", email: "tu.more@dvvpcoe.edu.in", phone: "+91 9876543210", specialization: "Manufacturing Processes", status: "active", alumniCount: 140 },
        { id: 11, name: "Prof. R. S. Gaikwad", department: "Civil Engineering", batches: ["2019", "2020", "2021", "2022"], avatar: "https://ui-avatars.com/api/?name=RS+Gaikwad&background=ec4899&color=fff", email: "rs.gaikwad@dvvpcoe.edu.in", phone: "+91 9876543211", specialization: "Structural Engineering", status: "active", alumniCount: 160 },
        { id: 12, name: "Prof. N. M. Deshpande", department: "Civil Engineering", batches: ["2023", "2024"], avatar: "https://ui-avatars.com/api/?name=NM+Deshpande&background=6366f1&color=fff", email: "nm.deshpande@dvvpcoe.edu.in", phone: "+91 9876543212", specialization: "Environmental Engineering", status: "active", alumniCount: 45 }
    ],

    // Pending Alumni Registrations (for mentor approval)
    pendingAlumni: [
        { id: 101, name: "Aditya Joshi", email: "aditya.j@gmail.com", department: "Computer Engineering", batch: "2020", mentor: "Prof. R. D. More", avatar: "https://i.pravatar.cc/150?img=15", phone: "+91 9123456780", rollNo: "2020COMP056", status: "pending", appliedDate: "2026-04-10" },
        { id: 102, name: "Riya Pawar", email: "riya.p@gmail.com", department: "Computer Engineering", batch: "2020", mentor: "Prof. R. D. More", avatar: "https://i.pravatar.cc/150?img=26", phone: "+91 9123456781", rollNo: "2020COMP032", status: "pending", appliedDate: "2026-04-11" },
        { id: 103, name: "Kunal Deshmukh", email: "kunal.d@gmail.com", department: "Computer Engineering", batch: "2021", mentor: "Prof. S. K. Pawar", avatar: "https://i.pravatar.cc/150?img=17", phone: "+91 9123456782", rollNo: "2021COMP018", status: "pending", appliedDate: "2026-04-12" },
        { id: 104, name: "Nikita Bhosale", email: "nikita.b@gmail.com", department: "Information Technology", batch: "2021", mentor: "Prof. K. R. Mane", avatar: "https://i.pravatar.cc/150?img=27", phone: "+91 9123456783", rollNo: "2021IT024", status: "pending", appliedDate: "2026-04-12" },
        { id: 105, name: "Sahil Gaikwad", email: "sahil.g@gmail.com", department: "Mechanical Engineering", batch: "2020", mentor: "Prof. G. H. Nikam", avatar: "https://i.pravatar.cc/150?img=18", phone: "+91 9123456784", rollNo: "2020MECH011", status: "pending", appliedDate: "2026-04-13" }
    ],

    // Job Approval Pipeline
    jobApprovals: [
        { id: 201, title: "Full Stack Developer", company: "Infosys", location: "Pune, MH", type: "Full-time", experience: "2-4 yrs", postedBy: "Aarav Patel", postedByAvatar: "https://i.pravatar.cc/150?img=11", department: "Computer Engineering", status: "pending_coordinator", postedDate: "2026-04-10", description: "Looking for a full stack developer with React and Node.js experience." },
        { id: 202, title: "DevOps Engineer", company: "Wipro", location: "Bangalore, KA", type: "Full-time", experience: "3-5 yrs", postedBy: "Vikram Joshi", postedByAvatar: "https://i.pravatar.cc/150?img=8", department: "Computer Engineering", status: "pending_admin", postedDate: "2026-04-08", description: "AWS certified DevOps engineer needed for cloud migration projects." },
        { id: 203, title: "ML Research Intern", company: "TCS Innovation Lab", location: "Mumbai, MH", type: "Internship", experience: "Fresher", postedBy: "Priya Deshmukh", postedByAvatar: "https://i.pravatar.cc/150?img=9", department: "Computer Engineering", status: "approved", postedDate: "2026-04-05", description: "Research internship in machine learning and NLP." },
        { id: 204, title: "Network Administrator", company: "Tech Mahindra", location: "Hyderabad, TG", type: "Full-time", experience: "1-3 yrs", postedBy: "Sneha Kulkarni", postedByAvatar: "https://i.pravatar.cc/150?img=5", department: "Information Technology", status: "pending_coordinator", postedDate: "2026-04-11", description: "Network admin with CCNA certification preferred." },
        { id: 205, title: "Structural Design Engineer", company: "L&T Construction", location: "Mumbai, MH", type: "Full-time", experience: "3-5 yrs", postedBy: "Rohit Sharma", postedByAvatar: "https://i.pravatar.cc/150?img=12", department: "Civil Engineering", status: "rejected", postedDate: "2026-04-01", description: "Structural engineer for high-rise construction projects." }
    ],

    // System Activity Logs (for admin)
    systemLogs: [
        { action: "User Login", user: "Shubham Kulkarni", role: "Alumni", time: "2 mins ago", icon: "bx-log-in", color: "green" },
        { action: "Job Post Submitted", user: "Aarav Patel", role: "Alumni", time: "15 mins ago", icon: "bx-briefcase", color: "blue" },
        { action: "Alumni Approved", user: "Prof. R. D. More", role: "Mentor", time: "1 hour ago", icon: "bx-user-check", color: "purple" },
        { action: "Event Created", user: "Dr. Anjali Mehta", role: "Coordinator", time: "2 hours ago", icon: "bx-calendar-plus", color: "amber" },
        { action: "Department Updated", user: "Admin", role: "Admin", time: "5 hours ago", icon: "bx-building", color: "red" },
        { action: "Job Approved", user: "Dr. Rajesh Patil", role: "Coordinator", time: "1 day ago", icon: "bx-check-circle", color: "green" },
        { action: "Bulk Email Sent", user: "Admin", role: "Admin", time: "1 day ago", icon: "bx-envelope", color: "blue" },
        { action: "New Registration", user: "Riya Pawar", role: "Alumni", time: "2 days ago", icon: "bx-user-plus", color: "purple" }
    ],

    // Admin Chat Contacts
    adminChatContacts: [
        { id: 50, name: "All Coordinators Group", lastMsg: "Department reports are due Friday.", time: "10m ago", avatar: "https://ui-avatars.com/api/?name=AC&background=4f46e5&color=fff", online: true, isGroup: true },
        { id: 51, name: "All Mentors Group", lastMsg: "Please verify pending registrations.", time: "30m ago", avatar: "https://ui-avatars.com/api/?name=AM&background=7c3aed&color=fff", online: true, isGroup: true },
        { id: 52, name: "Dr. Anjali Mehta", lastMsg: "COMP department report submitted.", time: "1h ago", avatar: "https://i.pravatar.cc/150?img=47", online: true, isGroup: false },
        { id: 53, name: "Dr. Rajesh Patil", lastMsg: "IT alumni data is updated.", time: "2h ago", avatar: "https://i.pravatar.cc/150?img=52", online: false, isGroup: false },
        { id: 54, name: "Prof. R. D. More", lastMsg: "Batch 2020 verification complete.", time: "3h ago", avatar: "https://ui-avatars.com/api/?name=RD&background=0ea5e9&color=fff", online: true, isGroup: false }
    ],

    // Coordinator Chat Contacts
    coordinatorChatContacts: [
        { id: 60, name: "Department Mentors Group", lastMsg: "Alumni registration updates needed.", time: "15m ago", avatar: "https://ui-avatars.com/api/?name=DM&background=10b981&color=fff", online: true, isGroup: true },
        { id: 61, name: "Admin Office", lastMsg: "Budget approved for annual meetup.", time: "1h ago", avatar: "https://ui-avatars.com/api/?name=AO&background=4f46e5&color=fff", online: true, isGroup: false },
        { id: 62, name: "Prof. R. D. More", lastMsg: "Batch 2020 list ready for review.", time: "2h ago", avatar: "https://ui-avatars.com/api/?name=RD&background=0ea5e9&color=fff", online: true, isGroup: false },
        { id: 63, name: "Prof. S. K. Pawar", lastMsg: "Need to discuss placement drive.", time: "4h ago", avatar: "https://ui-avatars.com/api/?name=SK&background=7c3aed&color=fff", online: false, isGroup: false },
        { id: 64, name: "Prof. M. A. Shah", lastMsg: "Project expo details shared.", time: "1d ago", avatar: "https://ui-avatars.com/api/?name=MA&background=f59e0b&color=fff", online: false, isGroup: false }
    ],

    // Mentor Chat Contacts
    mentorChatContacts: [
        { id: 70, name: "Batch 2020 Group", lastMsg: "Reunion planning starts next week!", time: "5m ago", avatar: "https://ui-avatars.com/api/?name=B20&background=4f46e5&color=fff", online: true, isGroup: true },
        { id: 71, name: "Batch 2019 Group", lastMsg: "Placement stats updated.", time: "2h ago", avatar: "https://ui-avatars.com/api/?name=B19&background=7c3aed&color=fff", online: true, isGroup: true },
        { id: 72, name: "Dr. Anjali Mehta", lastMsg: "Submit batch report by Friday.", time: "1h ago", avatar: "https://i.pravatar.cc/150?img=47", online: true, isGroup: false },
        { id: 73, name: "Shubham Kulkarni", lastMsg: "Thanks for the recommendation, sir!", time: "3h ago", avatar: "https://i.pravatar.cc/150?img=3", online: false, isGroup: false },
        { id: 74, name: "Aarav Patel", lastMsg: "Can you verify my profile update?", time: "1d ago", avatar: "https://i.pravatar.cc/150?img=11", online: false, isGroup: false }
    ],

    // Top Alumni Suggestions (pending admin approval)
    topAlumniSuggestions: [
        { id: 301, name: "Amit Kulkarni", role: "VP Engineering", company: "Flipkart", batch: "2012", department: "Computer Engineering", avatar: "https://i.pravatar.cc/150?img=14", suggestedBy: "Dr. Anjali Mehta", reason: "Led the engineering team that scaled Flipkart's payment gateway.", status: "pending" },
        { id: 302, name: "Deepa Joshi", role: "Chief Data Officer", company: "Reliance Jio", batch: "2010", department: "Information Technology", avatar: "https://i.pravatar.cc/150?img=25", suggestedBy: "Dr. Rajesh Patil", reason: "Pioneered data-driven telecom strategies impacting 400M+ users.", status: "pending" },
        { id: 303, name: "Rajendra Patil", role: "Founder & CTO", company: "BuildStack", batch: "2014", department: "Civil Engineering", avatar: "https://i.pravatar.cc/150?img=16", suggestedBy: "Dr. Priya Kulkarni", reason: "Founded a construction-tech startup valued at $50M.", status: "approved" }
    ]
};
