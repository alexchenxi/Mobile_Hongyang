<template>
	<div class="common-page">
		<TopBar title="来访未留电客户"> </TopBar>
		<main class="common-page-container" :style="{ height: pageContainerHeight }">
<!-- 			<section class="filter-container">
				<div class="split"></div>
				<FilterSection ref="filter" :filter-list="currentConfig.filterList" @change="handleFilter"
				/> </section> -->
			<van-tabs @change="initConfig" v-model="status" animated>
				<van-tab v-for="(tab,tabIndex) in tabList" :key="tab.code" :title="tab.name" :name="tab.code">
					<section class="customer-container">
						<template v-if="currentRole.roleCode === 'ST_SALES'">
                            <van-list v-model="loading" :finished="finished" :finished-text="finishedText"
                                      @load="onLoad" offset="20" :immediate-check="false">
                                <CaseCustomer :list="customerList" @goDetail="goDetail" @reception="reception"
                                              @finishCustomerInfo="finishCustomerInfo" /> </van-list>
                        </template>
                        <template v-else>
                            <van-collapse
                                v-model="activeNames"
                                :border="false"
                                @change="changeCollapse"
                            >
                                <van-collapse-item
                                    v-for="item in subsalesList"
                                    :key="item.userId"
                                    :name="item.userId"
                                    :border="true"
                                >
                                    <template #title>
                                        <div class="common-collapse-title">
                                            {{ item.userName }}（{{ item.customerCount }}）
                                        </div>
                                    </template>
                                    <CaseCustomer
                                        :key="item.userId"
                                        :list="item.customerList"
                                        @goDetail="goDetail"
                                    />
                                    <div
                                        v-if="item.isShowMoreBtn"
                                        class="more-btn-wrap"
                                    >
                                        <div
                                            class="more-btn"
                                            @click="showMoreClint"
                                        >
                                            查看更多
                                            <van-icon
                                                class="icon-arrow"
                                                name="arrow-down"
                                            />
                                        </div>
                                    </div>
                                </van-collapse-item>
                            </van-collapse>
                            <van-empty
                                v-if="!subsalesList || !subsalesList.length"
                                class="custom-image"
                                :image="$baseImgUrl + '/no-data.png'" description="暂无数据~" />
                        </template>
					</section>
				</van-tab>
			</van-tabs>
		</main>
        <ClientTypeSetting :showSetting="showSetting" :item="curItem" @handleClose="handleClose" />
    </div>
