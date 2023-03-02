export default{
  friends: function(){
    let d = new Date()
    let friendarr=[
      {
        id: 1,
        imgurl: "four.png",
        tip:0,
        name:"大海",
        email:"qweasd@163.com",
        times: d.getHours().toString()+":"+d.getMinutes().toString(),
        news: "lkshdgkwhlehfilweflksnd,vnsm,dfkjwehklfjlgn",
      },
      
    ]
    return friendarr
  },
  //好友---关系
  isFriends: function(){
    let isfriend=[
      {
        userid:1,
        friend:2345,
      },
      {
        userid:1,
        friend:15,
      },
      {
        userid:1,
        friend:6,
      }
    ]
    return isfriend
  },
  //聊天消息
  message:function(){
    let msgs=[
      {
        id:'b',
        imgurl:'four.png',
        message:"10",
        types:0,//信息类型（0：文字，1：图片，......）
        time: new Date()-1000*24,
        tip:2
      },
      {
        id:'a',
        imgurl:'one.png',
        message:"9",
        types:0,//信息类型（0：文字，1：图片，......）
        time: new Date()-1000*36,
        tip:3
      },
      {
        id:'a',
        imgurl:'one.png',
        message:"8",
        types:0,//信息类型（0：文字，1：图片，......）
        time: new Date()-1000*36,
        tip:4
      },
      {
        id:'a',
        imgurl:'one.png',
        message:"7",
        types:0,//信息类型（0：文字，1：图片，......）
        time: new Date()-1000*36,
        tip:5
      },
      {
        id:'a',//a是好友
        imgurl:'one.png',
        message:"6",
        types:0,//信息类型（0：文字，1：图片，......）
        time: new Date()-1000,
        tip:0
      },
      {
        id:'b',
        imgurl:'four.png',
        message:"5",
        types:0,//信息类型（0：文字，1：图片，......）
        time: new Date()-1000*16,
        tip:1
      },
      {
        id:'b',
        imgurl:'four.png',
        message:"4",
        types:0,//信息类型（0：文字，1：图片，......）
        time: new Date()-1000*24,
        tip:2
      },
      {
        id:'a',
        imgurl:'one.png',
        message:"3",
        types:0,//信息类型（0：文字，1：图片，......）
        time: new Date()-1000*36,
        tip:3
      },
      {
        id:'a',
        imgurl:'one.png',
        message:"2",
        types:0,//信息类型（0：文字，1：图片，......）
        time: new Date()-1000*36,
        tip:4
      },
      {
        id:'a',
        imgurl:'one.png',
        message:"1",
        types:0,//信息类型（0：文字，1：图片，......）
        time: new Date()-1000*36,
        tip:5
      },
      {
        id:'b',
        imgurl:'four.png',
        message:"10",
        types:0,//信息类型（0：文字，1：图片，......）
        time: new Date()-1000*24,
        tip:2
      },
      {
        id:'a',
        imgurl:'one.png',
        message:"9",
        types:0,//信息类型（0：文字，1：图片，......）
        time: new Date()-1000*36,
        tip:3
      },
      {
        id:'a',
        imgurl:'one.png',
        message:"8",
        types:0,//信息类型（0：文字，1：图片，......）
        time: new Date()-1000*36,
        tip:4
      },
      {
        id:'a',
        imgurl:'one.png',
        message:"7",
        types:0,//信息类型（0：文字，1：图片，......）
        time: new Date()-1000*36,
        tip:5
      },
      {
        id:'a',//a是好友
        imgurl:'one.png',
        message:"6",
        types:0,//信息类型（0：文字，1：图片，......）
        time: new Date()-1000,
        tip:0
      },
      {
        id:'b',
        imgurl:'four.png',
        message:"5",
        types:0,//信息类型（0：文字，1：图片，......）
        time: new Date()-1000*16,
        tip:1
      },
      {
        id:'b',
        imgurl:'four.png',
        message:"4",
        types:0,//信息类型（0：文字，1：图片，......）
        time: new Date()-1000*24,
        tip:2
      },
      {
        id:'a',
        imgurl:'one.png',
        message:"3",
        types:0,//信息类型（0：文字，1：图片，......）
        time: new Date()-1000*36,
        tip:3
      },
      {
        id:'a',
        imgurl:'one.png',
        message:"2",
        types:0,//信息类型（0：文字，1：图片，......）
        time: new Date()-1000*36,
        tip:4
      },
      {
        id:'a',
        imgurl:'one.png',
        message:"1",
        types:0,//信息类型（0：文字，1：图片，......）
        time: new Date()-1000*36,
        tip:5
      },
      {
        id:'b',
        imgurl:'four.png',
        message:"5",
        types:0,//信息类型（0：文字，1：图片，......）
        time: new Date()-1000*16,
        tip:1
      },
      {
        id:'b',
        imgurl:'four.png',
        message:"4",
        types:0,//信息类型（0：文字，1：图片，......）
        time: new Date()-1000*24,
        tip:2
      },
      {
        id:'a',
        imgurl:'one.png',
        message:"3",
        types:0,//信息类型（0：文字，1：图片，......）
        time: new Date()-1000*36,
        tip:3
      },
      {
        id:'a',
        imgurl:'one.png',
        message:"2",
        types:0,//信息类型（0：文字，1：图片，......）
        time: new Date()-1000*36,
        tip:4
      },
      {
        id:'a',
        imgurl:'one.png',
        message:"1",
        types:0,//信息类型（0：文字，1：图片，......）
        time: new Date()-1000*36,
        tip:5
      },
    ]
    return msgs;
  }
}