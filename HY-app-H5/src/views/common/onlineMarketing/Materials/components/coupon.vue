<template>
    <div ref="scrollWrap" class="common-container">
        <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
            <div v-for="(item, index) in list" :key="index" class="item">
                <van-image v-if="item.expired" width="119" height="119" fit="fill" src="https://zyx-local.obs.cn-east-2.myhuaweicloud.com/MP-GWZX/app-h5/onlineMarketing/expired.png" />
                <div :class="['container', item.expired ? 'expired' : '']">
                    <div class="item-top">
                        <div class="title">{{ item.title }}</div>
                        <span class="tag">{{ item.typeName }}</span>
                    </div>
                    <div class="item-middle">
                        <div class="circle-left circle"></div>
                        <div class="circle-right circle"></div>
                        <div class="line-dashed"></div>
                    </div>
                    <div class="item-bottom">
                        <div class="content">
                            <div class="end-date content-item">
                                <span class="label">截止日期：</span>
                                <span :class="['text', !item.expired ? (item.isExpand ? 'text-open' : 'text-close') : '']" @click="toggleExpand(item, index)">
                                    {{ item.endDate }}
                                </span>
                            </div>
                            <div ref="moreContent" class="more-content">
                                <div class="content-item">
                                    <span class="label">有效时间：</span>
                                    <span class="text">{{ item.validBeginDate ? formatDate(item.validBeginDate) + '至' + formatDate(item.validEndDate) : '--' }}</span>
                                </div>
                                <div class="content-item">
                                    <span class="label">物品说明：</span>
                                    <span class="text">{{ item.remark }}</span>
                                </div>
                            </div>
                        </div>
                        <van-button v-if="!item.expired" round @click.stop="handleShare(item)">分享</van-button>
                    </div>
                </div>
            </div>
        </van-list>
        <ShareBox v-model="show" :options="shareOptions" :share-info="shareInfo" />
    </div>
</template>

<script>
import ShareBox from '@/views/common/onlineMarketing/components/ShareBox.vue'
import API from '@/request/api/onlineMarketing'
import { mapGetters } from 'vuex'
export default {
    components: {
        ShareBox
    },
    data() {
        return {
            loading: false,
            finished: true,
            list: [],
            isExpand: false,
            show: false,
            shareOptions: ['wechat'],
            pageParams: {
                pageNum: 1,
                pageSize: 10
            },
            shareInfo: {}
        }
    },
    computed: { ...mapGetters(['projectId', 'user']) },
    mounted() {
        this.getDataList()
    },
    methods: {
        onLoad() {
            if (this.finished) return
            this.pageParams.pageNum += 1
            this.getDataList()
        },
        async getDataList() {
            let params = {
                projectId: this.projectId,
                pageNum: this.pageParams.pageNum,
                pageSize: this.pageParams.pageSize
            }
            const result = await API.getMaterielList(params)
            this.list = this.list.concat(result.list)
            if (result.list.length < this.pageParams.pageSize) {
                this.finished = true
            } else {
                this.finished = false
            }
            this.loading = false
            this.fomartDomHeight()
        },
        toggleExpand(item, index) {
            if (this.$refs.moreContent[index].offsetHeight === 0) {
                this.$refs.moreContent[index].style.height = item.orginHeight + 'px'
            } else {
                this.$refs.moreContent[index].style.height = 0
            }
            item.isExpand = !item.isExpand
        },
        fomartDomHeight() {
            this.$nextTick(() => {
                this.list.map((item, index) => {
                    item.orginHeight = this.$refs.moreContent[index].offsetHeight
                    this.$refs.moreContent[index].style.height = 0
                    item.isExpand = false
                })
            })
        },
        handleShare(data) {
            this.shareInfo = {
                thingId: data.id,
                // 物料类型
                thingType: 8,
                //标题
                title: this.user.name + '给您分享了一张优惠券，可点击前往领取'
            }
            this.show = true
        },
        formatDate(date) {
            if (!date) return ''
            return date.split(' ')[0].replace(/-/g, '.')
        }
    }
}
</script>

<style lang="less" scoped>
.common-container {
    background: #f6f8fa;
    height: 100%;
    overflow: auto;
    padding: 0 15px;
    .van-list {
        margin-top: 15px;
    }
    .item {
        position: relative;
        background: #ffffff;
        margin-bottom: 15px;
        border-radius: 8px;
        padding: 15px 15px 0;
        .van-image {
            position: absolute;
            right: 0;
            bottom: -29px;
        }
        .container.expired {
            opacity: 0.49;
        }
        .item-top {
            .title {
                font-size: 18px;
                font-family: PingFangSC-Medium, PingFang SC;
                font-weight: 500;
                color: @header-text-color;
                line-height: 18px;
            }
            .tag {
                display: inline-block;
                padding: 4px 7px;
                font-size: 11px;
                font-family: PingFangSC-Medium, PingFang SC;
                font-weight: 500;
                color: @theme-color;
                line-height: 11px;
                background: rgba(219, 8, 38, 0.08);
                margin: 9px 0;
            }
        }
        .item-middle {
            position: relative;
            height: 15px;
            .common-flex();
            justify-content: space-around;
            .line-dashed {
                width: 100%;
                height: 1px;
                border-bottom: 1px dashed #e6e6e6;
            }
            .circle {
                position: absolute;
                top: 0px;
                width: 15px;
                height: 15px;
                border-radius: 50%;
                background: #f6f8fa;
                &.circle-left {
                    left: -22px;
                }
                &.circle-right {
                    right: -22px;
                }
            }
        }
        .item-bottom {
            .common-flex-between();
            align-items: flex-start;
            padding-top: 2px;
            .content {
                padding-right: 15px;
                overflow: hidden;
                .content-item {
                    display: flex;
                    font-size: 12px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    margin-bottom: 9px;
                    &.end-date {
                        position: relative;
                        margin-top: 9px;
                        .text.text-close::after {
                            position: absolute;
                            top: 50%;
                            right: -12px;
                            margin-top: -5px;
                            border: 3px solid;
                            border-color: transparent transparent #cccccc #cccccc;
                            transform: rotate(-45deg);
                            opacity: 0.8;
                            content: '';
                        }
                        .text.text-open::after {
                            transform: rotate(135deg);
                            margin-top: -1px;
                        }
                    }
                    .label {
                        color: @info-color;
                        flex-shrink: 0;
                    }
                    .text {
                        color: @header-text-color;
                    }
                }
                .more-content {
                    transition: all 0.3s;
                    .content-item:last-child {
                        padding-bottom: 15px;
                    }
                }
            }
            .van-button {
                flex-shrink: 0;
                width: 68px;
                height: 30px;
                padding: 0;
                background: rgba(219, 8, 38, 0.08);
                border: none;
                font-size: 12px;
                font-family: PingFangSC-Medium, PingFang SC;
                font-weight: 500;
                color: @theme-color;
                line-height: 12px;
                margin-bottom: 9px;
            }
        }
    }
}
</style>
