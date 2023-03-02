// 数据库配置
var mysql = require('mysql')
var connection = mysql.createConnection({//建立一个连接参数方法
    host: 'localhost', //数据库地址
    port: '3306',//端口号
    user: 'root',//用户名
    password: '123456',//密码
    database: 'vue_node_ex'//数据库名称
});
//用参数与数据库进行连接
connection.connect((err)=>{
    if(err){
        console.log("连接失败")
    }else{
        console.log("连接成功")
    }
});
module.exports = connection