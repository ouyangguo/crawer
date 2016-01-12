/**
 * Created by Jericho.ou on 15/9/23.
 */

var http = require("http"),
    queryString = require("querystring"),
    URI=require("url"),
    _=require("underscore");

var localConfig = require("./config/BaseConfig").localConfig;
    ipWhileList=require("./config/BaseConfig").ipWhileList;

var regRule=require("./jsonConfig/reg");

var FormatObjectUtil=require("./util/FormatObjectUtil"),
    LogUtil=require("./util/LogUtil"),
    ValidateObjectUtil=require("./util/ValidateObjectUtil"),
    RedisUtil=require("./util/RedisUtil");

var regularPath ="/queue";

http.createServer(function (req, res) {
    var resultJson={
        "code":999,
        "message":"未知错误",
        "logId":new Date().getTime()+ "" + parseInt(1000000000 * Math.random())
    };
    try {
        var requestUrlInfo = (URI.parse(req.url));
        //初始化query
        if (requestUrlInfo.query == null) {
            requestUrlInfo.query = {};
        }
        else{
            requestUrlInfo.query=queryString.parse(requestUrlInfo.query);
        }
        requestUrlInfo.userIP=getUserIp(req);
        if(ipWhileList.length>=1 && _.contains(ipWhileList,requestUrlInfo.userIP)==false){
            resultJson.code=20;
            resultJson.message="当前IP未授权!";
            writeJson(res,resultJson);
        }
        else if (req.method.toLowerCase() === "post" && requestUrlInfo.pathname === regularPath) {
            var userPostData="";
            req.addListener('data', function(chunk){
                userPostData+=chunk.toString();
            })
            .addListener('end', function(){
                try{
                    userPostData=JSON.parse(userPostData);
                    var errorMessage = ValidateObjectUtil.doValidate(userPostData, regRule.save);
                    if (errorMessage != "") {
                        resultJson.code = 20;
                        resultJson.message = errorMessage;
                        writeJson(res, resultJson);
                    }
                    else {
                        RedisUtil[userPostData.type == "1" ? "lPush" : "rPush"].call(this,userPostData.taskName, userPostData.taskType+"/"+userPostData.data, function (err, data) {
                            if (err) {
                                LogUtil.error("存储队列任务到Redis发生错误，错误原因：" + err + "！", true);
                                resultJson.code = 40;
                                resultJson.message = err;
                            }
                            else {
                                resultJson.code = 0;
                                resultJson.message = "保存成功！";
                            }
                            writeJson(res, resultJson);
                        });
                    }
                }
                catch(e){
                    resultJson.code=20;
                    resultJson.message="内容格式有误，错误原因："+ e.message+"!";
                    writeJson(res,resultJson);
                }
                finally{

                }
            });
        }
        else if (req.method.toLowerCase() === "get" && requestUrlInfo.pathname === regularPath) {
            var errorMessage = ValidateObjectUtil.doValidate(requestUrlInfo.query, regRule.get);
            if (errorMessage != "") {
                resultJson.code = 20;
                resultJson.message = errorMessage;
                writeJson(res, resultJson);
            }
            else {
                RedisUtil.lPop(requestUrlInfo.query.taskName, function (err, data) {
                    if (err) {
                        LogUtil.error("从Redis读取队列信息时发生错误，错误原因：" + err + "！", true);
                        resultJson.code = 40;
                        resultJson.message = err;
                    }
                    else {
                        resultJson.code = 0;
                        resultJson.message = "读取成功！";
                        if(data == null){
                            resultJson.data=[];
                            resultJson.count=0;
                        }
                        else{
                            resultJson.data=[{
                                taskType:data.substr(0,data.indexOf("/")),
                                data:data.substring(data.indexOf("/")+1)
                            }];
                            resultJson.count=1;
                        }
                    }
                    writeJson(res, resultJson);
                })
            }
        }
        else {
            res.writeHead(404, {'Content-Type': 'text/html;charset=utf-8'});
            res.end("Page not found！");
        }
    }
    catch(e){
        LogUtil.error("用户调用队列接口时发生错误，错误原因："+ e.message,true);
        writeJson(res, resultJson);
    }
    finally{

    }
}).listen(localConfig[0],localConfig[1]);

LogUtil.info("服务已启动，ip："+localConfig[1],true);
LogUtil.info("端口："+localConfig[0]);

function getUserIp(req){
    var ipAddress;
    var headers = req.headers;
    var forwardedIpsStr = headers['x-real-ip'] || headers['x-forwarded-for'];
    forwardedIpsStr ? ipAddress = forwardedIpsStr : ipAddress = null;
    if (!ipAddress) {
        ipAddress = req.connection.remoteAddress;
    }
    return ipAddress;
}

function writeJson(res,resultJSON){
    res.writeHead(200, {'Content-Type': 'application/json;charset=utf-8'});
    res.end(JSON.stringify(resultJSON));
}