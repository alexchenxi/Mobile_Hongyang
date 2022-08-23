<template>
    <div class="common-page">
        <div class="common-page-top">
            <top-bar title="待办中心"></top-bar>
        </div>
        <div class="common-page-container" :style="{ height: pageContainerHeight }">
            <van-list v-model="loading" offset="10" :finished="finished">
                <template v-for="item in infoList">
                    <div class="info-box" @click="openMessageDetail(item)">
                        <div class="left-col">
                            <img :src="$baseImgUrl + item.imgUrl" alt="" />
                            <span class="title">{{ item.title }}</span>
                        </div>
                        <div class="right-col">
                            <div class="count" v-if="item.count">{{ item.count }}</div>
                        </div>
                    </div>
                    <div class="split-line"></div>
                </template>
            </van-list>
        </div>
    </div>
</template>
<script>
import API from '@/request/api/my'
import { mapGetters } from 'vuex'
import TopBar from '@c/TopBar'

export default {
    name: 'toDoCenterMiddlePage',
    components: {
        TopBar
    },
    computed: {
        ...mapGetters(['tabData', 'currentRole']),
    },
    data() {
        return {
            pageNum: 1,
            pageSize: 10,
            refreshing: false,
            loading: false,
            finished: true,
            infoList: [],
        }
    },
    created() {},
    mounted() {
        const toDoCountInfo = sessionStorage.getItem('toDoCountInfo')
        this.infoList = [
            {
                id: 1,
                title: '自渠下线经纪人解绑申请',
                count: toDoCountInfo?.bind,
                imgUrl: '/extension/myMessage/icon-recommend-clients.png',
            },
            {
                id: 2,
                title: '自渠人员补卡申请',
                count: toDoCountInfo?.sign,
                imgUrl: '/extension/myMessage/icon-housing application.png',
            },
        ]
    },
    methods: {
        // 跳转消息详情
        openMessageDetail(item) {
            this.$router.push({
                path: '/my/toDoCenter',
                query: {
                    id: item.id,
                    title: item.title,
                },
            })
        },
    },
}
</script>
<style scoped lang="less">
.common-page-container {
    background: @bg-color;

    .info-box {
        display: flex;
        justify-content: space-between;
        padding: 18px 15px;
        background: #ffffff;

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
            min-width: 60px;

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
                background: #ea4b57;
            }
        }
    }

    .split-line {
        position: relative;
        left: 60px;
        width: 316px;
        background: #eaeaea;
        height: 1px;
        z-index: 9;
    }
}
</style>
