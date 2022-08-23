<template>
  <div class="common-page">
    <top-bar :needWhite="true" :back="true" title="二维码"></top-bar>
    <img class="top-bg" :src="$baseImgUrl+  '/extension/top-bg.png'" alt />
    <div class="common-page-container" :style="{height: pageContainerHeight}">
      <div class="content">
        <div class="qrcode-wrap">
          <p class="title">{{name}}</p>
          <canvas id="canvasBox" class="canvas"></canvas>
        </div>
        <van-button
          class="save-btn"
          round
          block
          type="save"
          native-type="submit"
          @click="saveImg"
        >保存二维码</van-button>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import QrCodeWithLogo from 'qr-code-with-logo'
import APICOMMON from '@/request/api/commonApi'
import TopBar from '@c/TopBar'
export default {
  name: 'customerFollow',
  components: {
    TopBar
  },
  data() {
    return {
      name: ''
    }
  },
  created() {
    this.name = this.$route.query.name
  },
  mounted() {
    this.draw()
  },
  computed: { ...mapGetters(['device']) },
  methods: {
    draw() {
      const myCanvas = document.getElementById('canvasBox')
      QrCodeWithLogo.toCanvas({
        canvas: myCanvas,
        content: `3:${this.$route.query.taskId}`,
        logo: {
          src: this.baseImgUrl + '/scan-logo.png',
          bgColor: 'transparent',
          logoSize: 0.2,
          borderRadius: 4
        },
        nodeQrCodeOptions: {
          margin: 3
        }
      })
    },
    // 保存图片
    saveImg() {
      document.getElementById('canvasBox').toBlob(blob => {
        var data = new FormData()
        // 装载图片数据
        data.append('file', blob, new Date().getTime() + '.png')
        APICOMMON.uploadFile(data).then(res => {
          this.$appMethods.DownloadImage(this.device,res)
        })
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
      .qrcode-wrap {
        height: 400px;
        background: #fff;
        box-shadow: 0px 4px 8px 0px rgba(19, 41, 83, 0.05);
        border-radius: 4px;
        .title {
          padding-top: 30px;
          font-size: 18px;
          font-weight: 500;
          text-align: center;
        }
      }
      .save-btn {
        margin-top: 40px;
      }
    }
    .canvas {
      width: 100% !important;
      height: 345px !important;
    }
  }
}
</style>