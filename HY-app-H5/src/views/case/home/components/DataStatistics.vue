<template>
	<div class="container">
        <div class="right-top-tip" v-if="currentRole.roleCode !== 'ST_SALES'" @click="filterChange">
            <FilterSection ref="filterSection" :filter-list="filterList" :isShowMaxDate="true" container="body" @change="handleFilterDate" />
        </div>
		<van-tabs v-model="selectTab" @change="changeType" background="none" animated swipeable title-active-color="#ffffff" title-inactive-color="#ffffff" line-width="16px" line-height="3px">
			<van-tab v-for="tab in tabList" :key="tab.value" :title="tab.text">
				<div class="count">
					<div class="li" :key="index" v-for="(item,index) in countArray" @click="goDetail(item)">
						<div class="num spantext">{{item.value | numFormat(item.value)}} <span class="unit">{{item.unit}}</span></div>
						<div class="text">{{item.text}}</div>
					</div>
				</div>
			</van-tab>
		</van-tabs>
        <div class="tip">
            <van-popover v-model="isShow" trigger="click" placement="bottom-end" theme="light">
                <div class="common-pop-style">
                	<div v-for="item in formatActions">{{ item.text }}</div>
                </div>
                <template #reference>
                    <van-icon name="question-o" @click.stop="isShow = true"/>
                </template>
            </van-popover>
        </div>
	</div>
</template>
<script>
	import { mapGetters } from 'vuex'
	import API from '@/request/api/caseSystem/home'
    import FilterSection from '@c/FilterSection'

    export default {
		name: 'DataStatistics',
        components: {
            FilterSection
        },
		props: {},
		data() {
			return {
                filterList: [
                    {
                        name: '自定义时间',
                        type: 'date',
                        field: 'dateTime',
                        dateName: ['beginDate', 'endDate'],
                    }
                ],
                beginDate: '',
                endDate: '',
				tabList: [{
					text: '日',
					value: 1
				}, {
					text: '周',
					value: 2
				}, {
					text: '月',
					value: 3
				}, {
					text: '',
					value: 4
				}],
				selectTab: 0,
				countArray: [{
					text: '首访量',
					value: 0,
					type: 'firstVisitCount',
					unit: '组'
				},{
					text: '认购套数',
					value: 0,
					type: 'subscribeCount',
					unit: '套'
				}, {
					text: '签约套数',
					value: 0,
					type: 'signCount',
					unit: '套'
				},{
					text: '复访量',
					value: 0,
					type: 'repeatedVisitCount',
					unit: '组'
				}, {
					text: '认购金额',
					value: 0,
					type: 'subscribeMoney',
					unit: '万'
				}, {
					text: '签约金额',
					value: 0,
					type: 'signCountMoney',
					unit: '万'
				}],
				activeTab: 1,
                isShow: false
			}
		},
		methods: {
			changeType(index) {
                this.$refs.filterSection.resetFilter()
				this.selectTab = index
                if (this.filterList[0].defaultValue !== 3) {
                    delete this.filterList[0].defaultValue
                }

				this.getData()
			},
            filterChange() {
                this.selectTab = 3
            },
            handleFilterDate(val) {
                if (val?.beginDate || val?.endDate) {
                    this.beginDate = val?.beginDate.substring(0,10)
                    this.endDate = val?.endDate.substring(0,10)
                    this.selectTab = 3
                } else {
                    this.selectTab = 0
                }
                this.getData()
            },
			getData() {
			    const params = {
                    projectId: this.projectId,
                    dateType: this.selectTab + 1,
                    roleCode: this.currentRole.roleCode
                }
                if (this.beginDate && this.endDate) {
                    params.beginDate = this.beginDate
                    params.endDate = this.endDate
                }
				API.statisticsDealApi(params).then((data) => {
					this.countArray.map((item) => {
						item.value = item.type === 'subscribeMoney' || item.type === 'signCountMoney'
                            ? data[item.type] && data[item.type].toFixed()
                            : data[item.type]
					})
				})
			},
            goDetail(item) {
			    const params = {
                    type: item.type,
                    value: item.value,
                    dateType: this.selectTab + 1,
                    beginDate: this.beginDate,
                    endDate: this.endDate
                }

                this.$emit('goDetail', params)
            },
		},
		computed: {
		    ...mapGetters(['projectId','currentRole']),
            formatActions() {
		        let actions = [
                    { text: '首访量：当日/当周/当月首访的客户组数。' },
                    { text: '复访量：当日/当周/当月复访的客户组数。' },
                    { text: '认购套数：当日/当周/当月认购单数量。' },
                    { text: '认购金额：当日/当周/当月认购单金额汇总数。' },
					{ text: '签约套数：当日/当周/当月签约单数量。' },
					{ text: '签约金额：当日/当周/当月签约单金额汇总数。' }
                ]
                return actions
            }
        },
		created() {
			if(!this.projectId) return
            this.getData()
		},
		watch: {
			projectId() {
				if(!this.projectId) return
				this.getData()
			}
		}
	}
