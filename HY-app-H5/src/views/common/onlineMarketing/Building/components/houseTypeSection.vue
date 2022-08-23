<template>
    <div class="houseType-container">
        <van-tabs type="card" animated>
            <template v-for="tab in unitTypeList">
                <van-tab v-if="tab.result && tab.result.length > 0" :key="tab.formatId" :title="tab.formatName">
                    <div class="houseType-list">
                        <div v-for="item in tab.result" :key="item.id" class="houseType-item">
                            <van-image crossorigin="anonymous" width="120" height="158" fit="fill" :src="formatImgUrl(item.simg)" @click="previewImg(item.simg)" />
                            <div class="content">
                                <div class="content-title">
                                    {{ item.structure }}
                                </div>
                                <div class="content-desc">
                                    建筑约{{ item.floorSpace }}㎡
                                    <span class="direction">{{ item.orientation }}</span>
                                </div>
                                <div class="content-price">
                                    约
                                    <span class="price-text">{{ item.totalPrice }}</span>
                                    万/套
                                </div>
                            </div>
                        </div>
                    </div>
                </van-tab>
            </template>
        </van-tabs>
    </div>
</template>

<script>
export default {
    props: {
        unitTypeList: {
            type: Array,
            default: () => {
                return []
            }
        }
    },
    data() {
        return {
            data: []
        }
    },
    mounted() {},
    methods: {
        previewImg(img) {
            this.$utils.previewImageList([img], 0)
        },
        // 图片路径加时间戳
        formatImgUrl(url) {
            return url + '?' + new Date().getTime()
        }
    }
}
</script>

<style lang="less" scoped>
.houseType-container {
    /deep/ .van-tabs {
        .van-tabs__nav--card {
            border: none;
            margin: 0;
            padding: 0;
            height: 24px;
            .van-tab {
                flex: inherit;
                margin-right: 10px;
                border: 1px solid #eeeeee;
                font-size: 11px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: @header-text-color;
                padding: 0 9px;
                border-radius: 2px;
                &.van-tab--active {
                    color: #ffffff;
                    border: 1px solid @theme-color;
                }
            }
        }
    }
    .houseType-list {
        .common-flex();
        padding: 18px 0 15px;
        overflow-x: auto;
        .houseType-item {
            margin-right: 10px;
            &:last-child {
                margin-right: 0;
            }
            .van-image {
                padding: 15px;
                border: 1px solid #eeeeee;
            }
            .content {
                margin-top: 15px;
                .content-title {
                    font-size: 16px;
                    font-family: PingFangSC-Medium, PingFang SC;
                    font-weight: 500;
                    color: @header-text-color;
                    margin-bottom: 6px;
                }
                .content-desc {
                    font-size: 14px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    color: @header-text-color;
                    margin-bottom: 6px;
                    .direction {
                        margin-left: 24px;
                    }
                }
                .content-price {
                    font-size: 12px;
                    font-family: PingFangSC-Medium, PingFang SC;
                    font-weight: 500;
                    color: #e70120;
                    line-height: 12px;
                }
            }
        }
    }
}
</style>
