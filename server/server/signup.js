/**
 * 注册处理
 */
var dbserver = require('../dao/dbserver')
var mail = require('../dao/emailserver')


//用户注册
exports.signUp = function (req, res) {
    let name = req.body.name
    let email = req.body.email
    let pwd = req.body.pwd
    dbserver.buildUser(name, email, pwd, res)
    mail.emailSignUp(email, res)
}

//用户是否已占用
exports.judgeNameValue = function (req, res) {
    let name = req.body.name
    dbserver.checkoutName(name, res)
}
//邮箱是否已占用
exports.judgeEmailValue = function (req, res) {
    let email = req.body.email
    dbserver.checkoutEmail(email, res)
}