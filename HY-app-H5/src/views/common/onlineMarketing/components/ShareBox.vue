<template>
    <div>
        <van-share-sheet v-model="showShare" class="custom-share-sheet" title="分享至" :options="checkOptions" get-container="body" @select="onSelect" />
        <!-- 生成海报 -->
        <van-popup v-model="showPoster" class="poster-popup" closeable position="bottom" :style="{ height: '80%' }">
            <p class="title">{{ popupTitle }}</p>
            <section class="poster-content" :style="{ height: posterHeight }">
                <div ref="posterBox" class="poster">
                    <img crossorigin="anonymous" class="poster-img" :src="formatImgUrl(posterInfo.posterImg)" />
                    <div class="user-info">
                        <img
                            crossorigin="anonymous"
                            class="avatar"
                            width="30px"
                            height="30px"
                            radius="15"
                            :src="user.avatar ? formatImgUrl(user.avatar) : formatImgUrl($baseImgUrl + '/default-avatar.png')"
                        />
                        <div class="info">
                            <p class="name">{{ user.name }}</p>
                            <span class="tel">{{ user.tel }}</span>
                        </div>
                        <img crossorigin="anonymous" class="qrcode" width="30px" height="30px" radius="15" :src="formatImgUrl(posterInfo.qrcode)" />
                    </div>
                </div>
            </section>
            <div class="common-fix-bottom" :style="{ paddingBottom: bottomSafe }">
                <van-button round block type="save" native-type="submit" @click="savePoster">{{ popupBtnText }}</van-button>
            </div>
        </van-popup>
    </div>
</template>

<script>
import html2canvas from 'html2canvas'
import { mapGetters } from 'vuex'
import APICOMMON from '@/request/api/commonApi'
import API from '@/request/api/onlineMarketing'
export default {
    props: {
        value: Boolean,
        options: {
            type: Array,
            default: () => ['wechat', 'wechat-moments']
        },
        // 海报信息
        posterInfo: {
            type: Object,
            default: () => {
                return {
                    // 海报图片
                    posterImg: '',
                    // 小程序码
                    qrcode: '',
                    // 物料id
                    thingId: '',
                    // 物料类型
                    thingType: ''
                }
            }
        },
        // 分享信息
        shareInfo: {
            type: Object,
            default: () => {
                return {
                    // 物料id
                    thingId: '',
                    // 物料类型
                    thingType: '',
                    //标题
                    title: '',
                    //内容
                    text: '',
                    // 图片
                    imgUrl: ''
                }
            }
        }
    },
    data() {
        return {
            defaultOptions: [
                { name: '微信', value: 'wechat', icon: process.env.VUE_APP_IMG_URL + '/onlineMarketing/wechat.png' },
                // { name: '微信朋友圈', value: 'wechat-moments', icon: process.env.VUE_APP_IMG_URL + '/onlineMarketing/wechat-moments.png' },
                { name: '复制链接', value: 'link', icon: process.env.VUE_APP_IMG_URL + '/onlineMarketing/link.png' },
                { name: '生成海报', value: 'poster', icon: process.env.VUE_APP_IMG_URL + '/onlineMarketing/poster.png' },
                { name: '保存图片', value: 'image', icon: process.env.VUE_APP_IMG_URL + '/onlineMarketing/image.png' }
            ],
            checkOptions: [],
            // 是否展示海报
            showPoster: false,
            // 海报高度
            posterHeight: 0,
            // 小程序路径
            pages: new Map([
                // 项目详情
                [1, 'pages/building/detail'],
                // 广告详情
                [2, 'pages/advPageDetail'],
                // 资讯详情
                [3, 'subPages/information/detail'],
                // 活动
                // [4, 'pages/building/detail'],
                // AI名片详情
                [5, 'subPageBusiness/business/detail/detail'],
                // 户型详情
                [6, 'subPages/building/unit-type-detail/unit-type-detail'],
                // 户型列表
                [7, 'subPages/building/unit-type-list/unit-type-list'],
                // 物品-优惠券
                [8, 'pages/building/detail']
            ]),
            popupTitle: '',
            popupBtnText: ''
        }
    },
    computed: {
        showShare: {
            get() {
                return this.value
            },
            set(v) {
                this.$emit('input', v)
            }
        },
        ...mapGetters(['device', 'user', 'projectId'])
    },
    watch: {
        options: {
            handler(newVal) {
                this.checkOptions = []
                if (newVal.length === 0) {
                    newVal = ['wechat', 'wechat-moments']
                }
                newVal.map((item) => {
                    let option = this.defaultOptions.find((option) => option.value === item)
                    if (option) {
                        this.checkOptions.push(option)
                    }
                })
            },
            deep: true,
            immediate: true
        }
    },
    created() {},
    mounted() {
        this.posterHeight = 'calc(100% - ' + (60 + this.buttonAreaHeight + parseFloat(this.bottomSafe)) + 'px)'
    },
    methods: {
        async onSelect(option) {
            this.showShare = false
            // 微信好友
            if (option.value === 'wechat') {
                let { thingId, thingType, title, text, imgUrl } = this.shareInfo
                const params = {
                    thingId: thingId,
                    thingType: thingType,
                    projectId: this.projectId,
                    shareUserId: this.user.id,
                    obtainCustomerType: 1
                }
                let scene = await APICOMMON.generateShortScene(params)
                this.$appMethods.shareProgramWithTitle(this.device, {
                    title: title, //标题
                    text: text, //内容
                    imgUrl: imgUrl, //图片
                    url: imgUrl, // h5地址
                    copy: false, // 是否有复制链接
                    miniProgramType: 2, //0-正式，1-开发，2-体验
                    xcxId: this.isSAAS ? 'gh_1446ae829af9' : 'gh_7466f026a7d0', //原始ID
                    xcxPath: `/${this.pages.get(thingType)}?scene=${scene}` //小程序路径
                })

                return
            }
            // 海报
            if (option.value === 'poster') {
                this.popupTitle = '生成海报'
                this.popupBtnText = '保存海报'
                this.showPoster = true
                this.qrcodeGenerate()
                return
            }
            // 保存图片
            if (option.value === 'image') {
                this.popupTitle = '生成图片'
                this.popupBtnText = '保存图片'
                this.showPoster = true
                this.qrcodeGenerate()
                return
            }
        },
        // 保存海报
        async savePoster() {
            const imgUrl = await this.createImage()
            this.$appMethods.DownloadImage(this.device, imgUrl)
        },
        // 生成图片
        async createImage() {
            return new Promise((resolve) => {
                let canvasID = this.$refs['posterBox']
                let that = this
                let a = document.createElement('a')
                html2canvas(canvasID, {
                    useCORS: true,
                    scale: 2 //按比例增加分辨率
                }).then((canvas) => {
                    let dom = document.body.appendChild(canvas)
                    dom.style.display = 'none'
                    a.style.display = 'none'
                    document.body.removeChild(dom)
                    let blob = that.dataURLToBlob(dom.toDataURL('image/png'))
                    var data = new FormData()
                    // 装载图片数据
                    data.append('file', blob, new Date().getTime() + '.png')
                    APICOMMON.uploadFile(data).then((res) => {
                        return resolve(res)
                    })
                })
            })
        },
        //图片格式转换方法
        dataURLToBlob(dataurl) {
            let arr = dataurl.split(',')
            let mime = arr[0].match(/:(.*?);/)[1]
            let bstr = atob(arr[1])
            let n = bstr.length
            let u8arr = new Uint8Array(n)
            while (n--) {
                u8arr[n] = bstr.charCodeAt(n)
            }
            return new Blob([u8arr], { type: mime })
        },
        async qrcodeGenerate() {
            let { thingId, thingType } = this.posterInfo
            const params = {
                thingId: thingId,
                thingType: thingType,
                projectId: this.projectId,
                shareUserId: this.user.id,
                obtainCustomerType: 1
            }

            this.$utils.loading()
            let obj = {
                path: `${this.pages.get(thingType)}`,
                params: params
            }
            const result = await API.qrcodeGenerate(obj)
            this.posterInfo.qrcode = result
            this.$toast.clear()
        },
        // 图片路径加时间戳
        formatImgUrl(url) {
            return url + '?' + new Date().getTime()
        }
    }
}
</script>

