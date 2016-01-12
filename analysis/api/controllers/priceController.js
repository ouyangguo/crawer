
/**
 * Created by ou on 16-1-12.
 */
var _ = require("underscore"),
  async = require("async");
module.exports = {
  handleData:function(req,res) {
    var params = req.allParams();
    if (!params.data) {
      return res.json({
        code: 101,
        message: "data 不能为空"
      });
    }
    var data = params.data,errMessage = "";
    for (var i = 0; i < data.length;i++){
          var item = data[i];
          if(!/^\d+$/.test(item.product_id)) errMessage = "product_id只能为数字";
      if(!/^\d+(.\d+)$/.test(item.price)) errMessage = "price 只能为整数或者数字 ";
      if(!/^\d+$/.test(item.market_id)) errMessage = "market_id 只能为数字";
      if(!/^\d{4}-\d{2}-\d{2}$/.test(item.date)) errMessage = "date的格式不对";
      if(!/^\d+$/.test(item.product_id)) errMessage = "product_id只能为数字";
      if(!/^\d+$/.test(item.country_code)) errMessage = "product_id只能为数字";
      if(!/^\d+$/.test(item.province_code)) errMessage = "product_id只能为数字";
      if(!/^\d+$/.test(item.city_code)) errMessage = "product_id只能为数字";
      if(errMessage) break;
    }
    if(errMessage) return res.json({
      code:101,
      message:errMessage
    });
    var successNum = 0,errNum= 0,total = data.length;
    async.eachLimit(data,5,function(item,async_callback){
      priceService.saveOrUpdatePrice(item,function(err,result){
          if(err) errNum++;
        else successNum++;
        return async_callback();
      },function(err){
        logger.info("收到"+total+"条数据，成功处理"+successNum+"条,失败"+errNum+"条");
        return res.json({
          code:200,
          successNum:successNum,
          errNum:errNum
        })
      })
    })
  }
}
