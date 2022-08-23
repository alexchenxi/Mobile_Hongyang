<template>
  <div class="container">
    <div
      v-for="(item,index) in data"
      :key="item.id"
      class="li"

    >
	<div class="item" 	v-if="showMore||(!showMore&&index<3)">
      <div class="line" >
        <div class="left">
          <span
            v-if="index<3"
            :class="' index bg'+index"
          ><img :src="$baseImgUrl + '/report/icon-medal'+index+'1.png'"></span>
          <span
            v-else
            class="index"
          >{{ index+1 }}.</span> {{ item.name }}
        </div>
        <div class="right">
          {{ parseFloat(item.add) >= 0 ? '+' : '' }}{{ item.add | numFormat(item.add)  }}<span class="unit">{{ item.unit }}</span>
        </div>
      </div>
      <div class="content">
        <div class="content-li-wrap">
          <div
                  v-for="(subItem,subIndex) in item.num"
                  :key="subIndex"
                  class="content-li"
                  @click="goCustomerList(item,subItem)"
              >
                  <div :class="['num', tokerType === (subIndex+1) ? 'color' : '']">
                      {{ item[subItem.field] | numFormat(item[subItem.field]) }}<span class="unit">{{ subItem.unit }}</span>
                  </div>
                  <div class="text">
                      {{ subItem.text }}
                  </div>
              </div>
        </div>
      </div>

    </div>
	</div>
	 <div  class="add-more" v-if="data && data.length > 3" @click="showMore=!showMore">{{showMore?'收起排行':'查看更多排行'}}</div>
  </div>
</template>
<script>
	export default {
		name: 'Team',
		props: {
			data: {
				type: Array,
				default: []
			},
            tokerType: {
			    type: Number
            }
		},
		data() {
			return {
				showMore:false
			}
		},
		methods: {
            goCustomerList(item,subItem) {
                if(!subItem.code) return
				subItem.groupId=item.groupId
				subItem.staffId=item.staffId
                this.$emit('goCustomerList', subItem,subItem.code,item[subItem.field])
            }
        },
	}
</script>
<style scoped lang="less">
	.li {
		.item{
			margin: 15px 0 15px;
			border-bottom: 1px solid #ececec;

		}
		.line {
			display: flex;
			justify-content: space-between;
			align-content: center;
			.left {
				font-size: 15px;
				font-family: PingFangSC-Medium, PingFang SC;
				font-weight: 600;
				color: #333333;
				line-height: 15px;
				margin-bottom: 16px;
				display: flex;
				align-items: center;
				.index {
					position: relative;
					width: 30px;
					text-align: center;
					display: inline-block;
					font-weight: 600;
					margin-right: 8px;
					font-size: 18px;
					font-family: DINAlternate-Bold, DINAlternate;
					img {
						width: 26px;
					}
				}
			}
			.right {
				font-size: 24px;
				font-family: DINAlternate-Bold, DINAlternate;
				font-weight: bold;
				color: #db0826;
				line-height: 18px;
				.unit {
					font-size: 10px;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #db0826;
					line-height: 10px;
					margin-left: 2px;
				}
			}
		}
		.content {
			//display: flex;
			//height: 60px;
			//background: #F9F9F8;
			//border-radius: 4px;
			//margin-bottom: 15px;
            overflow-x: auto;
            .content-li-wrap {
                min-width: 520px;
                display: flex;
                height: 60px;
                background: #F9F9F8;
                border-radius: 4px;
                margin-bottom: 15px;
                .content-li {
                    flex: auto;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    padding: 0 5px;
                    .num {
                        display: flex;
                        align-items: center;
                        font-size: 16px;
                        font-family: DINAlternate-Bold, DINAlternate;
                        font-weight: bold;
                        color: #333333;
                        line-height: 14px;
                        margin-bottom: 10px;
                        .unit {
                            font-size: 10px;
                            font-family: PingFangSC-Regular, PingFang SC;
                            font-weight: 400;
                            line-height: 10px;
                            margin-left: 2px;
                        }
                    }
                    .color {
                        color: #DB0826;
                    }
                    .text {
                        font-size: 12px;
                        font-family: PingFangSC-Regular, PingFang SC;
                        font-weight: 400;
                        color: #333333;
                        line-height: 12px;
                        opacity: 0.6;
                    }
                }
            }
		}
	}
	.add-more{
		width: 345px;
		height: 40px;
		line-height: 40px;
		background: rgba(241,15,15,0.04);
		border-radius: 8px;
		margin:0 auto;
		font-size: 15px;
		font-family: PingFangSC, PingFangSC-Medium;
		font-weight: 500;
		text-align: left;
		color: #f10f0f;
		text-align: center;
	}
</style>
