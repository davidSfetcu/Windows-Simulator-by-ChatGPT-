# WP8 Complete — Feature Branch

This branch (feature/wp8-complete) contains a high-fidelity Windows Phone 8 simulator built with HTML/CSS/JS. It's designed to approximate the look and feel of WP8 and provide functional apps simulated in the browser.

How to run:
- Clone the repo and checkout the branch:
  git fetch origin feature/wp8-complete && git checkout feature/wp8-complete
- Serve with a static server (recommended):
  python -m http.server 8000
  open http://localhost:8000/index.html

Notes:
- Camera requires HTTPS or localhost for getUserMedia.
- All data is persisted in localStorage via a simple storage wrapper. You can migrate to server endpoints if desired.
- To simulate an incoming call press the "c" key in the shell page or use the "Simulate Incoming" button in the Phone app.