</template>
<script>
	import { mapGetters } from 'vuex'
	import TopBar from '@c/TopBar'
	import FilterSection from '@c/FilterSection'
	import CaseCustomer from '@c/CaseCustomer'
    import ClientTypeSetting from '@c/ClientTypeSetting'
    import API from '@/request/api/caseSystem/whiteboard'
	import { getConfig } from '@/config/caseCustomerConfig'
	export default {
		name: 'whiteboardCustomer',
		components: {
			TopBar,
			FilterSection,
			CaseCustomer,
            ClientTypeSetting
		},
		data() {
			return {
				status: 0,
				currentConfig: {},
				tabList: [{
					name: '未完善',
					code: 0,
				}, {
					name: '已完善',
					code: 1,
				}],
				loading: false,
				finished: false,
                showSetting: false,
				finishedText: '没有更多了',
				pageNum: 1,
				pageSize: 10,
				filterValue: [],
				customerList: [],
                activeNames: [],
                subsalesList: [],
                oldActiveNames: [],
                refresh: false,
				isFirst: true,
                curItem: {}
			}
		},
		computed: { ...mapGetters(['projectId', 'currentRole', 'keepAliveList'])
		},
		created() {
			let whiteboardStatus = localStorage.getItem('whiteboardStatus')
			if (whiteboardStatus) {
				this.status = 1
				localStorage.removeItem('whiteboardStatus')
			}
			this.initConfig()
		},
		activated() {

			if (this.refresh) {
				this.pageNum = 1
				this.loading = true
				this.finished = false
				this.customerList = []
				this.activeNames = []
				this.getClientList()
				this.refresh = false
			}
		},
		methods: {
			initConfig() {
				this.$refs.filter && this.$refs.filter.resetFilter()
				this.filterValue = {}
				const code = this.status === 0 ? 'ST.CUSTOMER.UNBLANK' :
					'ST.CUSTOMER.BLANK'
				this.currentConfig = JSON.parse(JSON.stringify(getConfig(code)))

				this.initParams()
			},
			initParams() {
				this.pageNum = 1
				this.loading = true
				this.finished = false
				this.customerList = []
                this.activeNames = []
                if (this.currentRole.roleCode !== 'ST_SALES') {
                    this.getSubSalesList()
                } else {
                    this.getClientList()
                }
			},
			//筛选
			handleFilter(val) {
				this.filterValue = val
				this.initParams()
			},
			onLoad() {
				if (this.finished) return
				this.pageNum += 1
				this.getClientList()
			},
			//客户详情
			goDetail(item) {
				if (this.status !== 1) {
					return
				}
				if (this.currentRole.roleCode === 'ST_SALES') {
					this.finishCustomerInfo(item)
				} else {
					this.$router.push({
						path: '/case/customerDetail',
						query: {
							oppId: item.oppId,
							clueId: item.clueId,
							menuId: item.menuId ? item.menuId : 'ST.CUSTOMER.LOST',
                            clientId: item.clientId
						}
					}).catch(()=>{})
				}
			},
			//跳转完善信息
			finishCustomerInfo(item) {
				this.$router.push({
					path: '/case/completeWhiteboardInfo',
					query: {
						id: item.id
					}
				}).catch(()=>{})
			},
            // 完成接待
            async reception(item) {
                // 白板客户
                this.$router.push({
                    path: '/case/questionnaire',
                    query: {
                        whiteBoardId: item.id
                    }
                }).catch(() => {
                })
            },
            // 关闭弹窗
            handleClose(val) {
			    if (val.status === '无效') {
			        this.getData()
                }
                this.showSetting = val.flag
            },
            // 获取所有顾问列表
            async getSubSalesList() {
                let params = {
                    menuId: this.$route.query.menuId,
                    projectId: this.projectId,
                    roleCode: this.currentRole.roleCode,
                    status: this.status
                }
                Object.assign(params, this.filterValue)
                this.$utils.loading()
                let result = await API.whiteboardListByStaffId(params)
                this.subsalesList = result
                // if (result.length > 0) {
                //     this.activeNames = [result[0].userId]
                //     this.oldActiveNames = [result[0].userId]
				// 	this.subsalesList[0].pageNum=1
                // 	this.getClientList(this.subsalesList[0].userId,this.subsalesList[0].pageNum)
                // } else {
                //     this.finishedText = '没有更多了'
                // }
                this.finished = true
                this.$toast.clear()
            },
            changeCollapse(val) {
                if (!val.length) return
                const curUserId = val[val.length - 1]
                const index = this.subsalesList.findIndex(item => item.userId === curUserId)
                if (val.length < this.oldActiveNames.length) {
                    this.oldActiveNames = val
                    return
                }
                //收起在展开不需要重新调用接口
                if (this.subsalesList && this.subsalesList[index]?.customerList?.length) return
				this.subsalesList[index].pageNum=this.subsalesList[index].pageNum||1
            	this.getClientList(curUserId,this.subsalesList[index].pageNum)
                this.oldActiveNames = val
            },
            // 加载更多客户
            async showMoreClint() {
              	const  curUserId=this.oldActiveNames[this.oldActiveNames.length - 1]
            	const index = this.subsalesList.findIndex(item => item.userId === curUserId)
            	this.subsalesList[index].pageNum=this.subsalesList[index].pageNum+1
                this.getClientList(this.oldActiveNames[this.oldActiveNames.length - 1])
            },
			async getClientList(userId,pageNum) {
				let params = {
                    userId: userId || '',
					menuId: this.$route.query.menuId,
					pageSize: this.pageSize,
					pageNum: pageNum||this.pageNum,
					projectId: this.projectId,
					roleCode: userId?'ST_SALES':this.currentRole.roleCode,
					status: this.status
				}
				Object.assign(params, this.filterValue)
				let result = await API.whiteboardList(params)
				const code = this.status === 1 ? 'ST.CUSTOMER.BLANK' : 'ST.CUSTOMER.UNBLANK'
				result.list.map((item) => {
					item.codeType = code
					item.canEdit = this.status !== 1 && this.currentRole.roleCode ===
						'ST_SALES'
					item.isFirstVisit = item.receptionStatus
					item.finishReception = item.receptionStatus
				})
                // 展示顾问纬度下的客户
                if (userId) {
                    this.subsalesList.map(item => {
                        if (item.userId === userId) {
                            item.customerList = item.customerList ? item.customerList.concat(result.list) : result.list
                            if (result.list.length < this.pageSize) {
                                item.isShowMoreBtn = false
                            } else {
                                item.isShowMoreBtn = true
                            }
                        }
                    })
                    this.finished = false
                    this.loading = false
                    this.$forceUpdate()
                    this.$toast.clear()
                    return
                }
				this.customerList = this.customerList.concat(result.list)
				if (result.list.length < this.pageSize) {
					this.finished = true
				} else {
					this.finished = false
				}
				this.$forceUpdate()
				this.loading = false
			},
		},
		watch: {},
		beforeRouteEnter(to, from, next) {
			next((vm) => {
				var array = vm.keepAliveList || []
				let aliveList = ['/case/customerDetail','/case/completeWhiteboardInfo', '/case/receptionRecord']
				if (array.indexOf('whiteboardCustomer') === -1) {
					array.push('whiteboardCustomer')
					vm.$store.dispatch('other/setKeepAlive', array)
				}
				if (from.path.includes('/case/customerDetail') || from.path.includes('/case/completeWhiteboardInfo') || from.path.includes('/case/receptionRecord')) {
					vm.refresh = true
				}
			})
		},
		beforeRouteLeave(to, from, next) {
			var array = this.keepAliveList
			if (!to.path.includes('/case/customerDetail') && !to.path.includes('/case/completeWhiteboardInfo') && !to.path.includes('/case/receptionRecord')) {
				 array = array.filter((item) => {
					return item !== 'whiteboardCustomer'
				})
				this.$store.dispatch('other/setKeepAlive', array)
			}
			next()
		},
	}
