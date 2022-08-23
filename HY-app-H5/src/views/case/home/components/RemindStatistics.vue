<template>
	<div class="container">
		<div class="common-title">
            <img class="icon" :src="$baseImgUrl + '/case/home/' + icon" />
            {{title === '今日案场待办' && currentRole.roleCode === 'ST_SALES' ? '今日待办' :title === '今日案场提醒' && currentRole.roleCode === 'ST_SALES' ? '今日提醒' : title }}</div>
		<div class="content">
			<!--v-if="item.today!=0||item.history!=0"-->
			<div class="li" @click="goList(item)" :style="needbg?'background:#FFEEEE':''"
			 :key="index" v-for="(item,index) in data" >
				<van-popover class="wenhao" style="font-size: 12px" v-model="item.isShow" v-if="item.code.includes('ST.HOME')" :actions="formatStatusDescribeMap(item)" trigger="click" :placement="index%2===0?'top':'top-end'" theme="light">
					<template #reference>
						<van-icon name="question-o" @click.stop="openTip(index, item)"/>
					</template>
				</van-popover>
                <img :src="$baseImgUrl + '/case/home/' + item.checkedIconName" />
                <div style="margin-left: 15px">
                    <div class="top">
                        <div class="num">{{item.today || 0}}
							<!-- <span class="add" v-if="item.today">+{{item.today}}</span> -->
						</div>
					</div>
                    <div class="bottom">
                        {{ item.name }}
                    </div>
                </div>
			</div>
		</div>
	</div>
</template>
<script>
	import { mapGetters } from 'vuex'

    export default {
		name: 'RemindStatistics',
		props: {
			title: {
				type: String,
				default: ''
			},
            icon: {
                type: String,
                default: ''
            },
			data: {
				type: Array,
				default: []
			},
            needbg: {
			    type: Boolean,
                default: false
            }
		},
        computed: {
            ...mapGetters(['currentRole'])
        },
		data() {
			return {
                showPopover: false,
                statusDescribeMap: {
                    'ST.HOME.FOLLOWALERT.TOARRIVE': ['请您尽快与预计今日到访的问询客户联系哦','需要置业顾问尽快与预计今日到访的问询客户联系'],
                    'ST.HOME.FOLLOWALERT.TOVISIT': ['您计划需要今日跟进这些客户，请尽快与客户取得联系哦','置业顾问计划需要今日跟进这些客户'],
                    'ST.HOME.FOLLOWALERT.LOSING': ['这些客户将在3日内进入公客池，请您尽快跟进客户哦','这些客户将在3日内进入公客池，需要置业顾问尽快跟进客户'],
                    'ST.HOME.FOLLOWALERT.WHITE': ['需要您今日补全电话的接待客户（如今日未补全，则客户消失哦）','需要置业顾问今日补全电话的接待客户（如今日未补全，则客户消失）'],
                    'ST.HOME.OVERALERT.OVERACCESS': ['您有未及时完成跟进的客户，请及时完成客户接待、完善客户资料，否则无法接待客户','有未及时完成跟进的客户，需要置业顾问及时完成客户接待、完善客户资料，否则无法接待客户'],
                    'ST.HOME.OVERALERT.OVERCONTRACT': ['您有逾期未转签约的认购单，请尽快联系客户转签约','置业顾问有逾期未转签约的认购单，需要尽快联系客户转签约'],
                    'ST.HOME.FOLLOWALERT.FINISHRECEPTION': ['需要您今日完善客户资料信息的首访客户（如果今日未完善，则次日无法接待客户哦）','需要置业顾问今日完善客户资料信息的首访客户（如果今日未完善，则次日无法接待客户）'],
                    'ST.HOME.FOLLOWALERT.YYKH': ['线上预约看房的客户（如今日未与客户沟通并系统跟进，则次日无法接待客户哦）','线上预约看房的客户（如今日未与客户沟通并系统跟进，则次日置业顾问无法接待客户）'],
                    'ST.HOME.ACQK.QDGW': ['','显示今日置业顾问的签到情况'],
                    'ST.HOME.ACQK.JDZKH': ['','显示今日案场接待中和已接待的客户组数（包含来访未留电客户）'],
					'ST.HOME.ACQK.GJQK': ['','显示今日置业顾问跟进过的客户'],
					'ST.HOME.FOLLOWALERT.TOFOLLOWUP': ['根据跟进保护期规则需您今日内跟进的客户（如今日未跟进，则流入公客池哦）','根据跟进保护期规则需置业顾问今日内跟进的客户（如今日未跟进，则流入公客池）']
                },
                orderByMap: {
                    'ZT.HOME.OVERDUE.1': 5,
                    'ZT.HOME.OVERDUE.3': 6
                }
            }
		},
		methods: {
			goList(item) {
                if(item.code === 'ST.HOME.FOLLOWALERT.WHITE') {
                	this.$router.push(`/case/whiteboardCustomer`).catch(()=>{})
                    return
                }
				if(item.code === 'ST.HOME.ACQK.GJQK') {
                	this.$router.push(item.url).catch(()=>{})
                    return
                }
                if(item.code === 'ZT.HOME.OVERDUE.3' || item.code === 'ZT.HOME.OVERDUE.1') {
                    const sortType = this.orderByMap[item.code]
                    this.$router.push({
                        path: '/extension/customer',
                        query: {
                            orderBy: sortType
                        }
                    }).catch(()=>{})
                    localStorage.setItem('isFromHome', 1)
                    return
                }
                // 案场情况客户
                if(item.code === 'ST.HOME.ACQK.JDZKH') {
                    this.$router.push({
                        path: '/case/customerAnChangCondition',
                        query: { menuId: item.code }
                    }).catch(()=>{})
                    return
                }else if (item.code === 'ST.HOME.ACQK.QDGW') {
                    this.$router.push({
                        path: '/case/signAgent',
                        query: { menuId: item.code }
                    }).catch(()=>{})
                    return
                }else if (item.code === 'ST.HOME.FOLLOWALERT.YYKH') {
                    this.$router.push({
                        path: '/case/customerWithoutTab',
                        query: { menuId: item.code,isFromHomePage:1 }
                    }).catch(()=>{})
                    return
                }
				this.$store.dispatch('other/setSearchCustomerListType', 'index')
				this.$router.push(`/case/customerList?name=${item.name}&menuId=${item.code}&isFromHomePage=1`).catch(()=>{})
			},
            openTip(index,item) {
			    item.isShow = true
			    this.data.splice(index,1, item)
            },
            formatStatusDescribeMap(item) {
			    if (this.currentRole.roleCode === 'ST_SALES') {
                    return [{text: this.statusDescribeMap[item.code] && this.statusDescribeMap[item.code][0]}]
                } else {
                    return [{text: this.statusDescribeMap[item.code] && this.statusDescribeMap[item.code][1]}]
                }
            }
		}
	}
