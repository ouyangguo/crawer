/**
 * Created by ou on 16-1-7.
 */
var request = require("request"),
  $ = require("jquery"),
  _ = require('underscore'),
  logger = require("./config/logger.js").getLogger("crawer"),
  env = require("jsdom").env,
  jsdom = require("jsdom"),
  service = null;
module.exports = service = {
  loadHtml:function(url,encode,callback){
   var req =  request.get(url,function(err,resp,data){
      //resp.on("data",function(data){
      //  console.log(data);
      //});
      //if(err) logger.error("load html form "+url+" faild:",err);
      //callback(err,data);
    });
    var chunk = new Buffer(0);
    req.on("data",function(data){
      chunk = Buffer.concat([chunk,data],chunk.length+data.length);
    });
    req.on("end",function(){
      var iconv = require('iconv-lite');
      var str = iconv.decode(chunk, encode||"utf8");
      callback(null,str);
    })
    req.on("error",function(err){
      logger.error("load html "+url+" faild:",err);
      callback(err);
    });
  },
  jqueryCall:function($target,method,param){
    if(!param) return method.call($target);
    else return method.call($target,param);
  },
  getValue:function($node,selector,attr,param,isArray){
    var target = $node.find(selector),
      _this = this,
      $target = $(target);
    var result = null;
    if(!isArray) {
      result = $target[attr];
      if((typeof result)=="function")  {
        result = _this.jqueryCall($target,result,param);
      }
      result = result.replace(/[\n|\t|\r]/g,"");
    }
    else{
      result = [];
      $target.each(function(index,item){
        var $item = $(item),
          attrValue = $item[attr];
        if(typeof  attrValue=="function"){
          attrValue = _this.jqueryCall($item,attrValue,param);
          attrValue = attrValue.replace(/[\n|\t|\r]/g,"");
        }
        result.push(attrValue);
      });
    }
    return result;
  },
  makeTarget: function (rules,$node,isArray) {
    var _this = this,
      results = [];
    if(!isArray){
      var record = {};
      for(var rule in rules){
        record[rule] = _this.getValue($($node[0]),rules[rule].selector,rules[rule].attr,rules[rule].param,rules[rule].array);
      }
      return record;
    }
    $node.each(function(index,item){
      var record = {};
      for(var rule in rules){
        record[rule] = _this.getValue($(item),rules[rule].selector,rules[rule].attr,rules[rule].param,rules[rule].array);
      }
        results.push(record);
      });
    return results;
  },
  crawer:function(conf,url,callback){
    var _this = this;
    logger.info("start to load html");
    _this.loadHtml(url,conf.encode,function(err,html){
      if(err) {
        return callback(err);
      }
      env(html,function(error,window){
        if(err) return callback(error);
        $ = $(window);
        var $parentNode = (conf.parentNode?$(conf.parentNode):$ );
        //if(conf.parentNode) $parentNode = $parentNode.find(conf.parentNode);

        var result = null;
        if(conf.rules) result = _this.makeTarget(conf.rules,$parentNode,conf.array);
        callback(null,result);
      })

    })
  }
};

service.crawer({
  parentNode:".pmCon tbody tr",
  encode:"gbk",
  array:true,
  rules:{
    "price":{
      selector:"td:eq(0)",
      attr:"html",
      array:false
    }
  }
},"http://nc.mofcom.gov.cn/channel/gxdj/jghq/jg_list.shtml",function(err,result){
  //logger.info(err,result);
  console.log(err,result);
});

