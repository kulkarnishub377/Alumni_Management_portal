<div align="center">
  <h1>🎓 Alumni Management Portal</h1>
  <p><strong>A professional, enterprise-grade Alumni Management System designed to connect graduates, facilitate mentorship programs, post jobs, and manage university events through an interactive, multi-page web application.</strong></p>


<p>
    <a href="#overview">Overview</a> •
    <a href="#features">Features</a> •
    <a href="#tech-stack">Tech Stack</a> •
    <a href="#directory-structure">Structure</a> •
    <a href="#setup--installation">Installation</a> •
    <a href="#mpa-generation">MPA Generation</a> •
    <a href="#roadmap">Roadmap</a>
  </p>
</div>

---

<br />
## 🌟 Overview

The **Alumni Management Portal** bridges the gap between past graduates and their educational institution. Designed using a modern tech stack and prepared seamlessly for integration with robust backend frameworks (Django/Node.js/Laravel), this platform offers an immersive experience via a glassy, particle-infused UI/UX.

With **11 distinct interactive modules**, the frontend is scalable, deeply structured, and ready to act as a presentation layer for enterprise-level deployment.

---

## ✨ Features

### 🏛️ Public Landing Environment

- **Hero & Landing Page**: Engaging introductory experience with data stats and calls to action.
- **Top Alumni Carousel**: Dynamic spotlight on successful graduates.
- **Announcements & Tickers**: Scrolling banners displaying latest updates.

### 👤 User Authentication

- **Multi-Step Registration**: Smooth, interactive forms for new alumni and students.
- **Secure Login Interface**: Animated glassmorphism authentication screens.

### 📊 Comprehensive Dashboard (11 Modules)

- 🏠 **Overview**: Summary of networking stats, upcoming events, and fresh jobs.
- 👨‍💻 **Profile Management**: Profile viewer with editor features.
- 🌍 **Alumni Directory**: A sophisticated grid interface to search and filter alumni by batch, department, or company.
- 💬 **Messaging (Chat)**: Real-time UI layout tailored for direct messaging (ready for WebSocket binding).
- 🔔 **Notifications**: Global alert center for system and network updates.
- 📅 **Event Manager**: Browse, RSVP, and save upcoming university and alumni events.
- 💼 **Job Board**: Find or post job opportunities and internships targeted at the network.
- 🖼️ **Gallery**: A media viewing portal covering past hackathons, graduation ceremonies, etc.
- 🥇 **Top Alumni**: Dedicated showcase module.
- 🤝 **Mentorship Program**: Apply as a mentor or find one to elevate career trajectories.
- ⚙️ **Settings**: Granular mock controls for application preferences.

---

## 🚀 Tech Stack & Architecture

This repository contains the **Frontend Skeleton**. It has been architected specifically as a **Multi-Page Application (MPA)**.

> **💡 Why MPA over SPA?**`<br>`
> By hard-routing every dashboard module to specific HTML endpoints (`pages/alumni/chat.html`, `pages/alumni/jobs.html`), this system can be dragged-and-dropped directly into traditional Server-Side Rendered (SSR) frameworks like **Django**, **Flask**, **Rails**, or **Express/EJS**. The `dashboard.js` controller intelligently activates logic dynamically based on the `<div data-page="...">` attribute, preserving standard server-driven URL navigation while offering SPA-like reactivity.

### Frontend Technologies

| Technology           | Description                                            |
| -------------------- | ------------------------------------------------------ |
| **HTML5**      | Semantic, accessible structures.                       |
| **CSS3**       | Flexbox, Grid, Custom Properties, Glassmorphism.       |
| **JavaScript** | Vanilla ES6+ DOM manipulation without React/Vue blobs. |
| **BoxIcons**   | Lightweight vector icon implementations.               |

---

## 📂 Directory Structure

