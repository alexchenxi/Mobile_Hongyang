<template>
    <div class="container">
        <div class="common-title">智能拓客</div>
        <div class="content">
            <!-- 名片 已设置-->
            <div v-if="isSettingCard" v-code="[code + '.HOME.TOKER', code + '.HOME.TOKER.AICARD']" class="card" @click="goUrl('/AICard', { id: cardInfo.cardId })">
                <img class="photo" crossorigin="anonymous" :src="cardInfo.avatar" />
                <div class="info">
                    <span class="name">{{ cardInfo.name }}</span>
                    <van-tag type="primary">{{ currentRole.roleName }}</van-tag>
                    <p class="slogan">{{ cardInfo.motto }}</p>
                    <p class="record">
                        <span class="record-item">
                            浏览
                            <span class="count">{{ cardInfo.scans || 0 }}</span>
                        </span>
                        <span class="record-item">
                            点赞
                            <span class="count">{{ cardInfo.likes || 0 }}</span>
                        </span>
                    </p>
                </div>
                <div class="share" @click.stop="shareShow = true"><i class="iconfont iconfenxiang" /></div>
            </div>
            <!-- 名片 未设置 -->
            <div v-else v-code="[code + '.HOME.TOKER', code + '.HOME.TOKER.AICARD']" class="card-notsetting">
                <i class="icon-card" />
                <span class="tip">设置名片后，支持通过分享名片拓客</span>
                <van-tag plain type="primary" @click="goUrl('/editAICard')">设置名片</van-tag>
            </div>
            <!-- 最新物料 -->
            <div v-if="materials.length" class="notice">
                <div class="notice-bar">
                    <van-notice-bar left-icon="" :scrollable="false">
                        <van-swipe vertical class="notice-swipe" :autoplay="3000" :show-indicators="false">
                            <van-swipe-item v-for="x in materials" :key="x.id" class="van-ellipsis">
                                <van-badge>
                                    <div class="child">{{ getThinsTypeName(x.type) }}</div>
                                </van-badge>
                                <span class="name van-ellipsis">{{ x.name }}</span>
                                <van-tag plain type="primary" @click="goMaterialDetail(x)">查看</van-tag>
                            </van-swipe-item>
                        </van-swipe>
                    </van-notice-bar>
                </div>
            </div>
            <!-- 物料 -->
            <div class="took">
                <div v-code="[code + '.HOME.TOKER', code + '.HOME.TOKER.ACTIVITY']" class="project-item" @click="goUrl('/building/detail')" />
                <div v-code="[code + '.HOME.TOKER', code + '.HOME.TOKER.MATERIALS']" class="material-item" @click="goUrl('/materialsList')" />
            </div>
        </div>
        <ShareBox v-model="shareShow" :options="shareOptions" :share-info="shareInfo" />
    </div>
