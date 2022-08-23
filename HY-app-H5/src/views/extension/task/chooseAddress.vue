<template>
	<div class="common-page">
		<div class="search-section" :style="{paddingTop: topSafe}">
			<search-bar :back=true placeholder="请输入位置信息" :filter="isSearch" @returnSearch="search">
				<div v-if="isSearch" slot="filter-append"><span @click="initData">取消</span></div>
			</search-bar>
		</div>
		<div class="common-page-container" :style="{height: pageContainerHeight}">
			<div class="main-section" v-if="isSearch">
				<van-list :immediate-check="false" ref="searchList" v-model="loading" @load="onLoad" :finished="finished"
				 finished-text="没有更多了">
					<div class="li" @click="selectLocation(item)" v-for="item in searchedList" :key="item.uid">
							<!--	<span class="tag">{{item.tag}}</span>·-->
							<div class="name">{{item.name}}</div>
							<div class="address">{{item.address}}</div>
						</div>
				</van-list>
			</div>
			<Map ref="map" v-if="!isSearch" :isShowName="false" :style="{height: pageContainerHeight}"></Map> </div>
		<div class="common-fix-bottom" v-if="!isSearch&&selectItem.name" :style="{paddingBottom: bottomSafe}">
			<div class="name">{{selectItem.name}}<span class="close" @click="selectItem={}">×</span></div>
			<div
			 class="address">{{selectItem.address}}</div>
		<van-button class="btn" round block type="save" @click="confirm">保存</van-button>
	</div>
	</div>
</template>
<script>
	import { Toast } from 'vant'
	import { mapGetters } from 'vuex'
	import SearchBar from '@c/SearchBar'
	import Map from '@c/Map'
	import Axios from 'axios'
	import APICOMMON from '@/request/api/commonApi'
	export default {
		name: 'extensionTaskChooseAddress',
		components: {
			SearchBar,
			Toast,
			Map
		},
		data() {
			return {
				loading: false,
				finished: false,
				refreshing: false,
				placeholder: '',
				currentObj: {},
				searchedList: [],
				isSearch: false,
				pageSize: 10,
				pageNum: 0,
				keyword: '',
				selectItem: {}
			}
		},
		created() {},
		mounted() {
			this.initData()
		},
		computed: { ...mapGetters(['addTaskAddress', 'device']),
		},
		methods: {
			initData() {
				if (this.addTaskAddress && this.addTaskAddress.address) {
					this.selectLocation(this.addTaskAddress)
				} else {
					this.isSearch = false
					this.getAddress()
				}
			},
			//获取当前定位
			getAddress() {
				this.$appMethods.startLocation(this.device).then((res) => {
					this.$refs.map.initMap(res)
				}, (e) => {
					this.$refs.map.initMap({
						lon: '116.404',
						lat: '39.915'
					})
				})
			},
			//保存
			confirm() {
				this.$store.dispatch('other/setAddTaskAddress', this.selectItem)
				this.$router.go(-1)
			},
			//选择地点
			selectLocation(item) {
				this.isSearch = false
				this.selectItem = item;
				setTimeout(() => {
					this.$refs.map.initMap(item)
				}, 200)
			},
			getList() {
				this.loading = true
				this.finished = false
				APICOMMON.getLocationInfo({
					keyword: this.keyword,
					pageNum: this.pageNum,
					pageSize: this.pageSize
				}).then((res) => {
					if (this.pageNum < 1) {
						this.searchedList = []
					}
					var array = []
					res.map((item) => {
						//防止出现空值
						if (!item.address) item.address = item.name
						if (!item.name) item.name = item.address
						array.push({
							lon: item.location && item.location.lng,
							lat: item.location && item.location.lat,
							address: item.address,
							name: item.name
						})
					})
					this.loading = false
					this.finished = res.length < 10
					this.searchedList = array.concat(this.searchedList)
					this.isSearch = true
				})
			},
			search(val) {
				if (!!val) {
					this.keyword = val
					this.getList()
				} else {
					Toast('请输入位置信息')
				}
			},
			onLoad() {
				if (this.finished) return
				this.pageNum += 1
				this.getList()
			},
			goBack() {
				this.$router.go(-1)
			},
		},
	}
</script>
<style scoped lang="less">
	.van-cell {
		font-size: 16px;
	}
	
	.search-section {
		padding: 0 15px;
		background: #ffffff;
	}
	
	.common-page-container {
		position: relative
	}
	
	.main-section {
		overflow-y: auto;
		height: calc(100% - 24px);
	}
	
	.li {
		margin: 0 15px;
		padding: 15px 0;
		border-bottom: 1px solid #eeeeee;
		.name {
			font-size: 15px;
			font-weight: 600;
			.tag {
				color: #5F95FA;
			}
		}
		.address {
			margin-top: 4px;
			color: #999;
			font-size: 12px;
		}
	}
	
	.common-fix-bottom {
		display: block;
		height: auto;
		z-index: 100;
		margin-bottom: 0;
		.name {
			position: relative;
			padding-top: 20px;
			color: #333333;
			font-size: 18px;
			font-weight: 600;
			margin-bottom: 18px;
		}
		.address {
			font-size: 12px;
			margin-bottom: 20px;
		}
		.close {
			top: 14px;
			right: -4px;
			position: absolute;
			font-size: 25px;
			color: #ccc;
		}
		.van-button--save {
			margin-bottom: 8px;
		}
	}
</style>