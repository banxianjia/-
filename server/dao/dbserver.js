/**
 *数据库中的数据操作方法
 *  */
var db = require("../config/db");
var dbmodel = require("../model/dbmodel");
var bcrypt = require("./bcrypt");
var jwt = require("./jwt");

//创建Users表
dbmodel.Users();

//创建Friends表
dbmodel.Friends();

//创建Messages表
dbmodel.Messages();

//用户名是否存在检验
exports.checkoutName = function (name, res) {
    //查询
    let sql = `select * from users where name=?`;
    db.query(sql, [name], (err, results, fields) => {
        if (err) {
            console.log(err);
            res.send({ status: 500, msg: "sql执行失败" })
        } else {
            console.log("执行成功");
            if (results.length > 0) {
                console.log("isok");
                res.send({ status: 200, msg: "用户名已存在", isok: true });
            } else {
                res.send({ status: 200, msg: "用户名未存在", isok: false });
            }
        }
    });
};

//邮箱是否存在检验
exports.checkoutEmail = function (email, res) {
    //查询
    let sql = `select * from users where email=?`;
    db.query(sql, [email], (err, results, fields) => {
        if (err) {
            console.log(err);
            res.send({ status: 500, msg: "sql执行失败" })
        } else {
            console.log("执行成功");
            if (results.length > 0) {
                console.log("isok");
                res.send({ status: 200, msg: "邮箱已存在", isok: true });
            } else {
                res.send({ status: 200, msg: "邮箱未存在", isok: false })
            }
        }
    });
};

//新建用户
exports.buildUser = function (name, email, pwd, res) {
    //密码加密
    let hash = bcrypt.encryption(pwd);

    //数据表中新建用户
    let sql = `insert into users(name,email,pwd,time) values(?,?,?,?)`;
    db.query(sql, [name, email, hash, new Date()], (err, results, fields) => {
        if (err) {
            console.log(err);
            res.send({ status: 500, msg: "sql执行错误" })
        } else {
            console.log(results);
            res.send({ status: 200, msg: "注册成功" });
        }
    });
};

//验证用户
exports.userMatch = function (str, pwd, res) {
    //前端登录通过后端到数据库进行匹配用户名/邮箱--密码
    //匹配成功：传入，id,name,imgurl,token,
    //data可能是用户名可能是邮箱
    let sql = `select * from users where name=? or email=?`;
    db.query(sql, [str, str], (err, results, fields) => {
        if (err) {
            res.send({ status: 400, msg: "查询错误！" });
            console.log(err);
        } else {
            if (results.length) {
                console.log(results[0]);
                let obj = results[0];
                let pwdMatch = bcrypt.verification(pwd, obj.pwd);
                if (pwdMatch) {
                    let token = jwt.generateToken(obj.id, res);
                    let back = {
                        id: obj.id,
                        name: obj.name,
                        imgurl: obj.imgurl,
                        token: token,
                    };
                    res.send({ status: 200, msg: "请求成功！", back });
                } else {
                    res.send({ status: 500, msg: "密码错误！" });
                }
                console.log(fields);
            } else {
                res.send({ status: 500, msg: "用户或邮箱错误！" });
            }
        }
    });
};

//搜索好友
exports.searchUser = function (str, res) {
    str = "%" + str + "%";
    let sql = `select * from users where name like ? or email like ?`;
    db.query(sql, [str, str], (err, results, fields) => {
        if (err) {
            console.log(err);
            res.send({ status: 500, msg: "sql执行错误", data: results });
        } else {
            console.log(results.length);
            if (results.length) {
                console.log("搜索成功！");
                res.send({ status: 200, msg: "搜索成功", data: results });
            } else {
                console.log("不存在！");
                res.send({ status: 400, msg: "不存在" })
            }
        }
    });
};

//判断是否为好友
exports.isFriend = function (uid, fid, res) {
    let sql = `select *from friends where userId=? and friendId=? and type=0`;
    db.query(sql, [uid, fid], (err, results, fields) => {
        if (err) {
            console.log(err);
            res.send({ status: 500, msg: "sql执行错误" })
        } else {
            console.log(results);
            if (results.length > 0) {
                //是好友
                console.log("yes");
                res.send({ status: 200, msg: "是好友", isF: true })
            } else {
                //不是好友
                console.log("no");
                res.send({ status: 400, msg: "不是好友", isF: false })
            }
        }
    });
};

