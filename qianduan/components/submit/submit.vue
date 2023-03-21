<template>
  <view class="submit">
    <view class="submit-chat">
      <view class="bt-img" @tap="toVoice">
        <image :src="toc" mode=""></image>
      </view>
      <textarea focus="true" class="print btn" :class="{displaynone:isvoice}" auto-height="true" value="" placeholder=""
        v-model="msg" @input="inputs" />
      <view class="voice btn" :class="{displaynone:!isvoice}">按住说话</view>
      <view class="bt-img" @tap="showEmoji">
        <image v-if="isemoji" src="../../static/images/submit/jp.png" mode=""></image>
        <image v-if="!isemoji" src="../../static/images/submit/bq.png" mode=""></image>
      </view>
      <view class="bt-img" @tap="showMore">
        <image src="../../static/images/submit/tj.png" mode=""></image>
      </view>
    </view>
    <view class="emoji" :class="{displaynone:!isemoji}">
      <view class="emoji-delete">
        <image @tap="emojiDel" src="../../static/images/submit/back.png" mode=""></image>
      </view>
      <emoji @curemoji="getEmoji" :height="230"></emoji>
    </view>
    <view class="more" :class="{displaynone:!ismore}">
      <view class="more-list" @tap="sendImg('album')">
        <view class="more-list-img">
          <image src="../../static/images/submit/tp.png" mode=""></image>
        </view>
        <view class="more-list-title">
          照片
        </view>
      </view>
      <view class="more-list"  @tap="sendImg('camera')">
        <view class="more-list-img">
          <image src="../../static/images/submit/pz.png" mode=""></image>
        </view>
        <view class="more-list-title">
          拍照
        </view>
      </view>
      <view class="more-list" @tap="chooseLocation">
        <view class="more-list-img">
          <image src="../../static/images/submit/dw.png" mode=""></image>
        </view>
        <view class="more-list-title">
          定位
        </view>
      </view>
      <view class="more-list">
        <view class="more-list-img">
          <image src="../../static/images/submit/sp.png" mode=""></image>
        </view>
        <view class="more-list-title">
          视频
        </view>
      </view>
      <view class="more-list">
        <view class="more-list-img">
          <image src="../../static/images/submit/wj.png" mode=""></image>
        </view>
        <view class="more-list-title">
          文件
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  import Vue from '../../App.vue'
  import emoji from "./emoji/emoji.vue"
  export default {
    name: "submit",
    data() {
      return {
        msg: "",
        isvoice: false,
        isemoji: false,
        ismore: false,
        toc: '../../static/images/submit/yy.png',
      };
    },
    components: {
      emoji,
    },
    methods: {
      sendImg(chose){
        let count = 9
        if(chose == 'camera '){
          count =  1
        }else{
          count = 9
        }
        uni.chooseImage({
        	count: count, //默认9
        	sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
        	sourceType: [chose], //从相册选择
        	success: (chooseImageRes)=>{
            const filePath = chooseImageRes.tempFilePaths
            
            for(var i=0;i<filePath.length;i++){
              const uploadTask = uni.uploadFile({
              			url: 'http://localhost:3000/file/upload', 
              			filePath: filePath[i],
              			name: 'image',
              			formData: {
              				'user': 'test',
                      "url": "img"
              			},
              			success: (uploadFileRes) => {
                      //照片在服务器中的地址
                      let path = this.serverURL + uploadFileRes.data
                      this.send(uploadFileRes.data,1)
              			}
              		});
              
              		uploadTask.onProgressUpdate((res) => {
              			console.log('上传进度' + res.progress);
              			console.log('已经上传的数据长度' + res.totalBytesSent);
              			console.log('预期需要上传的数据总长度' + res.totalBytesExpectedToSend);
              
              		});
              
            }
        		console.log(JSON.stringify(chooseImageRes.tempFilePaths));
        	}
        });
      },
      chooseLocation(){
        uni.chooseLocation({
        	success: function (res) {
        		console.log('位置名称：' + res.name);
        		console.log('详细地址：' + res.address);
        		console.log('纬度：' + res.latitude);
        		console.log('经度：' + res.longitude);
        	}
        });
      },
      send(msg, type) {
        let data = {
          message: msg,
          types: type
        }
        this.$emit('inputs', data)
        setTimeout(() => {
          this.msg = ""
        }, 0)
      },
      emojiDel() {
        if (this.msg.length > 0) {
          this.msg = this.msg.substring(0, this.msg.length - 1)
        }
      },
      getEmoji(value) {
        this.msg = this.msg + value
      },
      getElementHeight() {
        let query = uni.createSelectorQuery().in(this)
        query.select('.submit').boundingClientRect(data => {
          this.$emit('submitHeight', data.height)
          console.log("data.height:" + data.height)
        }).exec()
      },
      toVoice() {
        this.isvoice = !this.isvoice
        this.isemoji = false
        this.ismore = false
        if (this.isvoice) {
          this.toc = "../../static/images/submit/jp.png"
        } else {
          this.toc = "../../static/images/submit/yy.png"
        }
      },
      showEmoji() {
        this.isemoji = !this.isemoji
        this.ismore = false
        this.isvoice = false
        setTimeout(() => {
          this.toc = "../../static/images/submit/yy.png"
          this.getElementHeight()
        }, 0)
      },
      showMore() {
        this.ismore = !this.ismore
        this.isemoji = false
        this.isvoice = false
        setTimeout(() => {
          this.toc = "../../static/images/submit/yy.png"
          this.getElementHeight()
        }, 0)
      },
      inputs(e) {
        var chatm = e.detail.value
        if (chatm.indexOf('\n') != -1 && this.msg.length > 1) {
          this.send(this.msg, 0)

        }
      }
    }
  }
