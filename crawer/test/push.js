/**
 * Created by ou on 16-1-11.
 */
// producer.js
var zmq = require('zmq')
  , sock = zmq.socket('push');

sock.bindSync('tcp://127.0.0.1:5678');
console.log('Producer bound to port 3000');
var i = 0;
setInterval(function(){
  console.log('sending work');
  sock.send(' work'+i);
  i++;
}, 500);