//用户详情
exports.userDetail = function (id, res) {
    let sql = `select 
        id,name,email,sex,birth,phone,time,signature,imgurl
    from
        users
    where
        id =?`;
    db.query(sql, [id], function (err, results, fields) {
        if (err) {
            console.log(err);
            res.send({ status: 400, msg: "查询错误！" });
        } else {
            if (results.length > 0) {
                console.log(results);
                res.send({ status: 200, msg: "查询成功", data: results[0] });
            } else {
                res.send({ status: 400, msg: "未找到信息！" });
            }
        }
    });
};

//用户信息修改
exports.userUpdate = function (data, res) {
    //判断是否有密码
    if (typeof data.pwd != "undefined") {
        //有密码进行匹配
        let sql = `select * from users where id=?`;
        db.query(sql, [data.id], (err, results, fields) => {
            if (err) {
                console.log(err);
                res.send({ status: 400, msg: "查询错误！" });
            } else {
                if (results.length) {
                    console.log(results[0]);
                    let obj = results[0];
                    let pwdMatch = bcrypt.verification(data.pwd, obj.pwd);
                    if (pwdMatch) {
                        if (data.type == "pwd") {
                            data.data = bcrypt.encryption(data.data);
                        }
                        let sql1 = `update users set ${data.type}=? where id=?`;
                        //修改信息
                        db.query(sql1, [data.data, data.id], (err, results, fields) => {
                            if (err) {
                                console.log(err);
                                res.send({ status: 400, msg: "密码正确and修改失败！" });
                            } else {
                                console.log(results);
                                res.send({ status: 200, msg: "密码正确and修改成功！" });
                            }
                        });
                    } else {
                        res.send({ status: 500, msg: "密码错误！" });
                    }
                } else {
                    res.send({ status: 400, msg: "未找到信息" });
                }
            }
        });
    } else {
        let sql1 = `update users set ${data.type}=? where id=${data.id}`;
        //修改信息
        db.query(sql1, [data.data], (err, results, fields) => {
            if (err) {
                console.log(err);
                res.send({ status: 400, msg: "修改失败！" });
            } else {
                console.log(results);
                res.send({ status: 200, msg: "修改成功！" });
            }
        });
    }
};

//获取好友备注
exports.getMarkname = function (data, res) {
    let sql = `
    select
        remark
    from
        friends
    where
        userId=?
        and friendId=?
    `;
    db.query(sql, [data.uid, data.fid], (err, results, fields) => {
        if (err) {
            console.log(err);
            res.send({ status: 500, msg: "获取失败！" });
        } else {
            console.log(results);
            res.send({ status: 200, msg: "获取成功！", markname: results[0].remark });
        }
    });
};

//修改好友备注
exports.friendMarkname = function (data, res) {
    let sql = `
    update
        friends
    set
        remark=?
    where
        userId=?
        and friendId=?
    `;
    db.query(sql, [data.name, data.uid, data.fid], (err, results, fields) => {
        if (err) {
            console.log(err);
            res.send({ status: 500, msg: "查询错误！" });
        } else {
            console.log(results);
            res.send({ status: 200, msg: "修改成功！" });
        }
    });
};

