# WP8 Stage B — Progress

This commit adds Stage B features to the Windows Phone 8 simulator branch (feature/wp8-complete):

- Tile reordering via drag & drop (tiles saved to IndexedDB)
- Notification center (persisted) and notifications are stored when WP.notify is called
- Mail app (local mailboxes) and compose/send
- Video app placeholder (assets/sample.mp4 placeholder)
- Calculator app
- Weather app with mock data and optional OpenWeatherMap integration when you store a key under `weatherApiKey`
- Small accessibility improvements in index.html (ARIA roles)

How to test (quick)
- Checkout the branch and serve the repo locally (python -m http.server)
- Open the shell (index.html), drag tiles to reorder them; ordering is persisted.
- Use the Mail app to compose messages (saved locally). Use Weather -> Refresh to see mock data.

Next: Mail polishing, Calendar reminders with notification scheduling, Music playlists, Video samples, Store polish (install creates real placeholder tiles), accessibility audit and i18n expansion.
