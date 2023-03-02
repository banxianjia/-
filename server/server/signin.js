/**
 * 登录页
 */
var dbserver = require("../dao/dbserver")

exports.signIn = function(req, res){
    let str = req.body.str
    let pwd = req.body.pwd
    dbserver.userMatch(str,pwd,res)
}