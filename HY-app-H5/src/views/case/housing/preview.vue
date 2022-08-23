<template>
    <div class="common-page">
        <div class="common-page-top">
            <top-bar :back="true" back-path="-" :title="title" @back="back"/>
        </div>
        <div class="common-page-container" :style="{ height: pageMiddleWithButtonHeight }">
            <div class="main-container">
                <div class="legend-section">
                    <div v-for="(item, index) in legendList" :key="index" class="legend-item">
                        <span :class="['legend-dot', item.label.tagClass]" />
                        <span class="legend-text">{{ item.label.name }}</span>
                    </div>
                </div>
                <van-tabs v-model="building" animated @change="getUnitList">
                    <van-tab v-for="tab in tabList" :key="tab.code" :title="tab.name" :name="tab.code">
                        <div class="multiple-filter">
                            <div class="multiple-filter-left">
                                <van-dropdown-menu active-color="#DB0826" v-if="unitOptions && unitOptions.length">
                                    <van-dropdown-item ref="filter" v-model="unit" :get-container="getContainer" :options="unitOptions" @change="getRoomList" />
                                </van-dropdown-menu>
                            </div>
                        </div>
                        <div class="main-section">
                            <van-empty v-if="list.length === 0 && finished" class="custom-image" :image="$baseImgUrl + '/no-data.png'" description="暂无您想找的房源~" />
                            <div v-if="list.length > 0" class="list">
                                <van-index-bar :ref="'indexBar' + building" :sticky="false" :index-list="indexList" @change="clearActive" @select="changeActive">
                                    <div v-for="(item, index) in list" :key="item.code" style="display: flex">
                                        <van-index-anchor :ref="'indexBar' + building + 'index'" :index="item.code">楼层{{ item.name }}</van-index-anchor>
                                        <van-cell style="flex: 1">
                                            <div class="li">
                                                <div
                                                    v-for="(subItem, subIndex) in item.childList"
                                                    :key="subItem.id"
                                                    :class="currentRole.roleCode === 'ST_MANAGER' ? 'item ' + getHousingStatus(subItem.salesControl) : 'item common-housing-white'"
                                                    @click="showDetail(subItem, index, subIndex)"
                                                >
                                                    <van-icon v-if="subItem.checked" name="checked" class="checked"/>
                                                    <div class="room">{{ subItem.room }}</div>
                                                </div>
                                            </div>
                                        </van-cell>
                                    </div>
                                </van-index-bar>
                            </div>
                        </div>
                    </van-tab>
                </van-tabs>
            </div>
        </div>
        <div class="common-fix-bottom" :style="{ paddingBottom: bottomSafe }">
            <van-checkbox v-if="total < oldTotal" v-model="unChecked">全选</van-checkbox>
            <van-checkbox v-else v-model="checked">全选</van-checkbox>
            <van-button style="width: 80%" block type="save" native-type="submit" :disabled="roomIdList.length === 0" @click="handleNext">{{ submitTitle }}（{{ total }}）</van-button>
        </div>

        <canvas width="375" height="" id="watermarkCanvas" class="watermark-canvas" />
    </div>
</template>

<script>
import TopBar from '@c/TopBar'
import { mapGetters } from 'vuex'
import { commonMethods } from 'movit-utils'
import API from '@/request/api/caseSystem/housing'
import { commonData, getHousingStatus } from '@/config/commonData'

