<template>
    <div class="common-page">
        <TopBar title="联名客户">
        </TopBar>
        <main class="common-page-container" :style="{ height: pageContainerHeight }">
            <section class="customer-container">
                <van-list v-model="loading" :finished="finished" :finished-text="finishedText" @load="onLoad" offset="20" :immediate-check="false">
                    <template v-for="(item, index) in formData">
                        <div class="card-list">
                            <van-form input-align="right">
                                <van-cell :title="'联名客户'+ (index +1)">
                                    <!-- 使用 right-icon 插槽来自定义右侧图标 -->
                                    <template #right-icon>
<!--                                        <div class="right-btn">联名转客户</div>-->
                                        <div class="right-btn" @click="editCustomer(item, index+1)">修改</div>
                                    </template>
                                </van-cell>
                                <van-field
                                    v-model="item.name"
                                    label="姓名"
                                />
                                <van-field
                                    v-model="item.gender"
                                    label="性别"
                                />
                                <van-field
                                    v-model="item.tel"
                                    label="电话"
                                />
                                <van-field
                                    v-if="item.relationType"
                                    v-model="item.relationType"
                                    label="与主客户关系"
                                />
                                <van-field
                                    v-if="item.idType"
                                    v-model="item.idType"
                                    label="证件类型"
                                />
                                <van-field
                                    v-if="item.idNo"
                                    v-model="item.idNo"
                                    label="证件号码"
                                />
                                <van-field
                                    v-if="item.address"
                                    v-model="item.address"
                                    label="联系地址"
                                />
                                <van-field
                                    v-if="item.addressDetail"
                                    v-model="item.addressDetail"
                                    label="详细地址"
                                />
                            </van-form>
                        </div>
                    </template>
                </van-list>
            </section>
        </main>
        <div class="common-fix-bottom" :style="{ paddingBottom: bottomSafe }" v-if="formData && formData.length < 4">
            <van-button round block type="save" native-type="submit" v-debounce="[()=>addJointCustomers()]">新增联名客户</van-button>
        </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import TopBar from '@c/TopBar'
import API from '@/request/api/caseSystem/customer'

export default {
    name: 'jointCustomers',
    components: {
        TopBar
    },
    data() {
        return {
            codeType: 'ST.CUSTOMER.FAV',
            loading: false,
            finished: false,
            finishedText: '没有更多了',
            activeNames: [],
            showCollapse: false,
            pageNum: 1,
            pageSize: 10,
            customerList: [],
            subsalesList: [],
            refresh: false,
            formData:[],
            idTypeMap: {
                '0': '身份证',
                '1': '营业执照',
                '2': '港澳台通行证'
            },
            relationTypeMap: {
                '0': '夫妻',
                '1': '子女'
            },
        }
    },
    computed: { ...mapGetters(['projectId', 'currentRole', 'keepAliveList']) },
    created() {
        this.initParams()
        this.getList()
    },
    activated() {
        if (this.refresh) {
            this.loading = true
            this.finished = false
            this.getList()
            this.refresh = false
        }
    },
    methods: {
        initParams() {
            this.loading = true
            this.finished = false
        },
        onLoad() {
            if (this.finished) return
            this.getList()
        },
        //客户详情
        goDetail(item) {
            if(item.firstChannelCode === 'C04') {
                this.$router.push({
                    path: '/case/customerCaseRegisterDetail',
                    query: {
                        oppId: item.oppId,
                        clientId: item.clientId,
                        clueId: item.clueId,
                        menuId: 'ST.CUSTOMER.INPUT'
                    }
                }).catch(()=>{})
            }else {
                this.$router.push({
                    path: '/case/customerDetail',
                    query: {
                        oppId: item.oppId,
                        clientId: item.clientId,
                        clueId: item.clueId,
                        menuId: item.menuId
                    }
                }).catch(()=>{})
            }

        },
        getList() {
            this.loading = true
            API.getJointCustomer(this.$route.query.customerId).then(res => {
                this.formData = (res || []).map(item => {
                    return {
                        ...item,
                        relationType: this.relationTypeMap[item.relationType],
                        idType: this.idTypeMap[item.idType]
                    }
                })
                if (!res?.length) {
                    // 如果是第一次新增联名客户，排序字段默认为0
                    localStorage.setItem('addJointCustomer', 0)
                }

            }).finally(() => {
                this.loading = false
                this.finished = true
            })
        },
        editCustomer(item, index) {
            const formatItem = JSON.stringify(item)
            localStorage.setItem('addJointCustomer', index)
            this.$router
                .push({
                    path: '/case/addJointCustomers',
                    query: {
                        type: 'edit',
                        customerId: this.$route.query.customerId,
                        oppId: this.$route.query.oppId,
                        formatItem
                    }
                })
        },
        addJointCustomers() {
            if(this.formData.length > 3) return
            this.$router
                .push({
                    path: '/case/addJointCustomers',
                    query: {
                        type: 'add',
                        customerId: this.$route.query.customerId,
                        oppId: this.$route.query.oppId
                    }
                })
        }
    },
    watch: {},
    beforeRouteEnter(to, from, next) {
        next(vm => {
            var array = vm.keepAliveList || []
            if (array.indexOf('customerWithoutTab') === -1) {
                array.push('customerWithoutTab')
                vm.$store.dispatch('other/setKeepAlive', array)
            }
            if (from.path.includes('/case/customerDetail')) {
                vm.refresh = true
            }
        })
    },
    beforeRouteLeave(to, from, next) {
        var array = this.keepAliveList
        if (!to.path.includes('/case/customerDetail')) {
            array = array.filter(item => {
                return item !== 'customerWithoutTab'
            })
            this.$store.dispatch('other/setKeepAlive', array)
        }
        next()
    }
}
</script>
<style scoped lang="less">
/deep/ .head-container {
    .head-c {
        position: absolute;
        width: 100%;
        z-index: 1;
    }
    .head-l,
    .head-r {
        position: relative;
        z-index: 2;
    }
    .iconsousuo {
        font-size: 19px;
        margin-left: 30px;
    }
    .iconfenpei {
        font-size: 20px;
    }
    .top-action {
        font-size: 15px;
        color: @theme-color;
        font-weight: 500;
    }
}
.common-page-container {
    .filter-container {
        height: 40px;
        padding: 0 18px;
        .common-flex-between();
        align-items: stretch;
        .right-section {
            .common-flex();
            .filter-section {
                margin-left: 40px;
            }
        }
        /deep/ .van-dropdown-menu__title,
        .switch-button {
            font-size: 14px;
            color: @header-text-color;
            font-weight: 400;
        }
        .switch-button {
            span {
                padding-right: 3px;
                font-size: 14px;
            }
        }
    }
    .customer-container {
        height: calc(100% - 40px);
        background: @bg-color;
        overflow: auto;
        /deep/ .van-list {
            height: 100%;
            overflow: auto;
            .card-list {
                padding: 0;
                margin-bottom: 10px;
                .right-btn {
                    padding: 0px 10px;
                    font-size: 12px;
                    border-radius: 20px;
                    background: #DB0826;
                    color: #fff;
                    margin-left: 10px;
                }
            }
        }
    }
}
/deep/ .common-fix-bottom {
    padding: 0 18px;
}
</style>
