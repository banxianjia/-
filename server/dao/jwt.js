//token
//引入
var jwt = require('jsonwebtoken')

let secret = "yike_study"

//生成token
exports.generateToken = function(userid,res){
    let payload = {id:userid,time:new Date()}
    let token = jwt.sign(payload,secret,{expiresIn:60*60*24})
    return token
}

//解码token
exports.verifyToken = function(token,res){
    var payload
    jwt.verify(token,secret,function(err,result){
        if(err){
            payload=0
        }else{
            payload=1
        }
    })
    return payload
}