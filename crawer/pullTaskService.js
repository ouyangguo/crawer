/**
 * Created by ou on 16-1-11.
 */
var zmq = require('zmq')
  , sock = zmq.socket('pull'),
  service = require("./crawerService"),
  logger = require("./config/logger").getLogger("crawer"),
  config = require("./config/config");


sock.connect(config.task_url);
logger.info('crawer connected to '+config.task_url);

sock.on('message', function(msg){
  logger.info('get task :', msg);
  try{
    var task = JSON.parse(msg);
    console.log(task.conf,task.target);
    service.crawer(task.conf,task.target,function(err,result){
      console.log(result);
    })
  }catch(err){
    logger.error("解析任务失败，",err);
  }
});
