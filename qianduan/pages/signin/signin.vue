<template>
  <view class="content">
    <view class="top-bar">
      <view class="top-bar-right" @tap="toSignup()">
        <view class="text">注册</view>
      </view>
    </view>
    <view class="main">
      <view class="logo">
        <image src="../../static/images/sign/logo1.png" mode=""></image>
      </view>
      <view class="logn-form">
        <form>
          <view class="title">
            登录
          </view>
          <view class="welc">
            您好，欢迎来到yike!
          </view>
          <input type="text" value="" v-model="user" placeholder="用户名或邮箱" placeholder-class="input-pla"/>
          <input type="password" value="" v-model="pwd" placeholder="密码" placeholder-class="input-pla"/>
          <view class="tips" v-if="tip">
            输入用户或密码错误！
          </view>
          <view class="submit">
            <button @tap="login">登录</button>
          </view>
        </form>

      </view>
    </view>
  </view>
</template>

<script>
  import Vue from 'vue'
  import {store} from '../../commons/js/store.js'
  export default {
    data() {
      return {
        user: "",
        pwd: "",
        tip:false
      };
    },
    onLoad: function(e){
      console.log(typeof(e))
      if(e.hasOwnProperty('user') && e.user.length > 0){
        this.user = e.user
        uni.showToast({
          title: "注册成功请登录",
          icon:"none",
          duration:2000
        })
      }
    },
    methods: {
      toSignup: function() {
        uni.navigateTo({
          url: "../signup/signup"
        })
      },
      login: function() {
        console.log("logiunnnnnnnnnn")
        if (this.user && this.pwd) {
          console.log(this.user + "   " + this.pwd)
          console.log(this.serverURL)
          uni.request({
            url: this.serverURL + '/signin/match',
            data:{
              str: this.user,
              pwd: this.pwd
            },
            method:'POST',
            success: (res) => {
              console.log("前端成功请求")
              if(res.data.status == 200){
                this.tip = false
                //登录成功
                //本地存储用户信息
                try {
                	uni.setStorageSync('id', res.data.back.id);
                	uni.setStorageSync('name', res.data.back.name);
                	uni.setStorageSync('imgurl', res.data.back.imgurl);
                  // Vue.prototype.$userMsg = res.data.back
                  // getApp().globalData.userMsg = res.data.back
                  for(let key in res.data.back){
                    if(key == "imgurl"){
                      console.log(this.serverURL + res.data.back[key])
                      store.setUsg(key,this.serverURL + res.data.back[key])
                    }else{
                      store.setUsg(key,res.data.back[key])
                    }
                  }
                } catch (e) {
                	// error
                  console.log(e)
                  console.log("数据存储出错")
                }
                uni.navigateTo({
                  url: "../chatlist/chatlist"
                })
              }else{
                this.tip = true
                console.log("服务器出错："+res.data.msg)
              }
            }
          })
          
        }
      }
    }
  }
</script>

<style lang="scss">
  @import "../../commons/css/mycss.scss";

  .main {
    // border: 1px solid red;
    box-sizing: border-box;
    width: 100%;
    padding-left: $uni-spacing-row-lg;
    padding-right: $uni-spacing-row-lg;

    .logo {
      // border: 1px solid red;
      text-align: center;
      margin: 0 auto;
      padding-top: 188rpx;
      padding-bottom: 60rpx;

      image {
        width: 192rpx;
        height: 92rpx;
      }
    }

    .logn-form {

      // border: 1px solid red;
      .title {
        font-family: PingFangSC-Medium;
        font-size: 28px;
        color: #272832;
        font-weight: 600;
        padding-bottom: 18rpx;
      }

      .welc {
        font-family: PingFangSC-Regular;
        font-size: 20px;
        color: rgba(39, 40, 50, 0.50);
        letter-spacing: 0;
        font-weight: 400;
        padding-bottom: 68rpx;
      }

      .tips {
        font-size: $uni-font-size-lg;
        color: $uni-color-warning;
        float: left;
        line-height: 56rpx;
      }

      input {
        margin-bottom: 60rpx;
      }

      .submit {
        margin-top: 120rpx;

        button {
          width: 520rpx;
          height: 96rpx;
          background: #FFE431;
          box-shadow: 0px 25px 16px -18px rgba(255, 228, 49, 0.4);
          border-radius: 24px;
        }
      }

    }
  }
</style>
