<template>
  <view class="content">
    <view class="top-bar">
      <view class="top-bar-left" @tap="backOne">
        <image class="back-image" src="../../static/images/common/back.png" mode=""></image>
      </view>
      <view class="top-bar-center ">
        <view class="title">
          详情
        </view>
      </view>
      <view class="top-bar-right">
        <!-- 占位 -->
      </view>
    </view>
    <view class="main">
      <view class="column">
        <view class="row">
          <view class="title">
            头像
          </view>
          <view class="cot">
            <view>
              <image-cropper :src="tempFilePath" @confirm="confirm" @cancel="cancel"></image-cropper>
              <image @tap="upload" class="user-img" :src="cropFilePath" mode="aspectFit"></image>
            </view>
          </view>
          <view class="more" v-if="dataarr.isSelf">
            <image src="../../static/images/common/more.png" mode=""></image>
          </view>
        </view>

        <view class="row">
          <view class="title">
            签名
          </view>
          <view class="cot" @tap="modify('签名',dataarr.sign,false)">
            {{dataarr.sign}}
          </view>
          <view class="more" v-if="dataarr.isSelf">
            <image src="../../static/images/common/more.png" mode=""></image>
          </view>
        </view>

        <view class="row">
          <view class="title">
            注册
          </view>
          <view class="cot">
            {{dataarr.zhuce}}
          </view>
        </view>

        <view class="row">
          <view class="title">
            昵称
          </view>
          <view class="cot" @tap="modify('昵称',dataarr.name,false)">
            {{dataarr.name}}
          </view>
          <view class="more" v-if="dataarr.isSelf">
            <image src="../../static/images/common/more.png" mode=""></image>
          </view>
        </view>

        <view class="row">
          <view class="title">
            性别
          </view>
          <view class="cot">
            <picker @change="bindPickerChange" :value="index" :range="sex" :disabled="!dataarr.isSelf">
              <view class="uni-input">{{sex[index]}}</view>
            </picker>
          </view>
          <view class="more" v-if="dataarr.isSelf">
            <image src="../../static/images/common/more.png" mode=""></image>
          </view>
        </view>

        <view class="row">
          <view class="title">
            生日
          </view>
          <view class="cot">
            <picker mode="date" :value="date" :start="startDate" :end="endDate" @change="bindDateChange"
              :disabled="!dataarr.isSelf">
              <view class="uni-input">{{date}}</view>
            </picker>
          </view>
          <view class="more" v-if="dataarr.isSelf">
            <image src="../../static/images/common/more.png" mode=""></image>
          </view>
        </view>

        <view class="row">
          <view class="title">
            电话
          </view>
          <view class="cot" @tap="modify('电话',dataarr.phone,false)">
            {{dataarr.phone}}
          </view>
          <view class="more" v-if="dataarr.isSelf">
            <image src="../../static/images/common/more.png" mode=""></image>
          </view>
        </view>

        <view class="row">
          <view class="title">
            邮箱
          </view>
          <view class="cot" @tap="modify('邮箱',dataarr.email,false)">
            {{dataarr.email}}
          </view>
          <view class="more" v-if="dataarr.isSelf">
            <image src="../../static/images/common/more.png" mode=""></image>
          </view>
        </view>
        <view class="row" v-if="dataarr.isSelf">
          <view class="title">
            密码
          </view>
          <view class="cot" @tap="modify('密码',null,true)">
            ********
          </view>
          <view class="more">
            <image src="../../static/images/common/more.png" mode=""></image>
          </view>
        </view>
      </view>
      <view class="bt2" v-if="dataarr.isSelf" @click="loginOut()">
        退出登录
      </view>
    </view>

    <view :animation="animationData" class="modify" :style="{bottom:-modifyHeight+'px'}">
      <view class="modify-header">
        <view class="close" @tap="modify()">
          取消
        </view>
        <view class="title">
          {{modifyTitle}}
        </view>
        <view class="define" @tap="modifySubmit()">
          确定
        </view>
      </view>
      <view class="modify-main">
        <input v-if="ispwd" type="text" class="modify-pwd" placeholder="请输入原密码" placeholder-class="input-pla"
          :value="dataarr.oldpwd" />
        <textarea v-model="modifyData" class="modify-content" placeholder="修改内容" />
      </view>
    </view>
  </view>
