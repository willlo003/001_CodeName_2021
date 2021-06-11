const mongoose = require("mongoose");

const MONGO_URI =
  "mongodb+srv://will:61471670@cards.qam5s.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "CodeName",
  })
  .then(() => console.log("Connected to Mongo DB."))
  .catch((err) => console.log(err));

const Schema = mongoose.Schema;

const cardsSchema = new Schema({
  name: Array,
});

const Cards = mongoose.model("cardsName", cardsSchema, "cardsName");

module.exports = {
  Cards,
};
