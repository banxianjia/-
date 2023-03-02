/**
 *好友
 */

var dbserver = require('../dao/dbserver')

//好友申请
exports.applyFriend = function(req,res){
    let data = req.body
    dbserver.addFriend(data,res)
}
//同意好友
exports.agreeApply = function(req,res){
    let data = req.body
    dbserver.agreeApply(data,res)
}
//拒绝或删除好友
exports.delFriend = function(req,res){
    let data = req.body
    dbserver.delFriend(data,res)
}

// 获取好友列表
exports.getUsers = function (req, res) {
    let data = req.body
    dbserver.getUsers(data,res);
};

//获取好友请求列表
exports.getReq = function (req, res) {
    let data = req.body
    dbserver.getReq(data,res)
}