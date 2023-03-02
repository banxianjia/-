// 数据模型
var db = require('../config/db')

//用户表
/**
 * id
 * 用户名
 * 邮箱
 * 性别
 * 生日
 * 电话
 * 密码
 * 注册时间
 * 签名
 * 头像
 */
let createUsers = `create table if not exists users(
    id int primary key auto_increment,
    name varchar(255) not null,
    email varchar(255),
    sex varchar(255) default 'asexual',
    birth date,
    phone varchar(255),
    pwd varchar(255),
    time datetime,
    signature varchar(255),
    imgurl varchar(255) default '/users/user.png'
);`

//好友表
/**
 * id
 * 用户id
 * 好友id
 * 生成时间
 * 好友类型（0已为好友，1被申请中，2发送申请中）
 * 备注
 */
let createFriends = `create table if not exists friends(
    id int primary key auto_increment,
    userId int references users(id),
    friendId int references users(id),
    time datetime,
    type tinyint,
    remark varchar(255)
);`

//一对一消息表
/**
 * id
 * 用户id
 * 好友id
 * 消息内容
 * 消息类型（0文字，1图片，2音频，3好友申请消息。。。。）
 * 发送时间
 * 消息状态（0已读，1未读）
 */
let createMessages = `create table if not exists messages(
    id int primary key auto_increment,
    userId int references users(id),
    friendId int references users(id),
    message varchar(255),
    type tinyint,
    time datetime,
    status tinyint
);`

exports.Users = function (res) {
    db.query(createUsers, function (err, results, fields) {
        if (err) {
            console.log(err.message)
        } else {
            console.log("用户表成功")
        }
    })
}

exports.Friends = function (res) {
    db.query(createFriends, function (err, results, fields) {
        if (err) {
            console.log(err.message)
        } else {
            console.log("好友表成功")
        }
    })
}

exports.Messages = function (res) {
    db.query(createMessages, function (err, results, fields) {
        if (err) {
            console.log(err.message)
        } else {
            console.log("消息表成功")
        }
    })
}