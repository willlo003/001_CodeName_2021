var pg = require("pg");
//or native libpq bindings

var conString =
  "postgres://ovyisvwv:1gk_ZQeJmeTW558RKLRihWDOE7Qr0lKO@batyr.db.elephantsql.com/ovyisvwv"; //Can be found in the Details page
var client = new pg.Client(conString);
client.connect(function (err) {
  if (err) {
    return console.error("could not connect to postgres", err);
  }
  client.query('SELECT NOW() AS "theTime"', function (err, result) {
    if (err) {
      return console.error("error running query", err);
    }
    client.end();
  });
});
