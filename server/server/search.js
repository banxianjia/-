/**
 * 搜索页
 */
var dbserver = require('../dao/dbserver')

//用户搜索
exports.searchUser = function(req,res){
    let str = req.body.str
    dbserver.searchUser(str,res)
}

//判断是否为好友
exports.isFriend = function (req,res){
    let uid = req.body.uid
    let fid = req.body.fid
    dbserver.isFriend(uid,fid,res)
}

