/**
 * Created by ou on 16-1-7.
 */
/**
 * Created by jahon on 14/12/28.
 */
var log4js = require('log4js');


var options = {
  "appenders": [{
    "type": "console",
    /*clustered,console*/
    "appenders": [
      /* {
       "type": "dateFile",
       "filename": "../../logs/access.log",
       "pattern": "-yyyy-MM-dd",
       "category": "http"
       }, {
       "type": "file",
       "filename": "../../logs/app.log",
       "maxLogSize": 10485760,
       "numBackups": 3
       }, {
       "type": "logLevelFilter",
       "level": "ERROR",
       "appender": {
       "type": "file",
       "filename": "../../logs/errors.log"
       }
       },*/

      /*跟团日志配置*/
      {
        "type": "logLevelFilter",
        "level": "ERROR",
        "appender": {
          "type": "dateFile",
          "pattern": "-yyyy-MM-dd",
          "category": "crawer",
          "filename":  "./logs/CRAWER_ERROR.log"
        }
      }, {
        "type": "logLevelFilter",
        "level": "INFO",
        "appender": {
          "type": "dateFile",
          "pattern": "-yyyy-MM-dd",
          "category": "crawer",
          "filename": "./logs/CRAWER_INFO.log"
        }
      }

    ]
  }]
};
log4js.configure(options);
module.exports = log4js;
