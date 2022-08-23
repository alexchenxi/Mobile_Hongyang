<template>
	<div class="common-page">
		<div class="common-page-top">
			<top-bar :back="true" title="二级销控房源"> </top-bar>
		</div>
		<!-- 筛选条件 -->
		<div class="common-page-container" :style="{ height: pageContainerHeight}">
			<div class="main-container">
				<div class="multiple-filter">
					<div class="multiple-filter-left">
						<div class="multiple-filter-middle">
							<van-dropdown-menu   active-color="#DB0826">
								<van-dropdown-item :disabled="selectList.length>0" ref="filter" v-model="building" :options="buildingOptions"
								 @change="getUnitList"></van-dropdown-item>
							</van-dropdown-menu>
						</div>
					</div>
					<div class="multiple-filter-right tab-filter-right">
						<van-dropdown-menu active-color="#DB0826">
							<van-dropdown-item  :disabled="selectList.length>0" ref="filter" v-model="unit" :options="unitOptions" @change="getRoomList"></van-dropdown-item>
						</van-dropdown-menu>
					</div>
				</div>
				<div class="main-section">
					 <van-empty v-if="list.length === 0&&finished" class="custom-image" :image="$baseImgUrl + '/no-data.png'" description="暂无您想找的房源~" />
					<div class="list" v-if="list.length>0">
						<div :key="item.code" v-for="(item,index) in list">
							<div class="main-title">{{item.name}}</div>
							<div class="li">
								<div v-for="(subItem,subIndex) in item.childList" @click="selectRoom(subItem.id)"
								 @dblclick="changeStatus(subItem)" class="item" :key="subItem.id">
									<van-icon name="checked" class="lock" v-if="selectList.indexOf(subItem.id)>-1"
									/>
									<div class="room">{{subItem.room}}</div>
									<div class="status">{{subItem.buildingName}} {{subItem.unit}}</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="common-fix-bottom" v-if="selectList.length>0" :style="{paddingBottom: bottomSafe}">
			<van-checkbox @click="changeAll" v-model="isAll">全选</van-checkbox>
			<van-button round block type="save" native-type="submit" @click="changeStatus">推盘选中的房源（{{selectList.length}}）</van-button>
		</div>
	</div>
</template>
<script>
	import { mapGetters } from 'vuex'
	import TopBar from '@c/TopBar'
	import API from '@/request/api/caseSystem/housing'
	import { commonData, getHousingStatus } from '@/config/commonData'
	import { commonMethods } from 'movit-utils'
	export default {
		name: 'caseHousingOperation',
		components: {
			TopBar
		},
		computed: { ...mapGetters(['projectId', 'currentRole']),
		},
		data() {
			return {
				// 客户列表预设
				buildingOptions: [],
				statusOptions: [],
				show: false,
				unitOptions: [],
				building: 1,
				unit: 1,
				status: -1,
				list: [],
				detail: {},
				flag: true,
				selectList: [],
				originList: [],
				isAll: false,
				finished:false,
				isPending: false
			}
		},
		created() {
			this.getBuildingList()
		},
		mounted() {},
		methods: {
			//获取楼栋
			async getBuildingList() {
				const params = {
					projectId: this.projectId,
					stage: ''
				}
				this.buildingOptions = await API.houseBuildingListApi(params)
				if (this.buildingOptions.length === 0) return
				this.buildingOptions.map((item) => {
					item.text = item.name
					item.value = item.code
				})
				this.buildingOptions.unshift({
					text: '全部楼栋',
					value: -1
				})
				this.building = -1
				this.getUnitList()
			},
			//获取单元
			async getUnitList() {
				this.$utils.loading()
				const params = {
					projectId: this.projectId,
					building: ''
				}
				let res = await API.houseUnitListApi(params)
				res.map((item) => {
					item.text = item.name
					item.value = item.code
				})
				this.unitOptions = res
				this.unitOptions.unshift({
					text: '全部单元',
					value: -1
				})
				this.unit = -1
				this.getRoomList()
			},
			getRoomList() {
				this.$utils.loading()
				const params = {
					projectId: this.projectId,
					roleCode: this.currentRole.roleCode,
					buildingList: this.building === -1 ? [] : [this.building],
					unitList: this.unit === -1 ? [] : [this.unit],
					status: 4
				}
				API.houseDetailListApi(params).then((res) => {
					this.finished=true
					this.list = res
					let array = []
					this.list.map((item) => {
						array = array.concat(item.childList)
					})
					this.originList = array
					this.$toast.clear()
				})
			},
			//选择房间
			selectRoom(id) {
				this.flag = true
				setTimeout(() => {
					if (this.flag) {
						const index = this.selectList.indexOf(id)
						if (index > -1) {
							this.selectList.splice(index, 1)
						} else {
							this.selectList.push(id)
						}
						this.isAll = this.selectList.length === this.originList.length
					}
				}, 300);
			},
			//全选改变
			changeAll() {
				this.selectList = []
				if (this.isAll) {
					this.originList.map((item) => {
						this.selectList.push(item.id)
					})
				}
			},
			getHousingStatus(status) {
				return getHousingStatus(status).tagClass
			},
			//推盘
			changeStatus(item) {
				let idArray = []
				if (item.id) {
					idArray = [item.id]
				} else {
					idArray = this.selectList
				}
				this.flag = false
				if(this.isPending) {
					return
				}
				this.$dialog.confirm({
					title: '',
					message: '是否确认推盘'
				}).then(() => {
					this.$utils.loading()
					this.isPending = true
					API.houseStatusUpdateApi({
						status: 0,
						houseIdList: idArray
					}).then(res => {
						this.isPending = false
						this.selectList=[]
						this.$toast.clear()
						this.$toast('操作成功')
						this.getRoomList()
					}).catch(err=> {
						this.isPending = false
					})
				}).catch(() => {
				})
			},
			beforeChangeTabs() {
				if (this.loading) {
					return false
				} else {
					return true
				}
			}
		}
	}
