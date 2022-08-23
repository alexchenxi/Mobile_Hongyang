<template>
    <div class="common-page">
        <div class="common-page-top">
            <top-bar :back="true" back-path="-" title="房间列表" @back="back">
                <div slot="append-suffix" class="right-icon"
                     v-if="currentRole.roleCode === 'ST_MANAGER' && isShowSalesControl">
                    <van-popover
                        v-model="showPopover"
                        theme="dark"
                        trigger="click"
                        placement="bottom"
                        :actions="actions"
                        @select="onSelect"
                    >
                        <template #reference>
                            <van-icon name="bars" size="24" />
                        </template>
                    </van-popover>
                </div>
            </top-bar>
        </div>
        <!-- 筛选条件 -->
        <div class="common-page-container" :style="{ height: pageContainerHeight }">
            <div class="main-container">
                <template v-if="isHouseLegend">
                    <div :class="['legend-section', currentRole.roleCode !== 'ST_MANAGER' ? 'flex-center' : '']">
                        <div v-for="(item, index) in formatLegendList" :key="index" class="legend-item">
                            <span :class="['legend-dot', item.label.tagClass]"></span>
                            <span class="legend-text">{{ item.label.name }}</span>
                        </div>
                    </div>
                </template>
                <van-tabs v-model="building" animated @change="getUnitList">
                    <van-tab v-for="tab in tabList" :key="tab.code" :title="tab.name" :name="tab.code">
                        <div class="multiple-filter">
                            <div class="multiple-filter-left">
                                <van-dropdown-menu active-color="#DB0826" v-if="unitOptions && unitOptions.length">
                                    <van-dropdown-item
                                        ref="filter"
                                        v-model="unit"
                                        :get-container="getContainer"
                                        :options="unitOptions"
                                        @change="getRoomList"
                                    />
                                </van-dropdown-menu>
                            </div>
                            <div
                                v-if="isHouseLegend"
                                class="multiple-filter-right tab-filter-right"
                            >
                                <FilterSection
                                    ref="filterSection"
                                    :filter-list="statusOptions"
                                    container="body"
                                    @change="getRoomList"
                                />
                            </div>
                        </div>
                        <div class="main-section">
                            <van-empty
                                v-if="list.length === 0 && finished"
                                class="custom-image"
                                :image="$baseImgUrl + '/no-data.png'"
                                description="暂无您想找的房源~"
                            />
                            <div v-if="list.length > 0" class="list">
                                <van-index-bar
                                    :ref="'indexBar' + building"
                                    :sticky="false"
                                    :index-list="indexList"
                                    @change="clearActive"
                                    @select="changeActive"
                                >
                                    <div v-for="(item, index) in list" :key="item.code" style="display: flex">
                                        <van-index-anchor
                                            :ref="'indexBar' + building + 'index'"
                                            :index="item.code"
                                        >
                                            楼层{{ item.name }}
                                        </van-index-anchor>
                                        <van-cell style="flex: 1">
                                            <div class="li">
                                                <template
                                                    v-if="isHouseLegend">
                                                    <div
                                                        :key="subItem.id"
                                                        v-for="(subItem, subIndex) in item.childList"
                                                        @click="showDetail(subItem, index, subIndex)"
                                                        :class="'item ' + getHousingStatus(subItem.status)"
                                                    >
                                                        <img
                                                            alt=""
                                                            class="lock"
                                                            v-if="subItem.status === 4"
                                                            :src="$baseImgUrl + '/case/housing/icon-lock.png'"
                                                        >
                                                        <div class="room">{{ subItem.room }}</div>
                                                    </div>
                                                </template>
                                                <template v-else>
                                                    <div
                                                        :key="subItem.id"
                                                        v-for="(subItem, subIndex) in item.childList"
                                                        @click="showDetail(subItem, index, subIndex)"
                                                        class="item common-housing-white"
                                                    >
                                                        <img
                                                            alt=""
                                                            class="lock"
                                                            v-if="subItem.status === 4"
                                                            :src="$baseImgUrl + '/case/housing/icon-lock.png'"
                                                        >
                                                        <div class="room">{{ subItem.room }}</div>
                                                    </div>
                                                </template>

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

        <van-overlay :show="show" @click="show = false">
            <div class="wrapper" @click.stop>
                <div class="close" @click="show = false">×</div>
                <div class="top">
                    <div class="room">
                        房间号：
                        {{ detail.roominfo || '--' }}
                        <span v-if="detail.status" :class="'status ' + getHousingStatus(detail.status)">{{ detail.status }}</span>
                    </div>
                    <!--                    <div class="unit">{{ detail.stage }}·{{ detail.building }}·{{ detail.unit
                    }}</div>-->
                </div>
                <div class="bottom">
                    <div class="line">
                        <div class="per full">
                            <span class="label">户型：</span>
                            <span>{{ detail.huXing || '--' }}</span>
                        </div>
                        <div class="per">
                            <span class="label">房间结构：</span>
                            <span>{{ detail.roomStru || '--' }}</span>
                        </div>
                        <div class="per">
                            <span class="label">楼层：</span>
                            <span>{{ detail.floor || '--' }}</span>
                        </div>
                        <div class="per">
                            <span class="label">建筑面积：</span>
                            <span>{{ parseFloat(detail.bldArea) || '--' }}</span>
                            <span v-if="detail.bldArea" class="per-unit">㎡</span>
                        </div>
                        <div class="per">
                            <span class="label">套内面积：</span>
                            <span>{{ parseFloat(detail.tnArea) || '--' }}</span>
                            <span v-if="detail.tnArea" class="per-unit">㎡</span>
                        </div>
                        <div class="per">
                            <span class="label">建筑单价：</span>
                            <span>{{ parseFloat(detail.price) | numFormat() }}</span>
                            <span v-if="detail.price" class="per-unit">元</span>
                        </div>
                        <div class="per">
                            <span class="label">套内单价：</span>
                            <span>{{ parseFloat(detail.tnPrice) | numFormat() }}</span>
                            <span v-if="detail.tnPrice" class="per-unit">元</span>
                        </div>
                        <div class="per">
                            <span class="label">标准总价：</span>
                            <span>{{ parseFloat(detail.total) | numFormat() }}</span>
                            <span v-if="detail.total" class="per-unit">元</span>
                        </div>
                        <template v-if="currentRole.roleCode === 'ST_MANAGER'">
                            <div class="per">
                                <span class="label">客户：</span>
                                <span>{{ detail.cstAllName || '--' }}</span>
                            </div>
                            <div class="per">
                                <span class="label">成交总价：</span>
                                <span>{{ parseFloat(detail.cjtotal) | numFormat() }}</span>
                                <span v-if="detail.cjtotal" class="per-unit">元</span>
                            </div>
                            <div class="per">
                                <span class="label">建筑成交单价：</span>
                                <span>{{ parseFloat(detail.bldCjPrice) | numFormat() }}</span>
                                <span v-if="detail.bldCjPrice" class="per-unit">元</span>
                            </div>
                            <div class="per">
                                <span class="label">套内成交单价：</span>
                                <span>{{ parseFloat(detail.tnCjPrice) | numFormat() }}</span>
                                <span v-if="detail.tnCjPrice" class="per-unit">元</span>
                            </div>
                            <div class="per">
                                <span class="label">签署日期：</span>
                                <span>{{ detail.qsdate && detail.qsdate.slice(0, 19) || '--' }}</span>
                            </div>
                            <div class="per">
                                <span class="label">业务员：</span>
                                <span>{{ detail.ywy || '--' }}</span>
                            </div>
                        </template>
                    </div>
                    <!--                    <div v-if="detail.status !== 5" class="plan-button">-->
                    <!--                        <div class="container" @click="goPlacConfig">制定置业计划书</div>-->
                    <!--                    </div>-->
                </div>
            </div>
        </van-overlay>
        <canvas id="watermarkCanvas" width="375" height="" class="watermark-canvas" />
    </div>
