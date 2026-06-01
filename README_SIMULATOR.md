# Windows Phone Simulator — README

This simulator is a lightweight, client-only Windows Phone-like UI you can run from the repository.

Files added in this commit (starter):
- index.html — launcher and phone shell
- styles/main.css — simulator styles
- scripts/app.ts — TypeScript source (optional)
- scripts/app.js — compiled JS (no build step required)
- apps/clock.html, apps/clock.js — sample Clock app
- apps/notes.html, apps/notes.js — Notes app (uses localStorage)
- icons/* — SVG phone frame and app icons

How to run:
1. Clone the repo: git clone https://github.com/davidSfetcu/Windows-Simulator-by-ChatGPT-.git
2. Open index.html in a browser (double-click or serve with a static server).

Notes:
- The simulator is client-only and uses localStorage for notes. If you want a PHP backend for persistence, tell me and I can add server/api.php and example fetch calls.
- I avoided modifying README.md in the repo; this file is README_SIMULATOR.md to document the simulator.
