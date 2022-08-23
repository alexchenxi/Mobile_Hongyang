<template>
	<div class="common-page">
		<div class="common-page-top">
			<top-bar title="选择成员"><span class="head-right-text" slot="append-suffix" @click="selectAll">{{isAll?'取消':'全选'}}</span></top-bar>
		</div>
		<div class="common-page-middle" :style="{height: pageMiddleWithButtonHeight}">
			<div class="search-section">
				<search-bar placeholder="请输入成员姓名或账号" @changeInput="changeInput"></search-bar>
			</div>
			<div class="select-num">共<span> {{personList.length}} </span>个成员</div>
			<div class="person-list">
				<div class="person-li" v-for="(item,index) in personList" :key="index">
					<van-icon v-if="item.check" name="checked" color="#DB0826" @click="changeCheck(item.id,index)"
					/> <span class="check" v-else @click="changeCheck(item.id,index)"></span> <img
					 :src="item.avatar|| $baseImgUrl + '/default-avatar.png'" />
					<div>
						<div class="line name">{{item.name}}</div>
						<div class="line"><span class="label">账号：</span>{{item.account}}</div>
					</div>
				</div>
			</div>
			<div style="width: 100%;height: 30px;"></div>
		</div>
		<div class="common-fix-bottom" :style="{paddingBottom: bottomSafe}">
			<van-button round block type="save" @click="confirmData">确定选择</van-button>
		</div>
	</div>
</template>
<script>
	import { mapGetters } from 'vuex'
	import TopBar from '@c/TopBar'
	import SearchBar from '@c/SearchBar'
	import API from '@/request/api/selfExtension/task'
	export default {
		name: 'extensionTaskChooseMember',
		components: {
			TopBar,
			SearchBar
		},
		computed: { ...mapGetters(['currentRole', 'user', 'projectId', 'involveUserIdsArray']),
		},
		data() {
			return {
				personList: [],
				originalList: [],
				isAll: false
			}
		},
		created() {
			this.initData()
		},
		methods: {
			changeCheck(id, index) {
				this.personList[index].check = !this.personList[index].check;
				this.judgeAll()
				this.$forceUpdate()
			},
			changeInput(e) {
				if(!e){
					this.personList= this.originalList
					return
				}
				this.personList = this.originalList.filter((item) => {
					return (item.name.indexOf(e) > -1 || item.account.indexOf(e) > -1)
				})
			},
			judgeAll() {
				let isAll = true;
				this.personList.forEach(item => {
					if (!item.check) {
						isAll = item.check
					}
				})
				this.isAll = isAll
			},
			initData() {
				var that = this;
				this.$utils.loading()
				API.teamUserList({
					projectId: this.projectId
				}).then((res) => {
					this.$toast.clear()
					if (this.currentRole.roleCode === 'ZT_MANAGER') {
                        this.personList = (res || []).filter(item => item.userId !== this.user.id)
                    }else {
                        this.personList = res || [];
                    }
					if (this.involveUserIdsArray && this.involveUserIdsArray.length > 0) {
						this.personList.map((item) => {
							this.involveUserIdsArray.map((subItem) => {
								if (item.userId === subItem.userId) {
									item.check = true
								}
							})
						})
						this.judgeAll()
					}
					this.originalList = res ;
				})
			},
			selectAll() {
				this.isAll = !this.isAll;
				this.personList.map((item, index) => {
					item.check = this.isAll;
				});
			},
			confirmData() {
				let checkData = this.personList.filter(item => item.check)
				this.$store.dispatch('other/setInvolveUserIdsArray', checkData)
				this.$router.go(-1)
			}
		},
	}
</script>
<style scoped lang="less">
	.common-page-middle {
		background: #F0F4FA;
		.search-section {
			position: fixed;
			width: calc(100% - 30px);
			padding: 0 15px;
			background: #ffffff;
		}
		.select-num {
			margin: 56px 15px 10px 15px;
			font-size: 12px;
			color: #999;
			span {
				font-size: 15px;
				color: #DB0826;
				font-weight: bold;
			}
		}
		.person-list {
			margin: 0 15px;

		}
		.person-li {
			background: #fff;
			display: flex;
			align-items: center;
			margin-bottom: 10px;
			height: 85px;
			border-radius: 4px;
			.check {
				border-radius: 50%;
				width: 18px;
				height: 18px;
				background: #FFFFFF;
				border: 1px solid #F0F0F0;
				margin: 0 15px;
			}
			.van-icon {
				font-size: 20px;
				margin: 0 15px;
			}
			img {
				display: inline-block;
				width: 50px;
				height: 50px;
				border-radius: 50%;
				margin-right: 12px;
				object-fit: cover;
			}
			.line {
				font-size: 13px;
				color: #333;
				&.name {
					font-size: 18px;
					font-weight: 600;
				}
				.label {
					color: #999999;
				}
			}
		}
	}
	.head-right-text {
		position: absolute;
		right: 0;
	}
</style>
