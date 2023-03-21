let dbserver = require('./dbserver')
module.exports = function (io) {
    var users = {};// socket注册用户
    io.on('connection', (socket) => {

        console.log("连接成功")
        // 用户登录注册
        socket.on('login', (id) => {
            console.log(id)
            socket.emit('login', id)
            socket.name = id;
            users[id] = socket.id
        })
        // 用户消息
        socket.on('msg', (msg, fromid, toid) => {
            console.log(msg)
            // 存储消息
            dbserver.addMessage(fromid, toid, msg.types, msg.message);
            // 发送给对方
            if (users[toid]) {
                socket.to(users[toid]).emit('msg', msg, fromid)
            }
        })
        // 用户离开
        socket.on('disconnecting', () => {
            if (users.hasOwnProperty(socket.name)) {
                delete users[socket.name]
            }
        })

    })
}