var express = require("express");
var bodyParser = require("body-parser");

var testRouter = require("./router/test");
var dbserver = require("./dao/dbserver");
var jwt = require("./dao/jwt");

var app = express();
const port = 3000;

//socket.io
const { Server } = require("socket.io");
const io = new Server(8082)
require('./dao/socket')(io);


// 允许跨域
app.all("*", function (req, res, next) {
  console.log(req.headers.origin);
  console.log(req.environ);
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  // res.header("Access-Control-Allow-Origin", '*');
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type,Content-Length, Authorization, Accept,X-Requested-With"
  );
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("X-Powered-By", " 3.2.1");
  if (req.method === "OPTIONS") res.sendStatus(200); /*让options请求快速返回*/
  else next();
});

//设置静态资源路径
app.use(express.static(__dirname + '/files'));

app.use(bodyParser.json());

//token验证
// app.use(function(req,res,next){
//     if(req.url != '/signup/add' && req.url != '/signup/judge' && req.url != '/signin/match'){
//         //处理token匹配
//         let token = req.body.token
//         let tokenMatch = jwt.verifyToken(token,res)
//         if(tokenMatch == 1){
//             //通过
//             next()
//         }else{
//             //不通过
//             res.send({status:300})
//         }

//     }else{
//         next()
//     }
// })

app.use(testRouter);
require("./router/files")(app);

//其他都是404页面
app.use(function (req, res, next) {
  let err = new Error("Not Found");
  err.status = 404;
  next(err);
});

//错误处理中间件
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.send(err.message);
});

app.listen(port, () => console.log(`已启动端口：${port}!`));
