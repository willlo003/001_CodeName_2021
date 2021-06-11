const express = require("express");
const path = require("path");
const { verifyUsers } = require("../controllers/usersController");

const router = express.Router();

const usersController = require("../controllers/usersController");
const cardsController = require("../controllers/cardsController");
// const sessionController = require("../controllers/sessionController");

router.get("/", (req, res) => {
  res.status(200).sendFile(path.join(__dirname, "../../index.html"));
});

router.post("/register", (req, res) => {
  // console.log("i m good");
  res.status(200).json({});
});

router.post("/login", usersController.verifyUsers, (req, res) => {
  res.status(200).json(req.body);
});

router.get("/lobby", (req, res) => {
  res.status(200).sendFile(path.join(__dirname, "../../index.html"));
});

router.get("/game", (req, res) => {
  // console.log("hi");
  res.status(200).sendFile(path.join(__dirname, "../../index.html"));
});

router.get("/cards", cardsController.getCards, (req, res) => {
  // console.log("hi");
  res.status(200).json({ cards: res.locals.cards });
});

module.exports = router;
