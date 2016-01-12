/**
 * Created by Jericho.ou on 15/2/27.
 */

var redisConfig=require("../config/BaseConfig").redisConfig;

var redis = require("redis"),
  client = redis.createClient(redisConfig.port, redisConfig.host);


var RedisUtil = {
   set: function (key, value, ttl, callback) {
    client.set(key, value, function (err, data) {
      if (!err) {
        if (new RegExp("^[1-9]{1}[0-9]{0,7}$").test(ttl)) {
          client.expire(key, ttl);
        }
      }
      if(callback){
        callback(err, data);
      }
    });
  }
  ,get: function (key, callback) {
    client.get(key, function (err, data) {
      if(callback){
        callback(err, data);
      }
    });
  }
  , hmSet:function(key,value, ttl,callback){
    client.hmset(key,value,function(err,data){
      if (!err) {
        if (new RegExp("^[1-9]{1}[0-9]{0,7}$").test(ttl)) {
          client.expire(key, ttl);
        }
      }
      if(callback){
        callback(err, data);
      }
    });
  }
  , hmGet:function(key,value,callback){
    client.hmget(key,value,function(err,data){
      if(callback){
        callback(err, data);
      }
    });
  }
  , sortSet: function (key,score,value,callback) {
    client.zadd(key, score, value,function(err,data){
      if(callback){
        callback(err, data);
      }
    });
  }
  ,getSortSet:function(key,start,end,orderby,callback){
    client.zrevrange(key,start,end,orderby,function(err,data){
      if(callback){
        callback(err, data);
      }
    });
  }
  , quit:function(){
    client.quit();
  }
  , end:function(){
    client.end();
  },
  lPush:function(key,value,callback){
    client.lpush(key,value,function(err,data){
      if(callback){
        callback(err, data);
      }
    });
  },
  rPush:function(key,value,callback){
    client.rpush(key,value,function(err,data){
      if(callback){
        callback(err, data);
      }
    });
  },
  lPop:function(key,callback){
    client.lpop(key,function(err,data){
      if(callback){
        callback(err, data);
      }
    });
  }
};

module.exports = RedisUtil;

//RedisUtil.rPush("taskTest",parseInt(new Date().getTime()/1000),console.info);

//RedisUtil.lPop("taskTest",console.info);

//RedisUtil["rPush"].call(this,"test1",parseInt(new Date().getTime()/1000),console.info);