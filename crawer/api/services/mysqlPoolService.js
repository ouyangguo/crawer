/**
 * Created by ou on 16-1-11.
 */
var mysql = require("mysql"),
  config = {
    connectionLimit:10,
    host:"localhost",
    user:"root",
    password:"123456"
  };

var pool = mysql.createPool(config);
module.exports = pool;
