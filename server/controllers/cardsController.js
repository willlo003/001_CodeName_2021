let { Cards } = require("../models/cardsModels");

const cardsController = {};

cardsController.getCards = (req, res, next) => {
  Cards.find({})
    .exec()
    .then((cardsName) => {
      res.locals.cards = cardsName;
      return next();
    })
    .catch((err) => console.log(err));
};

module.exports = cardsController;
