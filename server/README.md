# Server setup for WP8 simulator

This small Express server provides endpoints to integrate with real services and keep secret API keys off the client.

Features:
- /api/sms/send (POST) — send SMS via Twilio
- /api/call/make (POST) — initiate phone calls via Twilio
- /api/mail/send (POST) — send email via SMTP (nodemailer)
- /api/weather (GET) — proxy to OpenWeatherMap

Quick start:
1. Install dependencies:
   cd server
   npm install
2. Create a .env file based on .env.example and fill in credentials (TWILIO_*, SMTP_*, OPENWEATHERMAP_API_KEY).
3. Start the server:
   npm start

Notes:
- The server listens on port 3000 by default. If you serve the simulator UI from a different port, CORS is enabled.
- Do NOT commit your .env file or API keys to the repository.
