# DVVPCOE Alumni Management Portal

Welcome to the **DVVPCOE Alumni Management Portal** — a premium, high-performance web ecosystem designed to connect, empower, and inspire graduates of Dr. Vithalrao Vikhe Patil College of Engineering. 

This repository contains the completely modernized, decoupled, responsive Frontend architecture for the platform.

## 🚀 Key Features

- **Modern UI/UX**: Clean, professional, "college-standard" branding powered by custom Vanilla CSS (omitting complex CSS frameworks for maximum customizability).
- **Decoupled Architecture**: Transitioned away from legacy Single Page Application (SPA) engines to a highly optimized, high-performance multi-page application model where each role operates in its own discrete directory.
- **Data-Driven & Dynamic**: All interactive components (Stats, Jobs, Galleries, Alumni Spotlights) fetch their initial state from a centralized JavaScript data store (`assets/js/data.js`), making future backend integration incredibly simple.
- **Role-Based Access**: Specialized interfaces for four distinct user roles, isolating logic cleanly by directory path.
- **Micro-Animations**: Uses `IntersectionObserver` to trigger performant, smooth CSS fade-ups and transitions.

## 📁 Repository Structure

The architecture revolves around strict separation of concerns, broken down into specific role domains and centralized assets:

```text
Alumni_Management_portal/
│
├── index.html                   # Super-fast, lightweight College Landing Page
│
├── assets/                      # Centralized Global Assets
│   ├── css/                     # Vanilla CSS style definitions
│   ├── js/                      # Core logic & Central Mock Data Store
│   └── images/                  # Static multimedia and branding
│
└── pages/                       # Role-Based Routing
    ├── admin/                   # Super-admin configuration and oversight
    ├── alumni/                  # Standard alumni social experience, feeds & jobs
    ├── coordinator/             # Faculty and coordinator moderation tools
    ├── mentor/                  # Tools for alumni offering mentorship
    └── auth/                    # Registration, Login, and Password flow
```

## 🧠 Architectural Overview

### 1. `data.js` (The Central Store)
Currently, all dynamic logic across the platform queries `window.APP_DATA`, located in `assets/js/data.js`. This creates a unified "mock backend" that guarantees that if an alumni changes their avatar in one place, the change is reflected seamlessly on the homepage, the admin panel, and the chat UI.
*Next Step: This object will be replaced by API calls to the Node.js/Express backend.*

### 2. Styling Rules (`homepage.css` & `dashboard.css`)
To avoid global namespace pollution, strict CSS class prefixing is enforced:
- **`.hp-*`**: Used strictly for the Landing Page / Homepage (e.g., `.hp-hero`, `.hp-navbar`).
- **Standard CSS**: Used within the dashboard environments mapped securely via `dashboard.js`.

### 3. Dedicated Routing
Rather than a complex virtual DOM layout, user roles are sandboxed:
- A user navigating as an Admin resides entirely in `/pages/admin/`.
- Cross-role pollution is eliminated, maximizing security and rendering speed.

## 💻 Setup & Development

1. **Clone the project**
2. **Run a Local Server**: Since the project is decoupled, simply open `index.html` via VSCode's Live Server or run:
   ```bash
   npx serve .
   ```
3. **Explore the data**: Modify the contents of `assets/js/data.js` and watch components instantly react to new JSON structures.

## 🛠 Tech Stack
- HTML5 (Semantic Structure)
- Cascading Style Sheets (CSS3 - Vanilla, CSS Variables)
- Vanilla JavaScript (ES5/ES6 Logic)
- **Icons**: Boxicons

## 🚧 Status
- [x] Landing Page Refactor
- [x] Global State Implementation (`data.js`)
- [x] Responsive Design Normalization
- [x] Layout Sandbox (`/pages/`)
- [ ] Transition from `data.js` to Axios/Fetch calls referencing backend MongoDB.
