/**
 * Created by Jericho.ou on 15/9/24.
 */

var zmq = require('zmq')
    , sock = zmq.socket('pub'),
    http = require("http"),
    queryString = require("querystring"),
    URL=require("url"),
    _=require("underscore");

var zmqConfig=require("./config/BaseConfig").zmqConfig,
    localConfig=require("./config/BaseConfig").localConfig,
    queueConfig=require("./config/BaseConfig").queueConfig,
    sleepTime=require("./config/BaseConfig").sleepTime;

var LogUtil=require("./util/LogUtil"),
    HttpUtil=require("./util/HttpUtil");

sock.bindSync('tcp://'+zmqConfig.server.ip+":"+zmqConfig.server.port);

var MessageCenterRun={
    startServer:function(){

    },
    run:function(){
        var tempModel={
            taskName:"lpPrice"
        };
        MessageCenterRun.getTask(tempModel,function(error,response,body){
            if(error){
                LogUtil.error("调用队列接口失败：失败原因："+error+"！",true);
            }
            else{
                try{
                    var tempSleepTime=500;
                    body=JSON.parse(body);
                    if(body.code!=0){
                        LogUtil.error("队列结果信息错误：错误原因："+body.message+"！",true);
                    }
                    else if(body.count<=0){
                        LogUtil.info("当前队列中无任务！",true);
                        tempSleepTime=sleepTime;
                    }
                    else if(body.data[0].taskType==null || _.contains(zmqConfig.taskType,body.data[0].taskType)==false){
                        LogUtil.info(body.data[0].taskType);
                        LogUtil.error("队列结果信息错误：错误原因：队列类型不存在！",true);
                    }
                    else{
                        LogUtil.info("开始发送任务内容："+body.data[0].data);
                        sock.send([body.data[0].taskType,body.data[0].data]);
                    }
                    setTimeout(function(){
                        MessageCenterRun.run();
                    },tempSleepTime);
                }
                catch(e){
                    LogUtil.error("解析队列返回信息失败：失败原因："+error+"！",true);
                }
                finally{

                }
            }
        });
    },
    saveTask:function(model,callback){
        var tempUrl=queueConfig.postUrl;
        HttpUtil.doRequest(tempUrl,{},"post",model,callback);
    },
    getTask:function(model,callback){
        var tempUrl=queueConfig.getUrl;
        for(var key in model){
            tempUrl=tempUrl.replace("$#"+key+"#$",model[key]);
        }
        HttpUtil.doRequest(tempUrl,{},"get",null,callback);
    }
};

module.exports=MessageCenterRun;

MessageCenterRun.startServer();
MessageCenterRun.run();

LogUtil.info("服务程序已启动！",true);
LogUtil.info("启动发送队列，队列绑定地址：tcp://"+zmqConfig.server.ip+":"+ zmqConfig.server.port+"！");