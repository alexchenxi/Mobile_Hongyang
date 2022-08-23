<template>
    <div class="common-page">
        <div class="common-page-content" :style="{ height: pageContentHeight }">
            <div class="top-img-container" :style="{ paddingTop: topSafe }">
                <div class="customer-info">
                    <img v-if="!!userData.avatar" class="avatar" :src="userData.avatar" alt="" @click="$router.push('my/userInfo')" />
                    <img v-else class="avatar" :src="$baseImgUrl + '/default-avatar.png'" alt="" @click="$router.push('my/userInfo')" />
                    <div class="user-name">{{ userData.name }}</div>
                    <div class="user-account">账号：{{ userData.account }}</div>
                </div>
            </div>
            <div class="nav-section">
                <van-cell v-if="roleList.length > 1" title="角色切换" is-link :value="currentRole.roleName" to="my/switchRoles">
                    <template #icon>
						<!-- <i class="iconfont iconjiaoseqiehuan"></i> -->
						<img class="img-icon" :src="$baseImgUrl + '/case/my/icon-role.png'">
					</template>
                </van-cell>
                <template v-for="item in menuActive.childrenList">
                    <van-cell :value="item.name==='消息中心'&&messageNum>0?messageNum:''" :key="item.code" :title="item.name" is-link :to="item.url">
                        <template #icon><i class="iconfont" :class="item.checkedIconName"></i></template>
                    </van-cell>
                </template>
                <van-cell v-if="currentRole.roleCode === 'ZT_MANAGER'" is-link to="my/toDoCenterMiddlePage">
                    <template #title>
                        <span>待办中心</span><span v-if="toDoCount">（{{ toDoCount }}）</span>
                    </template>
                    <template #icon><i class="iconfont iconchengyuanguanli icontodo iconbiaoqian"></i></template>
                </van-cell>
                <van-cell v-if="currentRole.roleCode === 'ZT_MANAGER' || currentRole.roleCode === 'ZT_DIRECTOR'" is-link to="extension/myMessage">
                    <template #title>
                        <span>消息中心</span>
                    </template>
                    <template #icon>
						<!-- <i class="iconfont iconchengyuanguanli icontodo iconxiaoxizhongxin"></i> -->
						<img class="img-icon" :src="$baseImgUrl + '/case/my/icon-msg.png'">
					</template>
                    <template #right-icon>
                        <!-- <i class="iconfont iconchengyuanguanli icontodo iconxiaoxizhongxin"></i> -->
                        <van-badge :content="msgCount" max="99">
                            <div class="child"/>
                        </van-badge>
                        <van-icon name="arrow" style="margin-left: 10px" color="#ccc"/>
                    </template>
                </van-cell>
                <van-cell v-if="currentRole.roleCode === 'ZT_DIRECTOR' || currentRole.roleCode === 'ZT_MEMBER'" @click="handleGoBroker">
                    <template #title>
                        <span>自渠下线经纪人</span>
                    </template>
                    <template #icon><i class="iconfont iconchengyuanguanli icontodo iconbiaoqian"></i></template>
                    <template #right-icon>
                        <van-icon name="arrow" style="margin-left: 10px" color="#ccc"/>
                    </template>
                </van-cell>
                <van-cell v-if="currentRole.roleCode === 'ZT_MANAGER'" is-link to="my/agent/foldList">
                    <template #title>
                        <span>自渠下线经纪人</span>
                    </template>
                    <template #icon><i class="iconfont iconchengyuanguanli icontodo iconbiaoqian"></i></template>
                    <template #right-icon>
                        <van-icon name="arrow" style="margin-left: 10px" color="#ccc"/>
                    </template>
                </van-cell>
                <van-cell v-if="currentRole.roleCode === 'ZT_DIRECTOR' || currentRole.roleCode === 'ZT_MEMBER'" is-link to="my/myQrCode">
                    <template #title>
                        <span>我的邀请码</span>
                    </template>
                    <template #icon>
						<!-- <i class="iconfont iconerweima"></i> -->
						<img class="img-icon" :src="$baseImgUrl + '/case/my/icon-yaoqingma.png'">
					</template>
                </van-cell>
                <van-cell v-if="currentRole.roleCode === 'ST_SALES'" is-link to="my/maintainTag">
                    <template #title>
                        <span>我的标签</span>
                    </template>
                    <template #icon>
						<img class="img-icon" :src="$baseImgUrl + '/case/my/icon-biaoqian.png'">
					</template>
                </van-cell>
