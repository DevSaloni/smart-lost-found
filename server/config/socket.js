import { Server } from "socket.io";

let io;

export const initSocket = (httpServer, allowedOrigins) => {
  io = new Server(httpServer, {
    cors: {
      origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      },
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("join", (userId) => {
      if (userId) {
        socket.join(`user_${userId}`);
        console.log(`User ${userId} joined their notification room.`);
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};
