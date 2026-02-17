import { io } from 'socket.io-client';

let socket = null;

export function connectSocket() {
  if (!socket) {
    const serverUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:3000';
    socket = io(serverUrl, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socket.on('connect', () => {
      console.log('✅ Connected to server');
    });

    socket.on('disconnect', () => {
      console.log('❌ Disconnected from server');
    });

    socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
    });
  }
  
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

export function joinPoll(pollId) {
  if (socket) {
    socket.emit('joinPoll', pollId);
  }
}

export function leavePoll(pollId) {
  if (socket) {
    socket.emit('leavePoll', pollId);
  }
}

export function getSocket() {
  return socket;
}
