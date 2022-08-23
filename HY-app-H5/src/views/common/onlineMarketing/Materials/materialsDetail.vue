<template>
    <div class="common-page">
        <TopBar :title="typeTitle + '详情'"></TopBar>
        <main class="common-page-container" :style="{ height: pageMiddleWithButtonHeight }">
            <div ref="page" class="main-container">
                <div class="title">{{ detail.title }}</div>
                <div class="date">发布时间: {{ detail.publishDate || '--' }}</div>
                <!-- eslint-disable -->
                <div class="content" v-html="detail.content"></div>
            </div>
        </main>
        <ShareBox v-model="show" :options="options" :share-info="shareInfo" :poster-info="posterInfo" />
        <footer>
            <div class="fix-bottom common-fix-bottom" :style="{ paddingBottom: bottomSafe }">
                <van-button round block type="save" @click="handleShare">分享{{ typeTitle }}</van-button>
            </div>
        </footer>
    </div>
</template>

<script>
import TopBar from '@c/TopBar'
import ShareBox from '@/views/common/onlineMarketing/components/ShareBox.vue'
import API from '@/request/api/onlineMarketing'
import html2canvas from 'html2canvas'
import APICOMMON from '@/request/api/commonApi'
export default {
    name: 'MaterialsDetail',
    components: {
        TopBar,
        ShareBox
    },
    data() {
        return {
            typeTitle: '',
            show: false,
            options: [],
            detail: {},
            posterInfo: {
                // 海报图片
                posterImg: '',
                // 小程序码
                qrcode: '',
                // 物料id
                thingId: '',
                // 物料类型
                thingType: ''
            },
            shareInfo: {}
        }
    },
    mounted() {
        let type = this.$route.query.type
        switch (type) {
            case '2':
                this.typeTitle = '广告'
                this.options = ['wechat', 'wechat moment', 'image']
                this.getAdDetail()
                break
            case '4':
                this.typeTitle = '活动'
                this.options = ['wechat', 'wechat moment', 'image']
                break
            case '3':
                this.typeTitle = '资讯'
                this.options = ['wechat', 'wechat moment', 'image']
                this.getNewsDetail()
                break
        }
    },
    methods: {
        handleShare() {
            // 未处理完图片
            if (!this.posterInfo.posterImg) {
                return
            }
            Object.assign(this.posterInfo, {
                thingId: this.detail.id,
                // 物料类型
                thingType: parseInt(this.$route.query.type),
                //标题
                title: this.detail.title
            })
            Object.assign(this.shareInfo, {
                thingId: this.detail.id,
                // 物料类型
                thingType: parseInt(this.$route.query.type),
                //标题
                title: this.detail.title,
                imgUrl: this.detail.img
            })
            this.show = true
        },
        // 广告详情
        async getAdDetail() {
            let params = {
                id: this.$route.query.id
            }
            this.$utils.loading()
            const result = await API.getAdDetail(params)
            this.detail = result
            this.$toast.clear()
            this.$nextTick(async () => {
                this.formatImage()
                this.posterInfo.posterImg = await this.createImage()
            })
        },
        // 新闻详情
        async getNewsDetail() {
            let params = {
                id: this.$route.query.id
            }
            this.$utils.loading()
            const result = await API.getNewsDetail(params)
            this.detail = result
            this.$toast.clear()
            this.$nextTick(async () => {
                this.formatImage()
                this.posterInfo.posterImg = await this.createImage()
            })
        },
        // 生成图片
        async createImage() {
            return new Promise(resolve => {
                let canvasID = this.$refs['page']
                let a = document.createElement('a')
                html2canvas(canvasID, {
                    scale: 2, //按比例增加分辨率
                    useCORS: true
                }).then(canvas => {
                    let dom = document.body.appendChild(canvas)
                    dom.style.display = 'none'
                    a.style.display = 'none'
                    document.body.removeChild(dom)
                    dom.toBlob(function (blob) {
                        let data = new FormData()
                        data.append('file', blob, '.png')
                        APICOMMON.uploadFile(data).then(res => {
                            return resolve(res)
                        })
                    })
                })
            })
        },
        //处理图片跨域
        formatImage() {
            let contentDom = document.getElementsByClassName('content')[0]
            let imgDomList = contentDom.getElementsByTagName('img')
            imgDomList.forEach(item => {
                if (!item.getAttribute('crossorigin')) {
                    item.setAttribute('crossorigin', 'anonymous')
                } else {
                    item.removeAttribute('crossorigin')
                }
            })
        }
    }
}
</script>

<style lang="less" scoped>
.common-page-container {
    .main-container {
        padding: 30px 15px;
    }
    .title {
        font-size: 18px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: @header-text-color;
        margin-bottom: 15px;
    }
    .date {
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: @info-color;
        line-height: 12px;
        margin-bottom: 30px;
    }
    .content {
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #666666;
        line-height: 28px;
        word-break: break-all;
        /deep/ img {
            width: 100% !important;
        }
    }
}
</style>