//好友操作
// 添加好友表
exports.buildFriend = function (uid, fid, type, res) {
    let sql = `insert into friends(userId,friendId,type,time) values(?,?,?,?)`;
    db.query(sql, [uid, fid, type, new Date()], (err, results, fields) => {
        if (err) {
            console.log(err);
            // res.send({status:500,msg:"sql执行失败"})
        } else {
            console.log(results);
            // res.send({status:200,msg:"发送成功"})
        }
    });
};
// 添加一对一消息表
exports.addMessage = function (uid, fid, type, message, res) {
    let sql = `insert into
    messages(userId,friendId,type,message,time,status)
    values(?,?,?,?,?,?)`;
    db.query(
        sql,
        [uid, fid, type, message, new Date(), 1],
        (err, results, fields) => {
            if (err) {
                console.log(err);
                res.send({ status: 500, msg: "sql执行失败" });
            } else {
                console.log(results);
                res.send({ status: 200, msg: "发送成功" });
            }
        }
    );
};
// 好友申请
exports.addFriend = function (data, res) {
    let sql = `select * from friends where userId=? and friendId=?`;
    db.query(sql, [data.uid, data.fid], (err, results, fields) => {
        if (err) {
            console.log(err);
        } else {
            console.log(results);
            if (results.length == 0) {
                this.buildFriend(data.uid, data.fid, 2, res);
                this.buildFriend(data.fid, data.uid, 1, res);
            }
            this.addMessage(data.uid, data.fid, 3, data.message, res);
        }
    });
};
//同意好友
exports.agreeApply = function (data, res) {
    let sql = `select * from friends where (userId=? and friendId=?) or (userId=? and friendId=?)`;
    db.query(
        sql,
        [data.uid, data.fid, data.fid, data.uid],
        (err, results, fields) => {
            if (err) {
                console.log(err);
                res.send({ status: 500, msg: "sql执行失败" });
            } else {
                console.log(results);
                let sql1 = `update friends set type=0 where (userId=? and friendId=?) or (userId=? and friendId=?)`;
                db.query(
                    sql1,
                    [data.uid, data.fid, data.fid, data.uid],
                    (err1, results1, fields1) => {
                        if (err) {
                            console.log(err);
                            res.send({ status: 400, msg: "同意失败" });
                        } else {
                            console.log(results1);
                            res.send({ status: 200, msg: "同意成功" });
                        }
                    }
                );
            }
        }
    );
};
//拒绝或删除好友
exports.delFriend = function (data, res) {
    let sql = `delete from friends where (userId=? and friendId=?) or (userId=? and friendId=?)`;
    db.query(
        sql,
        [data.uid, data.fid, data.fid, data.uid],
        (err, results, fields) => {
            if (err) {
                console.log(err);
                res.send({ status: 500, msg: "sql执行失败" });
            } else {
                console.log(results);
                let sql1 = `delete from messages where userId=? and friendId=?`;
                db.query(
                    sql1,
                    [data.fid, data.uid],
                    (err1, results1, fields1) => {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log(results1);
                        }
                    }
                );
                res.send({ status: 200, msg: "拒绝/删除成功" });
            }
        }
    );
};
//获取好友列表
exports.getUsers = function (data, res) {
    let sql = `
    select f.friendId,f.remark,f.time,u.imgurl,u.name,u.signature
    from friends f
    inner join users u
    on f.friendId = u.id
    WHERE f.userId =? AND f.type=0
    `;
    db.query(sql, [data.uid], (err, results, fields) => {
        if (err) {
            console.log(err);
            res.send({ status: 500, msg: "sql执行失败" });
        } else {
            console.log(results);
            res.send({ status: 200, msg: "请求成功", data: results });
        }
    });
};
//获取好友请求列表
exports.getReq = function (data, res) {
    let sql = `
    select m.message,u.id,u.name,m.time
    from messages m
    inner join users u
    on m.userId = u.id
    inner join friends f
    on m.userId = f.userId
    where m.friendId=? and m.type=3 and f.type = 2
    `
    db.query(sql, [data.uid], (err, results, fields) => {
        if (err) {
            console.log(err)
            res.send({ status: 500, msg: "sql执行失败" })
        } else {
            console.log(results)
            res.send({ status: 200, msg: "获取成功", list: results })
        }
    })
}

// 消息
//获取消息列表
exports.getMessagesList = function (data, res) {
    let sql = `select m.userId,m.message,m.type,m.time,u.imgurl
    from messages m 
    inner join users u
    on m.userId = u.id
    where (m.userId=? and m.friendId=?) or (m.userId=? and m.friendId=?) order by time DESC`;
    db.query(sql, [data.uid, data.fid, data.fid, data.uid], (err, results, fields) => {
        if (err) {
            console.log(err);
            res.send({ status: 500, msg: "sql1执行失败" });
        } else {
            console.log(3333333);
            console.log(results);
            console.log(4444444);

            // friendsList.push(results);
            res.send({ status: 200, msg: "请求成功", list: results });
        }
    });
    console.log(55555555555);
    // console.log(friendsList)
};
//修改消息状态为已读
exports.altMsgStatus = function (data, res) {
    let sql = `update messages set status=0 where userId=> and friendId=? and status=1`;
    db.query(sql, [data.uid, data.fid], (err, results, fields) => {
        if (err) {
            console.log(err);
            res.send({ status: 500, msg: "sql执行失败" });
        } else {
            console.log(results);
            res.send({ status: 200, msg: "请求成功", data: results });
        }
    });
};

//获取一对一聊天消息
