const path = require("path");
const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const {
  usersJoint,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require("./users");
const formatMessage = require("./util");
app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
  socket.emit("message", formatMessage("chatBot", "welcome to cord"));

  socket.on("joinRoom", ({ username, room }) => {
    const users = usersJoint(socket.id, username, room);
    socket.join(users.room);
    socket.emit(
      "message",
      formatMessage("chatBot", `Welcome ${username} to the ${room} room`)
    );
    socket.broadcast
      .to(users.room)
      .emit(
        "message",
        formatMessage("chatbot", `${username} has joined the chat`)
      );

    io.to(users.room).emit("usersInRoom", getRoomUsers(users.room));
  });
  // listen for chat message
  socket.on("chatMessage", (msg) => {
    const user = getCurrentUser(socket.id);
    io.to(user.room).emit("message", formatMessage(user.username, msg));
  });
  socket.on("leaveRoom", () => {
    const user = userLeave(socket.id);
    if (user) {
      io.to(user.room).emit(
        "message",
        formatMessage("chatBot", `${user.username} has left the chat`)
      );
    }
  });
  socket.on("disconnect", () => {
    const user = userLeave(socket.id);
    if (user) {
      io.to(user.room).emit(
        "message",
        formatMessage("chatBot", `${user.username} has left the chat`)
      );
    }
  });
});
server.listen(3000, () => {
  console.log("listening on *:3000");
});
