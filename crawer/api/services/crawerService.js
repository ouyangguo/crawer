/**
 * Created by ou on 16-1-7.
 */
var request = require("request"),
  $ = require("jquery"),
  _ = require('underscore'),
  //logger = require("../logger/logger.js"),
  env = require("jsdom").env,
  jsdom = require("jsdom"),
  service = null;
module.exports = service = {
  loadHtml:function(url,callback){
    request.get(url,function(err,resp,data){
      if(err) logger.error("load html form "+url+" faild:",err);
      callback(err,data);
    })
  },
  jqueryCall:function($target,method,param){
    if(!param) return method.call($target);
    else return method.call($target,param);
  },
  getValue:function($node,selector,attr,param){
    var target = $node.find(selector),
      _this = this,
      $target = $(target);
    var result = null;
    if($target.length==1) {
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
  makeTarget: function (rules,$node) {
    var _this = this,
      results = [];
    $node.each(function(index,item){
      var record = {};
      for(var rule in rules){
        record[rule] = _this.getValue($(item),rules[rule].selector,rules[rule].attr,rules[rule].param);
      }
        results.push(record);
      });
    return results;
  },
  crawer:function(conf,url,callback){
    var _this = this;
    _this.loadHtml(url,function(err,html){
      if(err) {
        return callback(err);
      }
      env(html,function(error,window){
        if(err) return callback(error);
        $ = $(window);
        var $parentNode = (conf.parentNode?$(conf.parentNode):$ );
        //if(conf.parentNode) $parentNode = $parentNode.find(conf.parentNode);

        var result = null;
        if(conf.rules) result = _this.makeTarget(conf.rules,$parentNode);
        callback(null,result);
      })

    })
  }
}

service.crawer({
  parentNode:".pmCon tbody tr",
  rules:{
    "price":{
      selector:"td:eq(1)",
      attr:"html"
    }
  }
},"http://nc.mofcom.gov.cn/channel/gxdj/jghq/jg_list.shtml",function(err,result){
  //logger.info(err,result);
  console.log(err,result);
});

