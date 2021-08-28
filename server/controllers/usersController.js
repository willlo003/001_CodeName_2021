const db = require("../models/usersModels");
const bcrypt = require("bcryptjs");
const SALT_WORK_FACTOR = 5;
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
    if (result.rows.length === 1) {
      if (
        (await bcrypt.compare(
          req.body.loginDetails.password,
          result.rows[0].password
        )) === false
      ) {
        res.locals.message = "Invalid username or password";
        return next();
      } else {
        res.locals = result.rows[0];
        return next();
      }
    } else {
      res.locals.message = "Invalid username or password";
      return next();
    }
  } catch (err) {
    console.log(err);
  }
};

usersController.createUser = async (req, res, next) => {
  //check the username whether already existed
  if (
    req.body.registeDetails.username.includes(" ") ||
    req.body.registeDetails.password.includes(" ")
  ) {
    res.locals.message = "Invalid username or password";
    return next();
  }
  if (
    req.body.registeDetails.username.length < 4 ||
    req.body.registeDetails.password.length < 8
  ) {
    res.locals.message =
      "Username and password at least 4 and 8 characters in length respectively";
    return next();
  }
  const existUser = `SELECT * FROM person WHERE username='${req.body.registeDetails.username}'`;
  const result = await db.query(existUser);

  if (result.rows.length === 0) {
    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
    const hashedPassword = await bcrypt.hash(
      req.body.registeDetails.password,
      salt
    );
    const insert = `INSERT INTO person (username, password, games, win) VALUES (
      '${req.body.registeDetails.username}',
      '${hashedPassword}',
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