</template>

<script>
import TopBar from '@c/TopBar'
import { mapGetters } from 'vuex'
import { commonMethods } from 'movit-utils'
import FilterSection from '@c/FilterSection'
import API from '@/request/api/caseSystem/housing'
import { commonData, getHousingStatus, getConsultantHousingStatus } from '@/config/commonData'

export default {
    name: 'CaseHousingDetail',
    components: {
        TopBar,
        FilterSection
    },
    data() {
        return {
            isHouseLegend: true,
            legendList: [],
            tabList: [],
            statusOptions: [],
            show: false,
            isShowSalesControl: false,
            unitOptions: [],
            building: 1,
            unit: 1,
            status: -1,
            indexList: [],
            list: [],
            finished: false,
            detail: {},
            //判断是否首次加载索引组件
            isFirst: true,
            flag: true,
            time: 0,
            // 判断接口是否在调用
            isPending: false,
            actions: [
                { text: '设置预销控', className: ['grid-item', 'house-grid-item'] }, {
                    text: '取消预销控',
                    className: ['grid-item', 'house-grid-item']
                }
            ],
            showPopover: false
        }
    },
    computed: {
        formatLegendList() {
            if (!this.isShowSalesControl || this.currentRole.roleCode !== 'ST_MANAGER') {
                return this.legendList.filter(item => item.label.name !== '预销控')
            } else {
                return this.legendList
            }
        },
        ...mapGetters(['projectId', 'currentRole', 'keepAliveList', 'user'])
    },
    created() {
        this.NumFormat = commonMethods.NumFormat

        let statusOptions = null
        if (this.currentRole.roleCode !== 'ST_MANAGER') {
            statusOptions = this.$utils.mapToArray(commonData.salesHousingStatus)
            this.legendList = this.$utils.mapToArray(commonData.salesHousingStatus)
            statusOptions.map((item) => {
                item.label = item.label.name
            })
        } else {
            const arr = ['可销控', '不可销控', '已售']
            statusOptions = this.$utils.mapToArray(commonData.housingStatus)
            statusOptions = statusOptions.filter((item) => !arr.includes(item.value))
            this.legendList = this.$utils.mapToArray(commonData.housingStatus).filter((item) => !arr.includes(item.value))

            statusOptions.map((item) => {
                item.label = item.label.name
            })

        }

        this.statusOptions = [
            {
                name: '房源状态',
                type: 'check',
                field: 'statusList',
                list: statusOptions
            }
        ]
        this.building = this.$route.query.buildCode
        this.getBuildingList()
        this.getUnitList()
        // this.housePreview()
    },
    activated() {
        this.showPopover = false
        this.building = this.$route.query.buildCode
        this.getBuildingList()
        this.getUnitList()
        this.housePreview()
    },
    mounted() {
        let text = `弘客云-${ this.user.name }-${ localStorage.getItem('userName') } ${ commonMethods.DateToTime(new Date()) }`
        this.$utils.drawWatermark('watermarkCanvas', text)
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            var array = vm.keepAliveList || []
            if (array.indexOf('CaseHousingDetail') === -1) {
                array.push('CaseHousingDetail')
                vm.$store.dispatch('other/setKeepAlive', array)
            }
            if (from.path.includes('/case/housingPreview')) {
                vm.refresh = true
            }
        })
    },
    beforeRouteLeave(to, from, next) {
        var array = this.keepAliveList
        this.showPopover = false
        if (localStorage.getItem('stageCode')) {
            localStorage.removeItem('stageCode')
            localStorage.removeItem('buildCode')
        }
        if (localStorage.getItem('stageName')) {
            localStorage.removeItem('stageName')
        }
        next()
    },
    methods: {
        onSelect(item) {
            this.$router.push({
                path: '/case/housingPreview',
                query: {
                    name: this.$route.query.name,
                    stageCode: this.$route.query.stageCode,
                    buildCode: this.building,
                    status: item.text === '设置预销控' ? 1 : 2
                }
            })
        },
        //获取楼栋
        async getBuildingList() {
            const params = {
                projectId: this.projectId,
                stage: this.$route.query.stageCode
            }

            this.tabList = await API.houseBuildingListApi(params)
            if (!this.tabList?.length) {
                this.tabList = [{ code: '01', name: '无单元' }]
            }
        },
        //获取单元
        async getUnitList() {
            this.$utils.loading()
            const params = {
                projectId: this.projectId,
                building: this.building
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
                unit: this.unit
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
            if (this.currentRole.roleCode !== 'ST_MANAGER') {
                return getConsultantHousingStatus(status).tagClass
            }
            return getHousingStatus(status).tagClass
        },
        //点开详情
        showDetail(subItem) {
            if (this.isHouseLegend && subItem.status === '已售' && this.currentRole.roleCode !== 'ST_MANAGER') return
            this.flag = true

            const params = {
                roomGuid: subItem.id,
                roleCode: this.currentRole.roleCode
            }
            setTimeout(() => {
                if (this.flag) {
                    this.$utils.loading()
                    API.houseDetailApi(params).then((res) => {
                        this.$toast.clear()
                        this.detail = res
                        this.detail.status = subItem.status === '预销控' ? '预销控' : res.status
                        console.log('res', res)
                        this.show = true
                    })
                }
            }, 500)
        },
        //筛选挂载节点
        getContainer() {
            return document.querySelector('.main-container')
        },
        changeStatus(item, index, subIndex) {
            this.flag = false
            if (this.currentRole.roleCode === 'ST_SALES') return
            if (item.status !== 0 && item.status !== 4) {
                this.$toast('该房源状态不支持销控')
                return
            }
            var tip = '是否确认销控'
            if (item.status === 4) {
                tip = '是否取消销控'
            }
            if (this.isPending) {
                return
            }
            this.$dialog
                .confirm({
                    title: '',
                    message: tip
                })
                .then(() => {
                    this.$utils.loading()
                    this.isPending = true
                    API.houseStatusUpdateApi({
                            status: item.status === 4 ? 0 : 4,
                            houseIdList: [item.id]
                        })
                        .then(() => {
                            this.isPending = false
                            const data = this.list[index].childList[subIndex]
                            data.status = item.status === 4 ? 0 : 4
                            data.statusName = item.status === 4 ? '二级销控' : '待售'
                            this.$toast.clear()
                            this.$toast('操作成功')
                            this.$forceUpdate()
                        })
                        .catch(() => {
                            this.isPending = false
                        })
                })
                .catch(() => {
                })
        },
        beforeChangeTabs() {
            if (this.loading) {
                return false
            } else {
                return true
            }
        },
        goPlacConfig() {
            this.$router
                .push({
                    name: 'caseHousePlanConfig',
                    params: {
                        stageCode: this.$route.query.stageCode,
                        buildCode: this.$route.query.buildCode,
                        area:
                            this.detail.childList && this.detail.childList.find((item) => item.fieldName === '建筑面积')
                                ? this.detail.childList.find((item) => item.fieldName === '建筑面积').fieldValue
                                : '',
                        unitPrice:
                            this.detail.childList && this.detail.childList.find((item) => item.fieldName === '标准单价')
                                ? this.detail.childList.find((item) => item.fieldName === '标准单价').fieldValue
                                : '',
                        houseInfo: this.detail.stage + '-' + this.detail.building + '-' + this.detail.unit + ' ' + this.detail.room
                    }
                })
                .catch(() => {
                })
        },
        back() {
            if (this.$refs?.filterSection && this.isHouseLegend) {
                this.$refs.filterSection[0].hide()
            }
            this.$router
                .replace({
                    path: this.$store.getters.microPrefix + '/case/housing'
                })
                .catch(() => {
                })
        },
        // 房源预览
        housePreview() {
            API.otherSetting(this.projectId).then((res) => {
                if (res?.houseSalesControl) {
                    this.isShowSalesControl = true
                } else {
                    this.isShowSalesControl = false
                    const statusOptions = this.statusOptions[0].list.filter(item => item.label !== '预销控')
                    this.statusOptions = [
                        {
                            name: '房源状态',
                            type: 'check',
                            field: 'statusList',
                            list: statusOptions
                        }
                    ]
                }

                // 顾问和主管是否能查看房源
                this.isHouseLegend = this.currentRole.roleCode === 'ST_MANAGER' ? true : res?.isCanSee
            })
        }
    }
}
</script>

