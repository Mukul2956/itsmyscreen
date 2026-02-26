import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { initDatabase, createPoll, getPoll, vote, getVotes } from './database.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Initialize database
initDatabase();

// Store active connections per poll
const pollRooms = new Map();

// API Routes
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'itsmyscreen API is running', timestamp: new Date().toISOString() });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.post('/api/polls', async (req, res) => {
  try {
    const { question, options } = req.body;
    
    if (!question || !options || options.length < 2) {
      return res.status(400).json({ error: 'Question and at least 2 options are required' });
    }
    
    const pollId = await createPoll(question, options);
    res.json({ pollId, shareLink: `/poll/${pollId}` });
  } catch (error) {
    console.error('Error creating poll:', error);
    res.status(500).json({ error: 'Failed to create poll' });
  }
});

app.get('/api/polls/:pollId', async (req, res) => {
  try {
    const { pollId } = req.params;
    const poll = await getPoll(pollId);
    
    if (!poll) {
      return res.status(404).json({ error: 'Poll not found' });
    }
    
    const votes = await getVotes(pollId);
    res.json({ poll, votes });
  } catch (error) {
    console.error('Error fetching poll:', error);
    res.status(500).json({ error: 'Failed to fetch poll' });
  }
});

app.post('/api/polls/:pollId/vote', async (req, res) => {
  try {
    const { pollId } = req.params;
    const { optionId, fingerprint } = req.body;
    const ip = req.ip || req.connection.remoteAddress;
    
    if (!optionId || !fingerprint) {
      return res.status(400).json({ error: 'Option ID and fingerprint are required' });
    }
    
    const poll = await getPoll(pollId);
    if (!poll) {
      return res.status(404).json({ error: 'Poll not found' });
    }
    
    const result = await vote(pollId, optionId, ip, fingerprint);
    
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }
    
    // Emit real-time update to all connected clients in this poll room
    const votes = await getVotes(pollId);
    io.to(`poll-${pollId}`).emit('voteUpdate', { votes });
    
    res.json({ success: true, votes });
  } catch (error) {
    console.error('Error voting:', error);
    res.status(500).json({ error: 'Failed to submit vote' });
  }
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  socket.on('joinPoll', async (pollId) => {
    socket.join(`poll-${pollId}`);
    console.log(`Client ${socket.id} joined poll ${pollId}`);
    
    // Send current vote counts
    const votes = await getVotes(pollId);
    socket.emit('voteUpdate', { votes });
  });
  
  socket.on('leavePoll', (pollId) => {
    socket.leave(`poll-${pollId}`);
    console.log(`Client ${socket.id} left poll ${pollId}`);
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Real-time poll API ready`);
});
