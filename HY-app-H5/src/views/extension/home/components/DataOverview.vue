<template>
  <div
    class="box"
    :class="info.class"
    @click="clickInfo(info)"
    v-if="info.show"
  >
    <img
      class="icon-data-status"
      :src="$baseImgUrl + '/extension/home/'+ info.checkedIconName"
    >
    <div class="info">
      <p class="title">
        {{ info.name }}<span :class="info.type === 1 ? 'count count-org' : 'count'">{{ info.taskNum }}</span>
      </p>
      <p>
        <span class="font-size-12" v-if="info.type === 1">
          您的目标是
          <span class="target">{{ info.targetNum }}</span>请加油!
        </span>
        <span class="font-size-12" v-if="info.type === 2">
          进度：
          <van-progress
            class="progress"
            color="#FAB55F"
            track-ccomplete-targetolor="#FEEBD3"
            :percentage="info.percent"
            :show-pivot="false"
          />
          <span class="progress-text">{{ info.percentStr }}%</span>
        </span>
        <span class="font-size-12" v-if="info.type === 3">
          目标到访：
          <span class="complete-target">{{ info.targetNum }}</span>
          已达成到访：
          <span class="real-count">{{ info.completeNum }}</span>
        </span>
        <span class="font-size-12" v-if="info.type === 4">
          结束已完成：
          <span class="complete-target">{{ info.completeNum }}</span>
          结束未完成：
          <span class="real-count">{{ info.targetNum }}</span>
        </span>
      </p>
    </div>
      <span class="iconfont iconiconrightarrow"></span>
  </div>
</template>
<script>
export default {
  name: 'DataOverview',
  props: {
    info: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {}
  },
  created() {},
  methods: {
    clickInfo(info) {
      this.$emit('clickInfo', info)
    }
  }
}
</script>
<style lang="less" scoped>
.box {
  border-radius: 4px;
  box-shadow: 0px 3px 10px 0px rgba(49, 51, 54, 0.06);
  height: 80px;
  padding: 25px 15px;
  display: flex;
  position: relative;
  align-items: center;
  box-sizing: border-box;
  .title {
      color: #333;
      font-size: 14px;
  }
  .icon-data-status {
    width: 24px;
    height: 24px;
    margin-right: 18px;
  }
  .info {
    display: flex;
    flex-direction: column;
    color: #999;
    .font-size-12 {
      font-size: 12px;
    }
    .title {
      font-size: 13px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      flex: 1;
    }
      .real-count {
          color: #FD7A3F;
      }
    .count {
      display: inline-block;
      margin-left: -3px;
      width: 78px;
      font-size: 21px;
      font-weight: bold;
      color: @header-text-color;
        margin-left: 12px;
    }
      .count-org {
          color: #FD7A3F;
      }
    .target {
      margin: 0 4px;
      font-weight: bold;
      font-size: 18px;
      color: #333;
    }
    .complete-target {
      margin-right: 12px;
      font-size: 18px;
      font-weight: bold;
      color: @header-text-color;
    }
    .real-count {
      font-size: 18px;
      font-weight: bold;
    }
  }
    .iconfont {
        color: #A9A9A9;
        font-size: 12px;
        position: absolute;
        right: 16px;
    }
  .bg {
    position: absolute;
    width: 132px;
    height: 50px;
    right: 0;
    top: 0
  }
}
.progress {
  display: inline-block;
  width: 85px;
  height: 5px;
  vertical-align: middle;
}
</style>