</script>
<style scoped lang="less">
	.container {
		.common-title {
			font-size: 16px;
			font-family: PingFangSC-Medium, PingFang SC;
			font-weight: 700;
			padding: 12px 0;
            display: flex;
            align-items: center;
            .icon {
                width: 18px;
                height: 18px;
                margin-right: 6px;
            }
		}
		.content {
			display: flex;
			flex-wrap: wrap;
			justify-content: space-between;
			&:after {
				content: '';
				width: 31%;
				height: 0;
			}
			.li {
				position: relative;
				padding: 15px 14px;
				box-sizing: border-box;
				width: 48%;
				margin-bottom: 8px;
				flex-shrink: 0;
                display: flex;
                align-items: center;
                //justify-content: space-between;
				box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.06);
				border-radius: 4px;
				background: #fff;
				.wenhao {
					position: absolute;
					top: 9px;
					right: 10px;
				}
                img {
                    width: 28px;
                    height: 24px;
                }
				&:nth-child(3n + 0) {
					margin-right: 0;
				}
				.top {
					margin-bottom: 10px;
					.num {
						font-size: 21px;
						font-family: DINAlternate-Bold, DINAlternate;
						font-weight: bold;
						color: #333333;
						line-height: 18px;
						.add {
							font-size: 12px;
							font-family: DINAlternate-Bold, DINAlternate;
							font-weight: bold;
							color: #EB6877;
							line-height: 12px;
						}
					}
				}
				.bottom {
					font-size: 13px;
					font-family: PingFangSC-Regular, PingFang SC;
					color: #999999;
				}
			}
		}
	}
</style>
