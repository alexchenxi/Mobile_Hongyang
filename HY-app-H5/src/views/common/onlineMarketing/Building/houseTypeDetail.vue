<template>
    <div class="common-page">
        <TopBar title="户型详情"></TopBar>
        <main class="common-page-container" :style="{ height: pageMiddleWithButtonHeight }">
            <div class="container">
                <div class="img-container">
                    <van-swipe height="225" :autoplay="3000" @change="changeSwipe">
                        <van-swipe-item v-for="(img, index) in detail.imgs" :key="index">
                            <van-image crossorigin="anonymous" height="225" fit="fill" :src="img.url" @click="previewImg(index)" />
                        </van-swipe-item>
                        <template #indicator>
                            <div class="custom-indicator">{{ currentSwipe + 1 }}/{{ detail.imgs ? detail.imgs.length : 0 }}</div>
                        </template>
                    </van-swipe>
                </div>
                <div class="sectionBox sectionBox1">
                    <div class="section1">
                        <div class="title">
                            {{ detail.lpName }}
                            <span v-if="detail.saleState !== null" class="title-tag">{{ formatSalseState(detail.saleState) }}</span>
                        </div>
                        <div v-if="detail.tags" class="tags">
                            <span v-for="(tag, index) in detail.tags.split(',')" :key="index" class="tag">{{ tag }}</span>
                        </div>
                    </div>
                    <div class="section2">
                        <div class="section-column">
                            <div class="content red">
                                <span class="text-strong">{{ detail.totalPrice }}</span>
                                万/套
                            </div>
                            <div class="label">参考总价</div>
                        </div>
                        <div class="section-column">
                            <div class="content red">
                                <span class="text-strong">{{ detail.unitPrice }}</span>
                                元/㎡
                            </div>
                            <div class="label">参考单价</div>
                        </div>
                        <div class="section-column">
                            <div class="content">{{ detail.floorSpace }}㎡</div>
                            <div class="label">建筑面积</div>
                        </div>
                    </div>
                    <div class="section3">
                        <van-row gutter="15">
                            <van-col span="14">
                                <div class="section-item">
                                    <div class="label">业态：</div>
                                    <div class="content">{{ detail.formatName }}</div>
                                </div>
                            </van-col>
                            <van-col span="10">
                                <div class="section-item">
                                    <div class="label">产权：</div>
                                    <div class="content">{{ detail.propertyRight }}</div>
                                </div>
                            </van-col>
                        </van-row>
                        <van-row gutter="15">
                            <van-col span="14">
                                <div class="section-item">
                                    <div class="label">套内面积：</div>
                                    <div class="content">{{ detail.actualSpace }}㎡</div>
                                </div>
                            </van-col>
                            <van-col span="10">
                                <div class="section-item">
                                    <div class="label">朝向：</div>
                                    <div class="content">{{ detail.orientation }}</div>
                                </div>
                            </van-col>
                        </van-row>
                        <van-row>
                            <van-col span="24">
                                <div class="section-item">
                                    <div class="label">所属楼盘：</div>
                                    <div class="content link">{{ detail.lpName }}</div>
                                </div>
                            </van-col>
                        </van-row>
                    </div>
                </div>
                <div class="sectionBox sectionBox2">
                    <div class="sectionBox-title">
                        <div class="title-text">本楼其他户型</div>
                        <div class="title-more" @click="toUnitList">
                            更多
                            <van-icon name="arrow" />
                        </div>
                    </div>
                    <div class="container">
                        <HouseTypeSection :unit-type-list="unitTypeList" />
                    </div>
                </div>
            </div>
        </main>
        <ShareBox v-model="show" :options="options" :share-info="shareInfo" :poster-info="posterInfo" />
        <footer>
            <div class="fix-bottom common-fix-bottom" :style="{ paddingBottom: bottomSafe }">
                <van-button round block type="save" @click="handleShare">分享户型</van-button>
            </div>
        </footer>
    </div>
</template>

<script>
import TopBar from '@c/TopBar'
import HouseTypeSection from './components/houseTypeSection.vue'
import ShareBox from '@/views/common/onlineMarketing/components/ShareBox.vue'
import API from '@/request/api/onlineMarketing'
import { mapGetters } from 'vuex'
export default {
    components: {
        TopBar,
        HouseTypeSection,
        ShareBox
    },
    data() {
        return {
            detail: {},
            shareInfo: {},
            posterInfo: {},
            currentSwipe: 0,
            saleStateList: [
                {
                    value: 0,
                    name: '待售'
                },
                {
                    value: 1,
                    name: '在售'
                },
                {
                    value: 2,
                    name: '售罄'
                }
            ],
            unitTypeList: [],
            show: false,
            options: ['wechat', 'wechat-moments', 'poster']
        }
    },
    computed: { ...mapGetters(['projectId']) },
    mounted() {
        this.getDetailData()
        this.getUnitTypeList()
    },
    methods: {
        // 获取户型详情
        async getDetailData() {
            this.detail = await API.getUnitTypeDetail({
                huxingtuId: this.$route.query.id
            })
        },
        // 获取户型
        async getUnitTypeList() {
            this.unitTypeList = await API.getUnitTypeList(this.projectId)
        },
        // 跳转户型列表
        toUnitList() {
            this.$router
                .push({
                    path: '/houseTypeList'
                })
                .catch(() => {})
        },
        previewImg(index) {
            let imgList = this.detail.imgs.map((item) => {
                return item.url
            })
            this.$utils.previewImageList(imgList, index)
        },
        changeSwipe(index) {
            this.currentSwipe = index
        },
        formatSalseState(value) {
            let item = this.saleStateList.find((item) => item.value === value)
            return item ? item.name : ''
        },
        handleShare() {
            this.shareInfo = {
                thingId: this.$route.query.id,
                thingType: 6,
                imgUrl: this.detail.simg,
                title: `${this.detail.lpName} ${this.detail.name}`
            }
            this.posterInfo = {
                posterImg: this.detail.simg,
                qrcode: this.detail.qrcodeImg
            }
            this.show = true
        }
    }
}
</script>

