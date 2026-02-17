# Real-Time Poll Rooms 🗳️

A full-stack web application that enables users to create polls, share them via links, and collect votes with real-time result updates for all viewers.

## 🚀 Live Demo

**Deployed Application:** [Your deployment URL here]

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Anti-Abuse Mechanisms](#anti-abuse-mechanisms)
- [Edge Cases Handled](#edge-cases-handled)
- [Known Limitations](#known-limitations)
- [Installation & Setup](#installation--setup)
- [Deployment](#deployment)
- [Project Structure](#project-structure)

## ✨ Features

### Core Functionality
- ✅ **Poll Creation** - Create polls with custom questions and 2-10 options
- ✅ **Shareable Links** - Generate unique, persistent URLs for each poll
- ✅ **Single-Choice Voting** - Users can vote on one option per poll
- ✅ **Real-Time Updates** - Live vote count updates using WebSockets (Socket.io)
- ✅ **Data Persistence** - SQLite database ensures polls/votes survive server restarts
- ✅ **Fair Voting** - Multiple anti-abuse mechanisms prevent duplicate voting

### User Experience
- 🎨 Modern, clean UI with TailwindCSS
- 📱 Fully responsive design
- ⚡ Instant feedback and smooth animations
- 🔄 Automatic reconnection on network issues
- 📊 Real-time vote percentage calculations
- 🎯 Visual progress bars for results

## 🛠️ Tech Stack

### Backend
- **Node.js** + **Express** - Server framework
- **Socket.io** - Real-time bidirectional communication
- **better-sqlite3** - Lightweight, embedded SQL database
- **UUID** - Unique poll ID generation
- **express-rate-limit** - API rate limiting

### Frontend
- **React 18** - UI framework
- **Vite** - Fast build tool and dev server
- **React Router** - Client-side routing
- **Socket.io-client** - WebSocket client
- **Axios** - HTTP requests
- **TailwindCSS** - Utility-first CSS framework

### Database Schema
```sql
polls
  - id (TEXT, PRIMARY KEY)
  - question (TEXT)
  - created_at (DATETIME)

options
  - id (TEXT, PRIMARY KEY)
  - poll_id (TEXT, FOREIGN KEY)
  - text (TEXT)
  - position (INTEGER)

votes
  - id (INTEGER, PRIMARY KEY)
  - poll_id (TEXT, FOREIGN KEY)
  - option_id (TEXT, FOREIGN KEY)
  - ip_address (TEXT)
  - fingerprint (TEXT)
  - voted_at (DATETIME)
```

## 🛡️ Anti-Abuse Mechanisms

### 1. IP Address Tracking ⛔
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

### 2. Browser Fingerprinting 🔍
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

### 3. Rate Limiting 🚦 (Bonus)
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
- **SQL injection** - Parameterized queries with prepared statements

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

2. **SQLite Database**
   - Not ideal for high concurrency or distributed systems
   - Solution: Migrate to PostgreSQL/MySQL for production

3. **IP-based Tracking**
   - Shared IPs (schools, offices) can't vote multiple times
   - Solution: Implement optional email verification or OAuth

4. **Browser Fingerprinting**
   - Can be cleared or spoofed by determined users
   - Solution: Combine with server-side session tracking

5. **No Poll Expiration**
   - Polls remain active indefinitely
   - Solution: Add optional expiration dates and auto-archival

6. **No Vote Editing**
   - Users cannot change their vote once submitted
   - Solution: Add "change vote" feature with time limits

7. **No Authentication**
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

3. **Start the development servers**

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

4. **Access the application**
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000
- API Health: http://localhost:3000/api/health

## 🌐 Deployment

### Option 1: Railway (Recommended)

**Backend:**
1. Create new project on Railway
2. Connect GitHub repo
3. Set root directory to `/backend`
4. Add environment variable: `CLIENT_URL=https://your-frontend-url.com`
5. Deploy

**Frontend:**
1. Create new project on Railway
2. Connect same GitHub repo
3. Set root directory to `/frontend`
4. Add environment variable: `VITE_SERVER_URL=https://your-backend-url.railway.app`
5. Deploy

### Option 2: Render

**Backend:**
```yaml
# render.yaml
services:
  - type: web
    name: poll-backend
    env: node
    buildCommand: cd backend && npm install
    startCommand: cd backend && npm start
    envVars:
      - key: CLIENT_URL
        value: https://your-frontend.onrender.com
```

**Frontend:**
```yaml
  - type: web
    name: poll-frontend
    env: static
    buildCommand: cd frontend && npm install && npm run build
    staticPublishPath: ./frontend/dist
    envVars:
      - key: VITE_SERVER_URL
        value: https://your-backend.onrender.com
```

### Option 3: Vercel (Frontend) + Railway/Render (Backend)

**Frontend on Vercel:**
1. Import GitHub repo
2. Framework: Vite
3. Root directory: `frontend`
4. Build command: `npm run build`
5. Output directory: `dist`
6. Environment variable: `VITE_SERVER_URL`

**Backend:** Use Railway or Render as above

### Environment Variables

**Backend (.env):**
```env
PORT=3000
CLIENT_URL=http://localhost:5173
```

**Frontend (.env):**
```env
VITE_SERVER_URL=http://localhost:3000
```

## 📁 Project Structure

```
itsmyscreen/
├── backend/
│   ├── database.js          # SQLite setup & queries
│   ├── server.js            # Express + Socket.io server
│   ├── package.json
│   └── .gitignore
├── frontend/
│   ├── public/
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
│   ├── package.json
│   └── .gitignore
├── package.json             # Root package for scripts
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

**Note:** Replace placeholder URLs with your actual deployment links before submission.