const arr = ['可销控', '不可销控']
const arr1 = ['可取消销控', '不可取消销控']
const roomStatus = new Map([
    [
        '可取消销控',
        {
            name: '可取消销控',
            tagClass: 'common-housing-white',
        },
    ],
    [
        '不可取消销控',
        {
            name: '不可取消销控',
            tagClass: 'common-housing-light-gray',
        },
    ],
])
export default {
    name: 'caseHousingPreview',
    components: {
        TopBar,
    },
    data() {
        return {
            legendList: [],
            tabList: [],
            unitOptions: [],
            building: 1,
            unit: 1,
            indexList: [],
            list: [],
            finished: false,
            isFirst: true,
            checked: false,
            unChecked: false,
            roomIdList: [],
            title: '',
            submitTitle: '下一步',
            total: 0,
            oldTotal: 0,
        }
    },
    computed: {
        ...mapGetters(['projectId', 'currentRole', 'projectName', 'user', 'keepAliveList']),
    },
    created() {
        this.NumFormat = commonMethods.NumFormat

        let legendList
        if (this.$route.query.status === '1') {
            this.title = '设置预销控'
            legendList = this.$utils.mapToArray(commonData.housingStatus)
            legendList = legendList.filter((item) => arr.includes(item.value))
        } else {
            legendList = this.$utils.mapToArray(roomStatus)
            this.title = '取消预销控'
            this.submitTitle = '确认'
            legendList = legendList.filter((item) => arr1.includes(item.value))
        }
        this.legendList = legendList
        this.building = this.$route.query.buildCode
        this.getBuildingList()
        this.getUnitList()
    },
    activated() {
        this.building = this.$route.query.buildCode
        this.getBuildingList()
        this.getUnitList()
    },
    mounted() {
        let text = `弘客云-${this.user.name}-${localStorage.getItem('userName')} ${commonMethods.DateToTime(new Date())}`
        this.$utils.drawWatermark('watermarkCanvas', text)
    },
    watch: {
        checked(val) {
            const list = this.list

            list.forEach((item) => {
                const childList = item.childList

                childList.forEach((it) => {
                    if (val) {
                        if (it.salesControl === '可销控' && this.$route.query.status === '1') {
                            it.checked = true
                            const find = this.roomIdList.find((i) => i.id === it.id)

                            if (!find && it.salesControl === '可销控') {
                                this.roomIdList.push({
                                    id: it.id,
                                    salesControl: it.salesControl,
                                })
                                this.total = this.roomIdList.length
                                this.oldTotal = this.roomIdList.length
                            }
                        }else if (it.salesControl === '预销控' && this.$route.query.status === '2'){
                            it.checked = true
                            const find = this.roomIdList.find((i) => i.id === it.id)

                            if (!find && it.salesControl === '预销控') {
                                this.roomIdList.push({
                                    id: it.id,
                                    salesControl: it.salesControl,
                                })
                                this.total = this.roomIdList.length
                                this.oldTotal = this.roomIdList.length
                            }
                        }
                    } else {
                        this.total = 0
                        this.oldTotal = 0
                        this.roomIdList = []
                        it.checked = false
                    }
                })
            })
            this.list = list
        },
        unChecked(val) {
            const list = this.list

            list.forEach((item) => {
                const childList = item.childList

                childList.forEach((it) => {
                    if (val) {
                        if (it.salesControl === '可销控' && this.$route.query.status === '1') {
                            it.checked = true
                            const find = this.roomIdList.find((i) => i.id === it.id)

                            if (!find && it.salesControl === '可销控') {
                                this.roomIdList.push({
                                    id: it.id,
                                    salesControl: it.salesControl,
                                })
                                this.total = this.roomIdList.length
                                this.oldTotal = this.roomIdList.length
                            }
                        }else if (it.salesControl === '预销控' && this.$route.query.status === '2'){
                            it.checked = true
                            const find = this.roomIdList.find((i) => i.id === it.id)

                            if (!find && it.salesControl === '预销控') {
                                this.roomIdList.push({
                                    id: it.id,
                                    salesControl: it.salesControl,
                                })
                                this.total = this.roomIdList.length
                                this.oldTotal = this.roomIdList.length
                            }
                        }
                    }
                })
            })
            this.list = list
        }
    },
    methods: {
        //获取楼栋
        async getBuildingList() {
            const params = {
                projectId: this.projectId,
                stage: this.$route.query.stageCode,
            }
            this.tabList = await API.houseBuildingListApi(params)
            if (!this.tabList?.length) {
                this.tabList = [{ code: '01', name: '无单元' }]
            }
        },
        //获取单元
        async getUnitList() {
            this.$utils.loading()
            this.unChecked = false
            this.checked = false
            const params = {
                projectId: this.projectId,
                building: this.building,
            }
            let res = await API.houseUnitListApi(params)
            res.map((item) => {
                item.text = item.name
                item.value = item.code
            })
            if (res.length > 0) {
                this.unit = res[0].code
            } else {
                this.unit = ''
            }
            this.$toast.clear()
            this.unitOptions = res
            this.total = 0
            this.roomIdList = []
            this.getRoomList()
        },
        changeIndex() {
            var activeIndex = 0
            this.tabList.map((item, index) => {
                if (item.code === this.building) {
                    activeIndex = index
                }
            })
            const father = document.getElementsByClassName('van-tab__pane-wrapper')[activeIndex]
            if (!father) return
            const dom = father && father.getElementsByClassName('van-index-bar__sidebar')[0]
            const width = (activeIndex + 1) * document.documentElement.clientWidth - 22
            if (!dom) return
            if (this.indexList.length > 23) {
                dom.style.overflowY = 'auto'
            }
            dom.style.left = width + 'px'
        },
        getRoomList(val) {
            this.$utils.loading()
            this.filterValue = val
            const params = {
                projectId: this.projectId,
                roleCode: this.currentRole.roleCode,
                building: this.building,
                stage: this.$route.query.stageCode,
                unit: this.unit,
            }
            Object.assign(params, this.filterValue)
            API.houseTileListApi(params).then((res) => {
                this.finished = true
                this.list = res
                const array = []
                res.map((item) => {
                    array.push(item.code)
                })
                this.$toast.clear()
                setTimeout(() => {
                    this.indexList = array
                    this.isFirst = true
                    if (this.list.length === 0) return
                    let element = { dataset: {} }
                    element.dataset.index = this.list[0].code
                    if (!this.$refs['indexBar' + this.building]) return
                    this.$refs['indexBar' + this.building][0].scrollToElement(element)
                    this.changeIndex()
                }, 500)
            })
        },
        //右侧手动点击选中值，增加dom节点
        changeActive(index) {
            if (this.isFirst) {
                this.isFirst = false
                return
            }
            setTimeout(() => {
                const dom = document.getElementsByClassName('van-index-bar__index')
                const dom1 = document.getElementsByClassName('van-index-bar__index--active')
                if (!dom1[0]) return
                for (var i = 0; i < dom.length; i++) {
                    if (dom[i].innerHTML == index) {
                        var para = document.createElement('span')
                        var node = document.createTextNode(index + 'F')
                        para.appendChild(node)
                        para.classList.add('active')
                        dom[i].appendChild(para)
                    } else {
                        var childs = dom[i].childNodes
                        if (childs[1]) {
                            dom[i].removeChild(childs[1])
                        }
                    }
                }
            }, 200)
        },
        //滑动的时候删除节点
        clearActive() {
            const dom1 = document.getElementsByClassName('van-index-bar__index--active')[0]
            if (!dom1) return
            var childs = dom1.childNodes
            if (childs[1]) {
                dom1.removeChild(childs[1])
            }
        },
        //根据房源状态获取样式名
        getHousingStatus(status) {
            if (this.$route.query.status === '1') {
                if (status === '预销控') {
                    return getHousingStatus('不可销控').tagClass
                }else {
                    return getHousingStatus(status).tagClass
                }
            }else {
                if (status === '预销控') {
                    return getHousingStatus('可销控').tagClass
                }else {
                    return getHousingStatus('不可销控').tagClass
                }
            }
        },
        //点开详情
        showDetail(subItem, index, subIndex) {

            // 设置预销控
            if ((subItem.salesControl === '不可销控' || subItem.salesControl === '预销控') && this.$route.query.status === '1') {
                this.$toast('该房间不支持预销控')
                return
            }

            // 取消预销控
            if ((subItem.salesControl !== '预销控') && this.$route.query.status === '2') {
                this.$toast('该房间不支持取消预销控')
                return
            }

            if (this.roomIdList.length !== 0 && this.roomIdList[0].salesControl !== subItem.salesControl) {
                this.$toast('只能选择一种状态')
                return
            }
            subItem.checked = !subItem.checked

            if (subItem.checked) {
                this.roomIdList.push({
                    id: subItem.id,
                    salesControl: subItem.salesControl,
                })
            } else {
                this.roomIdList = this.roomIdList.filter((item) => subItem.id !== item.id)
            }
            this.total = this.roomIdList.length
            if (this.total < this.oldTotal) {
                this.unChecked = false
            }
            const item = this.list[index]
            item[subIndex] = subItem

            this.$set(this.list, index, item)
        },
        //筛选挂载节点
        getContainer() {
            return document.querySelector('.main-container')
        },
        handleNext() {
            const list = this.roomIdList
            const idList = []
            list.forEach((item) => {
                idList.push(item.id)
            })
            // 设置预销控
            if (this.$route.query.status === '1') {
                this.$router.push({
                    path: '/case/housingFinishSale',
                    query: {
                        type: list[0].salesControl === '可销控' ? 1 : 0,
                        name: this.$route.query.name,
                        stageCode: this.$route.query.stageCode,
                        buildCode: this.building
                    },
                })
                this.$store.commit('other/SET_SALE_ROOM_IDS', idList)
            } else {
                this.$dialog
                    .confirm({
                        title: '取消预销控',
                        message: '是否取消预销控',
                    })
                    .then(() => {
                        this.cancelPreSalesControl(idList)
                    })
                    .catch(() => {
                        // on cancel
                    })
            }
        },
        // 取消预销控
        cancelPreSalesControl(saleRoomIds) {
            this.$utils.loading()
            API.saveSalesControl({
                salasControlDate: this.getFormatDate(new Date()),
                projectId: this.projectId,
                houseIdList: saleRoomIds,
                salesControl: false
            }).then(res => {
                if (!res) return
                this.$toast('操作成功')
                this.$toast.clear()
                setTimeout(()=>{
                    this.$router.replace({
                        path: '/case/housingDetail',
                        query: {
                            name: this.$route.query.name,
                            stageCode: this.$route.query.stageCode,
                            buildCode: this.building
                        },
                    })
                },1000)
            })
        },
        // 时间格式化
        getFormatDate(date) {
            let year = date.getFullYear(),
                month = date.getMonth() + 1,
                day = date.getDate()
            let currentDate = year + '-' + this.zero(month) + '-' + this.zero(day)

            return currentDate
        },
        //补全0
        zero(i) {
            return i >= 10 ? i : '0' + i
        },
        back() {
            this.$router.replace({
                path: '/case/housingDetail',
                query: {
                    name: this.$route.query.name,
                    stageCode: this.$route.query.stageCode,
                    buildCode: this.$route.query.buildCode
                },
            })
        },
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            var array = vm.keepAliveList || []
            if (array.indexOf('caseHousingPreview') === -1) {
                array.push('caseHousingPreview')
                vm.$store.dispatch('other/setKeepAlive', array)
            }
            if (from.path.includes('/case/housingFinishSale')) {
                vm.refresh = true
            }
        })
    },
    beforeRouteLeave(to, from, next) {
        var array = this.keepAliveList
        if (!to.path.includes('/case/housingFinishSale')) {
            array = array.filter(item => {
                return item !== 'caseHousingPreview'
            })
            this.$store.dispatch('other/setKeepAlive', array)
        }
        next()
    },
}
</script>