<!--                <van-cell v-if="currentRole.roleCode === 'ST_SALES'" is-link to="my/myReservation">-->
<!--                    <template #title>-->
<!--                        <span>线上预约</span>-->
<!--                    </template>-->
<!--                    <template #icon>-->
<!--						<img class="img-icon" :src="$baseImgUrl + '/case/my/icon-yuyue.png'">-->
<!--					</template>-->
<!--                </van-cell>-->
                <van-cell is-link to="my/modifyPassword" v-if="user.tel">
                    <template #title>
                        <span>修改密码</span>
<!--                        <span v-if="needModify === 'true'" class="tip">当前密码安全等级较低</span>-->
                    </template>
                    <template #icon>
						<!-- <i class="iconfont iconxiugaimima"></i> -->
						<img class="img-icon" :src="$baseImgUrl + '/case/my/icon-password.png'">
					</template>
                </van-cell>
                <van-cell title="关于" :value="version">
                    <template #icon><i class="iconfont iconguanyu"></i></template>
                </van-cell>
            </div>
            <div class="logout" @click="logout">退出登录</div>
        </div>
        <tab-bar active="/my" :tab-data="tabData" />


        <van-popup v-model="show" get-container="body">
            <van-button type="danger" block size="small" style="margin-bottom: 10px" @click="$router.push({path:'my/agent/list'})">查看本人的自渠下线经纪人</van-button>
            <van-button type="danger" block size="small" @click="$router.push({path:'my/agent/foldList'})">查看专员的自渠下线经纪人</van-button>
        </van-popup>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import TabBar from '@c/TabBar'
import { commonData } from '@/config/commonData'
import API from '@/request/api/my.js'
import MESSAGEAPI from '@/request/api/my'
import versionQa from '../../../versionQa.json'
import versionProd from '../../../versionProd.json'
export default {
    name: 'My',
    components: {
        TabBar
    },
    data() {
        return {
            userData: {},
            teamUserRoleList: [],
            toDoCount: 0,
            msgCount: 0,
            version: '1.0.0',
            needModify: '',
            messageNum:0,
            show:false
        }
    },
    computed: { ...mapGetters(['projectId','tabData', 'user', 'roleList', 'currentRole', 'menuActive']) },
    created() {
        if (!this.menuActive.url.includes('/my')) {
            this.$store.dispatch(
                'menu/setTabActice',
                this.tabData.find(x => x.url === '/my')
            )
        }
        this.needModify = localStorage.needModify
    },
    mounted() {
        this.version = process.env.VUE_APP_TYPE === 'prod' ? versionProd.version : versionQa.version
        this.getUserInfo()
        if (this.isSAAS) {
            this.serviceVersion()
        }
        if (this.currentRole.roleCode === 'ZT_MANAGER') {
            this.getToDoCount()
        }

        if (['ZT_DIRECTOR', 'ZT_MANAGER'].includes(this.currentRole.roleCode)) {
            this.getMsgTotal()
        }
        if (this.currentRole.roleCode.indexOf('ST')>-1) {
            this.getMessageCount()
        }
        this.teamUserRoleList = commonData.teamViewRoleList
    },
    methods: {
        getUserInfo() {
            this.userData = this.user
        },
        getMsgTotal() {
            API.selfChannelMessageList({ roleCode: this.currentRole.roleCode }).then((res) => {
                this.msgCount = res?.total
            })
        },
        getToDoCount() {
            API.selfChannelMyUnbindApplicationCount({
                projectId: this.projectId
            }).then(res => {
                this.toDoCount = res.total
                sessionStorage.setItem('toDoCountInfo',res)
            })
        },
        logout() {
            this.$dialog
                .confirm({
                    title: '',
                    message: '确认退出当前账号'
                })
                .then(() => {
                    // on close
                    this.logOutConfirm()
                })
                .catch(() => {
                    // on cancel
                })
        },
        //退出登录操作
        logOutConfirm() {
            if (localStorage.getItem('caseCustomerSearchHistory')) {
                localStorage.removeItem('caseCustomerSearchHistory')
            } else if (localStorage.getItem('extensionCustomerSearchHistory')) {
                localStorage.removeItem('extensionCustomerSearchHistory')
            }
            localStorage.setItem('isAutoLogin', false)
            localStorage.removeItem('caseCustomerTagHistory')
            sessionStorage.setItem('toDoCountInfo', {})
            // 退出时清空首页项目索引
            this.$store.dispatch('other/setProjectListIndex', [])
            this.$router.replace({ path: '/login' }).catch(() => {})
        },
        // 获取版本信息
        serviceVersion() {
            API.serviceVersion().then(res => {
                this.version = res.version
            })
        },
        getMessageCount(){
            API.messageNum().then(res => {
                this.messageNum = res
            })
        },
        handleGoBroker() {
            const role = this.currentRole.roleCode

            if (role === 'ZT_MEMBER') {
                this.$router.push({
                    path:'my/agent/list'
                })
            }
            else if (role === 'ZT_MANAGER') {
                this.$router.push({
                    path:'my/agent/foldList'
                })
            }
            else {
                this.show = true
            }
        }
    }
}
</script>
<style scoped lang="less">
/deep/ .van-cell__value {
    color: @header-text-color;
}