</script>
<style scoped lang="less">
	.common-page-container {
		position: relative;
		background: #F6F8FA;
		.filter-container {
			position: fixed;
			right: 18px;
			top: 76px;
			z-index: 100;
			width: 56px;
			display: flex;
			align-items: center;
			justify-content: space-between;
		}
		/deep/ .van-dropdown-item {
			top: 118px!important;
		}
		.split {
			width: 1px;
			height: 14px;
			background: #EAEAEA;
		}
		/deep/ .field-content{
			flex-shrink: 0;
		}
        .more-btn-wrap {
            margin-top: -20px;
            margin-bottom: 40px;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            height: 45px;
            color: @theme-color;
            border-radius: 4px;
            font-size: 15px;
            font-weight: 500;

            .more-btn {
                width: 100px;
                text-align: center;
                line-height: 45px;
                border-radius: 20px;
            }
        }
        /deep/ .van-tab {
			color: #999;
			&.van-tab--active {
				color: @theme-color;
			}
		}
		/deep/ .van-tabs {
			position: relative;
			.van-tabs__wrap {
				position: fixed;
				// width: 300px;
				width: 100%;
				// padding-right: 75px;
				background: #fff;
				z-index: 99;
			}
			.van-tabs__content {
				padding-top: 44px;
			}
		}
	}
</style>