</script>
<style scoped lang="less">
	.container {
		// position: relative;
		// width: 100%;
		// box-sizing: border-box;
		// padding: 21px 15px 14px;
		// /*background: linear-gradient(#FF576F, #F1213F);*/
  //       background-image: url("@{baseImgUrl}/case/home/red_manage.png");
  //       background-position: -15px -20px;
  //       background-repeat: no-repeat;
  //       // background-size: 375px 176px;
		// background-size: 375px 245px;
		// border-radius: 4px;
		// // margin-bottom: 15px;
		height: 230px;
		position: relative;
		width: calc( 100% + 1rem);
		box-sizing: border-box;
		padding: 1.4rem 1rem 0rem;
		/* background: linear-gradient(#FF576F, #F1213F); */
		background-image: url("@{baseImgUrl}/case/home/red_manage.png");
		/* background-position: -1rem -1.33333rem; */
		background-repeat: no-repeat;
		background-size: 100% 100%;
		border-radius: 0.26667rem;
		margin-left: -7.5px;
		// margin-top: -30px;
		margin-bottom: -10px;
        .right-top-tip {
            position: absolute;
            top: 26px;
            right: 118px;
            color: #fff;
            z-index: 99;
            /deep/ .van-dropdown-menu .van-dropdown-menu__bar .van-dropdown-menu__title {
                color: #fff;
            }
            /deep/ .van-dropdown-menu__title--active {
                color: #fff !important;
            }
            /deep/ .van-dropdown-item {
                left: 14px !important;
                right: 14px !important;
            }
        }
        /deep/.van-ellipsis{
            color: #fff;
        }
        .tip {
            position: absolute;
            top: 25px;
            right: 33px;
			color: #FFF;
			font-size: 19px;
        }
        .tip-text {
            font-size: 12px;
            lin-height: 14px;
        }
		.img-style {
			// width: 160px;
			height: 100%;
			position: absolute;
			right: 0;
			top: 0;
		}
		.tab {
			font-size: 16px;
			font-family: PingFangSC-Medium, PingFang SC;
			font-weight: 500;
			color: #FFFFFF;
			margin-bottom: 24px;
			.li {
				padding-bottom: 4px;
				margin-right: 45px;
				&.active {
					border-bottom: 3px solid #fff;
				}
			}
		}
		.count {
			display: flex;
			align-items: center;
			font-size: 13px;
			font-family: PingFangSC-Regular, PingFang SC;
			color: #fff;
			flex-wrap: wrap;
			padding-top: 20px;
			text-align: center;
			.li {
				box-sizing: border-box;
				// padding-left: 46px;
				padding-left: 0px;
				width: 33.33%;
				flex-shrink: 0;
				margin-bottom: 30px;
				.num {
                    display: flex;
                    justify-content: center;
                    align-items: center;
					font-size: 19px;
					line-height: 21px;
					margin-bottom: 8px;
					font-family: DINAlternate-Bold, DINAlternate;
					font-weight: bold;
					color: #ffbb00;
					.unit {
						height: 10px;
						font-size: 10px;
						font-family: PingFangSC, PingFangSC-Regular;
						font-weight: 400;
						text-align: left;
						color: #ffffff;
						line-height: 10px;
					}
				}
				.text {
					font-size: 13px;
					line-height: 13px;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #ffffff;
					opacity: 0.7;
				}
			}
		}
		/deep/ .van-tabs {
			margin-top: 8px;
			.van-tabs__wrap {
				// margin-left: -22px;
				height: 25px;
			}
			.van-tab {
				flex-grow: 0;
				padding: 0 22px;
				font-size: 16px;
				line-height: 16px;
				height: 16px;
				font-family: PingFangSC-Medium, PingFang SC;
				font-weight: 500;
				color: #FFFFFF;
			}
			.van-tabs__line {
				background: #ffffff;
			}
		}
	}
	.common-pop-style {
		padding: 15px 15px;
		:last-child{
			margin-bottom: 0;
		}
		>div{
			font-size: 13px;
			margin-bottom: 6px;

		}
	}
</style>
