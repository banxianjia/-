var express = require("express");

var emailserver = require("../dao/emailserver");
var signup = require("../server/signup");
var signin = require("../server/signin");
var search = require("../server/search");
var userdetail = require("../server/userdetail");
var friends = require("../server/friends");
var message = require("../server/message");

var router = express.Router();

router.get("/test", (req, res) => res.send("hahahhahaha"));

//发送邮件
router.post("/mail", (req, res) => {
    console.log("lalaal");
    let mail = req.body.mail;
    console.log(mail);
    emailserver.emailSignUp(mail, res);
});

//注册
// 注册用户
router.post("/signup/add", (req, res) => {
    signup.signUp(req, res);
});
// 检验用户名是否存在
router.post("/signup/judge/name", (req, res) => {
    signup.judgeNameValue(req, res);
});
// 检验邮箱是否存在
router.post("/signup/judge/email", (req, res) => {
    signup.judgeEmailValue(req, res);
})

//登录
// 匹配
router.post("/signin/match", (req, res) => {
    signin.signIn(req, res);
});

//搜索
// 搜索用户
router.post("/search/user", (req, res) => {
    search.searchUser(req, res);
});

// 判断是否为好友
router.post("/search/isfriend", (req, res) => {
    search.isFriend(req, res);
});

//详情
// 用户详情
router.post("/user/detail", (req, res) => {
    userdetail.userDetail(req, res);
});
// 用户信息修改
router.post("/user/update", (req, res) => {
    userdetail.userUpdate(req, res);
});
// 好友备注
router.post("/user/markname", (req, res) => {
    userdetail.friendMarkname(req, res);
});

//好友
// 好友申请
router.post("/friend/apply", (req, res) => {
    friends.applyFriend(req, res);
});

//同意好友
router.post("/friend/aggre", (req, res) => {
    friends.agreeApply(req, res);
});
//拒绝或删除好友
router.post("/friend/del", (req, res) => {
    friends.delFriend(req, res);
});
//获取好友列表
router.post("/friend/getusers", (req, res) => {
    friends.getUsers(req, res);
});
//获取好友申请列表
router.post("/friend/getreq", (req, res) => {
    friends.getReq(req, res);
});

//消息
//获取消息列表
router.post("/message/getmsglist", (req, res) => {
    message.getMsgList(req, res);
})
//获取最新一条消息
router.post("/message/getlastmsg", (req, res) => {
    message.getLastMsg(req, res);
})
//修改消息状态为已读
router.post("/message/altmsgstatus", (req, res) => {
    message.altMsgStatus(req, res);
})





module.exports = router;
