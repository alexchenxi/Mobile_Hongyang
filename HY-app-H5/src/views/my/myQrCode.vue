<template>
    <div class="common-page">
        <top-bar :title="'我的邀请码'" />
        <div class="common-page-container" ref="imageBox" :style="{height: pageContainerHeight}">
            <div class="content">
                <img class="my-qrcode-bg" :src="$baseImgUrl + '/extension/my-qr-code.png'" alt="">
                <div class="qrcode-wrap">
                    <div class="qrcode">
                        <img class="qrcode-img" :src="qrcode" alt="">
                    </div>
                    <div class="code-remark">
                        <p class="title">我是【{{ projectName }}】大客户经理</p>
                        <p class="title">诚邀您成为本项目经纪人，请扫一扫上面的二维码注册</p>
                    </div>
                    <div class="split">
                        <div class="split-line"></div>
                        <div class="left-radius"></div>
                        <div class="right-radius"></div>
                    </div>
                    <section class="info">
                        <p class="name text">{{user.name}}</p>
                        <p class="tel text" v-if="user.tel">
                            <i class="iconfont icondianhua"></i>
                            {{user.tel}}
                        </p>
                    </section>
                </div>
                <div class="share-wrap">
                    <i class="iconfont iconfenxiang"></i>
                    <span class="share-text" @click.stop="handleShare">分享</span>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import TopBar from '@c/TopBar'
import QRCode from 'qrcodejs2'
import html2canvas from 'html2canvas'
import API from '@/request/api/my'
import APICOMMON from '@/request/api/commonApi'

export default {
    name: 'qrCode',
    components: {
        TopBar
    },
    computed: {
        ...mapGetters(['currentRole', 'projectId', 'projectName', 'user', 'device'])
    },
    data() {
        return {
            qrcode: null,
            show: false
        }
    },
    mounted() {
        this.getQrCode()
    },
    methods: {
        getQrCode() {
            API.getMyQrcode(this.projectId,this.currentRole.roleCode).then(res => {
                this.qrcode = res
            })
        },
        handleShare() {
            if (this.qrcode) {
                this.$appMethods.DownloadImage(this.device, this.qrcode)
            }
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
    }
}
</script>
<style scoped lang="less">
.common-page-container {
    background: @bg-color;

    .content {
        position: relative;
        padding: 15px 15px 0;
        display: flex;
        justify-content: center;
        height: 484px;
        .my-qrcode-bg {
            position: absolute;
            top: 10px;
            width: 360px;
        }
        .share-wrap {
            position: absolute;
            top: 26px;
            right: 0;
            width: 70px;
            height: 36px;
            line-height: 36px;
            background: @theme-color;
            color: #fff;
            font-size: 14px;
            padding-left: 18px;
            border-radius: 20px 0 0 20px;
            z-index: 100;
            .share-text {
                margin-left: 5px;
            }
        }
        .qrcode-wrap {
            z-index: 9;
            width: 345px;
            border-radius: 4px;
        }

        .code-remark {
            margin: 24px 0 26px;
            text-align: center;
            font-size: 12px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #333333;

            .title {
                line-height: 18px;
            }
        }
    }

    .qrcode {
        padding: 30px 0;
        height: 220px;
        display: flex;
        align-items: center;
        justify-content: center;
        .qrcode-img {
            width: 220px;
        }
    }

    .split {
        position: relative;

        .left-radius,
        .right-radius {
            width: 16px;
            height: 16px;
            top: -8px;
            border-radius: 50%;
            background: @bg-color;
            position: absolute;
        }

        .left-radius {
            left: -8px;
        }

        .right-radius {
            right: -10px;
        }
    }

    .info {
        padding: 20px 30px;
        text-align: left;

        .text {
            font-size: 15px;
            color: #999999;
            line-height: 30px;
        }

        .name {
            font-size: 18px;
            font-weight: 500;
            color: #333;
        }

        .tel {
            color: #666;
            font-size: 18px;
            font-weight: bold;

            .icondianhua {
                margin-right: 7px;
                color: @theme-color;
            }
        }
    }
}
</style>
