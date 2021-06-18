//require routers
const express = require("express");
const path = require("path");
const app = express();

const http = require("http");
const socketIO = require("socket.io");
const server = http.createServer(app);

const io = socketIO(server);

const port = 3000;

const cors = require("cors");
require("dotenv").config();

const router = require("./routes/routes");

//handle parsing request body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

if (process.env.NODE_ENV === "production") {
  // handle requests for static files
  app.use("/build", express.static(path.join(__dirname, "../build")));

  //define route handler
  app.use("/", router);
}

// catch-all route handler for any requests to an unknown route
app.use((req, res) =>
  res.status(404).send("This is not the page you're looking for...")
);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../index.html"));
});

const user = {};

io.on("connection", (socket) => {
  console.log(`Connected: ${socket.id}`);
  socket.on("disconnect", () => {
    console.log("user " + user[socket.id] + " disconnected");
  });
  // lobby;
  /*   socket.on("player logged on", (msg) => {
    console.log("user " + msg + " connected");
    user[socket.id] = msg;
    console.log(user);
    socket.broadcast.emit("player logged on", msg);
  });
  socket.on("player", (msg) => {
    io.emit("player", msg);
  });
  socket.on("game start", (msg) => {
    io.emit("game start", msg);
  }); */
  //game
  socket.on("assign", (msg) => {
    io.emit("assign", msg);
  });
  socket.on("getOnClickId", (msg) => {
    io.emitit("getOnClickId", msg);
  });
  socket.on("cardOnClick", (msg) => {
    io.emit("cardOnClick", msg);
  });
  socket.on("win condition", (msg) => {
    io.emit("win condition", msg);
  });
  socket.on("select red team", (msg) => {
    io.emit("select red team", msg);
  });
  socket.on("select blue team", (msg) => {
    io.emit("select blue team", msg);
  });
  socket.on("playing", (msg) => {
    io.emit("playing", msg);
  });
  socket.on("turn", (msg) => {
    io.emit("turn", msg);
  });
  socket.on("remainRed", (msg) => {
    io.emit("remainRed", msg);
  });
  socket.on("remainBlue", (msg) => {
    io.emit("remainBlue", msg);
  });
  socket.on("gameover", (msg) => {
    io.emit("gameover", msg);
  });
});

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

module.exports = router;