<style scoped lang="less">
.right-icon {
    font-size: 14px;
    width: 45px;
}

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
            background: #FFFFFF;
            .common-flex();
            //justify-content: center;
            flex-wrap: wrap;

            .legend-item {
                width: 20%;
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
                    margin-left: 6px;
                }
            }
        }

        .flex-center {
            justify-content: center;
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

            background: #FFFFFF;

            /deep/ .van-index-anchor {
                display: flex;
                align-items: center;
                min-width: 70px;
                font-size: 14px;
                padding: 0 10px 0;
                font-family: PingFangSC-Medium, PingFang SC;
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

                    .lock {
                        position: absolute;
                        right: 10px;
                        top: 10px;
                        width: 15px;
                        height: 15px;
                    }

                    .room {
                        font-size: 12px;
                        font-family: DINAlternate-Bold, DINAlternate;
                        font-weight: bold;
                        //margin-left: 15px;
                    }

                    .status {
                        min-width: 30px;
                        text-align: center;
                        font-size: 12px;
                        //margin-left: 15px;
                    }
                }

                .common-housing-white {
                    box-sizing: border-box;
                    min-width: 50px;
                    border: 1px solid #EEEEEE;
                }
            }
        }
    }

    .multiple-filter {
        background: #FFFFFF;
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
    background: #FFFFFF;
    border-radius: 8px 8px 0px 0px;
    box-sizing: border-box;

    .top {
        padding: 18px 15px;
        border-bottom: 1px solid #EEEEEE;

        .room {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding-right: 24px;
            font-size: 15px;
            font-family: DINAlternate-Bold, DINAlternate;
            font-weight: bold;
            color: #333333;
        }

        .status {
            min-width: 48px;
            padding: 1px 0px;
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
                color: #5F95FA;
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
        color: #CCCCCC;
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
    background: #E6E6E6;
    border-radius: 9px;
    right: 4px;
    max-height: 500px;

    .van-index-bar__index {
        padding: 0;
        font-size: 11px;
        color: #FFFFFF;
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
            background: #5F95FA;
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
                background: url("@{baseImgUrl}/case/housing/bg-index.png") no-repeat;
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