<style lang="less" scoped>
.custom-share-sheet {
    /deep/ .van-share-sheet__header {
        padding: 24px 0;
        .van-share-sheet__title {
            font-size: 18px;
            font-family: PingFangSC-Semibold, PingFang SC;
            font-weight: 600;
            color: @header-text-color;
            line-height: 18px;
            margin: 0;
        }
    }
    /deep/ .van-share-sheet__options {
        padding: 6px 15px 29px;
    }
    /deep/ .van-share-sheet__option {
        flex: 1;
    }
    /deep/ .van-share-sheet__cancel {
        font-size: 16px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: @header-text-color;
        &::before {
            background-color: #eeeeee;
            height: 1px;
            margin: 0 30px;
        }
    }
}
.poster-popup {
    border-radius: 8px 8px 0px 0px;
    .title {
        text-align: center;
        font-size: 18px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #333333;
        line-height: 60px;
    }
    /deep/ .van-popup__close-icon--top-right {
        font-size: 18px;
        top: 23px;
    }
    .poster-content {
        margin: 0 15px;
        height: 481px;
        background: #f6f8fa;
        display: flex;
        justify-content: center;
        align-items: center;
        .poster {
            width: 200px;
            height: calc(100% - 48px);
            background: #fff;
        }
        .poster-img {
            width: 100%;
            height: calc(100% - 60px);
            /deep/ .van-image__img {
                max-height: 100%;
                height: auto;
            }
        }
        .user-info {
            padding: 0 10px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 60px;
            .avatar {
                border-radius: 50% 50%;
            }
            .info {
                margin-left: 6px;
                flex: 1;
                .name {
                    font-size: 13px;
                    font-family: PingFangSC-Medium, PingFang SC;
                    font-weight: 600;
                    color: #333333;
                    line-height: 13px;
                }
                .tel {
                    font-size: 10px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    color: #999999;
                }
            }
        }
    }
}
.common-fix-bottom {
    box-shadow: none;
}
</style>
