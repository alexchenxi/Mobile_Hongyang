<template>
    <div class="common-page">
        <div class="common-page-middle">
            <div class="main-container">
                <div class="search-section" :style="{paddingTop: topSafe}">
                    <div class="back" @click="goBack"><i class="iconfont iconfanhui"></i></div>
                    <div class="search-wrap">
                        <search-bar placeholder="请输入客户姓名或手机号" :data="searchValue" readonly @focus="onFocus"></search-bar>
                    </div>
                </div>
                <div class="main-section" :style="{ height: pageContainerHeight }">
                    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad" :immediate-check="false">
                        <CustomerSection :list="customerList" @operate="operate"/>
                    </van-list>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import SearchBar from '@c/SearchBar'
import API from '@/request/api/selfExtension/keyAndBee'
import CustomerSection from '@/components/ExtensionCustomer'
export default {
    name: 'customer',
    components: {
        SearchBar,
        CustomerSection,
    },
    computed: {
        ...mapGetters(['tabData', 'projectId', 'currentRole']),
    },
    data() {
        return {
            loading: false,
            finished: false,
            searchValue: '',
            pageNum: 1,
            pageSize: 10,
            customerList: [],
        }
    },
    created() {},
    mounted() {
        this.searchValue = this.$route.query.searchKey
        this.getCustomerList()
    },
    methods: {
        onLoad() {
            if (this.finished) return
            this.pageNum += 1
            this.getCustomerList()
        },
        handleChangeTag(val) {},
        onFocus() {
            this.$router.go(-1)
        },
        goBack() {
            this.$router.go(-1)
        },
        async getCustomerList() {
            let params = {
                keyWord: this.searchValue,
                pageSize: this.pageSize,
                pageNum: this.pageNum,
                roleCode: this.currentRole.roleCode,
                beeType: Number(this.$route.query.dataType),
                sortType: 1
            }
            this.loading = true
            let result = await API.getBeeSubordinateList(params)
            if (result.list.length < 10) {
                this.finished = true
            } else {
                this.finished = false
            }
            result.list.map(item => {
                item.codeType = params.beeType === 6 ? 'keyPerson' : 'beePerson'
                item.canEdit = true
            })
            this.customerList = this.customerList.concat(result.list)
            this.loading = false
        },
         // 操作
        operate(data) {
            if (data.type.type === 'logoff') {
                this.$dialog
                    .confirm({
                        title: '',
                        message: `是否与${data.item.name}解除绑定`
                    })
                    .then(() => {
                        let params = {
                            beeId: data.item.userId,
                            type: 2,
                            leaderRoleCode: this.currentRole.roleCode
                        }
                        API.beeLogoff(params).then(res => {
                            this.$toast('解绑成功')
                            this.pageNum = 1
                            this.getCustomerList()
                        })
                    })
                    .catch(() => {
                        // on cancel
                    })
            }
        },
    },
}
</script>

<style scoped lang="less">
.common-page {
    height: 100%;
    .search-section {
        .common-flex();
        .back {
            margin-right: 7px;
        }
        .search-wrap {
            flex-shrink: 0;
            flex-grow: 1;
        }
    }
    .common-page-middle {
        height: 100%;
        background: #f0f4fa;
        .main-container {
            height: 100%;
            .search-section {
                padding: 0 15px 5px;
                background: #ffffff;
                .search-bar {
                    height: 34px;
                }
            }
            .main-section {
                height: calc(100% - 56px);
                padding: 0 15px;
                overflow: auto;
                .customer-list {
                    margin-top: 15px;
                }
            }
        }
    }
}
</style>

<style scoped lang="less"></style>
