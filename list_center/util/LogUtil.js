/**
 * Created by Jericho.ou on 14-7-24.
 */

var logConfig = require("../config/BaseConfig").logConfig;
var log4js = require('log4js');
log4js.configure(logConfig.log4JSConfig, {});

module.exports={
  dev: function (msg,line) {
    if (logConfig.logLevel <= 0) {
      if(line){log4js.getLogger("dev").info(module.exports.getLine());}
      log4js.getLogger("dev").info(msg);
    }
  }
  , info: function (msg,line) {
    if (logConfig.logLevel <= 1) {
      if(line){log4js.getLogger("info").info(module.exports.getLine());}
      log4js.getLogger("info").info(msg);
    }
  }
  , product: function (msg,line) {
    if (logConfig.logLevel <= 2) {
      if(line){log4js.getLogger("info").info(module.exports.getLine());}
      log4js.getLogger("info").info(msg);
    }
  }
  , error: function (msg,line) {
    if (logConfig.logLevel <= 3) {
      if(line){log4js.getLogger("error").info(module.exports.getLine());}
      log4js.getLogger("error").info(msg);
    }
  }
  , getLine: function () {
    return ("------------------------------------------------------------------------------------------");
  }
};
