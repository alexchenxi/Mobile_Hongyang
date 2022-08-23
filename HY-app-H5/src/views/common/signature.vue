<template>
    <div class="common-page">
        <div class="common-page-container" :style="pageStyle">
            <canvas class="canvas" :width="width - 56" :height="height - 24" id="canvas" @touchend="touchEnd" @touchmove.stop.prevent="touchMove" @touchstart="touchStar"></canvas>
            <canvas class="canvas-img" :width="height - 24" :height="width - 56" id="canvasImg"></canvas>
            <div class="top-wrap" :style="{width: '38px'}">
                <div class="top" :style="{ width: height - 24 + 'px', top: '0px' }">
                    <i class="iconfanhui iconfont" @click="back"></i>
                    <span class="name">在线签名</span>
                    <div class="btn-wrap">
                        <div class="reset-btn" @click="resetCanvas">重置</div>
                        <div @click="save" class="save-btn">保存</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import COMMONAPI from '@/request/api/commonApi'
import API from '@/request/api/my'
import { mapGetters } from 'vuex'
export default {
    name: 'signature',
    data() {
        return {
            canvas: null,
            cxt: null,
            clientHeight: document.body.clientHeight,
            height: null,
            width: document.body.clientWidth,
            // 是否开始签名
            isSign: false
        }
    },
    computed: {
        ...mapGetters(['safeArea', 'currentRole', 'keepAliveList']),
        pageStyle: function() {
            return {
                height: `${this.height}px`,
                'margin-top': `${this.safeArea.topSafe}px`
            }
        }
    },
    created() {
        this.height = parseInt(this.clientHeight) - parseInt(this.safeArea.topSafe) - parseInt(this.safeArea.bottomSafe)
    },
    mounted() {
        this.canvas = document.querySelector('#canvas')
        this.cxt = this.canvas.getContext('2d')
        this.drawInitText()
    },
    methods: {
        back() {
            this.$router.go(-1)
        },
        // 上传成功
        uploadSuccess(imgUrl) {
            let params = {
                recordId: this.$route.query.id,
                autograph: {
                    fieldValue: imgUrl,
                    fieldKey: this.currentRole.roleCode,
                    fieldName: this.currentRole.name
                }
            }
            API.saveSign(params)
                .then(res => {
                    this.$toast.clear()
                    this.$toast({
                        message: '保存成功',
                        className: 'custom-toast',
                        duration: 1000
                    })
                    this.$store.dispatch('other/setSaveSign', true)
                    setTimeout(() => {
                        this.back()
                    }, 1000)
                })
                .catch(err => {
                    this.$toast.clear()
                    this.$toast({
                        message: err,
                        className: 'custom-toast'
                    })
                })
        },
        // 绘制初始化文字
        drawInitText() {
            this.isSign = false
            this.cxt.save()
            this.cxt.fillStyle = '#ddd'
            this.cxt.shadowBlur = 0
            this.cxt.strokeStyle = '#ddd'
            this.cxt.font = '50px PingFangSC-Medium, PingFang SC'
            // 先位移坐标到中心
            this.cxt.translate(this.canvas.width / 2, this.canvas.height / 2)
            // // 旋转90度
            this.cxt.rotate((90 * Math.PI) / 180)
            this.cxt.fillText('此处签名', -100, 10)
            this.cxt.restore()
        },
        // 重置
        resetCanvas() {
            this.cxt.fillStyle = '#f6f7f9'
            this.cxt.fillRect(0, 0, this.canvas.width, this.canvas.height)
            this.drawInitText()
        },
        touchStar(e) {
            this.cxt.beginPath()
            this.cxt.fillStyle = '#f6f7f9'
            if (!this.isSign) {
                this.cxt.fillRect(0, 0, this.canvas.width, this.canvas.height)
                this.isSign = true
            }
            this.cxt.strokeStyle = '#000'
            this.cxt.lineWidth = 1
            this.cxt.lineCap = 'round' // 线条末端添加圆形线帽，减少线条的生硬感
            this.cxt.lineJoin = 'round' // 线条交汇时为原型边角
            // 利用阴影，消除锯齿
            this.cxt.shadowBlur = 1
            this.cxt.shadowColor = '#000'

            this.cxt.moveTo(e.changedTouches[0].pageX, e.changedTouches[0].pageY - (this.safeArea.topSafe + 12))
        },
        touchEnd(e) {
            this.cxt.closePath()
        },
        touchMove(e) {
            this.cxt.lineTo(e.changedTouches[0].pageX, e.changedTouches[0].pageY - (this.safeArea.topSafe + 12))
            this.cxt.stroke()
        },
        save() {
            if (!this.isSign) {
                this.$toast({
                    message: '请先完成签名',
                    className: 'custom-toast'
                })
                return
            }
            this.$toast.loading({
                message: '加载中...',
                duration: 0,
                forbidClick: true,
                loadingType: 'spinner',
                className: 'custom-toast'
            })
            let that = this
            //建立画布，因为要旋转，所以新画布的宽就是原画布的高，新画布的高就是原画布的宽。
            //重新绘制图像
            let ctx = document.querySelector('#canvasImg').getContext('2d')
            let canvas2 = document.querySelector('#canvasImg')
            //新建img对象
            let img = new Image()
            //把img的值设置为原画布的base64数据;
            //绘制
            img.onload = function(ev) {
                //获取新画布的宽高中心点
                let width = canvas2.width / 2
                let height = canvas2.height / 2
                //保存canvas状态
                ctx.save()
                //把canvas的 0,0（起点位置）设置为中心点
                ctx.translate(width, height)
                //画布旋转（旋转度数需要用  度数 *Math.PI/180 来计算）
                ctx.rotate((-90 * Math.PI) / 180)
                //绘图
                ctx.drawImage(img, -img.width / 2, -img.height / 2)
                //恢复canvas状态
                ctx.restore()
                document.querySelector('#canvasImg').toBlob(function(blob) {
                    let data = new FormData()
                    // 装载图片数据
                    data.append('file', blob, '.png')
                    COMMONAPI.uploadFile(data)
                        .then(res => {
                            that.uploadSuccess(res)
                        })
                        .catch(err => {
                            that.$toast.clear()
                            that.$toast({
                                message: err,
                                className: 'custom-toast'
                            })
                        })
                })
            }
            img.src = this.canvas.toDataURL('image/png')
        }
    }
}
</script>
<style scoped lang="less">
.common-page {
    width: 100%;
    height: 100%;
}
.canvas {
    margin-top: 12px;
    margin-left: 12px;
    position: relative;
    background: #f6f7f9;
    border-radius: 4px;
    border: 1px solid #e6e7e9;
    border-style: dashed;
}
.top {
    transform: rotate(90deg);
    transform-origin: 0 0;
    position: absolute;
    justify-content: center;
    align-items: center;
    left: 80%;
    display: flex;
    .iconfanhui {
        position: absolute;
        left: -5px;
        padding: 0 5px;
        font-weight: 600;
    }
    .name {
        font-size: 18px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 600;
        color: #030303;
    }
    .btn-wrap {
        position: absolute;
        right: 0;
        display: flex;
        font-size: 12px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        line-height: 24px;
    }
    .save-btn {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-left: 10px;
        width: 74px;
        height: 24px;
        background: @theme-color;
        border-radius: 22px;
        color: #fff;
    }
    .reset-btn {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 74px;
        height: 24px;
        background: #f4f4f4;
        border-radius: 22px;
        color: #999999;
    }
}

.img1 {
    width: 50px;
    height: 100px;
    transform: rotate(-90deg);
}
.canvas-img {
    top: 1000px;
    position: absolute;
}
.common-page-container {
    position: relative;
    overflow: hidden;
    .top-wrap {
        // display: inline-block;
        margin-top: 12px;
        height: calc(100% - 24px);
        position: relative;
        float: right;
        
    }
}
</style>
<style>
.custom-toast {
    transform: translate3d(-50%, -50%, 0) rotate(90deg);
}
</style>
