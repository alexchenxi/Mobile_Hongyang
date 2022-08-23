<template>
    <div class="common-page">
        <TopBar :back="false" title="客户">
            <span slot="append-suffix" v-code="['ST.CUSTOMER.BUTTON', 'ST.CUSTOMER.BUTTON.ASSIGN']" class="distribution iconfont iconfenpei" @click="assignCustomer"></span>
        </TopBar>
        <main class="common-page-middle" :style="{ height: pageMiddleHeight }">
            <div class="search-section">
                <search-bar placeholder="请输入客户姓名/手机号" readonly @focus="onFocus"></search-bar>
            </div>
            <section>
                <div v-for="item in list" :key="item.code" class="info" @click="goCustomer(item)">
                    <div class="info-left">
                        <img class="img" :src="$baseImgUrl + '/case/customer/' + item.checkedIconName" />
                        {{ item.name }}
                    </div>
                    <div class="info-right">
                        {{ item.count }}
                        <van-icon name="arrow" color="#CCCCCC" size="12" />
                    </div>
                </div>
            </section>
        </main>
        <div v-code="['ST.CUSTOMER.BUTTON', 'ST.CUSTOMER.BUTTON.RECOMMEND']" class="call-enter" :style="{ marginBottom: bottomSafe }" @click="callEnter">
            <img :src="$baseImgUrl + '/case/customer/case-register.png'" />
        </div>
        <tab-bar active="/case/customer" :tab-data="tabData" />
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import TopBar from '@c/TopBar'
import TabBar from '@c/TabBar'
import SearchBar from '@c/SearchBar'
import API from '@/request/api/caseSystem/customer'
export default {
    name: 'Index',
    components: {
        TabBar,
        TopBar,
        SearchBar
    },
    data() {
        return {
            list: []
        }
    },
    computed: { ...mapGetters(['tabData', 'menuActive', 'projectId', 'currentRole']) },
    watch: {},
    created() {
        this.init()
    },
    methods: {
        //   搜索
        onFocus() {
            // 保存客户搜索类型
            this.$store.dispatch('other/setSearchCustomerListType', 'customer')
            this.$store.dispatch('other/setSearchCustomerType', '')
            this.$router
                .push({
                    path: '/searchHistory',
                    query: {
                        type: 0
                    }
                })
                .catch(() => {})
        },
        async init() {
            let childrenList = this.menuActive.childrenList.filter(x => x.code !== 'ST.CUSTOMER.BUTTON')
            this.$utils.loading()
            let res = await this.getTotalList(childrenList.map(x => x.code))
            this.$toast.clear()
            for (let elem of childrenList) {
                elem.count = res[elem.code]
            }
            let zygw = {
                'ST.CUSTOMER.TOTAL': '全部客户',
                'ST.CUSTOMER.OVERDUE': '逾期客户',
                'ST.CUSTOMER.FAV': '重点客户',
                'ST.CUSTOMER.PUBLIC': '公客池',
                'ST.CUSTOMER.INPUT': '销售登记',
                'ST.CUSTOMER.FOLLOWING': '到访客户',
                'ST.CUSTOMER.NOVISIT': '全民营销客户'
            }
            if(this.currentRole.roleCode === 'ST_SALES') {
                childrenList.forEach(item => {
                    if(zygw[item.code]) {
                        item.name = zygw[item.code]
                    }
                })
            }
            this.list = childrenList
        },
        // 获取客户类型统计数据
        async getTotalList(menuIds) {
            return API.getClientTotalList({
                projectId: this.projectId,
                roleCode: this.currentRole.roleCode,
                menuIds: menuIds
            }).then(res => {
                return res
            })
        },
        // 跳转客户页面
        goCustomer(item) {
            let path = '/case/customerWithoutTab'
            // 带tab切换
            const pathObj = {
                'ST.CUSTOMER.INPUT': '/case/customerCaseRegister',
                'ST.CUSTOMER.FOLLOWING': '/case/customerWithTab',
                'ST.CUSTOMER.FAV': '/case/customerCollect',
                'ST.CUSTOMER.NOTPHONE': '/case/customerTook',
                'ST.CUSTOMER.PHONE': '/case/customerTook',
                'ST.CUSTOMER.YYKH': '/my/myReservation'
            }
            if (pathObj[item.code]) {
                path = pathObj[item.code]
            }

            this.$router
                .push({
                    path: path,
                    query: {
                        menuId: item.code
                    }
                })
                .catch(() => {})
        },
        //来电录入
        callEnter() {
            this.$router.push('/case/callEnter').catch(() => {})
        },
        // 分配客户
        assignCustomer() {
            this.$router.push('/case/assignCustomer').catch(() => {})
        }
    }
}
</script>
<style scoped lang="less">
.header {
    .distribution {
        font-size: 20px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #030303;
        position: absolute;
        right: 0;
    }
}
.common-page-middle {
    padding: 0 15px;
}
.info {
    padding: 15px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 15px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: @header-text-color;
    .info-left {
        display: flex;
        align-items: center;
        .img {
            margin-right: 10px;
            width: 45px;
            height: 45px;
            border-radius: 8px;
        }
    }
    .info-right {
        display: flex;
        align-items: center;
        .van-icon-arrow {
            margin-left: 10px;
        }
    }
}
.call-enter {
    position: fixed;
    right: 15px;
    bottom: calc(30px + @tab-bar-height);
    width: 66px;
    height: 66px;
    z-index: 3;
    img {
        width: 100%;
    }
}
</style>
