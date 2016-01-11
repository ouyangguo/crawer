/**
 * Created by ou on 16-1-11.
 */
var zmq = require('zmq')
  , sock = zmq.socket('push'),
  redis = require("redis"),
  config = {
    port:5678,
    redis_url:"redis://127.0.0.1:6379",
    queue_name:"mofcom_task_list"
  };
var client = redis.createClient(config.redis_url);
sock.bindSync('tcp://127.0.0.1:'+config.port);
console.log('Producer bound to port '+config.port);
setInterval(function(){
client.rpop(config.queue_name,function(err,data){
  console.log(err,data);
  if(err||!data) return;
  sock.send(data);
})
}, 5000);
