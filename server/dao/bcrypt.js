/**
 *密码操作方法
 */

var bcrypt = require('bcryptjs')

//生成hash密码
exports.encryption = function(pwd){
    //生成随机的salt
    let salt = bcrypt.genSaltSync(10)

    //加密
    let hash = bcrypt.hashSync(pwd, salt)
    return hash
}

//密码比对
exports.verification = function(pwd, hash){
    let verif = bcrypt.compareSync(pwd,hash)
    return verif
}