</script>

<style lang="scss">
  .submit {
    position: fixed;
    bottom: -1px;
    z-index: 10;
    background: rgba(244, 244, 244, 1);
    width: 100%;
    border-top: 1px solid $uni-border-color;
    bottom: var(--status-bar-height);

    .displaynone {
      display: none;
    }

    .submit-chat {
      display: flex;
      flex-direction: row;
      justify-content: space-around;
      align-items: flex-end;

      .btn {
        background-color: #FFFFFF;
        height: 80rpx;
        flex: auto;
        box-sizing: border-box;
        border-radius: $uni-border-radius-lg;
        margin: auto 20rpx;
      }

      .print {
        padding: 10rpx;
        font-size: 48rpx;
        line-height: 68rpx;
      }

      .voice {
        text-align: center;
        font-size: 48rpx;
        line-height: 80rpx;
      }

      .bt-img {
        width: 80rpx;
        height: 80rpx;
        box-sizing: border-box;
        padding: 10rpx;
        margin: 10rpx 0;

        image {
          width: 60rpx;
          height: 60rpx;
        }
      }
    }

    .emoji {
      width: 100%;
      height: 460rpx;
      background-color: #e2e3e1;

      .emoji-delete {
        width: 160rpx;
        height: 80rpx;
        box-sizing: border-box;
        position: fixed;
        bottom: 0;
        right: 0;
        padding: 8rpx 38rpx;
        margin-bottom: 10rpx;
        margin-right: 15rpx;
        background-color: #e2e3e1;
        text-align: center;
        line-height: 80rpx;

        image {
          width: 42px;
          height: 32px;
        }
      }
    }

    .more {
      width: 100%;
      height: 460rpx;
      background-color: #e2e3e1;
      box-sizing: border-box;
      padding: 50rpx 0;

      .more-list {
        float: left;
        width: 25%;
        height: 200rpx;
        box-sizing: border-box;
        text-align: center;

        .more-list-img {
          width: 120rpx;
          height: 120rpx;
          box-sizing: border-box;
          background-color: #FFFFFF;
          border-radius: 20rpx;
          margin: 0 auto;
          display: flex;
          flex-direction: row;
          justify-content: center;
          align-items: center;

          image {
            width: 72rpx;
            height: 72rpx;
          }
        }

        .more-list-title {
          height: 60rpx;
          line-height: 60rpx;
          color: #8c8c8c;
        }

      }
    }
  }
</style>
