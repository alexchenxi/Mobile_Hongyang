<template>
  <div class="common-page">
    <top-bar :backPath="backPath" :title="currentRole.moduleId ? '角色切换' : '选择角色'" @back="back" />
    <div class="common-page-container" :style="{height: pageContainerHeight}">
      <van-image
        class="avatar-img"
        round
        fit="cover"
        width="140px"
        height="140px"
        :src="user.avatar ? user.avatar : $baseImgUrl + '/default-avatar.png'"
      />
      <p class="tip">{{ currentRole.moduleId ? '您当前身份' : '请选择角色身份' }}</p>
      <p class="role-name" v-if="currentRole.moduleId">{{ currentRole.roleName }}</p>
      <section class="role-type">
        <van-button
          class="role-btn"
          v-for="item in roleList"
          :key="item.id"
          round
          block
          type="save"
          @click="selectRole(item)"
        >{{currentRole.moduleId ? '切换为“'+item.name+'”':item.name}}</van-button>
      </section>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import TopBar from '@c/TopBar'
import { roleMixin } from '@/views/mixin/role.js'
export default {
  name: 'switchRoles',
  mixins: [roleMixin],
  components: {
    TopBar
  },
  computed: {
    ...mapGetters(['currentRole', 'user']),
    roleList: function() {
      return this.$store.getters.roleList.filter(x => x.id !== this.$store.getters.currentRole.id)
    }
  },
  data() {
    return {
      backPath: ''
    }
  },
  created() {
	  if(!this.currentRole.moduleId) {
		  this.backPath = '/login'
	  }
  },
  mounted() {},
  methods: {
    //   选择角色
    async selectRole(item) {
      this.$store.dispatch('user/setCurrentRole', item)
      this.handleMenu(item)
    },
    back() {
        this.$router.replace({
            path: this.backPath
        }).catch(()=>{})
    }
  },
}
</script>

<style scoped lang="less">
.common-page-container {
  text-align: center;
  .avatar-img {
    margin-top: 60px;
  }
  .tip {
    margin-top: 24px;
    color: #999;
    font-size: 12px;
  }
  .role-name {
    margin-top: 12px;
    font-size: 16px;
    color: @header-text-color;
    font-weight: 600;
  }
  .role-type {
    padding: 60px 50px 0;
    .role-btn {
      margin-bottom: 24px;
    }
  }
}
</style>
