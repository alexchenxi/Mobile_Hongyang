<template>
    <div ref="scrollWrap" class="common-container">
        <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
            <div v-for="(item, index) in list" :key="index" :class="['item', item.over ? 'disabled' : '']" @click="goDetail">
                <div class="image-section">
                    <van-image fit="fill" :src="item.img" />
                </div>
                <div class="content-section">
                    <div class="item-content">
                        <span class="item-title">
                            <span v-if="item.tag" class="title-tag">{{ item.tag }}</span>
                            {{ item.title }}
                        </span>
                        <span class="item-date">活动截止：{{ item.date }}</span>
                    </div>
                    <div class="item-button">
                        <van-button round @click.stop="handleShare">分享</van-button>
                    </div>
                </div>
            </div>
        </van-list>
        <ShareBox v-model="show" :options="options" />
    </div>
</template>

<script>
import ShareBox from '@/views/common/onlineMarketing/components/ShareBox.vue'
export default {
    components: {
        ShareBox
    },
    data() {
        return {
            loading: false,
            finished: true,
            list: [],
            show: false,
            options: ['wechat', 'wechat-moments', 'poster']
        }
    },
    mounted() {
        this.getDataList()
    },
    methods: {
        onLoad() {
            this.getDataList()
        },
        getDataList() {
            this.list = []
        },
        goDetail() {
            this.$router.push({
                path: '/materialsDetail',
                query: {
                    type: 4
                }
            })
        },
        handleShare() {
            this.show = true
        }
    }
}
</script>

<style lang="less" scoped>
.common-container {
    padding: 0 15px;
    height: 100%;
    overflow: auto;
    .van-list {
        margin-top: 15px;
    }
    .item {
        border-radius: 8px;
        border: 1px solid #f0f0f0;
        margin-bottom: 15px;
        &.disabled {
            opacity: 0.49;
        }
        .image-section {
            height: 150px;
            .van-image {
                height: 100%;
                /deep/ .van-image__img {
                    border-radius: 8px 8px 0 0;
                }
            }
        }
        .content-section {
            .common-flex-between();
            padding: 10px 15px 12px;
            .item-content {
                .common-flex();
                align-items: flex-start;
                flex-direction: column;
                margin-right: 15px;
                .item-title {
                    font-size: 15px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    color: @header-text-color;
                    .title-tag {
                        padding: 4px 7px;
                        font-size: 11px;
                        font-family: PingFangSC-Medium, PingFang SC;
                        font-weight: 500;
                        color: @theme-color;
                        line-height: 11px;
                        background: rgba(219, 8, 38, 0.08);
                        margin-right: 4px;
                    }
                }
                .item-date {
                    font-size: 12px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    color: @info-color;
                    margin-top: 4px;
                }
            }
            .item-button {
                flex-shrink: 0;
                .van-button {
                    width: 68px;
                    height: 39px;
                    padding: 0;
                    background: rgba(219, 8, 38, 0.08);
                    border: none;
                    font-size: 12px;
                    font-family: PingFangSC-Medium, PingFang SC;
                    font-weight: 500;
                    color: @theme-color;
                    line-height: 12px;
                }
            }
        }
    }
}
</style>
