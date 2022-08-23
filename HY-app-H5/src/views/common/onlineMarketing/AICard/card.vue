<template>
    <div ref="page" class="common-page">
        <div class="common-page-top">
            <top-bar title="AI名片" :need-white="true" back-path="home" @back="back" />
        </div>
        <div ref="topBg" class="top-bg">
            <img class="top-img" crossorigin="anonymous" :src="$baseImgUrl + '/takelook-bg.png'" />
        </div>
        <div class="common-page-middle" :style="{ height: pageContainerHeight }">
            <div class="card-detail">
                <div class="card">
                    <img crossorigin="anonymous" class="photo" alt="" :src="info.avatar" />
                    <div class="info">
                        <span class="name">{{ info.name }}</span>
                        <van-tag type="primary">{{ currentRole.roleName }}</van-tag>
                        <p class="slogan">{{ info.motto }}</p>
                    </div>
                </div>
                <p class="tel">
                    <i class="iconfont icondianhuahaoma" />
                    手机号码：
                    <span class="value">{{ info.phone }}</span>
                </p>
                <p class="project-name">
                    <i class="iconfont iconloupanmingcheng" />
                    楼盘名称：
                    <span class="value">{{ projectName }}</span>
                </p>
                <p class="address">
                    <i class="iconfont iconloupandizhi" />
                    楼盘地址：
                    <span class="value">{{ info.projectLocation }}</span>
                </p>
                <p class="record">
                    <span class="record-item">
                        浏览
                        <span class="count">{{ info.scans || 0 }}</span>
                    </span>
                    <span class="record-item">
                        点赞
                        <span class="count">{{ info.likes || 0 }}</span>
                    </span>
                    <span class="record-item">
                        保存至通讯录
                        <span class="count">{{ info.addressBooks || 0 }}</span>
                    </span>
                </p>
                <!-- 分割区域 -->
                <div class="split-area">
                    <div class="left-semicircle" />
                    <div class="right-semicircle" />
                </div>
                <!-- 小程序码 -->
                <div class="qrcode-wrap">
                    <img crossorigin="anonymous" class="qrcode" :src="info.qrCode" />
                </div>
            </div>
            <div class="btn-bottom">
                <van-button round block type="save" class="edit-btn" @click="toEdit">编辑名片</van-button>
                <van-button round block type="save" @click="shareCard">分享名片</van-button>
            </div>
        </div>
        <ShareBox v-model="shareShow" :options="shareOptions" :share-info="shareInfo" />
    </div>