/deep/ .van-cell {
    color: @header-text-color;
    font-size: 15px;
    padding: 18px 15px;
	align-items: center;
}
/deep/ .van-cell__title .tip {
    margin-left: 10px;
    color: @danger-color;
    font-size: 12px;
}
.van-popup{
    width: 80% !important;
    padding: 10px;
}
.iconfont {
    margin-right: 10px;
}
.iconjiaoseqiehuan,
.iconxiaomifeng {
    color: @warning-color;
}

.iconxiaoxizhongxin {
    color: @red-color;
}

.iconchengyuanguanli,
.iconwodekehu {
    color: @blue-color;
}

.icontodo{
    color: @theme-color;
}
.iconwodeguanjianren,
.iconzhiyejihuashu,
.icondaikanquerendan {
    color: @light-green;
}

.iconxiugaimima,.iconbiaoqian
.iconguanyu {
    color: @success-color;
}
.iconerweima {
    color: #F55A29;
}
/deep/ .van-cell__value span{
     color: #eb6877;
     font-weight: 500;
     font-size: 15px;
}
.common-page {
    .common-page-content {
        background: @bg-color;
        .nav-section {
            border-radius: 10px 10px 0px 0px;
            margin-top: -10px;
            overflow: auto;
        }
        .logout {
            height: 56px;
            font-size: 18px;
            color: #eb6877;
            line-height: 60px;
            text-align: center;
            background: #fff;
            margin-top: 10px;
        }
    }
    .top-img-container {
        position: relative;
        background: url('@{baseImgUrl}/bg.png');
        background-size: 100% 100%;
        height: 236px;
        width: 100%;
        .customer-info {
            color: #fff;
            position: absolute;
            bottom: 36px;
            width: 100%;
            text-align: center;
            .avatar {
                width: 68px;
                height: 68px;
                border-radius: 50%;
                background: #5f95fa;
                border: 2px solid rgba(255, 255, 255, 0.5);
                object-fit: cover;
            }
            .user-name {
                margin-top: 18px;
                font-size: 20px;
                font-family: PingFangSC-Medium, PingFang SC;
                font-weight: 500;
                line-height: 20px;
            }
            .user-account {
                margin-top: 10px;
                font-size: 12px;
                line-height: 12px;
            }
        }
    }
    background: #fff;
}
.version-info {
    position: fixed;
    bottom: @tab-bar-height;
    width: 100%;
    color: #999999;
    text-align: center;
    padding-bottom: 10px;
}

.img-icon {
	width: 15px;
	height: 15px;
	margin-right: 10px;
}


</style>
