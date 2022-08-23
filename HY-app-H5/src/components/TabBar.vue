<template>
  <div
    class="tab-bar"
    :style="{paddingBottom: bottomSafe}"
  >
    <div
      v-for="item in tabData"
      :key="item.name"
      class="tab-item"
      :class="{ active: active === item.url }"
      @click="toPath(item)"
    >
        <template v-if="item.name === '消息'">
            <van-badge :dot="isDot">
                <i
                    v-if="item.name!=='报表'&&item.name!=='拓客图'"
                    class="iconfont"
                    :class="active === item.url ? item.checkedIconName : item.uncheckedIconName"
                />
                <img
                    v-else
                    class="icon-img"
                    :src="active === item.url ?$baseImgUrl + '/extension/tabbar/'+item.checkedIconName+'.png':$baseImgUrl + '/extension/tabbar/'+item.uncheckedIconName+'.png'"
                >
            </van-badge>
        </template>
        <template v-else>
            <i
                v-if="item.name!=='报表'&&item.name!=='拓客图'"
                class="iconfont"
                :class="active === item.url ? item.checkedIconName : item.uncheckedIconName"
            />
            <img
                v-else
                class="icon-img"
                :src="active === item.url ?$baseImgUrl + '/extension/tabbar/'+item.checkedIconName+'.png':$baseImgUrl + '/extension/tabbar/'+item.uncheckedIconName+'.png'"
            >
        </template>
      <p>{{ item.name }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TabBar',
  props: {
    tabData: {
      type: Array,
      default: ()=>{
        return []
      }
    },
    active: {
      type: String,
      default: ''
    },
    isDot: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {}
  },
    mounted() {

    },
    methods: {
    toPath(item) {
      this.$router.replace({
        path: this.$store.getters.microPrefix + item.url,
      }).catch(()=>{})
      this.$store.dispatch('menu/setTabActice',item)
    }
  }
}
</script>

<style scoped lang="less">
.tab-bar {
  width: 100%;
  position: fixed;
  height: @tab-bar-height;
  background: #fff;
  bottom: 0;
  .common-flex-between();
  box-shadow: 0px -1px 4px 0px rgba(0, 0, 0, 0.04);
  .tab-item {
    flex: 1;
    .common-flex-column();
    height: 100%;
    color: #DEE1E6;
    &.active {
      color: @theme-color;
      i {
        color: @theme-color;
      }
    }

    i {
      font-size: 18px;
    }

    p {
      font-size: 12px;
      margin-top: 0px;
    }
    .iconbaobiao{

      &::before{
        content: '';
      }
    }
    .icon-img{
      width: 18px;
      height: 18px;
    }
  }
}
</style>