<style lang="less" scoped>
.common-page-container {
    .container {
        background: #ffffff;
        .img-container {
            position: relative;
            .van-swipe-item {
                text-align: center;
            }
            .custom-indicator {
                position: absolute;
                right: 15px;
                bottom: 25px;
                padding: 1px 6px;
                font-size: 12px;
                font-family: PingFangSC-Medium, PingFang SC;
                font-weight: 500;
                color: #ffffff;
                line-height: 12px;
                border-radius: 8px;
                background: rgba(0, 0, 0, 0.49);
            }
            &::after {
                content: '';
                position: absolute;
                bottom: 0;
                left: 0;
                width: 100%;
                height: 10px;
                background: #ffffff;
                border-radius: 10px 10px 0 0;
            }
        }
        .sectionBox {
            padding: 0 15px;
        }
        .sectionBox1 {
            margin-bottom: 15px;
            .section1 {
                padding-top: 11px;
                .title {
                    display: inline-flex;
                    align-items: center;
                    font-size: 20px;
                    font-family: PingFangSC-Medium, PingFang SC;
                    font-weight: 500;
                    color: @header-text-color;
                    margin-bottom: 8px;
                    .title-tag {
                        font-size: 11px;
                        font-family: PingFangSC-Regular, PingFang SC;
                        font-weight: 400;
                        color: #fefffe;
                        line-height: 11px;
                        padding: 3px 6px;
                        margin-left: 12px;
                        background: linear-gradient(90deg, #ff5050, #ff8484);
                        border-radius: 2px;
                    }
                }
                .tags {
                    display: flex;
                    align-items: center;
                    .tag {
                        font-size: 11px;
                        font-family: PingFangSC-Regular, PingFang SC;
                        font-weight: 400;
                        color: #83878f;
                        line-height: 11px;
                        padding: 3px 6px;
                        background: #f3f4f7;
                        border-radius: 1px;
                        margin-right: 4px;
                    }
                }
            }
            .section2 {
                .common-flex();
                align-items: stretch;
                width: 100%;
                margin: 24px 0;
                .section-column {
                    padding: 0 15px;
                    border-right: 1px solid #eaeaea;
                    &:first-child {
                        flex-shrink: 1;
                        flex-grow: 1;
                        padding-left: 0;
                    }
                    &:nth-child(2) {
                        flex-shrink: 0;
                        flex-grow: 1;
                    }
                    &:last-child {
                        flex-shrink: 1;
                        flex-grow: 1;
                        padding-right: 0;
                        border-right: none;
                    }
                    .content {
                        font-size: 15px;
                        font-family: PingFangSC-Regular, PingFang SC;
                        font-weight: 400;
                        color: @header-text-color;
                        line-height: 15px;
                        &.red {
                            font-size: 15px;
                            font-weight: 500;
                            color: #e70120;
                            line-height: 15px;
                            .text-strong {
                                position: relative;
                                top: 1px;
                                font-size: 18px;
                            }
                        }
                    }
                    .label {
                        font-size: 12px;
                        font-family: PingFangSC-Regular, PingFang SC;
                        font-weight: 400;
                        color: @info-color;
                        line-height: 12px;
                        margin-top: 8px;
                    }
                }
            }
            .section3 {
                .van-row {
                    margin-bottom: 12px;
                    &:last-child {
                        margin-bottom: 0;
                    }
                }
                .section-item {
                    .common-flex();
                    font-size: 14px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    line-height: 14px;
                    .label {
                        color: @info-color;
                    }
                    .content {
                        color: @header-text-color;
                        &.link {
                            color: @theme-color;
                        }
                    }
                }
            }
        }
        .sectionBox2 {
            .sectionBox-title {
                .common-flex-between();
                padding: 24px 0;
                .title-text {
                    font-size: 18px;
                    font-family: PingFangSC-Medium, PingFang SC;
                    font-weight: 500;
                    color: @header-text-color;
                    line-height: 18px;
                }
                .title-more {
                    .common-flex();
                    font-size: 12px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    color: #ababab;
                    line-height: 12px;
                    .van-icon {
                        margin-left: 3px;
                        line-height: 9px;
                    }
                }
            }
        }
    }
}
</style>
