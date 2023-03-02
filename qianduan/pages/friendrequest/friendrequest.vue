<template>
  <view class="content">
    <view class="top-bar">
      <view class="top-bar-left" @tap="backOne">
        <image class="back-image" src="../../static/images/common/back.png" mode=""></image>
      </view>
      <view class="top-bar-center">
        <view class="title">
          好友请求
        </view>
      </view>
      <view class="top-bar-right">
        <view class="more-img">
          <image src="../../static/images/userhome/more.png" mode=""></image>
        </view>
      </view>
    </view>
    <view class="main">
      <view class="requester" v-for="(item,index) in list" :key="index">
        <view class="request-top">
          <view class="reject">
            拒绝
          </view>
          <image class="user-img" src="../../static/images/img/one.png" mode=""></image>
          <view class="agree">
            同意
          </view>
        </view>
        <view class="request-center">
          <view class="name">
            {{item.name}}
          </view>
          <view class="date">
            {{item.time.substring(0,10)}}
          </view>
        </view>
        <view class="notice">
          <view class="detail">
            <text>留言：</text>
            {{item.message}}
          </view>
        </view>
      </view>
      
      
    </view>
  </view>
</template>

<script>
  import Vue from '../../App.vue'
  export default {
    data() {
      return {
        list: [],
      };
    },
    onReady() {
      uni.request({
        url: this.serverURL + '/friend/getreq',
        data:{
          uid: uni.getStorageSync('id')
        },
        method:'POST',
        success: (res) => {
          if(res.data.status == 200){
            console.log("请求成功")
            this.list = res.data.list
          }else{
            console.log(res.data.msg)
          }
        }
      })
    },
    methods: {
      backOne() {
        uni.navigateBack({
          delta: 1
        })
      },
    }
  }
</script>

<style lang="scss">
  @import "../../commons/css/mycss.scss";

  .main {
    margin-top: 88rpx;
    width: 800rpx;
  }

  .requester {
    width: 90%;
    height: 450rpx;
    margin: 150rpx auto 20rpx;
    border-radius: 15rpx;
    box-shadow: 0 4px 8px 0 rgba(195, 195, 195, 0.2), 0 6px 20px 0 rgba(195, 195, 195, 0.19);

    .request-top {
      display: flex;
      direction: row;
      justify-content: space-around;
      position: relative;
      height: 130rpx;

      .reject {
        width: 160rpx;
        height: 60rpx;
        line-height: 60rpx;
        background-color: rgba(234, 219, 218, .4);
        border-radius: 30rpx;
        text-align: center;
        font-size: 32rpx;
        color: #FF5D5B;
        margin-top: 60rpx;
      }

      .user-img {
        top: -100rpx;
        width: 200rpx;
        height: 200rpx;
        border-radius: 50%;
      }

      .agree {
        width: 160rpx;
        height: 60rpx;
        line-height: 60rpx;
        background-color: rgba(235, 208, 54, .4);
        border-radius: 30rpx;
        text-align: center;
        font-size: 32rpx;
        color: #272832;
        margin-top: 60rpx;
      }
    }

    .request-center {
      text-align: center;

      .name {
        font-family: PingFangSC-Regular;
        font-size: 45rpx;
        color: #272832;
        font-weight: 400;
        line-height: 50rpx;
        margin-bottom: 10rpx;
      }

      .date {
        font-size: 15px;
        color: rgba(39, 40, 50, 0.40);
        letter-spacing: -0.41px;
        font-weight: 400;
        line-height: 30rpx;
      }
    }

    .notice {
      height: 90rpx;
      margin-top: 50rpx;
      margin-left: $uni-spacing-col-base;
      margin-right: $uni-spacing-col-base;
      background: #F3F4F6;
      border-radius: 10px;
      padding: 30rpx;
      
      .detail{
        height: 90rpx;
        font-family: PingFangSC-Regular;
        font-size: 32rpx;
        line-height: 45rpx;
        color: rgba(39, 40, 50, 0.50);
        letter-spacing: 0;
        font-weight: 400;
        // 多行省略
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
    }
  }
</style>
