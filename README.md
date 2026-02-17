<div align="center">

# 🗳️ Real-Time Poll Rooms

### _Create. Share. Vote. Watch Live._

[![Live Demo](https://img.shields.io/badge/demo-live-success?style=for-the-badge&logo=vercel)](YOUR_DEPLOYMENT_URL)
[![GitHub](https://img.shields.io/badge/github-repository-blue?style=for-the-badge&logo=github)](YOUR_GITHUB_URL)
[![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)](LICENSE)

**A modern, full-stack web application for creating polls and collecting votes with real-time updates powered by WebSockets.**

[Live Demo](#) • [Features](#-features) • [Tech Stack](#-tech-stack) • [Getting Started](#-installation--setup)

---

</div>

## 🎯 What is This?

A lightning-fast poll application where anyone can create polls, share unique links, and watch results update in real-time as votes pour in. No sign-up required—just create and share!

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Anti-Abuse Mechanisms](#-anti-abuse-mechanisms)
- [Edge Cases Handled](#-edge-cases-handled)
- [Known Limitations](#-known-limitations)
- [Installation & Setup](#-installation--setup)
- [Deployment](#-deployment)
- [Project Structure](#-project-structure)

## ✨ Features

<table>
<tr>
<td width="50%">

### 🚀 Core Functionality
- 📝 **Instant Poll Creation** - 2-10 options supported
- 🔗 **Unique Shareable Links** - UUID-based URLs
- 🗳️ **One Vote per User** - Single-choice voting
- ⚡ **Real-Time Updates** - WebSocket-powered live results
- 💾 **Cloud Database** - Supabase PostgreSQL persistence
- 🛡️ **Anti-Abuse System** - IP + Browser fingerprinting

</td>
<td width="50%">

### 🎨 User Experience
- 📱 **Fully Responsive** - Mobile, tablet, desktop
- 🎯 **Clean Modern UI** - Gradient designs with animations
- 📊 **Live Progress Bars** - Animated vote percentages
- 🔄 **Auto-Reconnect** - Network resilience built-in
- 📋 **One-Click Copy** - Share links instantly
- ⚡ **Zero Latency** - Instant feedback on actions

</td>
</tr>
</table>

## 🛠️ Tech Stack

<div align="center">

### Backend
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socketdotio&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)

### Frontend
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)

### Deployment
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![Render](https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)

</div>

---

## 📊 Database Schema (Supabase PostgreSQL)

```sql
polls
  - id (UUID, PRIMARY KEY)
  - question (TEXT)
  - created_at (TIMESTAMP)

options
  - id (UUID, PRIMARY KEY)
  - poll_id (UUID, FOREIGN KEY → polls.id)
  - text (TEXT)
  - position (INTEGER)

votes
  - id (BIGSERIAL, PRIMARY KEY)
  - poll_id (UUID, FOREIGN KEY → polls.id)
  - option_id (UUID, FOREIGN KEY → options.id)
  - ip_address (TEXT)
  - fingerprint (TEXT)
  - voted_at (TIMESTAMP)
```

## 🛡️ Anti-Abuse Mechanisms

> **Assignment Requirement:** "Include at least two mechanisms that reduce repeat/abusive voting"

### 1. 🌐 IP Address Tracking

**What it prevents:**
- Multiple votes from the same network/device
- Basic abuse from users trying to vote multiple times

**How it works:**
- Server captures the request IP address (`req.ip`)
- Before recording a vote, checks if this IP has already voted on this poll
- Rejects duplicate votes with clear error message

**Limitations:**
- Users behind the same NAT/corporate network share an IP
- Users with dynamic IPs could potentially vote again after IP change
- VPN/proxy users can bypass by switching servers

---

### 2. 🔍 Browser Fingerprinting

**What it prevents:**
- Same-device voting across different browsers/incognito modes
- More persistent tracking than cookies alone

**How it works:**
- Generates a unique fingerprint from browser characteristics:
  - User agent, language, screen resolution
  - Color depth, timezone, hardware specs
  - Canvas rendering signature
- Stores fingerprint in `localStorage` for persistence
- SHA-256 hash ensures privacy while maintaining uniqueness

**Limitations:**
- Clearing browser data removes the fingerprint
- Different browsers on same device get different fingerprints
- Sophisticated users can spoof browser characteristics

---

### 3. 🚦 Rate Limiting (Bonus)

**What it prevents:**
- Automated bot attacks
- Rapid spam voting attempts
- API abuse

**How it works:**
- Limits each IP to 100 requests per 15 minutes on `/api/*` endpoints
- Returns 429 status code when limit exceeded
- Prevents both legitimate abuse and DDoS attempts

**Limitations:**
- Affects all users behind shared IPs
- Determined attackers can distribute across multiple IPs

## ✅ Edge Cases Handled

### 1. Network Resilience
- **WebSocket disconnections** - Automatic reconnection with exponential backoff
- **Failed HTTP requests** - Clear error messages with retry options
- **Server unavailability** - Graceful fallback and user notifications

### 2. Data Validation
- **Empty poll questions** - Frontend and backend validation
- **< 2 options** - Enforced minimum requirement
- **Invalid option selection** - Verified against database
- **XSS prevention** - Input sanitization via React's automatic escaping
- **SQL injection** - Parameterized queries via Supabase client

### 3. Race Conditions
- **Simultaneous votes** - Database constraints ensure one vote per fingerprint/IP
- **Multiple poll creation** - UUID prevents ID collisions
- **Concurrent connections** - Socket.io room isolation per poll

### 4. User Experience
- **Poll not found** - Friendly 404 with navigation back home
- **Already voted** - Clear messaging without allowing re-vote
- **Loading states** - Skeleton screens and spinners during async operations
- **Empty results** - Displays 0% bars gracefully
- **Long content** - Text truncation and max-length validation

### 5. Browser Compatibility
- **localStorage unavailable** - Fallback fingerprint generation
- **crypto.subtle missing** - Alternative hashing algorithm
- **Old browsers** - Polite upgrade message (via Vite's legacy plugin if needed)

## ⚠️ Known Limitations & Future Improvements

### Current Limitations

1. **Single Server Architecture**
   - No horizontal scaling (Socket.io requires sticky sessions)
   - Solution: Implement Redis adapter for Socket.io

2. **IP-based Tracking**
   - Shared IPs (schools, offices) can't vote multiple times
   - Solution: Implement optional email verification or OAuth

3. **Browser Fingerprinting**
   - Can be cleared or spoofed by determined users
   - Solution: Combine with server-side session tracking

4. **No Poll Expiration**
   - Polls remain active indefinitely
   - Solution: Add optional expiration dates and auto-archival

5. **No Vote Editing**
   - Users cannot change their vote once submitted
   - Solution: Add "change vote" feature with time limits

6. **No Authentication**
   - Anyone can create unlimited polls
   - Solution: Add rate limiting on poll creation, optional accounts

### Potential Improvements

- 📊 **Analytics Dashboard** - View poll performance metrics
- 📧 **Email Notifications** - Alert creators when votes come in
- 🔒 **Private Polls** - Password-protected polls
- 📅 **Scheduled Polls** - Auto-open/close at specific times
- 🎨 **Customization** - Custom colors, themes, branding
- 📤 **Export Results** - Download as CSV, PDF, images
- 🔗 **QR Code Generation** - Easy mobile sharing
- 💬 **Comments** - Allow voters to leave feedback
- 🏆 **Poll Templates** - Pre-made poll formats
- 🌐 **Internationalization** - Multi-language support

## 🚀 Installation & Setup

### Prerequisites
- Node.js 18+ and npm
- Git
- Supabase account (free tier)

### Local Development

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd itsmyscreen
```

2. **Install dependencies**
```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. **Set up Supabase**
   - Create a project at https://supabase.com
   - Run the SQL from `backend/supabase-schema.sql` in the SQL Editor
   - Get your Project URL and Anon Key from Settings → API

4. **Configure environment variables**

Create `backend/.env`:
```env
PORT=3000
CLIENT_URL=http://localhost:5173
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

5. **Start the development servers**

Option A - Run both servers concurrently:
```bash
# From root directory
npm run dev
```

Option B - Run separately:
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

6. **Access the application**
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000
- API Health: http://localhost:3000/api/health

## 🌐 Deployment

### Deploy to Vercel (Frontend) + Render (Backend)

#### 1. Push to GitHub
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

#### 2. Deploy Backend to Render

1. Go to https://render.com/ and sign in with GitHub
2. Click "New +" → "Web Service"
3. Connect your repository
4. Configure:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Environment Variables**:
     ```
     NODE_ENV=production
     CLIENT_URL=https://your-frontend-url.vercel.app
     SUPABASE_URL=your_supabase_url
     SUPABASE_ANON_KEY=your_supabase_anon_key
     ```
5. Deploy and save the URL

#### 3. Deploy Frontend to Vercel

1. Go to https://vercel.com/ and sign in with GitHub
2. Click "Add New..." → "Project"
3. Import your repository
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Environment Variables**:
     ```
     VITE_SERVER_URL=https://your-backend-url.onrender.com
     ```
5. Deploy

#### 4. Update Backend CLIENT_URL

Go back to Render, update the `CLIENT_URL` environment variable with your Vercel URL, and redeploy.

## 📁 Project Structure

```
itsmyscreen/
├── backend/
│   ├── database.js          # Supabase queries
│   ├── server.js            # Express + Socket.io server
│   ├── supabase-schema.sql  # Database schema
│   ├── package.json
│   └── .env                 # Environment variables (not in git)
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.jsx         # Landing page
│   │   │   ├── CreatePoll.jsx   # Poll creation form
│   │   │   └── ViewPoll.jsx     # Voting & results
│   │   ├── utils/
│   │   │   ├── socket.js        # Socket.io client
│   │   │   └── fingerprint.js   # Browser fingerprinting
│   │   ├── App.jsx              # Router setup
│   │   ├── main.jsx             # React entry point
│   │   └── index.css            # TailwindCSS
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
├── package.json             # Root package for scripts
├── .gitignore
└── README.md
```

## 🧪 Testing the Application

### Manual Testing Checklist

**Poll Creation:**
- [ ] Create poll with 2 options
- [ ] Create poll with 10 options
- [ ] Try creating with 1 option (should fail)
- [ ] Try creating with empty question (should fail)
- [ ] Verify shareable link is generated

**Voting:**
- [ ] Vote on a poll
- [ ] Try voting again (should be blocked)
- [ ] Open poll in incognito (should be blocked by fingerprint)
- [ ] Open on different device (should be blocked by IP on same network)
- [ ] Verify error messages are clear

**Real-Time Updates:**
- [ ] Open poll on two different browsers/devices
- [ ] Vote on one device
- [ ] Verify the other device updates instantly
- [ ] Check vote counts and percentages match

**Edge Cases:**
- [ ] Navigate to non-existent poll ID
- [ ] Disconnect network and try voting
- [ ] Refresh page during vote submission
- [ ] Create poll with very long question/options

## 📝 License

MIT License - feel free to use this project for learning or production.

## 👨‍💻 Author

Built for the Full-Stack Assignment: Real-Time Poll Rooms

---

<div align="center">

**⭐ Star this repo if you found it helpful!**

Made with ❤️ using React, Node.js, Socket.io & Supabase

</div>
