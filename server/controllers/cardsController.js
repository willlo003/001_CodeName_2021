let { Cards } = require("../models/cardsModels");

const cardsController = {};

cardsController.getCards = (req, res, next) => {
  Cards.find({})
    .exec()
    .then((cardsName) => {
      //   console.log(cardsName);
      res.locals.cards = cardsName;
      //   res.status(200).send({ names: res.locals.cards });
      return next();
    })
    .catch((err) => console.log(err));
};

module.exports = cardsController;