<style lang="less" scoped>
.common-page {
    position: relative;

    .iconyulan {
        font-size: 18px;
    }

    /deep/ .check-button .check-item.fixedWidth {
        min-width: 70px;
    }

    .watermark-canvas {
        position: absolute;
        top: 0;
        left: 0;
        //width: 100%;
        //height: 800px;
        pointer-events: none;
        z-index: 3000;
        opacity: 0.6;
    }

    .common-page-container {
        .main-section {
            overflow-y: auto;
        }

        .legend-section {
            background: #ffffff;
            .common-flex();
            flex-wrap: wrap;
            justify-content: center;

            .legend-item {
                width: 25%;
                height: 20px;
                .common-flex-center();
                .common-flex();
                //margin-right: 18px;
                .legend-dot {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    margin-right: 4px;

                    &.common-housing-gay {
                        background-color: #999999 !important;
                    }

                    &.common-housing-green {
                        background: @success-color !important;
                    }

                    &.common-housing-blue {
                        background: @theme-color !important;
                    }

                    &.common-housing-light-green {
                        background: @light-green !important;
                    }

                    &.common-housing-orange {
                        background: @warning-color !important;
                    }

                    &.common-housing-red {
                        background: @red-color !important;
                    }
                }

                .legend-text {
                    font-size: 12px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    color: @header-text-color;
                    line-height: 12px;
                }

                &:last-child {
                    margin-right: 0;
                }
            }
        }

        .main-container,
        /deep/ .van-tabs,
        /deep/ .van-tab__pane,
        /deep/ .van-tab__pane {
            height: 100%;
        }

        /deep/ .van-tabs__content,
        .main-section {
            height: calc(100% - 44px);
        }

        .list {
            height: 100%;

            /deep/ .van-cell {
                padding: 0;
            }

            background: #ffffff;

            /deep/ .van-index-anchor {
                display: flex;
                align-items: center;
                min-width: 70px;
                font-size: 14px;
                padding: 0 10px 0;
                font-weight: 600;
            }

            .li {
                padding-right: 10px;
                display: flex;
                flex-wrap: wrap;
                //border-bottom: 1px solid #eeeeee;
                .item {
                    position: relative;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    flex-direction: column;
                    min-width: 50px;
                    height: 30px;
                    border-radius: 4px;
                    margin: 4px;
                    flex-shrink: 0;

                    .checked {
                        position: absolute;
                        right: 8px;
                        bottom: 8px;
                        width: 4px;
                        height: 4px;
                        font-size: 12px;
                        color: #fb2e4b;
                        //border-radius: 50%;
                        //background: #fb2e4b;
                    }

                    .room {
                        font-size: 12px;
                        font-weight: bold;
                    }

                    .status {
                        min-width: 30px;
                        text-align: center;
                        font-size: 12px;
                        //margin-left: 15px;
                    }
                }

                .common-housing-white {
                    min-width: 50px;
                    border: 1px solid #eeeeee;
                    box-sizing: border-box;
                }
            }
        }
    }

    .multiple-filter {
        background: #ffffff;
        height: 40px;
        box-shadow: 0px 1px 8px 0px rgba(53, 56, 61, 0.1);

        .multiple-filter-left {
            .common-flex();
            width: calc(100% - 75px);
            overflow-x: auto;

            .van-dropdown-menu {
                width: auto;
                margin-right: 50px;

                ::v-deep .van-dropdown-menu__item {
                    flex-grow: 1;
                    max-width: 100%;
                    justify-content: end;
                }
            }
        }

        /deep/ .van-dropdown-item {
            top: 44px !important;
        }

        .tab-filter-right {
            position: relative;
        }
    }
}

