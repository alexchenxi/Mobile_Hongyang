<template>
  <div class="common-page">
    <TopBar :back="true" :needWhite="true"></TopBar>
    <div :style="{height: pageContainerHeight}">
      <img class="text" :src="$baseImgUrl + '/case/reception-record/text.png'" />
      <div class="content">
        <img class="icon-chapter" :src="$baseImgUrl + '/case/reception-record/icon-chapter.png'" />
        <p class="label reception-duration-label">本次接待时长</p>
        <p class="reception-duration">
          <span class="value">{{baseInfo.receptionTime}}</span>分钟
        </p>
        <div class="reception-info">
          <div class="item">
            <p class="label">今日总时长</p>
            <p>
              <span class="value">{{baseInfo.receptionTotalTime}}</span>分钟
            </p>
          </div>
          <div class="item">
            <p class="label">接待数量</p>
            <p>
              <span class="value">{{baseInfo.receptionTotalCount}}</span>组
            </p>
          </div>
          <div class="item">
            <p class="label">平均时长</p>
            <p>
              <span class="value">{{baseInfo.receptionAverageTime}}</span>分钟
            </p>
          </div>
        </div>
        <img v-if="baseInfo.appraiseQrcode" class="qrcode" :src="baseInfo.appraiseQrcode" />
        <p v-if="baseInfo.appraiseQrcode" class="code-tip">微信扫一扫 评价</p>
      </div>
    </div>
  </div>
</template>
<script>
import TopBar from '@c/TopBar'
import API from '@/request/api/caseSystem/customer.js'
import { mapGetters } from 'vuex'
export default {
  name: 'receptionRecord',
  components: {
    TopBar
  },
  data() {
    return {
      baseInfo: {}
    }
  },
  created() {
    this.getReceptionServiceSummary()
  },
  computed: { ...mapGetters(['projectId','currentRole','user']),
		},
  methods: {
    getReceptionServiceSummary() {
      let params = {
        recordId: this.$route.query.recordId,
        type: Number(this.$route.query.type),
        projectId: this.projectId,
        staffId: this.user.id
      }
      API.getReceptionServiceSummary(params).then(res=>{
        this.baseInfo = res
      })
    }
  }
}
</script>
<style lang="less" scoped>
.common-page {
  background-image: url("@{baseImgUrl}/case/reception-record/right-top-bg.png"), url("@{baseImgUrl}/case/reception-record/left-bottom-bg.png"), linear-gradient(315deg, #5f95fa 0%, #4183ff 100%);
  background-position: right top, left bottom, center center;
  background-repeat: no-repeat, no-repeat, no-repeat;
  background-size: 200px 253px, 130px 214px, 100% 100%;
}
.text {
  height: 80px;
  margin-left: 30px;
  margin-top: 15px;
}
.content {
  padding: 10px 25px 75px 25px;
  position: relative;
  min-height: 350px;
  background: url("@{baseImgUrl}/case/reception-record/info-bg.png");
  background-size: 100% 100%;
  text-align: center;
  .icon-chapter {
    position: absolute;
    width: 99px;
    height: 99px;
    right: 30px;
    top: 10px;
  }
  .label {
    font-size: 15px;
    font-family: PingFangSC-Regular, PingFang SC;
    color: #999999;
    line-height: 15px;
  }
  .value {
    font-size: 24px;
    font-family: DINAlternate-Bold, DINAlternate;
    font-weight: bold;
    color: #333333;
    line-height: 24px;
  }
  .reception-duration-label {
    margin-top: 65px;
  }
  .reception-duration {
    margin: 15px 0 30px 0;
    .value {
      font-size: 68px;
      line-height: 68px;
    }
  }
  .reception-info {
    display: flex;
    .item {
      text-align: center;
      flex: 1;
      .label {
        margin-bottom: 10px;
      }
    }
  }
  .qrcode {
    margin-top: 32px;
    width: 130px;
    height: 130px;
  }
  .code-tip {
    margin-top: 15px;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #333333;
    line-height: 14px;
  }
}
</style>