/**
 * 邮件操作方法
 */

var nodemailer = require('nodemailer')

var credentials = require('../config/credentials')

//创建传输方式
var transporter = nodemailer.createTransport({
    service: 'qq',
    auth: {
        user: credentials.qq.user,
        pass: credentials.qq.pass,
    }
})

// 注册发送邮件
exports.emailSignUp = function (email, res) {
    //发送信息
    let options = {
        from: '2594787016@qq.com',
        to: email,
        subject: '感谢您在yike注册',
        html: '<span>欢迎加入</span><a href="http://locahost:8081/">点击</a>'
    }

    //发送邮件
    transporter.sendMail(options, function (err, info) {
        if (err) {
            console.log("邮件发送失败！")
            res.send({ status: 500, msg: "邮件发送失败！" })
            console.log(err)
        } else {
            console.log("邮件发送成功！")
            res.send({ status: 200, msg: "邮件发送成功！" })
        }
    })
}