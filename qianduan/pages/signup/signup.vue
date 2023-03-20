<template>
  <view class="content">
    <view class="top-bar">
      <view class="top-bar-left" @tap="toSignin">
        <image class="back-image" src="../../static/images/common/back.png" mode=""></image>
      </view>
    </view>
    <view class="main">
      <view class="logo">
        <image src="../../static/images/sign/logo1.png" mode=""></image>
      </view>
      <view class="logn-form">
        <form>
          <view class="title">
            注册
          </view>
            <view class="input-div">
              <input type="text" value="" placeholder="请取个名字" placeholder-class="input-pla" @blur="getUser"/>
              <view class="employ" v-if="isNameEmploy">已占用</view>
              <image class="ok" src="../../static/images/sign/right1.png" mode="" v-if="isuser"></image>
            </view>
            <view class="input-div">
              <input type="text" value="" placeholder="请输入邮箱" placeholder-class="input-pla" @blur="getemail"/>
              <view class="employ" v-if="isEmailEmploy">已占用</view>
              <view class="invalid" v-if="isinvalid">邮箱无效</view>
              <image class="ok" src="../../static/images/sign/right1.png" mode="" v-if="isemail"></image>
            </view>
            <view class="input-div">
              <input :type="type" value="" placeholder="这里输入密码" placeholder-class="input-pla" @blur="getPwd"/>
              <!-- <view class="employ" v-if="isPwdEmploy">已占用</view> -->
              <image class="look" src="../../static/images/sign/look.png" mode="" v-if="islook" @tap="looks"></image>
              <image class="biyan" src="../../static/images/sign/biyan.png" mode="" v-if="!islook" @tap="looks"></image>
            </view>
          <view :class="[{submit:isok},{nosubmit:!isok}]">
            <button type="submit" @tap="signUp">注册</button>
          </view>
        </form>
        
      </view>
    </view>
  </view>
</template>

<script>
  import Vue from '../../App.vue'
  export default {
    data() {
      return {
        type:"password",
        isuser:false,
        isemail:false,
        islook:true,
        isinvalid:false,
        isNameEmploy:false,
        isEmailEmploy:false,
        // isPwdEmploy:false,
        email:"",
        user:"",
        pwd:"",
      };
    },
    computed:{
      isok(){
        return this.isuser && this.isemail && !this.isPwdEmploy && this.pwd.length>5
      }
    },
    methods:{
      looks:function(){
        if(this.islook){
          this.type = "text"
          this.islook = !this.islook
        }else{
          this.type = "password"
          this.islook = !this.islook
        }
      },
      getemail:function(e){
        this.email = e.detail.value
        let pattern = /^([A-z0-9]{6,18})(\w|\-)+@[A-z0-9]+\.([A-z]{2,3})$/;
        this.isinvalid = false
        if(this.email.length>0){
          if(!pattern.test(this.email)){
            console.log("true")
            this.isinvalid = true
            this.isemail = false
          }else{
            console.log("false")
            this.isinvalid = false
            this.isemail = true
            // uni.request({
            //   url: this.serverURL + "/signup/judge/email",
            //   data: {
            //     email: this.email
            //   },
            //   method: 'POST',
            //   success: (res) => {
            //     console.log(res)
            //     console.log(res.data.isok)
            //     this.isEmailEmploy = res.data.isok
            //     this.isemail = !res.data.isok
            //     console.log(this.isEmailEmploy)
            //     console.log(this.isemail)
            //   }
            // })
          }
        }else{
          this.isEmailEmploy = false,
          this.isemail = false
        }
      },
      getUser:function(e){
        this.user = e.detail.value
        if(this.user.length > 0){
          uni.request({
            url: "http://localhost:3000/signup/judge/name",
            data: {
              name: this.user
            },
            method: 'POST',
            success: (res) => {
              console.log(res)
              if(res.data.status == 200){
                console.log(res.data.isok)
                this.isNameEmploy = res.data.isok
                this.isuser = !res.data.isok
                console.log(this.isNameEmploy)
                console.log(this.isuser)
              }else{
                console.log("服务器错误")
              }
            }
          })
        }else{
          this.isNameEmploy = false,
          this.isuser = false
        }
      },
      getPwd:function(e){
        this.pwd = e.detail.value
      },
      signUp:function(){
        if(this.isuser && this.isemail && !this.isPwdEmploy && this.pwd.length>5){
          uni.request({
            url: this.serverURL + "/signup/add",
            data:{
              name:this.user,
              email:this.email,
              pwd:this.pwd
            },
            method:'POST',
            success: (res) => {
              console.log(res)
              if(res.data.status == 200){
                //注册成功跳转到登录页
                uni.navigateTo({
                  url: '../signin/signin?user='+this.user
                })
              }else{
                console.log("服务器错误")
              }
            }
          })
        }
      },
      toSignin:function(){
        uni.navigateTo({
          url:'../signin/signin'
        })
      }
    }
  }
</script>

<style lang="scss">
  @import "../../commons/css/mycss.scss";
  .main{
    // border: 1px solid red;
    box-sizing: border-box;
    width: 100%;
    padding-left: $uni-spacing-row-lg;
    padding-right: $uni-spacing-row-lg;
    .logo{
      // border: 1px solid red;
      text-align: center;
      margin: 0 auto;
      padding-top: 188rpx;
      padding-bottom: 60rpx;
      image{
        width: 192rpx;
        height: 92rpx;
      }
    }
    .logn-form{
      // border: 1px solid red;
      .title{
        font-family: PingFangSC-Medium;
        font-size: 28px;
        color: #272832;
        font-weight: 600;
        padding-bottom: 68rpx;
      }
      .input-pla{
        color: rgba(39,40,50,0.40);
      }
      .input-div{
        margin-bottom: 60rpx;
        // border: 1px solid red;
        height: 50rpx;
        input{
          display: inline-block;
          height: 50rpx;
          width: 470rpx;
        }
        .employ,.invalid{
          display: inline-block;
          float: right;
          // border: 1px solid red;
          font-family: PingFangSC-Medium;
          font-size: 28rpx;
          line-height: 50rpx;
          color: #FF5D5B;
          font-weight: 500;
        }
        .look,.biyan{
          // border: 1px solid red;
          margin-top: 18rpx;
          float: right;
          width: 32rpx;
          height: 18rpx;
        }
        .ok{
          margin-top: 10rpx;
          float: right;
          width: 38rpx;
          height: 28rpx;
        }
      }
      .nosubmit{
        margin-top: 120rpx;
        button{
          width: 520rpx;
          height: 96rpx;
          background: rgba(39,40,50,0.20);
          border-radius: 48rpx;
           font-family: PingFangSC-Medium;
          font-size: 32rpx;
          color: #FFFFFF;
          font-weight: 500;
          line-height: 96rpx;
        }
      }
      .submit{
        margin-top: 120rpx;
        button{
          width: 520rpx;
          height: 96rpx;
          background: #FFE431;
          box-shadow: 0px 25px 16px -18px rgba(255,228,49,0.4);
          border-radius: 24px;
          font-family: PingFangSC-Medium;
          font-size: 16px;
          color: #272832;
          font-weight: 500;
          line-height: 96rpx;
        }
      }
      
    }
  }
</style>
