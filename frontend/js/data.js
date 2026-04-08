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
            avatar: "https://i.pravatar.cc/150?img=1",
            tags: ["Design", "Research"],
            linkedin: "#"
        }
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
    ]
};
