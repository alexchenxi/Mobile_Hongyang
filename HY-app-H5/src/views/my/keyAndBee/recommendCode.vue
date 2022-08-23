<template>
  <div class="common-page">
    <top-bar :title="'报备二维码'" />
    <div class="common-page-container" :style="{height: pageContainerHeight}">
      <div class="content">
        <div class="qrcode-wrap">
          <div class="qrcode">
            <div ref="qrcodeBox" id="qrcodeBox"></div>
          </div>
          <p class="code-remark">{{userType === 6 ? "关键人" : "小蜜蜂"}}邀请码</p>
          <div class="split">
            <div class="split-line"></div>
            <div class="left-radius"></div>
            <div class="right-radius"></div>
          </div>
          <section class="info">
            <p class="name text">{{user.name}}</p>
            <p class="tel text" v-if="user.tel">
              <i class="iconfont icondianhua"></i>
              {{user.tel}}
            </p>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import TopBar from '@c/TopBar'
import QRCode from 'qrcodejs2'
import API from '@/request/api/selfExtension/keyAndBee'
import APICOMMON from '@/request/api/commonApi'
export default {
  name: 'recommendCode',
  components: {
    TopBar
  },
  computed: {
    ...mapGetters(['currentRole', 'user'])
  },
  data() {
    return {
      qrcode: null,
      userType: null
    }
  },
  created() {
    this.userType = Number(this.$route.query.userType) // 6关键人 7小蜜蜂
  },
  mounted() {
    let leaderRoleCode = this.currentRole.roleCode,
      leaderId = this.user.id
      let text = ''
    if(this.isSAAS) {
        let name = APICOMMON.apiBase()
        let src = name.slice(0,name.indexOf('saasgw'))
        text = `${src}web/#/register?leaderRoleCode=${leaderRoleCode}&leaderId=${leaderId}&userType=${this.userType}&companyNo=${localStorage.companyNo}`
    }else {
        text = `${APICOMMON.apiBase()}/web/#/register?leaderRoleCode=${leaderRoleCode}&leaderId=${leaderId}&userType=${this.userType}`
    }
    this.qrcode = new QRCode(document.getElementById('qrcodeBox'), {
      text: text,
      width: this.$refs.qrcodeBox.clientWidth || 285,
      height: 293,
      colorDark: '#000000',
      colorLight: '#ffffff'
    })
  },
  methods: {}
}
</script>
<style scoped lang="less">
.common-page-container {
  background: @bg-color;
  .content {
    position: relative;
    padding: 15px 15px 0;
    display: flex;
    justify-content: center;
    .qrcode-wrap {
      width: 345px;
      background: #fff;
      box-shadow: 0px 4px 8px 0px rgba(19, 41, 83, 0.05);
      border-radius: 4px;
    }
    .code-remark {
      margin: 24px 0 26px;
      text-align: center;
      font-size: 15px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #333333;
      line-height: 15px;
    }
  }
  .qrcode {
    padding: 30px 30px 0;
  }
  .split {
    position: relative;
    .split-line {
      border-bottom: 1px dashed #e5e4e4;
    }
    .left-radius,
    .right-radius {
      width: 16px;
      height: 16px;
      top: -8px;
      border-radius: 50%;
      background: @bg-color;
      position: absolute;
    }
    .left-radius {
      left: -8px;
    }
    .right-radius {
      right: -10px;
    }
  }
  .info {
    padding: 25px 30px;
    text-align: left;
    .text {
      font-size: 15px;
      color: #999999;
      line-height: 30px;
    }
    .name {
      font-size: 18px;
      font-weight: 500;
      color: #333;
    }
    .tel {
      color: #666;
      font-size: 18px;
      font-weight: bold;
      .icondianhua {
        margin-right: 7px;
        color: @theme-color;
      }
    }
  }
}
</style>
