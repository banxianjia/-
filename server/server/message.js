/**
 * 消息列表页
 */
var dbserver = require("../dao/dbserver");

exports.getMsgList = function (req, res) {
    let data = req.body
    dbserver.getMessagesList(data, res)
}

exports.altMsgStatus = function (req, res) {
    let data = req.body
    dbserver.altMsgStatus(data, res)
}
