let ioInstance = null;

function initSocket(io) {
  ioInstance = io;

  io.on('connection', (socket) => {
    console.log(`🔌 Client connected to Socket.IO: ${socket.id}`);

    // Join user room by userId or role
    socket.on('join_room', (data) => {
      if (data.userId) {
        socket.join(`user_${data.userId}`);
        console.log(`Socket ${socket.id} joined room user_${data.userId}`);
      }
      if (data.role) {
        socket.join(`role_${data.role}`);
        console.log(`Socket ${socket.id} joined room role_${data.role}`);
      }
    });

    socket.on('disconnect', () => {
      console.log(`🔌 Client disconnected: ${socket.id}`);
    });
  });
}

function emitToUser(userId, event, payload) {
  if (ioInstance) {
    ioInstance.to(`user_${userId}`).emit(event, payload);
  }
}

function emitToRole(role, event, payload) {
  if (ioInstance) {
    ioInstance.to(`role_${role}`).emit(event, payload);
  }
}

function broadcastEvent(event, payload) {
  if (ioInstance) {
    ioInstance.emit(event, payload);
  }
}

module.exports = {
  initSocket,
  emitToUser,
  emitToRole,
  broadcastEvent
};
