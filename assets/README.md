# Global Assets Directory `(/assets)`

This directory contains the universal building blocks for the DVVPCOE Alumni Management Portal. Because the platform uses a decoupled multipage architecture, these assets are referenced extensively across the entire project to maintain brand consistency and unify application logic.

## Directory Breakdown

### 1. `/css` (Styling Layer)
Contains the cascading style sheets that dictate the visual ecosystem.
- `homepage.css`: Exclusively controls the styling for the highly optimized landing page root `index.html`. Uses `.hp-` prefixing to avoid global conflicts.
- `dashboard.css` (or related): Controls grid systems, cards, and UI components utilized inside the `/pages` directory.

### 2. `/js` (Logic & State Layer)
Manages the functional interactivities of the frontend.
- `data.js`: The most critical architectural file. Defines the `window.APP_DATA` object, which mocks a unified backend schema. All dynamic elements (Galleries, Jobs, Alumni Grids) query this JS object.
- `homepage.js`: Scripts strictly for Landing page interactivity (IntersectionObservers, Modal Handlers, Dynamic rendering).
- `dashboard.js`: The central engine governing DOM manipulations within the dashboard portal pages.

### 3. `/images` (Media Layer)
Global repository for static media.
- Stores college logos, hero patterns, and placeholder media not governed by `pravatar.cc` or external CDNs.

## Developer Note
When adding new pages to the `/pages/...` subdirectories, ensure that paths to these assets properly account for directory depth (e.g., `<script src="../../assets/js/data.js"></script>`).
