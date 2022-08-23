<template>
    <div ref="scrollWrap" class="common-container">
        <van-list v-model="loading" :finished="finished" finished-text="没有更多了" :immediate-check="false" @load="onLoad">
            <div v-for="(item, index) in list" :key="index" class="item" @click="goDetail(item.id)">
                <div class="content-section">
                    <div class="item-title">
                        <span v-if="item.newsTypeName" class="title-tag">{{ item.newsTypeName }}</span>
                        {{ item.title }}
                    </div>
                    <div class="content-bottom">
                        <span class="item-date">{{ formatDate(item.updateDate) }}</span>
                        <van-button round @click.stop="handleShare(item)">分享</van-button>
                    </div>
                </div>
                <div class="image-section">
                    <van-image fit="fill" :src="item.img" />
                </div>
            </div>
        </van-list>
        <ShareBox v-model="show" :options="shareOptions" :share-info="shareInfo" />
    </div>
</template>

<script>
import ShareBox from '@/views/common/onlineMarketing/components/ShareBox.vue'
import API from '@/request/api/onlineMarketing'
export default {
    components: {
        ShareBox
    },
    data() {
        return {
            loading: true,
            finished: false,
            list: [],
            show: false,
            pageParams: {
                pageNum: 1,
                pageSize: 10
            },
            newsTypeList: [],
            shareInfo: {},
            shareOptions: ['wechat']
        }
    },
    mounted() {
        this.getDataList()
    },
    methods: {
        async getDataList() {
            let params = {
                pageNum: this.pageParams.pageNum,
                pageSize: this.pageParams.pageSize
            }
            const result = await API.getNewsList(params)
            this.list = this.list.concat(result.list)
            if (result.list.length < this.pageParams.pageSize) {
                this.finished = true
            } else {
                this.finished = false
            }
            this.loading = false
        },
        onLoad() {
            if (this.finished) return
            this.pageParams.pageNum += 1
            this.getDataList()
        },
        goDetail(id) {
            this.$router.push({
                path: '/materialsDetail',
                query: {
                    type: 3,
                    id
                }
            })
        },
        handleShare(data) {
            this.shareInfo = {
                thingId: data.id,
                // 物料类型
                thingType: 3,
                //标题
                title: data.title,
                imgUrl: data.img
            }
            this.show = true
        },
        formatDate(val) {
            let date = val.split(' ')[0].replace(/-/g, '/')
            return date
        }
    }
}
</script>

<style lang="less" scoped>
.common-container {
    height: 100%;
    overflow: auto;
    .item {
        .common-flex-between();
        align-items: inherit;
        padding: 15px;
        border-bottom: 1px solid #eeeeee;
        &:last-child {
            border-bottom: none;
        }
        .image-section {
            flex-shrink: 0;
            width: 120px;
            height: 90px;
            text-align: center;
            .van-image {
                height: 100%;
            }
        }
        .content-section {
            flex-grow: 1;
            .common-flex-between();
            align-items: flex-start;
            flex-direction: column;
            padding-right: 15px;
            .item-title {
                font-size: 15px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: @header-text-color;
                line-height: 24px;
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
            .content-bottom {
                width: 100%;
                .common-flex-between();
                align-items: flex-end;
                .item-date {
                    font-size: 12px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    color: @info-color;
                    margin-top: 4px;
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
                }
            }
        }
    }
}
</style>