</template>

<script>
  import Vue from '../../App.vue'
  import {
    store
  } from '../../commons/js/store.js'
  import ImageCropper from "@/components/invinbg-image-cropper/invinbg-image-cropper.vue";
  export default {
    data() {
      return {
        modifyTitle: "",
        modifyData: "",
        ispwd: false,
        dataarr: {
          oldpwd: "",
          imgurl: "",
          isSelf: true, //用户类型，true本人，false其他人
          id: '',
          name: "这里是昵称",
          sign: "这里是签名",
          zhuce: '',
          sex: "asexual",
          birth: "1000-01-01",
          email: "xxxxxxxx@xxxx.com",
          phone: "xxx-xxxxxxxx"
        },
        animationData: {},
        isModify: false,
        modifyHeight: '',
        sex: ['male', 'female', 'asexual'],
        tempFilePath: '',
        userMsg: {},
      }
    },
    components: {
      ImageCropper
    },
    computed: {
      startDate() {
        return this.getDate('start');
      },
      endDate() {
        return this.getDate('end');
      },
      index: {
        get() {
          if (this.dataarr.sex == 'asexual') {
            return 2
          } else if (this.dataarr.sex == 'female') {
            return 1
          } else if (this.dataarr.sex == 'male') {
            return 0
          }
        },
        set(newValue) {
          console.log(newValue)
        }

      },
      date: {
        get() {
          let dd = new Date(Date.parse(this.dataarr.birth.replace(/-/g, "/")))
          let year = dd.getFullYear();
          let month = dd.getMonth() + 1;
          let day = dd.getDate();
          month = month > 9 ? month : '0' + month;
          day = day > 9 ? day : '0' + day;
          return `${year}-${month}-${day}`;
        }
      },
      cropFilePath: {
        get() {
          return this.dataarr.imgurl
        },
        set(newValue) {
          return newValue
        }
      }
    },
    onReady() {
      this.getElementStyle();
    },
    onLoad(e) {
      this.getStorages()
      if (e.hasOwnProperty('id') && e.id.length > 0) {
        this.dataarr.id = e.id
        this.findDetail(e.id)
        console.log("登录用户："+this.userMsg.id)
        console.log("详情用户:"+e.id)
        if (e.id == this.userMsg.id) {
          console.log("是本人")
          this.dataarr.isSelf = true
        } else {
          console.log("不是本人")
          this.dataarr.isSelf = false
        }
      }
    },
    methods: {
      loginOut(){
        uni.navigateTo({
          url: "../signin/signin"
        })
      },
      //获取缓存数据
      getStorages: function() {
        try {
          const id = uni.getStorageSync('id');
          if (id) {
            this.userMsg.id = id
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
      update(type, data, id) {
        console.log(data)
        uni.request({
          url: this.serverURL + "/user/update",
          data: {
            'type': type,
            'data': data,
            'id': id,
          },
          method: 'POST',
          success: (res) => {
            if (res.data.status == 200) {
              console.log("修改成功")
            } else {
              console.log(res.data.msg)
            }
          }
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
              this.dataarr.imgurl = this.serverURL + d.imgurl
              this.dataarr.sign = d.signature
              if (d.time != null) {
                this.dataarr.zhuce = d.time.substring(0, 10)
              }
              this.dataarr.name = d.name
              this.dataarr.sex = d.sex
              if (d.borth != null) {
                this.dataarr.birth = d.borth
              }
              console.log(this.dataarr.birth)
              if (d.phone != null) {
                this.dataarr.phone = d.phone
              }
              this.dataarr.email = d.email
              this.dataarr.id = d.id
            } else {
              console.log(res.data.msg)
            }
          }
        })

      },
      upload() {
        if (this.dataarr.isSelf) {
          uni.chooseImage({
            count: 1, //默认9
            sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album'], //从相册选择
            success: (chooseImageRes) => {
              this.tempFilePath = chooseImageRes.tempFilePaths.shift()
            }
          });
        }
      },
      confirm(e) {
        this.tempFilePath = ''
        this.cropFilePath = e.detail.tempFilePath
        console.log(e.detail.tempFilePath)
        const uploadTask = uni.uploadFile({
          url: 'http://localhost:3000/file/upload',
          filePath: e.detail.tempFilePath,
          name: 'image',
          formData: {
            'user': 'test',
            "url": "users"
          },
        	 success: (uploadFileRes) => {
            let path = this.serverURL + uploadFileRes.data
            this.dataarr.imgurl = path
            // store.setUsg("imgurl", path)
            uni.setStorageSync('imgurl', uploadFileRes.data);
            this.update("imgurl", uploadFileRes.data, this.dataarr.id)
            console.log(uploadFileRes.data);
          }
        });

        uploadTask.onProgressUpdate((res) => {
          console.log('上传进度' + res.progress);
          console.log('已经上传的数据长度' + res.totalBytesSent);
          console.log('预期需要上传的数据总长度' + res.totalBytesExpectedToSend);
        });
      },
      cancel() {
        console.log('canceled')
      },
      bindPickerChange: function(e) {
        console.log('picker发送选择改变，携带值为', e.detail.value)
        if (this.index != e.detail.value) {
          this.dataarr.sex = this.sex[e.detail.value]
          this.update("sex", this.sex[e.detail.value], this.dataarr.id)
        }
      },
      bindDateChange: function(e) {
        if (this.dataarr.birth != e.detail.value.toString().substring(0, 10)) {
          this.dataarr.birth = e.detail.value.toString().substring(0, 10)
          console.log(this.dataarr.birth)
          this.update("birth", this.dataarr.birth, this.dataarr.id)
        }
      },
      getDate(type) {
        const date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();

        if (type === 'start') {
          year = year - 60;
        } else if (type === 'end') {
          year = year + 2;
        }
        month = month > 9 ? month : '0' + month;
        day = day > 9 ? day : '0' + day;
        return `${year}-${month}-${day}`;
      },
      backOne() {
        uni.navigateBack({
          delta: 1
        })
      },
      getElementStyle() {
        const query = uni.createSelectorQuery().in(this);
        query.select('.modify').boundingClientRect(data => {
          console.log("得到布局位置信息" + JSON.stringify(data));
          console.log("节点离页面顶部的距离为" + data.top);
          this.modifyHeight = data.height
        }).exec();
      },
      modify(type, data, ispwd) {
        if (this.dataarr.isSelf) {
          this.modifyTitle = type;
          this.modifyData = data;
          this.ispwd = ispwd;
          this.isModify = !this.isModify
          var animation = uni.createAnimation({
            duration: 300,
            timingFunction: 'ease',
          })
          if (this.isModify) {
            animation.top(0).step()
          } else {
            animation.top(-this.modifyHeight).step()
          }
          this.animationData = animation.export()
        }
      },
      modifySubmit() {
        if (this.modifyTitle == "签名") {
          if (this.dataarr.sign != this.modifyData) {
            this.update("signature", this.modifyData, this.dataarr.id)
            this.dataarr.sign = this.modifyData
          }
        } else if (this.modifyTitle == "昵称") {
          if (this.dataarr.name != this.modifyData) {
            console.log(this.modifyData)
            uni.request({
              url: this.serverURL + "/signup/judge/name",
              data: {
                name: this.modifyData
              },
              method: 'POST',
              success: (res) => {
                console.log(res)
                console.log(res.data.isok)
                if (res.data.isok) {
                  alert("用户名已存在，修改失败")
                } else {
                  this.dataarr.name = this.modifyData
                  uni.setStorageSync('name',this.modifyData);
                  this.update("name", this.modifyData, this.dataarr.id)
                }
              }
            })
          }
        } else if (this.modifyTitle == "电话") {
          if (this.dataarr.phone != this.modifyData) {
            this.update("phone", this.modifyData, this.dataarr.id)
            this.dataarr.phone = this.modifyData
          }
        } else if (this.modifyTitle == "邮箱") {
          if (this.dataarr.email != this.modifyData) {
            let pattern = /^([A-z0-9]{6,18})(\w|\-)+@[A-z0-9]+\.([A-z]{2,3})$/;
            if (pattern.test(this.modifyData)) {
              uni.request({
                url: this.serverURL + "/signup/judge/email",
                data: {
                  email: this.modifyData
                },
                method: 'POST',
                success: (res) => {
                  console.log(res)
                  console.log(res.data.isok)
                  if (res.data.isok) {
                    alert("邮箱已存在，修改失败")
                  } else {
                    this.update("email", this.modifyData, this.dataarr.id)
                    this.dataarr.email = this.modifyData
                  }
                }
              })
            } else {
              alert("邮箱格式不对")
            }
          }
        } else if (this.modifyTitle == "密码") {
          console.log(this.dataarr.oldpwd)
          if (this.dataarr.oldpwd.length > 0) {
            // this.update("pwd",this.modifyData,this.dataarr.id)
            console.log(this.dataarr.oldpwd)
          }
        }
        this.modify()
      }
    }
  }
</script>

<style lang="scss">
  @import "../../commons/css/mycss.scss";

  .main {
    padding-top: 118rpx;
    display: flex;
    flex-direction: column;
    width: 100%;

    .column {
      display: flex;
      flex-direction: column;

      .row {
        display: flex;
        flex-direction: row;

        .title {
          flex: none;
          padding: 0 $uni-spacing-row-base;
          line-height: 112rpx;
          font-family: PingFangSC-Regular;
          font-size: 16px;
          color: #272832;
          letter-spacing: -0.55px;
          font-weight: 400;
        }

        .cot {
          flex: auto;
          font-family: PingFangSC-Regular;
          font-size: 16px;
          color: rgba(39, 40, 50, 0.60);
          letter-spacing: -0.55px;
          font-weight: 400;
          line-height: 112rpx;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;

          .user-img {
            width: 54px;
            height: 54px;
            border-radius: 10px;
          }
        }

        .more {
          flex: none;
          width: 80rpx;
          height: 112rpx;
          display: flex;
          align-items: center;

          image {
            width: 16rpx;
            height: 28rpx;
          }

        }
      }
    }

    .bt2 {
      text-align: center;
      margin-top: 160rpx;
      font-family: PingFangSC-Regular;
      font-size: 16px;
      color: #FF5D5B;
      letter-spacing: -0.55px;
      font-weight: 400;
      line-height: 44rpx;
    }
  }

  .modify {
    position: absolute;
    top: -1000px;
    z-index: 100;
    width: 100%;
    height: 100%;
    background-color: #FFFFFF;

    .modify-header {
      width: 100%;
      height: 88rpx;
      padding-top: var(--status-bar-height);
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;

      .close {
        font-family: PingFangSC-Regular;
        font-size: 16px;
        color: #272832;
        padding-left: 32rpx;
        line-height: 88rpx;
      }

      .title {
        font-family: PingFangSC-Regular;
        font-size: 20px;
        color: #272832;
        line-height: 88rpx;
      }

      .define {
        font-family: PingFangSC-Regular;
        font-size: 16px;
        color: #272832;
        padding-right: 32rpx;
        line-height: 88rpx;
      }
    }

    .modify-main {
      display: flex;
      flex-direction: column;
      justify-content: center;
      margin-top: 20rpx;

      .modify-pwd {
        background: #F3F4F6;
        border-radius: 20rpx;
        font-family: PingFangSC-Regular;
        font-size: 16px;
        color: #272832;
        background: #dfe0e1;
        line-height: 88rpx;
        margin: 10rpx 20rpx;
        padding: 10rpx 32rpx;
        width: 686rpx;
      }

      .modify-content {
        margin: 10rpx 20rpx;
        width: 686rpx;
        height: 386rpx;
        background: #dfe0e1;
        border-radius: 20rpx;
        font-family: PingFangSC-Regular;
        font-size: 16px;
        color: #272832;
        padding: 10rpx 32rpx;
        line-height: 44rpx;
      }
    }
  }
</style>
