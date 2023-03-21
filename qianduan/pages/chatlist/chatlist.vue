<template>
  <view class="content">
    <view class="top-bar">
      <navigator :url="'../userdetail/userdetail?id='+userMsg.id" class="top-bar-center">
        <image class="head-image" :src="userMsg.imgurl" mode=""></image>
      </navigator>
      <view class="top-bar-center">
        <view style="width: 88rpx;height: 88rpx;">
          <!-- 占位 -->
        </view>
      </view>
      <view class="top-bar-right">
        <view class="search-image">
          <image @tap="toSearch" src="../../static/images/index/search.png" mode=""></image>
        </view>
      </view>
    </view>
    <view class="main">
      <view class="friends">
        <view class="friends-list">
          <view @tap="toReq">
            <view class="friends-list-l">
              <!-- <text class="tip">1</text> -->
              <image src="../../static/images/index/apply.png" mode=""></image>
            </view>
            <view class="friends-list-r">
              <view class="top">
                <view class="name">
                  好友申请
                </view>
                <view class="time">
                </view>
              </view>
              <view class="message">
                茫茫人海，相聚便是缘分
              </view>
            </view>
          </view>
        </view>
      </view>

      <view class="friends">
        <view class="friends-list" @click="toChatroom(item.friendId,item.name,item.imgurl)" v-for="(item,index) in friends" :key="index">
          <view class="friends-list-l">
            <!-- <text class="tip" v-if="item.tip>0">{{item.tip}}</text> -->
            <image :src=item.imgurl mode=""></image>
          </view>
          <view class="friends-list-r">
            <view class="top">
              <view class="name">
                {{item.name}}
              </view>
              <view class="time">
                {{item.time.substring(0,10)}}
              </view>
            </view>
            <view class="message">
              {{item.msg}}
            </view>
          </view>
        </view>
      </view>
    </view>
    
    <view class="bottom-bar">
      <view class="bottom-left">
        <image src="../../static/images/index/chat.png" mode=""></image>
        <text>聊天</text>
      </view>
      <view class="bottom-center">
        <image src="../../static/images/index/logo.png" mode=""></image>
      </view>
      <view class="bottom-right">
        <image src="../../static/images/index/friend.png" mode=""></image>
        <text>好友</text>
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
        friends: [],
        // userMsg: store.state
        userMsg: {},
      }
    },
    onLoad() {
      this.getFriends()
      this.join(uni.getStorageSync('id'))
      this.revSocketMsg()
      // this.getUserMsg()
      // this.getStorages()
    },
    // computed:{
    //   userMsg:{
    //     get(){
    //       return {
    //         name: getApp().globalData.userMsg.name,
    //         imgurl: this.serverURL + getApp().globalData.userMsg.imgurl,
    //         token: "",
    //         uid: getApp().globalData.userMsg.id
    //       }
    //     }
    //   }
    // },
    //下方计算属性可以也是要刷新
    // computed:{
    //   userMsg:{
    //     get(){
    //       return {
    //         name: uni.getStorageSync('name'),
    //         imgurl: this.serverURL + uni.getStorageSync('imgurl'),
    //         id: uni.getStorageSync('id'),
    //       }
    //     }
    //   }
    // },
    onShow() {
      this.userMsg = {}
      this.getStorages()
      console.log(this.userMsg)
    },
    methods: {
      
      // socket模块
      join(uid){
        this.socket.emit('login',uid);
      },
      toChatroom(fid,name,imgurl){
        const info = {
          fid,
          name,
          imgurl
        }
        uni.navigateTo({
          url: '../chatroom/chatroom?info='+ encodeURIComponent(JSON.stringify(info))
        })
      },
      //获取缓存数据
      getStorages:function(){
        try {
        	const id = uni.getStorageSync('id');
          const name = uni.getStorageSync('name');
          const imgurl = uni.getStorageSync('imgurl');
        	if (id) {
            this.userMsg.imgurl = this.serverURL + imgurl
            this.userMsg.id = id
            this.userMsg.name = name
            // Vue.prototype.$userMsg = this.userMsg
        	}else{
            uni.navigateTo({
              url: "../signin/signin"
            })
          }
        } catch (e) {
        	// error
          console.log(e)
        }
      },
      // getUserMsg(){
      //   this.userMsg.imgurl = this.serverURL + this.$userMsg.imgurl
      //   console.log(this.$userMsg.imgurl)
      //   this.userMsg.uid = this.$userMsg.id
      //   console.log(this.$userMsg)
      // },
      toReq() {
        uni.navigateTo({
          url: "../friendrequest/friendrequest"
        })
      },
      toSearch() {
        uni.navigateTo({
          url: "../search/search"
        })
      },
      async getFriends() {
        await uni.request({
          url: this.serverURL + '/friend/getusers',
          data:{
            uid: uni.getStorageSync('id'),
          },
          method:'POST',
          success: (res) => {
            if(res.data.status == 200){
              console.log("请求成功")
              console.log(res.data)
              this.friends = res.data.data
              for (let i = 0; i < this.friends.length; i++) {
                this.friends[i].imgurl = this.serverURL + this.friends[i].imgurl;
                this.getLastMsg(this.friends,i);
              }
            }else{
              console.log(res.data.msg)
            }
          }
        });
      },
      async getLastMsg(arr,index){
        await uni.request({
          url: this.serverURL + '/message/getlastmsg',
          data:{
            uid: uni.getStorageSync('id'),
            fid: arr[index].friendId,
          },
          method:'POST',
          success: (res) => {
            if(res.data.status == 200){
              console.log("请求成功")
              console.log(res.data)
              let e = arr[index]
              e.type = res.data.list[0].type
              e.time = res.data.list[0].time
              if(e.type == 0){
                e.msg = res.data.list[0].message
              }else {
                e.msg = '[非文字信息]'
              }
              arr.splice(index,1,e);
            }else{
              console.log(res.data.msg)
            }
          }
        })
      },
      // socket接受
      revSocketMsg(){
        this.socket.on('msg',(msg,fromid)=>{
          console.log(msg)
          console.log(fromid)
          for (let i = 0; i < this.friends.length; i++) {
            if(fromid == this.friends[i].friendId){
              let item = this.friends[i]
              item.type = msg.types
              let date = new Date()
              item.time = (date.getMonth()+1)+'-'+date.getDate()
              if(msg.types == 0){
                item.msg = msg.message
              }else {
                item.msg = '[非文字信息]'
              }
              this.friends.splice(i,1)
              this.friends.unshift(item)
              break;
            }
          }
          
        })
      },
    }
  }
