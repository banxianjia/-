<template>
  <view class="content">
    <view class="top-bar">
      <view class="search-div">
        <image src="../../static/images/search/search.png" mode=""></image>
        <input type="text" class="search-input" value="" placeholder="搜索用户/群" placeholder-class="input-pla"
          @input="search" />
      </view>
      <view class="top-bar-right">
        <view class="text" @tap="backOne">取消</view>
      </view>
    </view>
    <view class="main">
      <view class="search-user result">
        <view class="title" v-if="searchList.length>0">用户</view>
        <view class="user list" v-for="(item, index) in searchList" :key="index">
          <navigator :url="'../userhome/userhome?id='+item.id+'&tip='+item.tip">
            <image :src="item.imgurl" mode=""></image>
            <view class="names">
              <view class="name" v-html="item.name"></view>
              <view class="email" v-html="item.email"></view>
            </view>
            <view class="right-bt send" v-if="item.tip == 1">发消息</view>
            <view class="right-bt add" v-if="item.tip == 0">加好友</view>
          </navigator>
        </view>

      </view>
    </view>
  </view>
</template>

<script>
  import Vue from '../../App.vue'
  import datas from "../../commons/js/datas.js"
  import {
    store
  } from '../../commons/js/store.js'
  export default {

    data() {
      return {
        searchCont: "",
        searchList: [],
        search: () => {},
        // userMsg: store.state
        id: '',
      };
    },
    onLoad() {
      this.getStorages()
    },
    mounted() {
      this.search = this.debounce(this.handle, 500, false)
    },
    methods: {
      //获取缓存数据
      getStorages: function() {
        try {
          const id = uni.getStorageSync('id');
          if (id) {
            this.id = id
            // Vue.prototype.$userMsg = this.userMsg
          } else {
            uni.navigateTo({
              url: "../signin/signin"
            })
          }
        } catch (e) {
          // error
          console.log(e)
        }
      },
      backOne() {
        uni.navigateBack({
          delta: 1
        })
      },
      //获取关键词
      handle(e) {
        this.searchList = []
        this.searchCont = e.detail.value
        console.log(this.searchCont)
        if (this.searchCont.length > 0) {
          this.searchUser(this.searchCont)
        }
      },
      //防抖
      debounce(func, delay = 1000, immediate = false) {
        let timer = null
        return function() {
          //在delay内重复使用的时候清空之前的定时任务
          if (timer) {
            clearTimeout(timer)
          }
          //如果需要首次立即执行
          if (immediate && !timer) {
            func.apply(this, arguments)
          }
          timer = setTimeout(() => {
            func.apply(this, arguments)
          }, delay)
        }
      },
      //寻找匹配
      searchUser(cont) {
        uni.request({
          url: this.serverURL + '/search/user',
          data: {
            str: cont,
          },
          method: 'POST',
          success: (res) => {
            if (res.data.status == 200) {
              console.log(res.data.data)
              let arr = res.data.data
              let exp = eval("/" + cont + "/g")
              for (let i = 0; i < arr.length; i++) {
                arr[i].tip = 0
                this.isFriend(arr[i])
                console.log(arr[i].tip)
                // if(arr[i].tip == 2){
                //   continue
                // }
                arr[i].imgurl = this.serverURL + arr[i].imgurl
                arr[i].name = arr[i].name.replace(exp, "<span style='color:#4AAAFF;'>" + cont + "</span>")
                arr[i].email = arr[i].email.replace(exp, "<span style='color:#4AAAFF;'>" + cont + "</span>")
                this.searchList.push(arr[i])
              }
            } else {
              console.log(res.data.msg)
            }
          }

        })
      },
      isFriend(arr) {
        let tip = 0
        if (arr.id == this.id) {
          tip = 2
          arr.tip = tip
        } else {
          uni.request({
            url: this.serverURL + '/search/isfriend',
            data: {
              uid: this.id,
              fid: arr.id
            },
            method: 'POST',
            success: (res) => {
              if (res.data.status == 200) {
                tip = 1
              } else {
                console.log(res.data.msg)
              }
              arr.tip = tip
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
    padding: 88rpx $uni-spacing-col-base;
    width: 100%;

    .result {
      padding-top: $uni-spacing-col-base;
      padding-left: $uni-spacing-col-base;

      .title {
        font-family: PingFangSC-Semibold;
        font-size: 22px;
        color: #272832;
        letter-spacing: -0.75px;
        font-weight: 600;
      }

      .list {
        height: 120rpx;
        padding-top: 20rpx;
        padding-right: $uni-spacing-col-base;

        image {
          float: left;
          width: 80rpx;
          height: 80rpx;
          border-radius: 20rpx;
        }

        .names {
          float: left;
          padding-left: $uni-spacing-col-base;

          .name {
            font-family: PingFangSC-Regular;
            font-size: 18px;
            color: #272832;
            letter-spacing: -0.62px;
            line-height: 25px;
            font-weight: 400;
          }

          .email {
            font-size: 12px;
            color: #272832;
            letter-spacing: -0.41px;
            font-weight: 400;
            line-height: 48rpx;
          }
        }

        .right-bt {
          text-align: center;
          float: right;
          width: 120rpx;
          height: 48rpx;
          border-radius: 24rpx;
          margin-top: 16rpx;
          font-family: PingFangSC-Regular;
          font-size: 12px;
          letter-spacing: -0.41px;
          font-weight: 400;
          line-height: 48rpx;
        }

        .send {
          background: #FFE431;
          color: #272832;
        }

        .add {
          background: rgba(74, 170, 255, 0.10);
          color: #4AAAFF;
        }
      }
    }
  }
</style>
