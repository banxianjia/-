<template>
  <view>
    <view class="top-bar">
      <view class="top-bar-left" @tap="backOne">
        <image class="back-image" src="../../static/images/common/back.png" mode=""></image>
      </view>
      <view class="top-bar-right">
        <view class="more-img" @tap="toDetail(user.id)">
          <image src="../../static/images/userhome/more.png" mode=""></image>
        </view>
      </view>
    </view>
    <view class="bg">
      <view class="bg-bai" :animation="animationData4"></view>
      <image class="bg-img" :src="user.imgurl" mode="aspectFill"></image>
    </view>
    <view class="main">
      <view class="user-head">
        <view :animation="animationData3" class="sex" :style="{background: sexBg}">
          <image :src="user.seximg" mode=""></image>
        </view>
        <image :animation="animationData2" class="user-img" :src="user.imgurl" mode="aspectFill"></image>
      </view>
      <view class="user-imf">
        <view class="name">{{user.name}}</view>
        <view class="intr">{{user.intr}}</view>
      </view>
    </view>
    <view class="bottom-bar" v-if="tip != 2">
      <view class="bottom-btn" @tap="addFriendAnimat()" v-if="tip == 0">
        加为好友
      </view>
      <view class="bottom-btn" @tap="" v-if="tip == 1">
        发送消息
      </view>
    </view>
    <view :animation="animationData" class="add-misg" :style="{height: addHeight+'px',bottom:-addHeight+'px'}">
      <view class="name">
        {{user.name}}
      </view>
      <textarea :placeholder="myname+'请求加为好友~'" v-model="reqMsg" maxlength="120" class="add-main" 
        style="background-color: rgba(229, 230, 231, 1.0);" />
    </view>
    <view class="add-bt" :animation="animationData1">
      <view class="close btn" @tap="addFriendAnimat()">
        取消
      </view>
      <view class="send btn" @tap="subReqfriend()">
        发送
      </view>
    </view>
  </view>
</template>

<script>
  import Vue from '../../App.vue'
  import {store} from '../../commons/js/store.js'
  export default {
    data() {
      return {
        animationData: {},
        animationData1: {},
        animationData2: {},
        animationData3: {},
        animationData4: {},
        isAdd: false,
        sexBg: "#FF5D5B",
        addHeight: "",
        // myname: "",
        tip: '', //是否为好友 0不是，1是，2本人
        user: {
          id: '',
          name: "",
          intr: "",
          imgurl: '',
          seximg: '',
        },
        reqMsg: "",
        // userMsg: {},
      }
    },

    onReady() {
      this.getElementStyle()
      // this.myname = this.userMsg.name
    },
    onLoad(e) {
      if (e.hasOwnProperty('id') && e.id.length > 0) {
        this.findDetail(e.id)
      }
      if(e.hasOwnProperty('tip') && e.tip.length > 0){
        this.tip = e.tip
      }
      // this.getStorages()
    },
    computed:{
      myname:{
        get(){
          return uni.getStorageSync('name')
        }
      },
      id:{
        get() {
          return uni.getStorageSync('id')
        }
      }
    },
    methods: {
      //获取缓存数据
            // getStorages:function(){
            //   try {
            //     const name = uni.getStorageSync('name');
            //   	if (id) {
            //       this.userMsg.name = name
            //       // Vue.prototype.$userMsg = this.userMsg
            //   	}else{
            //       uni.navigateTo({
            //         url: "../signin/signin"
            //       })
            //     }
            //   } catch (e) {
            //   	// error
            //     console.log(e)
            //   }
            // },
      subReqfriend(){
        let message = this.myname + '请求加为好友~'
        console.log(this.id+"  "+this.user.id)
        console.log(this.reqMsg)
        if(this.reqMsg != ""){
          message = this.reqMsg
        }
        uni.request({
          url: this.serverURL + "/friend/apply",
          data:{
            uid: this.id,
            fid: this.user.id,
            message: message,
          },
          method: 'POST',
          success: (res) => {
            if(res.data.status == 200){
              console.log("发送成功")
            }else{
              console.log(res.data.msg)
            }
          }
        })
      },
      toDetail(id){
        uni.navigateTo({
          url: "../userdetail/userdetail?id="+id
        })
      },
      findDetail(id) {
        uni.request({
          url: this.serverURL + '/user/detail',
          data: {
            id: id
          },
          method: 'POST',
          success: (res) => {
            if (res.data.status == 200) {
              console.log(res.data.msg)
              console.log(res.data.data)
              const d = res.data.data
              this.user.id = d.id
              this.user.imgurl = this.serverURL + d.imgurl
              this.user.intr = d.signature
              this.user.name = d.name
              this.user.seximg = "../../static/images/userhome/" + d.sex + ".png"
              // this.isFriend()
            } else {
              console.log(res.data.msg)
            }
          }
        })

      },
      backOne() {
        uni.navigateBack({
          delta: 1
        })
      },
      getElementStyle() {
        const query = uni.createSelectorQuery().in(this);
        query.select('.bg').boundingClientRect(data => {
          console.log("得到布局位置信息" + JSON.stringify(data));
          console.log("节点离页面顶部的距离为" + data.top);
          this.addHeight = data.height - 186
        }).exec();
      },
      addFriendAnimat() {
        this.isAdd = !this.isAdd
        var animation = uni.createAnimation({
          duration: 300,
          timingFunction: 'ease',
        })
        var animation1 = uni.createAnimation({
          duration: 300,
          timingFunction: 'ease',
        })
        var animation2 = uni.createAnimation({
          duration: 300,
          timingFunction: 'ease',
        })
        var animation3 = uni.createAnimation({
          duration: 300,
          timingFunction: 'ease',
        })
        var animation4 = uni.createAnimation({
          duration: 300,
          timingFunction: 'ease',
        })
        if (this.isAdd) {
          animation.bottom(0).step()
          animation1.bottom(0).step()
          animation2.width(120).height(120).top(40).step()
          animation3.opacity(0).step()
          animation4.backgroundColor('rgba(255,228,49,0.60)').step()
        } else {
          animation.bottom(-this.addHeight).step()
          animation1.bottom(-100).step()
          animation2.width(200).height(200).top(10).step()
          animation3.opacity(1).step()
          animation4.backgroundColor('rgba(255,228,49,0)').step()
        }
        this.animationData = animation.export()
        this.animationData1 = animation1.export()
        this.animationData2 = animation2.export()
        this.animationData3 = animation3.export()
        this.animationData4 = animation4.export()
      }
    }
  }
