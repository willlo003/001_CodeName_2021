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

// if (process.env.NODE_ENV === "production") {
// handle requests for static files
app.use("/build", express.static(path.join(__dirname, "../build")));

//define route handler
app.use("/", router);
// }

// catch-all route handler for any requests to an unknown route
app.use((req, res) =>
  res.status(404).send("This is not the page you're looking for...")
);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../index.html"));
});

io.on("connection", (socket) => {
  console.log(`Connected: ${socket.id}`);
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
  // lobby;
  socket.on("player logged on", (msg) => {
    io.emit("player logged on", msg);
  });
  socket.on("player", (msg) => {
    io.emit("player", msg);
  });
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
});

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

module.exports = router;