</script>

<style lang="scss">
  @import "../../commons/css/mycss.scss";

  .main {
    padding: 90rpx $uni-spacing-col-base $tabbar-height;
    width: 90%;
  }
  .bottom-bar{
    background: rgba(250,250,250,1.0);
    height: $tabbar-height;
    box-shadow: inset 0px 0.5px 0px 0px rgba(0,0,0,0.1);
  }
  .friends{
    width: 100%;
  }
  .friends-list {
    width: 90%;
    height: 96rpx;
    padding-bottom: 32rpx;

    &:active {
      background-color: $uni-bg-color-grey;
    }

    .friends-list-l {
      float: left;
      position: relative;

      image {
        width: 97rpx;
        height: 97rpx;
        border-radius: $uni-border-radius-base;
        background-color: $uni-color-primary;
      }

      .tip {
        position: absolute;
        z-index: 5;
        top: -6rpx;
        left: 68rpx;
        min-width: 36rpx;
        height: 36rpx;
        background: $uni-color-warning;
        border-radius: $uni-border-radius-circle;
        font-family: PingFangSC-Regular;
        font-size: $uni-font-size-base;
        color: $uni-text-color-inverse;
        font-weight: 400;
        text-align: center;
        line-height: 36rpx;
      }
    }

    .friends-list-r {
      padding-left: 128rpx;

      .top {
        height: 50rpx;

        .name {
          float: left;
          font-family: PingFangSC-Regular;
          font-size: 36rpx;
          color: $uni-text-color;
          font-weight: 400;
          line-height: 50rpx;
        }

        .time {
          float: right;
          text-align: right;
          font-family: PingFangSC-Regular;
          font-size: $uni-font-size-base;
          color: $uni-text-color-disable;
          line-height: 50rpx;
        }
      }

      .message {
        font-family: PingFangSC-Regular;
        font-size: $uni-font-size-base;
        color: $uni-text-color-grey;
        line-height: 40rpx;
        font-weight: 400;
        // 单行省略
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
      }
    }
  }
</style>
