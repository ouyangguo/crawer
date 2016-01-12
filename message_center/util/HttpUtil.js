/**
 * Created by Jericho.ou on 15/8/13.
 */

var request=require("request").defaults({pool:{maxSockets:Infinity}});

var LogUtil=require("./LogUtil");

module.exports={
    doRequest:function(url,headers,method,content,callback){
        var option={
            uri:url
            ,headers:headers
        };
        option.method=method;
        if(content!=null){
            option.body=new Buffer(content);
        }

        option.headers["Connection"]="keep-alive";
        option.headers["User-Agent"]='Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.107 Safari/537.36';
        option.timeout=120000;
        //option.pool={maxSockets: Infinity};

        var processApiTime=new Date().getTime();

        request(option, function (error, response, body) {
            var costTime=new Date().getTime()-processApiTime;
            LogUtil.dev("请求地址:"+option.uri,true);
            LogUtil.dev("处理时间:"+costTime+"ms");
            LogUtil.dev("请求头:"+JSON.stringify(option.headers));
            LogUtil.dev("请求结果:"+((response==null || response.statusCode==null)?0:response.statusCode));
            LogUtil.dev("返回内容:"+body);
            //if(content!=null && content.length>0){
            //    LogUtil.dev("请求内容:"+content.toString());
            //}
            callback(error, response, body);
        });
    }
};