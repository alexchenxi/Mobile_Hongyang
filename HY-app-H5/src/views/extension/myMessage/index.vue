<template>
    <div class="common-page">
        <div v-if="currentRole.roleCode === 'ZT_MANAGER' || currentRole.roleCode === 'ZT_DIRECTOR'" class="common-page-top">
            <top-bar title="消息中心"></top-bar>
        </div>
        <div v-else class="common-page-top">
            <top-bar :back="false" title="消息中心"></top-bar>
        </div>
        <div class="common-page-container" :style="{height: pageContainerHeight}">
            <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
                <van-list v-model="loading" offset="10" :finished="finished" finished-text="没有更多了" @load="getInfoList">
                    <template v-for="item in infoList">
                        <div class="info-box" @click="openMessageDetail(item)">
                            <div class="left-col">
                                <img :src="$baseImgUrl + item.imgUrl" alt="">
                                <span class="title">{{ item.title }}</span>
                            </div>
                            <div class="right-col">
                                <div class="time" v-if="item.count && item.time">{{ item.time }}</div>
                                <div class="count" v-if="item.count">{{ item.count }}</div>
                            </div>
                        </div>
                        <div class="split-line"></div>
                    </template>
                </van-list>
            </van-pull-refresh>
        </div>
        {{ currentRole.roleCode }}
        <tab-bar v-if="currentRole.roleCode === 'ZT_MEMBER'" active="/extension/myMessage" :isDot="isDot" :tab-data="tabData" />
<!--        <tab-bar v-else active="/extension/myMessage" :tab-data="tabData" />-->
    </div>
</template>
<script>
import API from '@/request/api/my'
import { mapGetters } from 'vuex'
import TopBar from '@c/TopBar'
import TabBar from '@c/TabBar'

export default {
    name: 'extensionMyMessage',
    components: {
        TopBar,
        TabBar
    },
    computed: {
        ...mapGetters(['tabData', 'currentRole'])
    },
    data() {
        return {
            pageNum: 1,
            pageSize: 10,
            refreshing: false,
            loading: false,
            finished: false,
            isDot: false,
            infoList: []
        }
    },
    created() {
    },
    mounted() {
    },
    methods: {
        getInfoList() {
            API.selfChannelMessageList({ roleCode: this.currentRole.roleCode }).then((res) => {
                this.loading = false
                this.finished = true
                this.refreshing = false
                this.isDot = res?.total ? true : false
                // 渠道经理只有两种消息类型
                if (this.currentRole.roleCode === 'ZT_MANAGER') {
                    this.infoList = [
                        {
                            id: 1,
                            title: '成交喜报',
                            time: res?.dealTime && this.dayjs(res?.dealTime).fromNow(),
                            count: res?.dealNum,
                            imgUrl: '/extension/myMessage/icon-recommend-clients.png'
                        },
                        {
                            id: 5,
                            title: '自渠下线经纪人',
                            time: res?.childBrokerTime && this.dayjs(res?.childBrokerTime).fromNow(),
                            count: res?.childBrokerNum,
                            imgUrl: '/extension/myMessage/icon-housing application.png'
                        }
                    ]
                    return
                }
                this.infoList = [
                    {
                        id: 1,
                        title: '成交喜报',
                        time: res?.dealTime && this.dayjs(res?.dealTime).fromNow(),
                        count: res?.dealNum,
                        imgUrl: '/extension/myMessage/icon-recommend-clients.png'
                    },
                    {
                        id: 2,
                        title: '客户状态变更',
                        time: res?.statusChangeTime && this.dayjs(res?.statusChangeTime).fromNow(),
                        count: res?.statusChangeNum,
                        imgUrl: '/extension/myMessage/icon-new-assigned customer.png'
                    },
                    {
                        id: 3,
                        title: '客户被分配',
                        time: res?.clientLoseTime && this.dayjs(res?.clientLoseTime).fromNow(),
                        count: res?.clientLoseNum,
                        imgUrl: '/extension/myMessage/icon-customer-assigned.png'
                    },
                    {
                        id: 4,
                        title: '新分配客户',
                        time: res?.clientGetTime && this.dayjs(res?.clientGetTime).fromNow(),
                        count: res?.clientGetNum,
                        imgUrl: '/extension/myMessage/icon-recycling-notice.png'
                    },
                    {
                        id: 5,
                        title: '自渠下线经纪人',
                        time: res?.childBrokerTime && this.dayjs(res?.childBrokerTime).fromNow(),
                        count: res?.childBrokerNum,
                        imgUrl: '/extension/myMessage/icon-housing application.png'
                    },
                    {
                        id: 6,
                        title: '考勤补卡',
                        time: res?.signAndClockTime && this.dayjs(res?.signAndClockTime).fromNow(),
                        count: res?.signAndClockNum,
                        imgUrl: '/extension/myMessage/icon-sign.png'
                    }
                ]
            })
        },
        onRefresh() {
            // 清空列表数据
            this.finished = false
            this.loading = true
            this.pageNum = 1
            this.getInfoList()
        },
        // 跳转消息详情
        openMessageDetail(item) {
            this.$router.push({
                path: 'myMessage/detail',
                query: {
                    id: item.id,
                    title: item.title
                }
            })
        }
    }
}
</script>
<style scoped lang="less">
.common-page-container {
    background: @bg-color;

    .info-box {
        display: flex;
        justify-content: space-between;
        padding: 18px 15px;
        background: #FFFFFF;

        .left-col {
            display: flex;
            align-items: center;
            font-size: 16px;

            img {
                width: 44px;
                height: 44px;
            }

            .title {
                margin-left: 10px;
            }
        }

        .right-col {
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            justify-content: center;
            font-size: 12px;
            min-width: 120px;

            .time {
                color: #999;
                margin-bottom: 13px;
            }

            .count {
                font-size: 11px;
                height: 18px;
                width: 30px;
                line-height: 18px;
                border-radius: 9px;
                padding: 0 4px;
                text-align: center;
                font-weight: 500;
                white-space: nowrap;
                color: #fff;
                background: #EA4B57;
            }
        }
    }

    .split-line {
        position: relative;
        left: 60px;
        width: 316px;
        background: #EAEAEA;
        height: 1px;
        z-index: 9;
    }
}
</style>
