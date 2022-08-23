<template>
    <div class="common-page">
        <top-bar title="楼盘详情" />
        <div ref="pageMiddle" class="common-page-middle" :style="{ height: pageMiddleWithButtonHeight }">
            <!-- 轮播图 -->
            <div class="swipe-wrap">
                <van-swipe :show-indicators="swipeType === 2" @change="onChange">
                    <!-- vr -->
                    <template v-if="swipeType === 0">
                        <van-swipe-item>
                            <van-image :src="buildInfo.vrShortImgUri" @click="goVr(buildInfo.vrUrl)" />
                        </van-swipe-item>
                    </template>
                    <!-- 视频 -->
                    <template v-if="swipeType === 1">
                        <van-swipe-item v-for="(video, i) in buildInfo.headerVideos" :key="i">
                            <video class="video" :src="video.uri" controls preload="auto" disablePictureInPicture playsinline webkit-playsinline x-webkit-airplay="allow" poster=""></video>
                        </van-swipe-item>
                    </template>
                    <!-- 图片 -->
                    <template v-if="swipeType === 2">
                        <van-swipe-item v-for="(img, i) in buildInfo.bannerImgs" :key="i">
                            <van-image :src="img.uri" />
                        </van-swipe-item>
                    </template>
                    <template v-if="swipeType === 2" #indicator>
                        <div v-if="buildInfo.bannerImgs && buildInfo.bannerImgs.length > 1" class="custom-indicator">{{ current + 1 }}/{{ buildInfo.bannerImgs.length }}</div>
                    </template>
                </van-swipe>
                <div class="type-wrap">
                    <template v-for="x in swipeTypeList">
                        <span v-if="x.show" :key="x.code" class="type-item" :class="x.code === swipeType ? 'select' : ''" @click="changeSwipeType(x.code)">{{ x.name }}</span>
                    </template>
                </div>
            </div>
            <!-- 楼盘信息 -->
            <div class="building-content">
                <!-- 基础信息 -->
                <div class="base-info">
                    <p class="title">
                        {{ buildInfo.salesName }}
                        <van-tag :type="buildInfo.salesStatus === 1 ? 'danger' : 'primary'">{{ buildInfo.salesStatusName }}</van-tag>
                    </p>
                    <!-- 特色 -->
                    <p class="feature">{{ buildInfo.lptese || '' }}</p>
                    <!-- 卖点 -->
                    <section class="sale-tag">
                        <van-tag v-for="x in buildInfo.saleArray" :key="x" color="#F3F4F7" text-color="#83878F">{{ x }}</van-tag>
                    </section>
                    <!-- 价格 -->
                    <div class="info">
                        <template v-for="x in baseInfo">
                            <div v-if="buildInfo[x.fieldName]" :key="x.name" class="info-item">
                                <span class="value van-ellipsis" :class="x.isPrice ? 'price' : ''">{{ buildInfo[x.fieldName] }}</span>
                                <span class="label">{{ x.name }}</span>
                            </div>
                        </template>
                    </div>
                    <!-- 开盘信息 -->
                    <div class="open">
                        <template v-for="x in openInfo">
                            <div v-if="buildInfo[x.fieldName]" :key="x.name" class="open-item">
                                {{ x.name }}：
                                <span class="value van-ellipsis">{{ buildInfo[x.fieldName] }}</span>
                            </div>
                        </template>
                    </div>
                    <!-- 位置 -->
                    <div class="address">
                        <span class="address-info van-ellipsis">
                            <i class="icon-address"></i>
                            {{ buildInfo.acAddress }}
                        </span>
                        <span class="navigation-btn" @click="toLocation">
                            <i class="icon-location"></i>
                            导航
                        </span>
                    </div>
                    <div class="more-info-btn" @click="toBuildingInfo">了解楼盘信息</div>
                </div>
                <!-- 户型 -->
                <div v-if="unitTypeList.length" class="house-type">
                    <div class="title-wrap">
                        <span class="title">主力户型</span>
                        <span class="more" @click="toUnitList">
                            更多
                            <i class="iconfont iconiconrightarrow"></i>
                        </span>
                    </div>
                    <HouseTypeSection :unit-type-list="unitTypeList" />
                </div>
                <!-- 楼盘鉴赏 -->
                <div v-if="Object.keys(appreciateImgs).length" class="appreciate">
                    <div class="title-wrap">
                        <span class="title">楼盘鉴赏</span>
                        <span class="more" @click="toAppreciate">
                            更多
                            <i class="iconfont iconiconrightarrow"></i>
                        </span>
                    </div>
                    <div class="appreciate-imgs">
                        <div v-for="(x, key) in appreciateImgs" :key="key" class="img-wrap" @click="toAppreciate">
                            <div class="img">
                                <van-image :src="x[0].uri" width="160" height="160" radius="4" />
                                <span class="img-count">{{ x.length }}</span>
                            </div>
                            <p class="img-title">{{ key }}</p>
                        </div>
                    </div>
                </div>
                <!-- 周边配套 -->
                <div v-show="buildInfo.longitude" class="peripheral-matching">
                    <div class="title-wrap">
                        <span class="title">周边配套</span>
                        <span class="more" @click="toPeripheralMatch">
                            更多
                            <i class="iconfont iconiconrightarrow"></i>
                        </span>
                    </div>
                    <p class="address-wrap">
                        楼盘地址：
                        <span class="address">{{ buildInfo.lpAddress }}</span>
                    </p>
                    <PeripheralMatchingMap :map-data="mapData" class="peripheral-map" :matching-info="matchingInfo" />
                </div>
            </div>
        </div>
        <div class="common-fix-bottom" :style="{ paddingBottom: bottomSafe }">
            <van-button round block type="save" native-type="submit" @click="handleShare">分享楼盘</van-button>
        </div>
        <ShareBox v-model="shareShow" :options="shareOptions" :share-info="shareInfo" :poster-info="posterInfo" />
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import TopBar from '@c/TopBar'
import HouseTypeSection from './components/houseTypeSection'
import PeripheralMatchingMap from './components/peripheralMatchingMap'
import ShareBox from '@/views/common/onlineMarketing/components/ShareBox'
import API from '@/request/api/onlineMarketing'
export default {
    name: 'BuildingDetail',
    components: {
        TopBar,
        HouseTypeSection,
        PeripheralMatchingMap,
        ShareBox
    },
    data() {
        return {
            scrollTop: 0,
            shareShow: false,
            shareOptions: ['wechat', 'wechat-moments', 'poster'],
            shareInfo: {},
            // 生成海报信息
            posterInfo: {},
            // 轮播类型
            swipeType: 0,
            current: 0,
            swipeTypeList: [
                {
                    name: 'VR',
                    code: 0,
                    show: false
                },
                {
                    name: '视频',
                    code: 1,
                    show: false
                },
                {
                    name: '图片',
                    code: 2,
                    show: false
                }
            ],
            baseInfo: [
                {
                    name: '楼盘售价',
                    fieldName: 'lowPrice',
                    isPrice: true
                },
                {
                    name: '装修情况',
                    fieldName: 'decoration'
                },
                {
                    name: '业态类型',
                    fieldName: 'formats'
                }
            ],
            openInfo: [
                {
                    name: '开盘',
                    fieldName: 'kpDate'
                },
                {
                    name: '销售状态',
                    fieldName: 'salesStatusName'
                }
            ],
            // 户型
            unitTypeList: [],
            // 楼盘鉴赏
            appreciateImgs: {},
            buildInfo: {},
            mapData: {
                lng: '',
                lat: '',
                name: '',
                address: ''
            },
            // 周边配套
            matchingInfo: [
                {
                    name: '交通配套',
                    fieldName: 'jiaotongpt',
                    value: ''
                },
                {
                    name: '教育资源',
                    fieldName: 'jiaoyuzy',
                    value: ''
                },
                {
                    name: '医疗健康',
                    fieldName: 'yiliaojk',
                    value: ''
                },
                {
                    name: '商场购物',
                    fieldName: 'shangchanggw',
                    value: ''
                },
                {
                    name: '其它',
                    fieldName: 'qita',
                    value: ''
                }
            ]
        }
    },
    computed: { ...mapGetters(['projectId', 'keepAliveList']) },
    created() {
        this.initData()
    },
    activated() {
        this.$refs['pageMiddle'].scrollTop = this.scrollTop
    },
    mounted() {},
    methods: {
        initData() {
            this.getProjectDetail()
            this.getUnitTypeList()
        },
        // 获取项目详情
        async getProjectDetail() {
            this.$utils.loading()
            let res = await API.getProjectDetail({
                lpId: this.projectId
            })
            this.$toast.clear()
            this.buildInfo = res
            this.swipeType = 2
            // 未配置海报，不能生成海报
            if (!res.posterImg) {
                this.shareOptions = this.shareOptions.filter((x) => x !== 'poster')
            }
            // 配置vr
            if (res.vrShortImgUri && res.vrUrl) {
                this.swipeType = 0
                this.swipeTypeList[0].show = true
            }
            // 配置视频
            if (res.headerVideos && res.headerVideos.length) {
                this.swipeTypeList[1].show = true
                this.swipeType = 1
            }
            // 配置图片
            this.buildInfo.bannerImgs = res.lpxiangce && res.lpxiangce.length ? res.lpxiangce : [{ uri: res.listXImg }]
            if (this.swipeType !== 2) {
                this.swipeTypeList[2].show = true
            }
            // 卖点
            if (res.salePointsName) {
                this.buildInfo.saleArray = res.salePointsName.split(',')
            }
            // 基本信息
            this.buildInfo.decoration = res.zhuangxiu ? res.zhuangxiu.split('、')[0] : ''
            if (res.yetai) {
                this.buildInfo.formats = res.yetai.split('，').slice(0, 2).join('、')
            }
            this.buildInfo.salesStatusName = res.salesStatus === 1 ? '在售' : '待售'
            // 楼盘鉴赏
            if (res.lpxiangce && res.lpxiangce.length) {
                let obj = {}
                for (let item of res.lpxiangce) {
                    if (!obj[item.imgType]) {
                        obj[item.imgType] = []
                    }
                    obj[item.imgType].push(item)
                }
                this.appreciateImgs = obj
            }

            // 地图
            if (res.longitude) {
                this.mapData.lng = res.longitude
                this.mapData.lat = res.latitude
                this.mapData.name = res.salesName
                this.mapData.address = res.lpAddress
            }

            // 周边配套
            for (let elem of this.matchingInfo) {
                elem.value = res[elem.fieldName]
            }
        },
        // 获取户型
        async getUnitTypeList() {
            let unitList = await API.getUnitTypeList(this.projectId)
            this.unitTypeList = unitList.filter((x) => x.result && x.result.length)
        },
        // 改变轮播类型
        changeSwipeType(code) {
            this.swipeType = code
            this.current = 0
        },
        // 图片切换
        onChange(index) {
            if (this.swipeType === 2) {
                this.current = index
            }
        },
        handleShare() {
            this.shareInfo = {
                thingId: this.projectId,
                thingType: 1,
                imgUrl: this.buildInfo.listXImg,
                title: `${this.buildInfo.salesName} ${this.buildInfo.lptese ? this.buildInfo.lptese : ''}`
            }
            this.posterInfo = {
                posterImg: this.buildInfo.posterImg,
                qrcode: this.buildInfo.qrcodeImg
            }
            this.shareShow = true
        },
        // 跳转户型列表
        toUnitList() {
            this.$router
                .push({
                    path: '/houseTypeList'
                })
                .catch(() => {})
        },
        // 跳转周边配套
        toPeripheralMatch() {
            this.$router
                .push({
                    path: '/building/peripheralMatching',
                    query: this.mapData
                })
                .catch(() => {})
        },
        // 查看Vr
        goVr(vrUrl) {
            this.$router
                .push({
                    path: '/VRView',
                    query: {
                        src: vrUrl
                    }
                })
                .catch(() => {})
        },
        // 跳转更多楼盘信息
        toBuildingInfo() {
            this.$router
                .push({
                    path: '/building/moreBuildingInfo'
                })
                .catch(() => {})
        },
        // 跳转楼盘鉴赏
        toAppreciate() {
            this.$router
                .push({
                    path: '/photoAlbum'
                })
                .catch(() => {})
        },
        // 打开项目定位
        toLocation() {
            this.$router
                .push({
                    path: '/buildingLocation',
                    query: this.mapData
                })
                .catch(() => {})
        }
    },
    beforeRouteEnter(to, from, next) {
        next((vm) => {
            var array = vm.keepAliveList || []
            if (array.indexOf('buildingDetail') === -1) {
                array.push('buildingDetail')
                vm.$store.dispatch('other/setKeepAlive', array)
            }
        })
    },
    beforeRouteLeave(to, from, next) {
        this.scrollTop = this.$refs['pageMiddle'].scrollTop
        var array = this.keepAliveList
        if (to.path.includes('/home')) {
            array = array.filter((item) => {
                return item !== 'buildingDetail'
            })
            this.$store.dispatch('other/setKeepAlive', array)
        }
        next()
    }
}
</script>
<style scoped lang="less">
.swipe-wrap {
    height: 225px;
    position: relative;
    display: flex;
    justify-content: center;
    .van-swipe {
        width: 100%;
        height: 100%;
        .van-image {
            width: 100%;
            height: 100%;
        }
        .video {
            width: 100%;
            height: 100%;
        }
    }
}
.custom-indicator {
    position: absolute;
    right: 15px;
    bottom: 25px;
    padding: 0 6px;
    font-size: 12px;
    background: rgba(0, 0, 0, 0.49);
    border-radius: 8px;
    color: #fff;
    font-size: 12px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
}
.type-wrap {
    position: absolute;
    bottom: 25px;
    background: rgba(255, 255, 255, 0.79);
    border-radius: 12px;
    .type-item {
        width: 50px;
        height: 24px;
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #333333;
        display: inline-block;
        text-align: center;
        line-height: 24px;
        &.select {
            background: @theme-color;
            color: #fff;
            border-radius: 12px;
        }
    }
}
.building-content {
    margin-top: -10px;
    position: relative;
    z-index: 999;
    height: 400px;
    background: #ffffff;
    border-radius: 10px 10px 0px 0px;
    .base-info {
        padding: 15px;
        .title {
            font-size: 20px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 600;
            color: #333333;
            display: flex;
            align-items: center;
            /deep/ .van-tag--danger {
                margin-left: 12px;
                font-size: 11px;
                padding: 1px 5px;
                vertical-align: text-top;
                background: linear-gradient(270deg, #ff8484 0%, #ff5050 100%);
                border-radius: 2px;
            }
            /deep/ .van-tag--primary {
                margin-left: 12px;
                font-size: 11px;
                padding: 1px 5px;
                vertical-align: text-top;
                background: linear-gradient(270deg, #DB0826 0%, #FB2E4B 100%);
                border-radius: 2px;
            }
        }
        .feature {
            margin-top: 5px;
            font-size: 12px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #333333;
        }
        .sale-tag .van-tag {
            margin-top: 5px;
            margin-right: 4px;
        }
        .info {
            margin-top: 24px;
            display: flex;
            .info-item {
                flex: 1;
                display: flex;
                flex-direction: column;
                margin-left: 15px;
                position: relative;
                &::after {
                    border-right: 0.06667rem solid #eaeaea;
                    position: absolute;
                    right: 0;
                    opacity: 0.8;
                    content: '';
                    height: 75%;
                    top: 3%;
                }
                &:last-child {
                    &::after {
                        border-right: none;
                    }
                }
                &:first-child {
                    margin-left: 0;
                }
            }
            .label {
                font-size: 12px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #999999;
                line-height: 28px;
            }
            .value {
                font-size: 15px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #333333;
                line-height: 15px;
            }
            .price {
                font-size: 15px;
                font-family: PingFangSC-Medium, PingFang SC;
                font-weight: 600;
                color: @danger-color;
                line-height: 18px;
            }
        }
        .open {
            margin-top: 10px;
            display: flex;
            .open-item {
                flex: 1;
                display: flex;
                align-items: center;
                font-size: 14px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #999999;
                .value {
                    flex: 1;
                    font-family: PingFangSC-Regular, PingFang SC;
                    color: #333333;
                }
            }
        }
        .address {
            margin-top: 18px;
            height: 50px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-top: 1px solid #eaeaea;
            border-bottom: 1px solid #eaeaea;
            .navigation-btn {
                width: 63px;
                height: 28px;
                border-radius: 14px;
                display: flex;
                justify-content: center;
                align-items: center;
                border: 1px solid @theme-color;
                font-size: 12px;
                font-family: PingFangSC-Medium, PingFang SC;
                font-weight: 500;
                color: @theme-color;
                .icon-location {
                    margin-right: 3px;
                    display: inline-block;
                    width: 12px;
                    height: 12px;
                    background: url('@{baseImgUrl}/onlineMarketing/icon-location.png');
                    background-size: 100% 100%;
                }
            }
            .address-info {
                flex: 1;
                font-size: 15px;
                .icon-address {
                    margin-right: 6px;
                    display: inline-block;
                    width: 10px;
                    height: 12px;
                    background: url('@{baseImgUrl}/onlineMarketing/icon-address.png');
                    background-size: 100% 100%;
                }
            }
        }
        .more-info-btn {
            margin-top: 18px;
            height: 44px;
            border-radius: 4px;
            background: #f3f7ff;
            font-size: 15px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: @theme-color;
            display: flex;
            align-items: center;
            justify-content: center;
        }
    }
    .title-wrap {
        padding: 0 15px;
        display: flex;
        justify-content: space-between;
        line-height: 60px;
        .title {
            font-size: 18px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 600;
            color: #333333;
        }
        .more {
            display: flex;
            align-items: center;
            font-size: 12px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #ababab;
            .iconiconrightarrow {
                margin-left: 3px;
                font-size: 12px;
                color: #ccc;
            }
        }
    }
    .houseType-container {
        padding-left: 15px;
    }
    .appreciate-imgs {
        padding-left: 15px;
        display: flex;
        overflow-x: auto;
        .img-wrap {
            margin-right: 15px;
            text-align: center;
            .img-title {
                padding: 15px 0;
                font-size: 12px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #333333;
                line-height: 12px;
            }
            .img {
                position: relative;
            }
            .img-count {
                position: absolute;
                color: #fff;
                font-size: 12px;
                background: rgba(0, 0, 0, 0.5);
                padding: 0px 0px;
                border-radius: 10px;
                bottom: 12px;
                right: 10px;
                width: 28px;
            }
        }
    }
    .peripheral-matching {
        .address-wrap {
            padding: 0 15px;
            font-size: 14px;
            color: #999999;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            .address {
                color: #333333;
            }
        }
        .peripheral-map {
            padding: 18px 15px 0 15px;
        }
    }
}
</style>
