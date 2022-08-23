<template>
  <div class="common-page">
    <div class="common-page-top">
      <top-bar :back="true" title="任务签到详情"></top-bar>
    </div>
    <div class="common-page-container" :style="{height: pageContainerHeight}">
      <header class="header">
        <img v-if="infoData.avatar" class="avatar" :src="infoData.avatar" />
        <img
          v-if="!infoData.avatar"
          class="avatar"
          :src="$baseImgUrl + '/default-avatar.png'"
        />
        <div class="right-info">
          <div
            class="tag-item"
            :class="infoData.statusStr && infoData.statusStr.tagClass"
          >{{infoData.statusStr && infoData.statusStr.name}}</div>

          <p class="name">
            {{infoData.userName}}
            <span class="date">{{$route.query.date}}</span>
          </p>
          <p class="task-name">
            <span class="date">任务名称</span>
            {{infoData.taskName}}
          </p>
          <div class="time-tag">
            <van-icon size="18" class="to-work" name="checked" />打卡：
            <span class="time">{{infoData.clockAt}}</span>
          </div>
        </div>
      </header>
      <p class="title">打卡详情</p>
      <ClockDetail class="sign-detail" :info="infoData" id="mapBox"/>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import TopBar from '@c/TopBar'
import ClockDetail from '@c/ClockDetail'
import { getTaskStatus } from '@/config/commonData'
import API from '@/request/api/selfExtension/task'
export default {
  name: 'TaskSignDetail',
  components: {
    TopBar,
    ClockDetail
  },
  computed: { ...mapGetters(['projectId']) },
  data() {
    return {
      infoData: {
        userName: '朱琳娜',
        clockAt: '09:00',
        taskName: '创意产业园任务'
      }
    }
  },
  created() {
    this.infoData.statusStr = getTaskStatus(0)
    this.getDetail()
  },
  mounted() {},
  methods: {
    getDetail() {
      API.getClockDetail(this.$route.query.id).then(res => {
        this.infoData = res
        this.infoData.statusStr = getTaskStatus(res.taskStatus)
      })
    }
  }
}
</script>
<style scoped lang="less">
.common-page-container {
  background: @bg-color;
  padding: 0 15px;
  .header {
    position: relative;
    margin-top: 15px;
    margin-bottom: 15px;
    padding: 15px;
    background: #fff;
    border-radius: 8px;
    display: flex;
    .avatar {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      object-fit: cover;
    }
    .right-info {
      margin-left: 12px;
    }
    .name {
      font-size: 16px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: @header-text-color;
    }
    .task-name {
      margin-top: 6px;
      font-size: 13px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: @header-text-color;
    }
    .date {
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #999999;
    }
    .time-tag {
      margin-top: 6px;
      margin-right: 6px;
      width: 102px;
      display: flex;
      justify-content: center;
      align-items: center;
      background: #f5f6f7;
      border-radius: 4px;
      color: #999;
      padding: 4px 3px;
      font-size: 13px;
      .time {
        color: @header-text-color;
      }
    }
    .to-work {
      margin-right: 2px;
      color: @theme-color;
    }
  }
  .sign-detail {
    margin-bottom: 15px;
  }
}
.tag-item {
  display: inline-block;
  padding: 1px 11px;
  border-radius: 2px;
  font-size: 11px;
  position: absolute;
  top: 15px;
  right: 15px;
}
.title {
  background: #fff;
  font-size: 16px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: @header-text-color;
  line-height: 16px;
  padding: 24px 0 0 15px;
}
</style>