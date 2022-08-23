<template>
    <div ref="page" class="common-page">
        <TopBar title="户型列表"></TopBar>
        <main class="common-page-container" :style="{ height: pageMiddleWithButtonHeight }">
            <van-list>
                <template v-for="(section, index) in list">
                    <div v-if="section.result && section.result.length > 0" :key="index" class="section">
                        <div class="section-title">{{ section.formatName }}</div>
                        <div class="section-content">
                            <div v-for="item in section.result" :key="item.id" class="content-item" @click="goDetail(item.id)">
                                <div class="content-left">
                                    <img class="house-img" crossorigin="anonymous" width="110" height="110" :src="formatImgUrl(item.simg)" />
                                </div>
                                <div class="content-right">
                                    <div class="content-title">
                                        {{ item.structure }}
                                        <span class="title-tag">{{ formatSalseState(item.saleState) }}</span>
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
                                    <div v-if="item.tags" class="content-taglist">
                                        <span v-for="(tag, tagIndex) in item.tags.split(',')" :key="tagIndex" class="tag">{{ tag }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
            </van-list>
        </main>
        <ShareBox v-model="show" :share-info="shareInfo" />
        <footer>
            <div class="fix-bottom common-fix-bottom" :style="{ paddingBottom: bottomSafe }">
                <van-button round block type="save" @click="handleShare">分享户型列表</van-button>
            </div>
        </footer>
    </div>
</template>

<script>
import TopBar from '@c/TopBar'
import { mapGetters } from 'vuex'
import ShareBox from '@/views/common/onlineMarketing/components/ShareBox.vue'
import API from '@/request/api/onlineMarketing'
import html2canvas from 'html2canvas'
import APICOMMON from '@/request/api/commonApi'
export default {
    components: {
        TopBar,
        ShareBox
    },
    data() {
        return {
            list: [],
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
            show: false,
            shareInfo: {
                imgUrl: ''
            }
        }
    },
    computed: { ...mapGetters(['projectId', 'projectName']) },
    mounted() {
        this.getDataList()
    },
    methods: {
        async getDataList() {
            this.list = await API.getUnitTypeList(this.projectId)
            this.$nextTick(async () => {
                this.shareInfo.imgUrl = await this.createImage()
            })
        },
        formatSalseState(value) {
            let item = this.saleStateList.find((item) => item.value === value)
            return item ? item.name : ''
        },
        goDetail(id) {
            this.$router.push({
                path: '/houseTypeDetail',
                query: {
                    id: id
                }
            })
        },
        handleShare() {
            Object.assign(this.shareInfo, {
                thingId: this.projectId,
                thingType: 7,
                title: this.projectName
            })
            this.show = true
        },
        // 生成图片
        async createImage() {
            return new Promise((resolve) => {
                let canvasID = this.$refs['page']
                let a = document.createElement('a')
                html2canvas(canvasID, {
                    scale: 2, //按比例增加分辨率
                    useCORS: true,
                    y: 64,
                    height: 300
                }).then((canvas) => {
                    let dom = document.body.appendChild(canvas)
                    dom.style.display = 'none'
                    a.style.display = 'none'
                    document.body.removeChild(dom)
                    dom.toBlob(function (blob) {
                        let data = new FormData()
                        data.append('file', blob, '.png')
                        APICOMMON.uploadFile(data).then((res) => {
                            return resolve(res)
                        })
                    })
                })
            })
        },
        // 图片路径加时间戳
        formatImgUrl(url) {
            return url + '?' + new Date().getTime()
        }
    }
}
</script>

<style lang="less" scoped>
.common-page-container {
    padding: 0 15px;
    .section-title {
        font-size: 18px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #000000;
        line-height: 18px;
        padding: 24px 0;
    }
    .section-content {
        .content-item {
            .common-flex();
            align-items: flex-start;
            margin-bottom: 24px;
            .content-left {
                width: 110px;
                height: 110px;
                margin-right: 15px;
                .house-img {
                    object-fit: fill;
                }
            }
            .content-right {
                .content-title {
                    font-size: 16px;
                    font-family: PingFangSC-Medium, PingFang SC;
                    font-weight: 500;
                    color: @header-text-color;
                    margin-bottom: 10px;
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
                .content-desc {
                    font-size: 14px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    color: @header-text-color;
                    margin-bottom: 8px;
                    .direction {
                        margin-left: 24px;
                    }
                }
                .content-price {
                    font-size: 12px;
                    font-family: PingFangSC-Medium, PingFang SC;
                    font-weight: 500;
                    color: #e70120;
                    line-height: 18px;
                    margin-bottom: 10px;
                    .price-text {
                        position: relative;
                        top: 1px;
                        font-size: 18px;
                        line-height: 18px;
                    }
                }
                .content-taglist {
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
        }
    }
}
</style>
