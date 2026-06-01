// server/index.js
// Simple Express server to proxy/integrate Twilio (SMS/Calls), Mail (SMTP via nodemailer), and OpenWeatherMap

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

const app = express();
app.use(cors());
app.use(bodyParser.json({limit:'5mb'}));
app.use(bodyParser.urlencoded({extended:true}));

const PORT = process.env.PORT || 3000;

// Health
app.get('/api/health', (req,res)=> res.json({ok:true}));

// SMS send via Twilio
app.post('/api/sms/send', async (req,res)=>{
  const {to, body} = req.body;
  if(!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN || !process.env.TWILIO_FROM){
    return res.status(501).json({error:'Twilio not configured. Set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM in .env'});
  }
  try{
    const twilio = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    const msg = await twilio.messages.create({ body: body, from: process.env.TWILIO_FROM, to });
    res.json({ok:true, sid: msg.sid});
  }catch(e){ console.error(e); res.status(500).json({error: e.message}); }
});

// Make a call via Twilio (TwiML or URL must be provided)
app.post('/api/call/make', async (req,res)=>{
  const {to, twimlUrl} = req.body;
  if(!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN || !process.env.TWILIO_FROM){
    return res.status(501).json({error:'Twilio not configured'});
  }
  try{
    const twilio = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    const call = await twilio.calls.create({ to, from: process.env.TWILIO_FROM, url: twimlUrl });
    res.json({ok:true, sid:call.sid});
  }catch(e){ console.error(e); res.status(500).json({error:e.message}); }
});

// Mail send via SMTP (nodemailer) — configure SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS
app.post('/api/mail/send', async (req,res)=>{
  const {to, subject, body} = req.body;
  if(!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS)){
    return res.status(501).json({error:'SMTP not configured. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS in .env'});
  }
  try{
    const nodemailer = require('nodemailer');
    const transporter = nodemailer.createTransport({ host: process.env.SMTP_HOST, port: process.env.SMTP_PORT||587, secure: false, auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } });
    const info = await transporter.sendMail({ from: process.env.SMTP_FROM || process.env.SMTP_USER, to, subject, text: body });
    res.json({ok:true, messageId: info.messageId});
  }catch(e){ console.error(e); res.status(500).json({error:e.message}); }
});

// Weather proxy to OpenWeatherMap
app.get('/api/weather', async (req,res)=>{
  const q = req.query.q || 'London';
  if(!process.env.OPENWEATHERMAP_API_KEY){
    return res.status(501).json({error:'OpenWeatherMap API key not configured. Set OPENWEATHERMAP_API_KEY in .env'});
  }
  try{
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(q)}&appid=${process.env.OPENWEATHERMAP_API_KEY}&units=metric`;
    const r = await fetch(url);
    const j = await r.json();
    res.json(j);
  }catch(e){ console.error(e); res.status(500).json({error:e.message}); }
});

app.listen(PORT, ()=> console.log(`WP8 simulator server listening on port ${PORT}`));