</script>
<style scoped lang="less">
	.common-page {
		.common-page-container {
			.main-section {
				overflow-y: auto;
			}
			.main-container, /deep/ .van-tabs, /deep/ .van-tab__pane, /deep/ .van-tab__pane {
				height: 100%;
			}
			/deep/ .van-tabs__content, .main-section {
				height: calc(100% - 44px);
			}
			.list {
				height: 100%;
				/deep/ .van-cell {
					padding: 0;
				}
				background: #fff;
				/deep/ .van-index-anchor {
					font-size: 15px;
					padding: 15px 15px 11px;
					font-family: PingFangSC-Medium, PingFang SC;
					font-weight: 600;
				}
				.main-title {
					font-size: 15px;
					font-family: PingFangSC-Medium, PingFang SC;
					font-weight: 600;
					color: #333333;
					margin: 18px 15px 14px;
				}
				.li {
					padding: 0 10px 15px;
					display: flex;
					flex-wrap: wrap;
					border-bottom: 1px solid #EEEEEE;
					.item {
						position: relative;
						display: flex;
						justify-content: center;
						flex-direction: column;
						width: 110px;
						height: 60px;
						background: rgba(250, 181, 95, 0.1);
						border-radius: 4px;
						color: #FAB55F;
						margin: 4px;
						flex-shrink: 0;
						.lock {
							position: absolute;
							right: 10px;
							top: 10px;
							font-size: 15px;
						}
						.room {
							font-size: 18px;
							font-family: DINAlternate-Bold, DINAlternate;
							font-weight: bold;
							margin-left: 15px;
						}
						.status {
							font-size: 12px;
							margin-left: 15px;
						}
					}
				}
			}
		}
		.multiple-filter {
			background: #fff;
			height: 44px;
			box-shadow: 0px 1px 8px 0px rgba(53, 56, 61, 0.1);
			.multiple-filter-left {
				.common-flex();
				width: calc(100% - 55px);
				overflow-x: auto;
				margin-right: 55px;
				.van-dropdown-menu {
					width: auto;
					 ::v-deep .van-dropdown-menu__item {
						flex-grow: 1;
						max-width: 100%;
						justify-content: end;
					}
				}
			}
			/deep/ .van-dropdown-item {
				top: 108px!important;
			}
			.tab-filter-right {
				position: relative;
			}
		}
	}

	/deep/ .van-dropdown-menu {
		width: 500px;
	}

	/deep/ .van-dropdown-menu__item {
		flex: 0;
		min-width: 88px;
		max-width: 100px;
	}

	/deep/ .van-tree-select {
		.van-sidebar-item--select::before {
			display: none;
		}
	}

	.wrapper {
		position: fixed;
		bottom: 0;
		width: 100%;
		background: #FFFFFF;
		border-radius: 8px 8px 0px 0px;
		box-sizing: border-box;
		.top {
			padding: 18px 15px;
			border-bottom: 1px solid #EEEEEE;
			.room {
				display: flex;
				align-items: center;
				font-size: 24px;
				font-family: DINAlternate-Bold, DINAlternate;
				font-weight: bold;
				color: #333333;
			}
			.status {
				margin-left: 6px;
				padding: 1px 6px;
				font-size: 11px;
				border-radius: 2px;
			}
			.unit {
				margin-top: 4px;
				font-size: 13px;
				font-family: PingFangSC-Regular, PingFang SC;
				color: #999999;
			}
		}
		.bottom {
			padding: 24px 15px 0;
			.line {
				margin-bottom: 24px;
				color: #333333;
				font-size: 15px;
				display: flex;
				justify-content: space-between;
				.label {
					color: #999999;
				}
				.price {
					font-size: 21px;
					font-family: DINAlternate-Bold, DINAlternate;
					font-weight: bold;
					color: #5F95FA
				}
				.per {
					flex: 1
				}
			}
		}
		.close {
			font-size: 24px;
			position: absolute;
			right: 0;
			top: 0;
			padding: 10px;
			color: #ccc;
		}
	}

	/deep/ .van-index-bar {
		height: 100%;
	}

	/deep/ .van-index-bar__sidebar {
		padding: 15px 0;
		width: 18px;
		text-align: center;
		background: #E6E6E6;
		border-radius: 9px;
		right: 4px;
		.van-index-bar__index {
			padding: 0;
			font-size: 11px;
			color: #fff;
			line-height: 25px;
			& > span {
				display: none;
				opacity: 0;
			}
			&.van-index-bar__index--active {
				position: relative;
				width: 18px;
				height: 18px;
				text-align: center;
				line-height: 18px;
				background: #5F95FA;
				border-radius: 9px;
				font-size: 12px;
				span.active {
					display: block;
					position: absolute;
					right: 40px;
					top: -20px;
					line-height: 50px;
					font-size: 24px;
					font-family: PingFangSC-Medium, PingFang SC;
					font-weight: 500;
					width: 46px;
					text-align: left;
					padding-left: 14px;
					height: 50px;
					background: url('@{baseImgUrl}/case/housing/bg-index.png');
					background-size: contain;
					animation-name: example;
					animation-duration: 1s;
				}
				@keyframes example {
					from {
						opacity: 1;
					}
					to {
						opacity: 0;
					}
				}
			}
		}
	}

	.van-button--save {
		width: 280px;
	}
</style>
