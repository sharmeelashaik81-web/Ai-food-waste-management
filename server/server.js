const http = require('http');
const { Server } = require('socket.io');
const app = require('./app');
const { initSocket } = require('./services/socketService');
const seedData = require('./seed');

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

// Socket.IO Server
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_ORIGIN || '*',
    methods: ['GET', 'POST']
  }
});

initSocket(io);

// Auto-seed in-memory store for instant demonstration
seedData().then(() => {
  server.listen(PORT, () => {
    console.log(`🚀 AI Food Waste Management Server listening on port ${PORT}`);
    console.log(`📡 Socket.IO Real-time Engine running`);
    console.log(`🌐 Base API URL: http://localhost:${PORT}/api`);
  });
}).catch(err => {
  console.error('Failed to start server:', err);
});
