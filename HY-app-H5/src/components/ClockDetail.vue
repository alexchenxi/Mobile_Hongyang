<template>
  <div class="container">
    <p class="address">
      <img
        class="icon-location"
        :src="$baseImgUrl + '/extension/attendance/icon-location.png'"
      />
      {{info.locationName}}
    </p>
    <Map :id="id" :ref="id" :isEnableOperate="false" />
    <p class="title">现场照片</p>
    <img class="photo" :src="info.img" @click="preview" />
  </div>
</template>
<script>
import Map from '@c/Map'
export default {
  name: 'ClockDetail',
  components: {
    Map
  },
  props: {
    info: {
      type: Object,
      value: {}
    },
    id: {
      type: String,
      default: ''
    }
  },
  data() {
    return {}
  },
  watch: {
    info: {
      handler(newVal, oldVal) {
        if (newVal.locationName) {
          this.init(newVal)
        }
      },
      deep: true
    }
  },
  created() {},
  mounted() {
    this.init(this.info)
  },
  methods: {
    init(data) {
      this.$refs[this.id].initMap({
        lon: data.longitude,
        lat: data.latitude,
        address: data.locationName
      })
    },
    //预览图片
    preview() {
      this.$utils.previewImageList([this.info.img], 0)
    }
  }
}
</script>
<style scoped lang="less">
.container {
  padding: 15px;
  background: #fff;
  border-radius: 0 0 8px 8px;
}
.icon-location {
  width: 10px;
  height: 12px;
  margin-right: 6px;
}
.title {
  margin-top: 15px;
  font-size: 16px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: @header-text-color;
  line-height: 45px;
}
.address {
  margin-bottom: 18px;
}
.photo {
  height: 177px;
  width: 100%;
  border-radius: 2px;
}
</style>