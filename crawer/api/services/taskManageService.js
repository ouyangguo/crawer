/**
 * Created by ou on 16-1-11.
 */
var redis = require("redis"),
  service = null,
  config = {
    redis_ur:"redis://127.0.0.1:6379",
    queue_name:"mofcom_task_list"
  },
  pool = require("./mysqlPoolService");
module.exports = service = {
  allTask:{},
  taskIndex:0,
  recordTask:function(task){
    var _this = this;
    _this.allTask['task'+_this.taskIndex] = task;
  },
  queryTask:function(id,callback){
    pool.getConnection(function(err,db){
      if(err){
        return callback(err);
      }
      db.query("select * from task where id=?",[id],function(err,result){
        db.release();
        if(err) {
          return callback(err);
        }
        callback(err,result);
      })
    })
  },
  queryTaskByName:function(name,callback){
    pool.getConnection(function(err,db){
      if(err) {
        return callback(err);
      }
      db.client.query("select * from task where taskName like %?%",[name],function(err,result){
        db.release();
        if(err){

        }
        callback(err,result);
      })
    })
  },
  deleteTask:function(id,callback){
    pool.getConnection(function(err,db){
      if(err) {
        return callback(err);
      }
      db.query("update task set status=1 where id=?",[id],function(err,result){
        db.release();
        if(err){

        }
        return callback(err,result);
      })
    })
  },
  addTask:function(task,callback){
    pool.getConnection(function(err,db){
      if(err){
        return callback(err);
      }
      db.query("insert into task set ?",task,function(err,result){
        db.release();
        if(err) {

        }
        callback(err,result);
      })
    })
  },
  updateTask:function(id,task,callback){
    pool.getConnection(function(err,db){
      if(err) {
        return callback(err);
      }
      db.query("update task set ? where id=?",[task,id],function(err,result){
        db.release();
        if(err){

        }
        callback(err,result);
      })
    })
  },
  addTaskToQueue:function(task,callback){
    var client = redis.createClient(conf.redis_url);
    client.lpush(config.queue_name,JSON.stringify(task),function(err,data){
      client.quit();
      if(err) {

      }
      callback(err,data);
    })
  },
  addTaskToTop:function(task,callback){
    var client = redis.createClient(config);
    client.rpush(config.queue_name,task,function(err,data){
      client.quit();
      callback(err,data);
    })
  },
  addCrontab:function(config,callback){

  }
}
