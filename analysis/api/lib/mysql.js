var mysql = require("mysql"),
  config = require("../../config/connections").connections;
module.exports.getConnection = function(){
  var connection = mysql.createConnection(config.mysqlServer);
  connection.connect();
  return connection;
};
