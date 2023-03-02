/**
 * 详情页
 */
var dbserver = require('../dao/dbserver')

//用户详情
exports.userDetail = function(req,res){
    let id = req.body.id
    dbserver.userDetail(id,res)
}

//用户信息修改
exports.userUpdate = function(req,res){
    let data = req.body
    dbserver.userUpdate(data,res)
}

//好友备注
exports.friendMarkname = function(req,res){
    let data = req.body
    dbserver.friendMarkname(data,res)
}