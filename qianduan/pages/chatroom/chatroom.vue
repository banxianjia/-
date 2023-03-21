<template>
  <view class="content" :style="{height:contentHeight+'px'}">

    <view class="top-bar">
      <view class="top-bar-left">
        <image class="back-image" src="../../static/images/common/back.png" mode="" @click="backOne()"></image>
      </view>
      <view class="top-bar-center">
        <view class="title">
          {{fname}}
        </view>
      </view>
      <view class="top-bar-right">
        <view class="more-img">
          <image src="../../static/images/userhome/more.png" mode=""></image>
        </view>
      </view>
    </view>
    <scroll-view @scrolltoupper="" :style="{height:chatHeight+'px'}" id="scrollView" class="chat"
      scroll-y="true" :scroll-with-animation="swanimation" :scroll-top="scrollTop">
      <view class="chat-main" id="chat-m" :style="{paddingBottom:submitHeight+'px',paddingTop:tobBarHeight+'px'}">
        <view class="loading" :class="{displaynone:!isloading}">
          <image src="../../static/images/common/loading.png" :animation="loadinganimationData" class="loading-img"
            mode=""></image>
        </view>
        <view class="chat-ls" v-for="(item, index) in msgs" :key="index">
          <view class="chat-time">{{item.time}}</view>
          <view :class="[item.userId == fid ?'msg-left':'msg-right']" class="msg-m">
            <image class="user-img" :src="item.imgurl" mode=""></image>
            <view class="message" v-if="item.type == 0||item.type == 3">{{item.message}}</view>
            <view class="message" v-if="item.type == 1">
              <image @tap="previewImg(item.message)" class="msg-img" :src="serverURL+item.message" mode="widthFix"></image>
            </view>
          </view>
        </view>
        <view style="height: 150rpx;"></view>
      </view>
    </scroll-view>
    
    <submit @inputs="inputs" @submitHeight="getSubmitHeight"></submit>
  </view>
</template>

