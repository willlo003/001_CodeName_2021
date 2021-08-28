const express = require("express");
const path = require("path");

const router = express.Router();

const usersController = require("../controllers/usersController");
const cardsController = require("../controllers/cardsController");

router.get("/", (req, res) => {
  res.status(200).sendFile(path.join(__dirname, "../../index.html"));
});

router.post(
  "/register",
  usersController.createUser,

  (req, res) => {
    res.status(200).json({ message: res.locals.message });
  }
);

router.post(
  "/login",
  usersController.verifyUsers,

  (req, res) => {
    res.status(200).json(res.locals);
  }
);

router.get("/game", (req, res) => {
  res.status(200).sendFile(path.join(__dirname, "../../index.html"));
});

router.get("/cards", cardsController.getCards, (req, res) => {
  res.status(200).json({ cards: res.locals.cards });
});

module.exports = router;
