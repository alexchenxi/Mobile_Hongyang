<template>
    <div class="container" v-if="data.length>0">
        <div class="common-title">
            <div class="flex-style">
                <div class="title"> 接待中</div>
                <div class="tips flex-style"><span class="iconfont icontishi"></span><span
                    class="text">您有新客户啦，请尽快处理！</span></div>
            </div>
            <div class="num-style"><span class="big num">{{selectIndex * 1 + 1}}</span><span
                class="num">/{{data.length > 10 ? '10+' : data.length}}</span>组客户
            </div>
        </div>
        <!-- 超过一个要展示下一个，无法从配置去区分，只能写两组 -->
        <van-swipe v-if="data.length>1" @change="onChange" ref="swipe" class="my-swipe" :show-indicators="false"
                   :loop="false" :width='340'>
            <van-swipe-item :key="index" v-for="(item,index) in data">
                <div :class="['li', item.className]">
                    <img class="img-style" :src="item.bgUrl" />
                    <div v-if="item.voluntary" class="reception-help">义务</div>
                    <div style="display: flex;align-items: center;">
                        <div class="status">{{item.statusName}}</div>
                        <div class="info">
                            <div class="base-info"><span class="name van-ellipsis">{{item.customerName}}</span> <span
                                class="tel">{{item.customerTel}}</span></div>
                            <div class="num-info"><span class="tel">随行人数:</span><span><span
                                class="num">{{item.companionNumber}}</span>人</span>
                            </div>
                        </div>
                    </div>
                    <!-- <div class="btn">查看</div> -->
                    <div class="btn" v-code="['ST.HOME.BUTTON','ST.HOME.BUTTON.COMPLETE']" @click="reception(item)">
                        完成接待
                    </div>
                </div>
            </van-swipe-item>
        </van-swipe>
        <van-swipe v-else @change="onChange" ref="swipe" class="my-swipe" :show-indicators="false">
            <van-swipe-item :key="index" v-for="(item,index) in data">
                <div :class="['li', item.className]">
                    <img class="img-style" :src="item.bgUrl" />
                    <div v-if="item.voluntary" class="reception-help">义务</div>
                    <div style="display: flex;align-items: center;">
                        <div class="status">{{item.statusName}}</div>
                        <div class="info">
                            <div class="base-info"><span class="name van-ellipsis">{{item.customerName}}</span> <span
                                class="tel">{{item.customerTel}}</span></div>
                            <div class="num-info"><span class="tel">随行人数:</span><span><span
                                class="num">{{item.companionNumber}}</span>人</span>
                            </div>
                        </div>
                    </div>
                    <!-- <div class="btn">查看</div> -->
                    <div class="btn" v-code="['ST.HOME.BUTTON','ST.HOME.BUTTON.COMPLETE']" @click="reception(item)">
                        完成接待
                    </div>
                </div>
            </van-swipe-item>
        </van-swipe>
        <ClientTypeSetting :showSetting="showSetting" :item="curItem" @handleClose="handleClose" />
    </div>
</template>
<script>
import WHITEBOARDAPI from '@/request/api/caseSystem/whiteboard'
import HOMEAPI from '@/request/api/caseSystem/home'
import CUSTOMERAPI from '@/request/api/caseSystem/customer'
import ClientTypeSetting from '@c/ClientTypeSetting'
import { mapGetters } from 'vuex'

