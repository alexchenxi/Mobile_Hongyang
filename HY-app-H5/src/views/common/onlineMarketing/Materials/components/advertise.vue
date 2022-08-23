<template>
    <div ref="scrollWrap" class="common-container">
        <van-list v-model="loading" :finished="finished" finished-text="没有更多了" :immediate-check="false" @load="onLoad">
            <div v-for="(item, index) in list" :key="index" class="item" @click="goDetail(item.id)">
                <div class="image-section">
                    <van-image fit="fill" :src="item.img" />
                </div>
                <div class="content-section">
                    <div class="item-title">{{ item.title }}</div>
                    <div class="item-button">
                        <van-button round @click.stop="handleShare(item)">分享</van-button>
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
                pageSize: this.pageParams.pageSize,
                type: 2
            }
            const result = await API.getAdList(params)
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
                    type: 2,
                    id
                }
            })
        },
        handleShare(data) {
            this.shareInfo = {
                thingId: data.id,
                // 物料类型
                thingType: 2,
                //标题
                title: data.title,
                imgUrl: data.img
            }
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
        .image-section {
            height: 150px;
            width: 100%;
            .van-image {
                height: 100%;
                width: 100%;
                /deep/ .van-image__img {
                    border-radius: 8px 8px 0 0;
                }
            }
        }
        .content-section {
            .common-flex-between();
            padding: 10px 15px 12px;
            .item-title {
                font-size: 15px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: @header-text-color;
                margin-right: 15px;
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