</template>
<script>
import ShareBox from '@/views/common/onlineMarketing/components/ShareBox'
import API from '@/request/api/onlineMarketing'
import { mapGetters } from 'vuex'
export default {
    name: 'MarketingExtension',
    components: {
        ShareBox
    },
    props: {
        code: {
            type: String,
            default: 'ST'
        }
    },
    data() {
        return {
            // 是否设置了AI名片
            isSettingCard: false,
            cardInfo: {},
            materials: [],
            shareShow: false,
            shareOptions: ['wechat', 'wechat-moments'],
            shareInfo: {}
        }
    },
    computed: { ...mapGetters(['projectId', 'currentRole']) },
    watch: {
        projectId() {
            if (!this.projectId) return
            this.init()
        }
    },
    mounted() {
        this.init()
    },
    methods: {
        init() {
            this.getAICard()
            this.getHomeLastThings()
        },
        // 获取AI名片
        getAICard() {
            API.getAICardByProjectId(this.projectId).then(res => {
                if (res) {
                    this.isSettingCard = true
                    this.cardInfo = res
                    this.shareInfo = {
                        imgUrl: '',
                        thingId: this.cardInfo.cardId,
                        // 物料类型
                        thingType: 5,
                        //标题
                        title: `我是您的专属顾问${this.cardInfo.name}，可点击前往查看我的名片`
                    }
                } else {
                    this.isSettingCard = false
                }
            })
        },
        // 获取最新物料信息
        getHomeLastThings() {
            API.getHomeLastThings({
                projectId: this.projectId
            }).then(res => {
                this.materials = res
            })
        },
        // 获取物料类型名称
        getThinsTypeName(type) {
            let name = ''
            switch (type) {
                case 2:
                    name = '广告'
                    break
                case 3:
                    name = '资讯'
                    break
                case 4:
                    name = '活动'
                    break
            }
            return name
        },
        // 跳转页面
        goUrl(path, query = {}) {
            this.$router.push({ path, query }).catch(() => {})
        },
        // 跳转物料详情
        goMaterialDetail(item) {
            this.$router.path({
                type: item.type,
                id: item.id
            })
        }
    }
}
</script>
<style scoped lang="less">
.container {
    .common-title {
        font-size: 16px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 700;
        padding: 12px 0;
    }
    .content {
        .card {
            margin-bottom: 10px;
            height: 80px;
            position: relative;
            background: #fff;
            padding: 15px;
            border-radius: 6px;
            display: flex;
            .photo {
                margin-right: 12px;
                width: 62px;
                height: 100%;
                border-radius: 6px;
                object-fit: cover;
            }
            .share {
                top: 0;
                right: 0;
                position: absolute;
                width: 32px;
                height: 32px;
                background: rgba(219, 8, 38, 0.1);
                border-radius: 0px 0px 0px 8px;
                display: flex;
                justify-content: center;
                align-items: center;
                .iconfont {
                    font-size: 14px;
                    color: @theme-color;
                }
            }
            .info {
                flex: 1;
                .name {
                    margin-right: 6px;
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
                .record {
                    display: flex;
                    margin-right: 30px;
                    .record-item {
                        display: flex;
                        align-items: center;
                        flex: 1;
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
                    }
                }
            }
        }
        .card-notsetting {
            margin-bottom: 10px;
            height: 20px;
            position: relative;
            background: #fff;
            padding: 15px;
            border-radius: 6px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            .icon-card {
                margin-right: 4px;
                width: 19px;
                height: 19px;
                background: url('@{baseImgUrl}/onlineMarketing/icon-card.png');
                background-size: 100% 100%;
            }
            .tip {
                font-size: 13px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #999999;
                flex: 1;
            }
            /deep/ .van-tag {
                padding: 3px 10px;
                border-radius: 11px;
            }
        }
        .notice {
            display: flex;
            padding: 0 15px;
            align-items: center;
            justify-content: space-between;
            height: 50px;
            background: #fff;
            border-radius: 6px;
            margin-bottom: 10px;
            .notice-swipe {
                height: 50px;
                line-height: 50px;
                width: 100%;
            }
            /deep/ .van-notice-bar {
                height: 50px;
                background: transparent;
                color: #333;
                font-size: 14px;
            }
            /deep/ .van-tag {
                padding: 3px 10px;
                border-radius: 11px;
            }
            .child {
                width: 32px;
                height: 18px;
                background: rgba(219, 8, 38, 0.1);
                border-radius: 2px;
                font-size: 11px;
                font-family: PingFangSC-Medium, PingFang SC;
                font-weight: 500;
                color: @theme-color;
                line-height: 18px;
                text-align: center;
            }
            .name {
                flex: 1;
                margin: 0 23px 0 6px;
                font-size: 14px;
            }
            .notice-bar {
                flex: 1;
                /deep/ .van-notice-bar {
                    padding: 0;
                }
            }
        }
        .took {
            height: 68px;
            display: flex;
            .project-item {
                margin-right: 10px;
                width: 50%;
                background-image: url('@{baseImgUrl}/onlineMarketing/project.png');
                background-size: 100% 100%;
            }
            .material-item {
                width: 50%;
                background-image: url('@{baseImgUrl}/onlineMarketing/material.png');
                background-size: 100% 100%;
            }
        }
    }
    /deep/ .van-swipe-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    /deep/ .van-notice-bar__content {
        display: flex;
        width: 100%;
    }
    /deep/ .van-swipe__track--vertical {
        width: 100%;
    }
}
</style>