export default {
    name: 'ReceptionCentre',
    props: {},
    components: {
        ClientTypeSetting
    },
    data() {
        return {
            data: [],
            curItem: {},
            selectIndex: 0,
            showSetting: false
        }
    },
    methods: {
        onChange(index) {
            this.selectIndex = index
        },
        getData() {
            let params = {
                projectId: this.projectId,
                roleCode: this.currentRole.roleCode,
                pageNum: 1,
                pageSize: 10
            }
            HOMEAPI.visitingList(params).then(res => {
                res.list.map(item => {
                    switch (item.visitType) {
                        case 0:
                            item.bgUrl = this.$baseImgUrl + '/case/home/shoufang-bg.png'
                            item.className = 'first-visit'
                            item.statusName = '首访'
                            break
                        case 1:
                            item.bgUrl = this.$baseImgUrl + '/case/home/new-first-bg.png'
                            item.className = 'revisit'
                            item.statusName = '复访'
                            break
                        case 2:
                            item.bgUrl = this.$baseImgUrl + '/case/home/bg-whiteboard.png'
                            item.className = 'whiteboard'
                            item.statusName = '白板'
                            break
                        default:
                            item.bgUrl = this.$baseImgUrl + '/case/home/bg-whiteboard.png'
                            item.className = 'whiteboard'
                            item.statusName = ''
                    }
                })
                this.data = res.list
                if (res.list.length > 0) {
                    this.$nextTick(() => {
                        this.selectIndex = 0
                        this.$refs.swipe.swipeTo(0)
                    })
                }
            })
        },
        // 完成接待
        async reception(item) {
            if (item.statusName !== '白板') {

                //客户状态20直接完成接待
                if (item.clientStatus >= 40) {
                    let params = {
                        oppId: item.oppId
                    }
                    let result = await CUSTOMERAPI.receptionDone(params)
                    if (result) {
                        this.$toast('接待成功')
                        this.getData()
                    }
                    return
                }

                this.showSetting = true
                this.curItem = item
                return
            }
            // 白板客户
            this.$router.push({
                path: '/case/questionnaire',
                query: {
                    whiteBoardId: item.whiteBoardId
                }
            }).catch(() => {
            })
        },
        // 关闭弹窗
        handleClose(val) {
            if (val.status === '无效') {
                this.getData()
            }
            this.showSetting = val.flag
        }
    },
    computed: {
        ...mapGetters(['projectId', 'currentRole'])
    },
    created() {
        if (!this.projectId) return
        this.getData()
    },
    watch: {
        projectId() {
            if (!this.projectId) return
            this.getData()
        }
    }
}
</script>
<style scoped lang="less">
.container {
    margin-bottom: 15px;

    .common-title {
        display: flex;
        padding: 15px 15px;
        color: @header-text-color;
        justify-content: space-between;

        .flex-style {
            display: flex;
            align-items: center;

            .title {
                flex-shrink: 0;
                margin-right: 18.5px;
                font-size: 16px;
                font-family: PingFangSC-Medium, PingFang SC;
                font-weight: 600;
            }

            .tips {
                color: #EB6877;

                .text {
                    display: block;
                    margin-left: 4.5px;
                    font-family: PingFangSC-Medium, PingFang SC;
                    font-weight: 700;
                    font-size: 12px;
                    width: 190px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
            }
        }

        .num-style {
            flex-shrink: 0;
            font-size: 12px;
            font-family: PingFangSC-Regular, PingFang SC;
            color: #999999;

            .num {
                font-size: 12px;
                font-family: DINAlternate-Bold, DINAlternate;
                font-weight: bold;
                color: #E2102D;

                &.big {
                    font-size: 18px;
                }
            }
        }
    }

    .my-swipe {
        .li {
            position: relative;
            display: flex;
            height: 76px;
            border-radius: 4px;
            align-items: center;
            padding: 0 15px;
            justify-content: space-between;
            // margin: 0 15px;
            margin-left: 15px;
            overflow: hidden;

            .img-style {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                background-color: #fff;
                z-index: -1;
            }

            .status {
                flex-shrink: 0;
                width: 40px;
                height: 40px;
                background: #FFFFFF;
                border-radius: 50%;
                text-align: center;
                line-height: 40px;
                font-size: 14px;
                font-family: PingFangSC-Semibold, PingFang SC;
                font-weight: 600;
                margin-right: 15px;
            }

            .info {
                font-size: 12px;
                font-family: PingFangSC-Regular, PingFang SC;
                color: #93979F;

                .base-info {
                    .common-flex();
                    align-items: flex-end;
                    max-width: 170px;
                }

                .name {
                    font-size: 16px;
                    line-height: 16px;
                    font-family: PingFangSC-Medium, PingFang SC;
                    font-weight: 600;
                    color: #333333;
                    margin-right: 12px;
                    margin-bottom: 9px;
                }

                .num {
                    font-size: 18px;
                    line-height: 15px;
                    font-family: DINAlternate-Bold, DINAlternate;
                    font-weight: bold;
                    color: #333333;
                    margin-left: 8px;
                }

                .tel {
                    font-size: 13px;
                    line-height: 13px;
                    color: #999;
                    margin-bottom: 9px;
                }
            }

            .btn {
                flex-shrink: 0;
                // margin-left: 10px;
                text-align: center;
                line-height: 14px;
                padding: 8px 12px;
                border-radius: 15px;
                font-size: 14px;
                font-family: PingFangSC-Semibold, PingFang SC;
                font-weight: 600;
                color: #4FC0E8;
            }

            .reception-help {
                width: 36px;
                height: 36px;
                border-radius: 50%;
                background: rgba(95, 149, 250, .1);
                display: flex;
                align-items: flex-end;
                justify-content: center;
                font-size: 12px;
                line-height: 24px;
                font-weight: 500;
                color: #5F95FA;
                transform: rotate(-45deg);
                position: absolute;
                left: -10px;
                top: -10px;
            }
        }

        .li.first-visit {
            .status {
                color: #FF4F4F;
            }

            .btn {
                color: #FF4F4F;
                border: 1px solid #FF4F4F;
            }
        }

        .li.revisit {
            .status {
                color: #FFA331;
            }

            .btn {
                color: #FFA331;
                border: 1px solid #FFA331;
            }
        }

        .li.whiteboard {
            .status {
                color: @theme-color;
            }

            .btn {
                color: @theme-color;
                border: 1px solid @theme-color;
            }
        }
    }

    .close {
        position: fixed;
        top: 16%;
        right: 4%;
        z-index: 2008;

        .icondel {
            color: #fff;
            font-size: 30px;
        }
    }
}

.top {
    color: @theme-color;
    font-size: 14px;
    margin: 15px;

    .icontishi2 {
        margin-right: 6px;
    }
}

.content {
    display: flex;
    justify-content: space-between;
    padding: 25px 27px;

    .item {
        display: flex;
        flex-direction: column;
        align-items: center;

        .status-img {
            width: 120px;
            height: 120px;
        }

        .status-text {
            margin-top: 12px;
        }
    }
}
</style>