/deep/ .van-dropdown-menu {
    width: 500px;
}

/deep/ .van-dropdown-menu__item {
    flex: 0;
    min-width: 88px;
    max-width: 100px;
}

/deep/ .van-tree-select {
    .van-sidebar-item--select::before {
        display: none;
    }
}

.wrapper {
    position: fixed;
    bottom: 0;
    width: 100%;
    background: #ffffff;
    border-radius: 8px 8px 0px 0px;
    box-sizing: border-box;

    .top {
        padding: 18px 15px;
        border-bottom: 1px solid #eeeeee;

        .room {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding-right: 40px;
            font-size: 15px;
            font-family: DINAlternate-Bold, DINAlternate;
            font-weight: bold;
            color: #333333;
        }

        .status {
            min-width: 30px;
            margin-left: 6px;
            padding: 1px 6px;
            font-size: 11px;
            border-radius: 2px;
            text-align: center;
        }

        .unit {
            margin-top: 4px;
            font-size: 13px;
            font-family: PingFangSC-Regular, PingFang SC;
            color: #999999;
        }
    }

    .bottom {
        padding: 24px 15px 0;

        .line {
            color: #333333;
            font-size: 15px;
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;

            .label {
                flex-shrink: 0;
                color: #999999;
            }

            .price {
                font-size: 21px;
                font-family: DINAlternate-Bold, DINAlternate;
                font-weight: bold;
                color: #5f95fa;
            }

            .per {
                min-width: 100%;
                margin-bottom: 10px;
                .common-flex();

                &.full {
                    width: 100%;
                }

                .per-unit {
                    flex-shrink: 0;
                    font-size: 12px;
                    margin-left: 2px;
                }
            }
        }

        .plan-button {
            padding: 0 0 18px;

            .container {
                .common-flex-center();
                height: 45px;
                font-size: 15px;
                font-family: PingFangSC-Medium, PingFang SC;
                font-weight: 500;
                color: @theme-color;
                line-height: 15px;
                background: rgba(95, 149, 250, 0.03);
                border-radius: 4px;
            }
        }
    }

    .close {
        font-size: 24px;
        position: absolute;
        right: 0;
        top: 0;
        padding: 10px;
        color: #cccccc;
    }
}

