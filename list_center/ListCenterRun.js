/**
 * Created by Jericho.ou on 15/9/24.
 */

var zmq = require('zmq'),
    recSock = zmq.socket('sub'),
    sendSock=zmq.socket('push');

var zmqConfig=require("./config/BaseConfig").zmqConfig;

var LogUtil=require("./util/LogUtil");

recSock.connect('tcp://'+zmqConfig.listenServer.ip+':'+zmqConfig.listenServer.port);
recSock.subscribe(zmqConfig.listenServer.channel);

sendSock.bindSync('tcp://'+zmqConfig.server.ip+':'+zmqConfig.server.port);

recSock.on('message', function(topic, message) {
    LogUtil.info("接收到订阅任务，任务内容："+message.toString());
    sendSock.send(message.toString());
});

LogUtil.info("服务程序已启动！",true);
LogUtil.info("开始监听任务，任务中心地址：tcp://"+zmqConfig.listenServer.ip+":"+ zmqConfig.listenServer.port+"，订阅频道："+zmqConfig.listenServer.channel+"！");
LogUtil.info("启动发送队列，队列绑定地址：tcp://"+zmqConfig.server.ip+":"+ zmqConfig.server.port+"！");