</template>
<script>
import TopBar from '@c/TopBar'
import API from '@/request/api/onlineMarketing'
import ShareBox from '@/views/common/onlineMarketing/components/ShareBox'
import html2canvas from 'html2canvas'
import APICOMMON from '@/request/api/commonApi'
import { mapGetters } from 'vuex'
export default {
    name: 'AICard',
    components: {
        TopBar,
        ShareBox
    },
    data() {
        return {
            info: {},
            shareShow: false,
            shareOptions: ['wechat', 'wechat-moments'],
            shareInfo: {
                imgUrl: ''
            }
        }
    },
    computed: {
        ...mapGetters(['projectName', 'currentRole'])
    },
    created() {
        this.getCardDetail()
    },
    methods: {
        // 获取名片详情
        getCardDetail() {
            this.$utils.loading()
            API.getAICardDetail(this.$route.query.id).then(res => {
                this.$toast.clear()
                this.info = res
                this.$nextTick(async () => {
                    this.shareInfo.imgUrl = await this.createImage()
                })
            })
        },
        // 分享名片
        async shareCard() {
            // 未处理完图片
            if (!this.shareInfo.imgUrl) {
                return
            }
            Object.assign(this.shareInfo, {
                thingId: this.info.cardId,
                // 物料类型
                thingType: 5,
                //标题
                title: `我是您的专属顾问${this.info.name}，可点击前往查看我的名片`
            })

            this.shareShow = true
        },
        // 前往编辑名片
        toEdit() {
            this.$router
                .push({
                    path: '/editAICard',
                    query: {
                        id: this.$route.query.id
                    }
                })
                .catch(() => {})
        },
        back() {
            let backPath = ''
            if (this.currentRole.roleCode.includes('ST')) {
                backPath = '/case/home'
            }
            if (this.currentRole.roleCode.includes('ZT')) {
                backPath = '/extension/home'
            }
            this.$router.push(backPath).catch(() => {})
        },
        // 生成图片
        async createImage() {
            return new Promise(resolve => {
                let canvasID = this.$refs['page']
                let a = document.createElement('a')
                html2canvas(canvasID, {
                    scale: 2, //按比例增加分辨率
                    useCORS: true,
                    y: 64,
                    height: 300
                }).then(canvas => {
                    let dom = document.body.appendChild(canvas)
                    dom.style.display = 'none'
                    a.style.display = 'none'
                    document.body.removeChild(dom)
                    dom.toBlob(function(blob) {
                        let data = new FormData()
                        data.append('file', blob, '.png')
                        APICOMMON.uploadFile(data).then(res => {
                            return resolve(res)
                        })
                    })
                })
            })
        }
    }
}
</script>
<style scoped lang="less">
.common-page {
    background: #f6f8fa;
}
.top-bg {
    position: absolute;
    top: 0;
    height: 225px;
    width: 100%;
    .top-img {
        width: 100%;
        height: 100%;
    }
}
.common-page-middle {
    z-index: 2;
    position: relative;
    padding: 0 15px;
    .card-detail {
        position: relative;
        padding: 15px 0 30px 18px;
        margin-top: 30px;
        border-radius: 6px;
        background: #ffffff;
        box-shadow: 0px 2px 12px 0px rgba(0, 47, 134, 0.04);
        .card {
            height: 80px;
            position: relative;
            background: #fff;
            display: flex;
            .photo {
                margin-right: 12px;
                width: 62px;
                height: 100%;
                border-radius: 6px;
                margin-top: -27px;
                border: 2px solid #fff;
                object-fit: cover;
            }
            .info {
                flex: 1;
                padding-top: 6px;
                .name {
                    margin-right: 5px;
                    font-size: 18px;
                    font-family: PingFangSC-Medium, PingFang SC;
                    font-weight: 600;
                    color: #333333;
                    line-height: 18px;
                }
                /deep/ .van-tag {
                    font-size: 11px;
                    padding: 1px 5px;
                    vertical-align: text-top;
                    background: linear-gradient(270deg, #DB0826 0%, #FB2E4B 100%);
                    border-radius: 2px;
                }
                .slogan {
                    margin: 12px 0 8px 0;
                    font-size: 12px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    color: #666666;
                }
            }
        }
        .tel {
            margin-top: -10px;
            z-index: 2;
            margin-bottom: 8px;
            position: relative;
        }
        .project-name {
            z-index: 2;
            margin-bottom: 8px;
            position: relative;
        }
        .tel,
        .address,
        .project-name {
            margin-right: 15px;
            display: flex;
            font-size: 12px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #999999;
            line-height: 12px;
            align-items: flex-start;
            line-height: 18px;
            .iconfont {
                margin-right: 5px;
                color: @theme-color;
            }
            .value {
                color: #333333;
                flex: 1;
                word-break: break-all;
            }
        }
        .record {
            display: flex;
            margin-right: 15px;
            margin-top: 10px;
            align-items: center;
            .record-item {
                display: flex;
                align-items: center;
                font-size: 12px;
                font-weight: 400;
                color: #999999;
                .count {
                    margin-left: 5px;
                    font-size: 18px;
                    font-family: DINAlternate-Bold, DINAlternate;
                    font-weight: bold;
                    color: #333333;
                }
                &:first-child {
                    min-width: 120px;
                }
                &:nth-of-type(2) {
                    min-width: 80px;
                }
            }
        }
        .split-area {
            margin-top: 16px;
            border-bottom: 1px dashed #eaeaea;
            margin-right: 18px;
            padding-bottom: 5px;
            .left-semicircle {
                position: absolute;
                width: 20px;
                height: 20px;
                background: #f6f8fa;
                border-radius: 50% 50%;
                left: -10px;
            }
            .right-semicircle {
                position: absolute;
                width: 20px;
                height: 20px;
                background: #f6f8fa;
                border-radius: 50% 50%;
                right: -10px;
            }
        }
        .qrcode-wrap {
            margin-right: 18px;
            text-align: center;
            margin-top: 30px;
            .qrcode {
                width: 200px;
                height: 200px;
            }
        }
    }
    .btn-bottom {
        margin-top: 34px;
        height: @button-area-height;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .edit-btn {
            margin-right: 10px;
            background: @light-green;
        }
    }
}
</style>