<script>
  import Vue from '../../App.vue'
  import datas from "../../commons/js/datas.js"
  import submit from "../../components/submit/submit.vue"
  export default {
    data() {
      return {
        msgs: [],
        imgMsg: [],
        chatHeight: 0,
        contentHeight: 0,
        submitHeight: 0,
        tobBarHeight: 0,
        chatMheight: 0,
        scrollTop: 0,
        isloading: false,
        swanimation: true,
        loadinganimationData: {},
        loadingsetIn: '',
        nePage: 0,
        canload: true,
        isload: true,
        fid: null,
        fname: null,
        fimg:null,
      };
    },
    components: {
      submit,
    },
    watch: {
      chatMheight: function(newValue, oldValue) {
        if(oldValue != 0){
          this.scrollTop = newValue - oldValue
          console.log("this.scrollTop:"+this.scrollTop)
        }
      },
    },
    onLoad(e) {
      // this.getMsgs(0)
      setTimeout(() => {
        this.scrollToBottom()
      }, 100)
      if (e.hasOwnProperty('info') && e.info.length > 0) {
        let userInfo = JSON.parse(decodeURIComponent(e.info));
        console.log(userInfo)
        this.fid = userInfo.fid
        this.fname = userInfo.name
        this.fimg = userInfo.imgurl
      }
      
      this.getMsgs()
      this.revSocketMsg()
    },
    created() {
      const res = uni.getSystemInfoSync(); //获取手机可使用窗口高度     api为获取系统信息同步接口
      this.chatHeight = res.windowHeight - res.statusBarHeight * 2
      this.contentHeight = res.screenHeight
      console.log(this.chatHeight)
    },
    mounted() {
      this.gettopbarHeight()
    },
    methods: {
      // socket接受
      revSocketMsg(){
        this.swanimation = true
        this.socket.on('msg',(msg,fromid)=>{
          console.log(msg)
          console.log(fromid)
          if(fromid == this.fid){
            var data = {
              userId: fromid, //a是好友
              imgurl: this.fimg.substring(21),
              message: msg.message,
              type: msg.types, //信息类型（0：文字，1：图片，......）
              time: new Date() - 1000,
            }
            data.imgurl = this.serverURL + data.imgurl
            this.msgs.push(data)
          }
        })
      },
      // 渲染出下一页数据
      nextPage() {
        if (this.canload && this.isload) {
          this.isloading = true
          this.isload = false
          var animation = uni.createAnimation({
            duration: 1000,
            timingFunction: 'step-start',
          })
          this.animation = animation
          this.loadinganimationData = animation.export()
          let i = 1;
          this.loadingsetIn = setInterval(function() {
            animation.rotate(i * 30).step()
            this.loadinganimationData = animation.export()
            i++
            console.log("loading")
            // this.getMsgs(this.nePage)
          }.bind(this), 200)
          this.swanimation = false
          console.log("this.scrollTop:"+this.scrollTop)
        }
      },
      gettopbarHeight() {
        let query = uni.createSelectorQuery().in(this)
        query.select('.top-bar').boundingClientRect(data => {
          this.tobBarHeight = data.height
          console.log("data.height:" + data.height)
        }).exec()
      },
      getSubmitHeight(value) {
        this.submitHeight = value - 50
        console.log("this.submitHeight:" + this.submitHeight)
        setTimeout(() => {
          this.scrollToBottom()
        }, 0)

      },
      inputs(e) {
        this.swanimation = true
        var data = {
          userId: uni.getStorageSync('id'), //a是好友
          imgurl: uni.getStorageSync('imgurl'),
          message: e.message,
          type: e.types, //信息类型（0：文字，1：图片，......）
          time: new Date() - 1000,
        }
        data.imgurl = this.serverURL + data.imgurl
        this.msgs.push(data)
        if(e.types == 0){
          this.sendSocket(e)
        }
        if (e.types == 1) {
          this.imgMsg.push(this.serverURL+e.message)
          // console.log(this.serverURL+e.message)
          this.sendSocket(e)
        }
        setTimeout(() => {
          this.scrollToBottom()
        }, 0)
        console.log(e)
      },
      // 聊天数据发送后端
      sendSocket(e){
        console.log(e)
        this.socket.emit('msg',e,uni.getStorageSync('id'),this.fid);
      },
      getchatMheight() {
        console.log("begin:"+this.chatMheight)
        let query = uni.createSelectorQuery().in(this)
        query.select('#chat-m').boundingClientRect(data => {
          this.chatMheight = data.height
        }).exec()
        console.log("end:"+this.chatMheight)
      },
      //滚动到底部
      scrollToBottom() {
        let query = uni.createSelectorQuery().in(this)
        query.select('#scrollView').boundingClientRect()
        query.select('#chat-m').boundingClientRect()
        query.exec((res) => {
          //如果子元素高度大于父元素高度(显示高度)
          if (res[1].height > res[0].height) {
            //计算出二者差值就是需要滚动的距离
            this.scrollTop = res[1].height - res[0].height + 30 + this.submitHeight
            // console.log("this.scrollTop:" + this.scrollTop)
          }
        })
      },
      backOne() {
        uni.navigateBack({
          delta: 1
        })
      },
      getMsgs(){
        const uid = uni.getStorageSync('id');
        uni.request({
          url: this.serverURL + '/message/getmsglist',
          method: "POST",
          data:{
            uid: uid,
            fid: this.fid
          },
          success: (res) => {
            if(res.data.status == 200){
              console.log("请求成功")
              console.log(res.data)
              this.msgs = res.data.list
              for (let i = 0; i < this.msgs.length; i++) {
                this.msgs[i].imgurl = this.serverURL + this.msgs[i].imgurl;
                if(this.msgs[i].type == 1){
                  this.imgMsg.push(this.serverURL+this.msgs[i].message)
                }
              }
            }else{
              console.log(res.data.msg)
            }
          }
        })
      },
      // getMsgs(page) {
      //   let msg = datas.message()
      //   console.log('page:' + page)
      //   var maxMsg = (page + 1) * 10
      //   var startMsg = page * 10
      //   console.log(maxMsg + "?" + msg.length)
      //   console.log(this.canload)
      //   if (maxMsg > msg.length) {
      //     maxMsg = msg.length
      //     this.canload = false
      //   }
      //   for (var i = startMsg; i < maxMsg; i++) {
      //     msg[i].imgurl = this.serverURL + msg[i].imgurl
      //     if (msg[i].types == 1) {
      //       msg[i].message = this.serverURL  + msg[i].message
      //       this.imgMsg.unshift(msg[i].message)
      //     }
      //     this.msgs.unshift(msg[i])
      //   }
      //   this.nePage = this.nePage+1
      //   clearInterval(this.loadingsetIn)
      //   setTimeout(()=>{
      //     this.getchatMheight()
      //   },0)
      //   console.log("load-close")
      //   this.isloading = false
      //   this.isload = true
      //   // this.$nextTick(function(){
      //   //   this.scrollToBottom()
      //   // })
      // },
      previewImg(flag) {
        let index;
        for (var i = 0; i < this.imgMsg.length; i++) {
          if (this.serverURL+flag == this.imgMsg[i]) {
            console.log(1111)
            index = i
            break
          }
        }
        uni.previewImage({
          current: index,
          urls: this.imgMsg,
          longPressActions: {
            itemList: ['发送给朋友', '保存图片', '收藏'],
            success: function(data) {
              console.log('选中了第' + (data.tapIndex + 1) + '个按钮,第' + (data.index + 1) + '张图片');
            },
            fail: function(err) {
              console.log(err.errMsg);
            }
          }
        });
      }
    }
  }
</script>

<style lang="scss">
  @import "../../commons/css/mycss.scss";


  .top-bar,
  page {
    background: #F4F4F4;
  }

  .displaynone {
    display: none;
  }

  .chat {
    width: 100%;
    margin-top: 100rpx;
    margin-bottom: 100rpx;
    box-sizing: border-box;

    .loading {
      text-align: center;

      .loading-img {
        width: 60rpx;
        height: 60rpx;
      }
    }

    .chat-ls {
      margin-top: 32rpx;
      margin-left: 32rpx;
      margin-right: 32rpx;
      box-sizing: border-box;

      .chat-time {
        text-align: center;
        font-family: PingFangSC-Regular;
        font-size: 12px;
        color: rgba(39, 40, 50, 0.30);
        letter-spacing: -0.41px;
        font-weight: 400;
      }

      .msg-m {
        display: flex;
        margin-top: 56rpx;

        .user-img {
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .message {
          flex: none;
          max-width: 480rpx;
          word-wrap: break-word;
          box-sizing: border-box;
          padding: 16rpx 24rpx;
          margin: 0 20rpx;
          font-family: PingFangSC-Regular;
          font-size: 16px;
          line-height: 45rpx;
          color: #272832;
          letter-spacing: 2rpx;

          .msg-img {
            max-width: 400rpx;
            border-radius: $uni-border-radius-base;
          }
        }
      }

      .msg-left {
        flex-direction: row;

        .message {
          border-radius: 0 10px 10px 10px;
          background: #FFFFFF;
        }
      }

      .msg-right {
        flex-direction: row-reverse;

        .message {
          border-radius: 10px 0px 10px 10px;
          background: #FFE431;
        }
      }
    }
  }
</style>