```text
Alumni_Management_portal/
├── index.html                   # Landing Page (Hero, Stats, About, Top Alumni)
├── generate_mpas.py             # Python utility script to generate Dashboard modules
├── README.md                    # This document
├── .github/                     # Community health files, issue/PR templates
├── pages/                     
│   ├── auth/                    # Registration, Login, and Password Recovery modules
│   │   ├── login.html
│   │   └── register.html
│   └── alumni/                  # Dashboard Modules (MPA Layout)
│       ├── dashboard.html       # Base/Main Overview
│       ├── profile.html         # User Profile & Editor
│       ├── chat.html            # Messaging App UI
│       ├── network.html         # Alumni Directory
│       ├── events.html          # Events Board
│       ├── jobs.html            # Job / Internship Portal
│       └── ... (and more)
└── assets/                    
    ├── css/                   
    │   ├── common.css           # Global tokens, typography, navbar, footer
    │   ├── auth.css             # Login & Registration Wizard styling
    │   └── dashboard.css        # Sidebar, Grid layouts, Chat & Job specific styles
    ├── js/                    
    │   ├── data.js              # Mock database (JSON obj) simulating a REST API
    │   ├── homepage.js          # Preloader, sliders, parallax logic for landing
    │   ├── auth.js              # Interactivity for login/registration forms
    │   ├── common.js            # General cross-page logic
    │   └── dashboard.js         # Intelligent module controller & DOM binding
    └── images/                  # Core image assets & placeholders
```

---

## 🛠️ Setup & Installation

Because this repository strictly utilizes standard Web APIs with no build-steps (No Webpack, Vite, or npm installs require for the frontend base!), it runs cleanly out of the box.

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/yourusername/Alumni_Management_portal.git
cd Alumni_Management_portal
```

### 2️⃣ Serve the Project Local

You must serve the directory using a local HTTP server to avoid CORS/Protocol issues when standard components are referencing assets.

**Using Python:**

```bash
python -m http.server 8000
```

**Using Node.js:**

```bash
npx serve .
```

### 3️⃣ Explore the Platform

Navigate to `http://localhost:8000` via your web browser. Start at the landing page, hit **Register** or **Login**, and freely explore the entire Alumni Dashboard ecosystem.

---

## ⚙️ MPA Generation

To make maintaining the 11 interconnected dashboard modules easier while updating core navigation, we utilize a built-in Python script.

Instead of updating the sidebar navigation 11 times across all `pages/alumni/*.html` files, simply update `pages/alumni/dashboard.html` and run:

```bash
python generate_mpas.py
```

> This script parses `dashboard.html` and automatically sprouts correctly linked, titled, and state-aware files for `profile.html`, `network.html`, `jobs.html`, etc.

---

## 🛣️ Roadmap

- [X] **Phase 1:** High-Fidelity UI/UX Prototyping & Landing Page.
- [X] **Phase 2:** Interactive Dashboard transitions, Module splitting (MPA architecture), and Responsive CSS bug-bashes.
- [ ] **Phase 3:** Backend integration Setup (SQL databases, Session Auth, WebSockets).
- [ ] **Phase 4:** REST API pipeline mapping (replacing frontend mock `data.js` arrays).

---

## 🤝 Contributing

We welcome community engagement! If you wish to contribute to the UI polishing, feature implementations, or API scaffolding, we'd love to see your Pull Requests.

Please refer to our community guidelines inside the `.github` folder:

- 📖 [Contributing Guidelines](.github/CONTRIBUTING.md)
- ⚖️ [Code of Conduct](.github/CODE_OF_CONDUCT.md)
- 🛡️ [Security Policy](.github/SECURITY.md)

### Steps to Contribute:

1. **Fork** the repository
2. **Create** your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your Changes (`git commit -m 'Add some AmazingFeature'`)
4. **Push** to the Branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

---

## 📄 License

This project is licensed under the **MIT License**. Check the LICENSE file or GitHub properties for full details.

<p align="center">
  <i>Developed with ❤️ for alumni coordination and professional networking.</i>
</p>
