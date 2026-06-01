# Server integration added (Stage C)

I added a simple Express server under /server to integrate with real services you requested: Twilio (SMS & calls), SMTP mail via nodemailer, and OpenWeatherMap proxy.

Files added:
- server/index.js — Express server with endpoints
- server/package.json — dependencies
- server/.env.example — env vars to configure
- server/README.md — how to run

Client changes:
- scripts/messaging.js now attempts to POST messages to http://localhost:3000/api/sms/send (falls back to local storage)
- scripts/mail.js now attempts to POST to http://localhost:3000/api/mail/send (falls back to local storage)
- scripts/weather.js will try the server proxy at http://localhost:3000/api/weather before falling back to mock data or direct OpenWeatherMap if you store a key in storage.

Next steps:
- Start the server locally and set environment variables with your Twilio and SMTP credentials. Server will return helpful 501 errors if not configured.
- Provide any credentials you want integrated on hosted environment (use .env and never commit credentials to git).

Note: I did not include any API keys in the repository. Provide them via environment variables on the server where you run the backend.
