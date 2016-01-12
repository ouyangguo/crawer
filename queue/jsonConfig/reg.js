/**
 * Created by Jericho.ou on 15/9/23.
 */

module.exports={
    save:{
        "taskName": [["^[a-zA-Z0-9]{4,8}$", "队列名称输入有误！"]],
        "type":[["^(0|1)$", "入队类型输入有误！"]],
        "data":[["^[\\s\\S]{1,}$","数据不能为空！"]],
        "taskType":[["^[a-zA-Z0-9]{4,8}$", "任务内容输入有误！"]]
    },
    get:{
        "taskName": [["^[a-zA-z0-9]{4,8}$", "队列名称输入有误！"]]
    }
};