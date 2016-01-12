/**
 * Created by ou on 16-1-12.
 */
var connect = require("../lib/mysql").getConnection,
  service = null,
  logger = require("../lib/logger").getLogger("crawer");
module.exports = service = {
  addPrice:function(model,callback){
    var db = connect();
    db.query("insert into product_price set ?",model,function(err,result){
      db.end();
      if(err){
        logger.error("添加价格是信息失败",err);
      }
      callback(err,result);
    })
  },
  getPrice:function(model,callback){
    var db = connect();
    db.query("select product_price_id,product_id,country_code,province_code,city_code,market_id,date,supplier_id,price,unit from product_price where product_id=? and market_id=? and date= ?",[model.product_id,model.market_id,model.date],function(err,result){
      db.end();
      if(err) {
        logger.error("获取价格信息失败,",err);
      }
      callback(err,result);
    })
  },
  updatePrice:function(model,callback){
    var db = connect();
    db.query("update product_price set ? where product_price_id=?",[model,model.product_price_id],function(err,result){
      db.end();
      if(err) {
        logger.error("更新价格信息失败,",err);
      }
      callback(err,result);
    })
  },
  saveOrUpdatePrice:function(model,callback){
    var _this = this;
    _this.getPrice(model,function(err,result){
      if(err) return callback(err,result);
      if(result&&result.length>0){
        var price = result[0];
        model.product_price_id = price.product_price_id;
        _this.updatePrice(model,function(err,result){
          if(err) logger.error("save or update fail,",err);
          callback(err,result);
        })
      }else{
        _this.addPrice(model,function(err,result){
          if(err) logger.error("save or update fail,",err);
          callback(err,result);
        })
      }
    })
  }
};

//service.updatePrice({product_price_id:0,price:500},function(err,result){
//  console.log(err,result);
//});
//service.getPrice({market_id:0,date:"2100-01-01",product_id:1},function(err,result){
//  console.log(err,result);
//});
//service.saveOrUpdatePrice({market_id:0,date:"2100-01-01",product_id:1,price:600},function(err,result){
//  console.log(err,result);
//});

