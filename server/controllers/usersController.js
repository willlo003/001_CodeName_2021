const db = require("../models/usersModels");
// const User = require("../models/usersModels");

const usersController = {};

usersController.getAllUsers = async (req, res, next) => {
  try {
    const person = "SELECT * FROM person";
    const result = await db.query(person);
    res.locals = result.rows;
    return next();
  } catch (err) {
    console.log(err);
  }
};

usersController.verifyUsers = async (req, res, next) => {
  try {
    const username = req.body.loginDetails.username;
    const person = `SELECT * FROM person WHERE username='${username}'`;
    const result = await db.query(person);
    // console.log(result.rows);
    if (result.rows.length === 0) {
      return res.status(404);
    }
    return next();
  } catch (err) {
    console.log(err);
  }
};

usersController.createUser = async (req, res, next) => {
  //check the username whether already existed
  const existUser = `SELECT * FROM person WHERE username='${req.body.registeDetails.username}'`;
  const result = await db.query(existUser);
  if (result.rows.length === 0) {
    const insert = `INSERT INTO person (username, password, games, win) VALUES (
      '${req.body.registeDetails.username}',
      '${req.body.registeDetails.password}',
      null,
      null
      )`;
    await db.query(insert);
    res.locals.message = "Success, Please login";
  } else {
    res.locals.message = "Username has been used";
  }

  return next();
};

module.exports = usersController;
