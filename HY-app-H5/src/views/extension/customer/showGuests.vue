<template>
  <div class="common-page">
    <top-bar :needWhite="true" :back="true" title="带客看房"></top-bar>
    <img class="top-bg" :src="$baseImgUrl + '/extension/top-bg.png'" alt />
    <div class="common-page-container" :style="{height: pageContainerHeight}">
      <div class="content">
        <div class="qrcode-wrap">
          <canvas id="canvasBox" class="canvas"></canvas>
          <div class="split">
            <div class="split-line"></div>
            <div class="left-radius"></div>
            <div class="right-radius"></div>
          </div>
          <section class="info">
            <p class="name text">{{customerData.customerName}}</p>
            <p class="tel text">
              <i class="iconfont icondianhua"></i>
              {{customerData.customerTel}}
            </p>
            <p class="text">报备项目：{{customerData.projectName}}</p>
            <p class="text">报备时间：{{customerData.reportDate}}</p>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import QrCodeWithLogo from 'qr-code-with-logo'
import API from '@/request/api/selfExtension/customer'
import TopBar from '@c/TopBar'
export default {
  name: 'customerFollow',
  components: {
    TopBar
  },
  data() {
    return {
      customerId: '',
      customerData: {}
    }
  },
  created() {
    this.customerId = this.$route.query.clueId
  },
  mounted() {
    this.draw()
    this.getCustomerDetail()
  },
  methods: {
    getCustomerDetail() {
      API.customerDetail({
        clueId: this.customerId
      }).then(res => {
        this.customerData = res
      })
    },
    draw() {
      const myCanvas = document.getElementById('canvasBox')
      QrCodeWithLogo.toCanvas({
        canvas: myCanvas,
        width: 345,
        content: `2:${this.customerId}`,
        logo: {
          src: this.$baseImgUrl + '/scan-logo.png',
          bgColor: 'transparent',
          logoSize: 0.2,
          borderRadius: 0,
          logoRadius: 2,
          borderSize: 0
        },
        nodeQrCodeOptions: {
          margin: 3
        }
      })
    }
  }
}
</script>
<style scoped lang="less">
.common-page {
  .top-bg {
    position: fixed;
    width: 100%;
    height: 286px;
    top: 0;
  }
  .common-page-container {
    background: @bg-color;
    .content {
      position: relative;
      padding: 4px 15px 0;
      display: flex;
      justify-content: center;
      .qrcode-wrap {
        //width: 345px;
        background: #fff;
        box-shadow: 0px 4px 8px 0px rgba(19, 41, 83, 0.05);
        border-radius: 4px;
      }
    }
    .canvas {
      margin-top: 4px;
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
}
</style>
