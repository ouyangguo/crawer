/**
 * Created by Jericho.ou on 15/1/5.
 */

module.exports={
  doValidate:function(user_data,rule){
    var rs="";
    for (var index in rule)
    {
      for(var i=0;i<rule[index].length;i++){
        var reg = new RegExp(rule[index][i][0]);
        if(!user_data[index] || !reg.test(user_data[index])){
          return rule[index][i][1];
        }
      }
    }
    return rs;
  },
  isJson:function(obj){
    var isjson = typeof(obj) == "object" && Object.prototype.toString.call(obj).toLowerCase() == "[object object]" && !obj.length;
    return isjson;
  },
  isJsonList:function(obj){
    if(Object.prototype.toString.call(obj).toLowerCase() == "[object array]" && obj.length>0){
      for(var i=0;i<obj.length;i++){
        if(module.exports.isJson(obj[i])==false){
          return false;
        }
      }
      return true;
    }
    else{
      return false;
    }
  }
};