/deep/ .van-index-bar {
    height: 100%;
}

/deep/ .van-index-bar__sidebar {
    transform: translateY(-46%);
    padding: 15px 0;
    width: 18px;
    text-align: center;
    background: #e6e6e6;
    border-radius: 9px;
    right: 4px;
    max-height: 500px;

    .van-index-bar__index {
        padding: 0;
        font-size: 11px;
        color: #ffffff;
        line-height: 23px;

        & > span {
            display: none;
            opacity: 0;
        }

        &.van-index-bar__index--active {
            position: relative;
            width: 18px;
            height: 18px;
            text-align: center;
            line-height: 18px;
            background: #5f95fa;
            border-radius: 9px;
            font-size: 12px;

            span.active {
                display: block;
                position: absolute;
                right: 40px;
                top: -20px;
                line-height: 50px;
                font-size: 24px;
                font-family: PingFangSC-Medium, PingFang SC;
                font-weight: 500;
                width: 56px;
                text-align: center;
                padding-left: 0;
                padding-right: 4px;
                height: 50px;
                background: url('@{baseImgUrl}/case/housing/bg-index.png') no-repeat;
                background-size: contain;
                animation-name: example;
                animation-duration: 1s;
            }

            @keyframes example {
                from {
                    opacity: 1;
                }
                to {
                    opacity: 0;
                }
            }
        }
    }
}
</style>