</script>

<style lang="scss">
  @import "../../commons/css/mycss.scss";

  .top-bar {
    background-color: rgba(0, 0, 0, 0);
  }

  .bg {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -2;

    .bg-bai {
      // background-color: #eee;
      width: 100%;
      height: 100%;
    }

    .bg-img {
      z-index: -1;
      opacity: 0.4;
      position: absolute;
      left: -10rpx;
      top: -10rpx;
      width: 110%;
      height: 110%;
      filter: blur(16px);
    }
  }

  .main {
    padding-top: 128rpx;
    text-align: center;

    .user-head {
      position: relative;

      .sex {
        width: 64rpx;
        height: 64rpx;
        border-radius: 28px;
        z-index: 3;
        text-align: center;
        position: absolute;
        top: 320rpx;
        right: 192rpx;

        image {
          padding: 16rpx;
          width: 32rpx;
          height: 32rpx;
        }
      }

      .user-img {
        top: 0;
        width: 400rpx;
        height: 400rpx;
        box-sizing: border-box;
        border: 3px solid #FFFFFF;
        border-radius: 24px;
        z-index: 2;
      }
    }

    .user-imf {
      padding-top: 42rpx;

      .name {
        font-family: PingFangSC-Regular;
        font-size: 26px;
        color: #272832;
        letter-spacing: -0.89px;
        font-weight: 400;
      }

      .intr {
        margin-top: 10rpx;
        padding: 0 98rpx;
        font-family: PingFangSC-Light;
        font-size: 14px;
        color: #272832;
        letter-spacing: -0.48px;
        line-height: 24px;
        font-weight: 200;
        text-align: left;
      }
    }
  }

  .add-misg {
    position: fixed;
    box-sizing: border-box;
    padding: 0 56rpx;
    width: 100%;
    background: #FFFFFF;
    border-radius: 20px 20px 0 0;

    .name {
      padding: 168rpx 0 40rpx;
      font-family: PingFangSC-Regular;
      font-size: 26px;
      color: #272832;
      letter-spacing: -0.89px;
      font-weight: 400;
      line-height: 74rpx;
    }

    .add-main {
      padding: 18rpx 22rpx;
      box-sizing: border-box;
      height: 420rpx;
      background: #F3F4F6;
      border-radius: 10px;
      font-family: PingFangSC-Regular;
      font-size: 16px;
      color: #272832;
      letter-spacing: -0.55px;
      font-weight: 400;
      line-height: 44rpx;
    }
  }

  .bottom-bar {
    z-index: 0;
  }

  .add-bt {
    position: fixed;
    bottom: -104rpx;
    width: 100%;
    height: 104rpx;
    padding: 12rpx $uni-spacing-col-base;
    background-color: #eee;
    box-sizing: border-box;
    display: flex;

    .btn {
      flex: auto;
      text-align: center;
      line-height: 40px;
      font-size: 16px;
      color: #272832;
      height: 40px;
      border-radius: 5px;
      font-family: PingFangSC-Regular;
      letter-spacing: -0.55px;
      font-weight: 400;
    }

    .send {
      width: 400rpx;
      margin-left: $uni-spacing-col-base;
      background: #FFE431;
    }

    .close {
      background: rgba(39, 40, 50, 0.10);
    }
  }
</style>
