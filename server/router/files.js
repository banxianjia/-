var multer = require("multer");

var mkdir = require("../dao/mkdir");

//控制文件存储
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let url = req.body.url;
    console.log(url);
    mkdir.mkdirs("../files/" + url, (err) => {
      console.log(err);
    });
    cb(null, "./files/" + url);
  },
  filename: function (req, file, cb) {
    let type = file.originalname.replace(/.+\./, ".");
    cb(null, Date.now() + type);
  },
});

var upload = multer({ storage: storage });

module.exports = function (app) {
  //前端文件上传
  app.post(
    "/file/upload",
    upload.array("image", 12),
    function (req, res, next) {
      console.log("22222222");
      console.log(req);
      console.log("11111111");
      console.log(req.body.user);
      //路径
      let url = req.body.url
      //获取文件名
      let data = req.files[0].filename;
      console.log(req.files[0].filename)
      let imgurl = '/' + url + '/' + data
      // console.log(imgurl + "1111111111111")
      res.send(imgurl);
      // req.files 是 `photos` 文件数组的信息
      // req.body 将具有文本域数据，如果存在的话
    }
  );
};
