<template>
    <div class="customer-list">
        <components :is="componentsName" ref="checkBoxGroup" v-model="checkList" @change="checkChange">
            <div v-for="(item, index) in formatList" :key="item.clueId" class="customer-item">
                <template>
                    <van-checkbox v-if="checkBox && componentsName === 'van-checkbox-group'" :name="item[checkField]">
                        <template #icon="props">
                            <span class="iconfont" :class="props.checked ? 'iconqueding' : 'iconweixuanzhong1'" />
                        </template>
                    </van-checkbox>
                    <van-radio v-if="checkBox && componentsName === 'van-radio-group'" :name="item[checkField]">
                        <template #icon="props">
                            <span class="iconfont" :class="props.checked ? 'iconqueding' : 'iconweixuanzhong1'" />
                        </template>
                    </van-radio>
                </template>
                <van-swipe-cell :ref="'swipeCell' + index" :disabled="true" :before-close="beforeClose">
                    <div @click="goDetail(item)" class="item-content">
                        <!-- 关键人小蜜蜂只能操作有效状态的 -->
                        <div
                            v-if="getCustomerConfig(item.codeType).operating && getCustomerConfig(item.codeType).operating.length && (item.memberStatus || item.memberStatus !== 0)"
                            class="item-right"
                            @click="openCell($event, index)"
                        >
                            <van-icon name="ellipsis" size="20px" color="#D8D8D8" />
                        </div>
                        <section class="top-containe-wrap" :class="getCustomerConfig(item.codeType).showAvatar ? 'is-avatar' : ''">
                            <van-image
                                v-if="getCustomerConfig(item.codeType).showAvatar"
                                class="avatar"
                                round
                                width="44px"
                                height="44px"
                                fit="cover"
                                :src="item[getCustomerConfig(item.codeType).avatarField] || $baseImgUrl + '/default-avatar.png'"
                            />
                            <div class="top-container">
                                <div class="section-header">
                                    <div class="section-header-left">
                                        <div class="name">{{ item[getCustomerConfig(item.codeType).nameField] }}</div>
                                        <div class="tag-list">
                                            <template v-for="(tag, i) in getCustomerConfig(item.codeType).tagList">
                                                <div v-if="tag.type === 'level' && item[tag.field]" :key="i" :class="['tag-item', 'common-tag-' + item[tag.field]]">{{ item[tag.field] }}级</div>
                                                <div
                                                    v-if="tag.type === 'status'"
                                                    :key="i"
                                                    :class="['tag-item', Array.isArray(tag.class) ? getCustomerTagColor(tag.class, item[tag.field]).class : tag.class]"
                                                >
                                                    {{ Array.isArray(tag.class) ? getCustomerTagColor(tag.class, item[tag.field]).name : item[tag.field] ? item[tag.field] : tag.field }}
                                                </div>
                                            </template>
                                        </div>
                                    </div>
                                    <div
                                        v-if="(getCustomerConfig(item.codeType).actions && getCustomerConfig(item.codeType).actions.collect) || (item.menuType && item.menuType === 'ST.CUSTOMER.FAV')"
                                        class="section-header-right"
                                    >
                                        <div v-if="(item.makeFlg && item.makeFlg !== '0') || currentRole.roleCode === 'ZT_MANAGER'" class="collect-container" @click.stop="handleCollection(item)">
                                            <img v-if="item.important === '1'" class="icon-collect" :src="$baseImgUrl + '/case/customer/icon-collect-on.png'" />
                                            <img v-else class="icon-collect" :src="$baseImgUrl + '/case/customer/icon-collect.png'" />
                                        </div>
                                    </div>
                                </div>
                                <div class="section-body">
                                    <template v-if="item.codeType">
                                        <template v-if="item.relationId&&item.codeType!='ZT.REFERRAL.BROKER'">
                                            <div class="field-name" style="margin-top: 10px">自渠下线经纪人：</div>
                                            <div class="field-content" style="margin-top: 10px">{{ item.reportUserName || '--' }}</div>
                                        </template>
                                        <template v-for="(field, i) in getCustomerConfig(item.codeType).fieldList">
                                            <!-- 关键人和小蜜蜂 -->
                                            <div
                                                v-if="field.name !== 'beeUserType' || (field.name === 'beeUserType' && item[field.name])"
                                                :key="i"
                                                class="field-section"
                                                :class="Array.isArray(field) ? 'no-wrap' : '' + field.className"
                                            >
                                                <template v-if="Array.isArray(field)">
                                                    <div v-for="(x, i) in field" :key="i" class="sub-field-section">
                                                        <div class="field-name">{{ x.name }}：</div>
                                                        <div v-if="x.name.includes('电话号码') || x.name.includes('手机号码')" class="field-content" @click="clickField(x, item)">
                                                            {{ item[x.field] || item[x.field] === 0 ? item[x.field] : '--' | hidePhone(item.canEdit, 'ZT.CUSTOMER.BUTTON.SHOWTEL') }}
                                                        </div>
                                                        <div v-else class="field-content" @click="clickField(x, item)">
                                                            {{ item[x.field] || item[x.field] === 0 ? item[x.field] + (x.unit || '') : '--' }}
                                                        </div>
                                                    </div>
                                                </template>
                                                <template v-else>
                                                    <template v-if="judgeShow(item, field)">
                                                        <div
                                                            class="field-name"
                                                            v-if="
                                                                [
                                                                    'ZT.RANK.GROUP.DF',
                                                                    'ZT.REPORT.DF',
                                                                    'ZT.REPORT.SF',
                                                                    'ZT.REPORT.FF',
                                                                    'ZT.RANK.GROUP.BB',
                                                                    'ZT.REPORT.TJ',
                                                                    'ZT.RANK.CHANNEL.BB',
                                                                    'ZT.RANK.CHANNEL.DF',
                                                                    'ZT.RANK.STAFF.BB',
                                                                    'ZT.RANK.STAFF.DF'
                                                                ].includes(item.codeType) && field.field === 'reportName'
                                                            "
                                                        >
                                                            {{ item.teamRoleCode === 'ZT_DIRECTOR' ? '渠道主管' : '渠道专员' }}：
                                                        </div>
                                                        <div class="field-name" v-else>{{ (item[field.name] || field.name) === '时间' ? item.dateName : (item[field.name] || field.name) }}：</div>
                                                        <div v-if="field.name.includes('电话号码') || field.name.includes('手机号码')" class="field-content" @click="clickField(field, item)">
                                                            {{ item[field.field] || '--' | hidePhone(item.canEdit, 'ZT.CUSTOMER.BUTTON.SHOWTEL') }}
                                                        </div>
                                                        <div v-else class="field-content" @click="clickField(field, item)">{{ item[field.field] || '--' }}</div>
                                                    </template>
                                                </template>
                                            </div>
                                        </template>
                                    </template>
                                    <template v-if="!item.codeType">
                                        <div class="field-section">
                                            <div class="field-name">电话号码：</div>
                                            <div class="field-content">{{ item.customerTel || '--' | hidePhone(item.canEdit, 'ZT.CUSTOMER.BUTTON.SHOWTEL') }}</div>
                                        </div>
                                        <div class="field-section">
                                            <div class="field-name">报备时间：</div>
                                            <div class="field-content">{{ item.reportDate || '--' }}</div>
                                        </div>
                                    </template>
                                </div>
                                <div v-if="getCustomerConfig(item.codeType).actions && getCustomerConfig(item.codeType).actions.setTag" class="section-footer">
                                    <SettingTag v-code="['ZT.HOME.BUTTON', 'ZT.CUSTOMER.BUTTON.TAG']" class="button-section" :type="2" :item="item" :data="item.label" @change="tagChange" />
                                    <!--                                <div v-if="getCustomerConfig(item.codeType).actions.recommendAgain && item.canEdit" class="recommend-again" @click.stop="recommendAgain(item)">-->
                                    <!--                                    <i class="iconfont iconzhongxinbaobei"></i>-->
                                    <!--                                    <span>重新报备</span>-->
                                    <!--                                </div>-->
                                </div>
                            </div>
                        </section>
                        <div v-if="getCustomerConfig(item.codeType).bottomInfo" class="took-info">
                            <div class="tag-item common-tag-blue">最近轨迹</div>
                            <p class="name van-ellipsis">{{ item[getCustomerConfig(item.codeType).bottomInfo.textField] }}</p>
                            <span class="date">{{ item[getCustomerConfig(item.codeType).bottomInfo.dateField] }}</span>
                        </div>
                        <div class="bottom-container">
                            <div class="action-list">
                                <div v-if="getCustomerConfig(item.codeType).actions.recommend" class="action-button" @click.stop="recommend(item)">
                                    <span class="iconfont icontuijian"></span>
                                    报备
                                </div>
                                <div v-if="item.canEdit && getCustomerConfig(item.codeType).actions.call" class="action-button" @click.stop="call(item)">
                                    <span class="iconfont icondianhua1"></span>
                                    打电话
                                </div>
                                <div v-if="getCustomerConfig(item.codeType).actions.report && item.canEdit && item.canRegister" class="action-button" @click.stop="report(item)">
                                    <span class="iconfont icontuijian"></span>
                                    报备客户
                                </div>
                            </div>
                        </div>
                    </div>
                    <template #right>
                        <div
                            v-for="operate in getCustomerConfig(item.codeType).operating"
                            :key="operate.text"
                            class="action-item"
                            :style="{ background: operate.bgColor }"
                            @click="clickOperate(operate, item)"
                        >
                            {{ operate.text }}
                        </div>
                    </template>
                </van-swipe-cell>
            </div>
        </components>
    </div>
</template>

<script>
import SettingTag from '@/components/SettingTag'
import { mapGetters } from 'vuex'
import { getConfig, getTagColor } from '@/config/extensionCustomerConfig'
export default {
    name: 'CustomerSection',
    components: {
        SettingTag
    },
    props: {
        list: {
            type: Array,
            default: () => {
                return []
            }
        },
        checkBox: {
            type: Boolean,
            default: false
        },
        checkAll: {
            type: Boolean,
            default: false
        },
        checkField: {
            type: String,
            default: 'id'
        },
        componentsName: {
            type: String,
            default: 'van-checkbox-group'
        }
    },
    data() {
        return {
            customerList: [],
            checkList: []
        }
    },
    watch: {
        checkAll(val) {
            if (val) {
                this.$refs.checkBoxGroup.toggleAll(true)
            } else {
                this.$refs.checkBoxGroup.toggleAll()
            }
        },
        list() {
            if (this.checkAll) {
                this.$nextTick(() => {
                    this.$refs.checkBoxGroup.toggleAll(true)
                })
            }
        }
    },
    computed: {
        ...mapGetters(['currentRole']),
        formatList() {
            this.list.forEach(item => {
                if (!item.relationId) {
                    delete item.relationId
                    delete item.reportUserName
                }
            })
            return this.list
        }
    },
    methods: {
        checkChange() {
            this.$emit('change', this.checkList)
        },
        judgeShow(item, field) {
            //首页穿透 如果销售主管自己推荐的客户不需要展示销售主管：XX
            const flag = !(
                ['ZT.RANK.GROUP.DF', 'ZT.REPORT.DF', 'ZT.RANK.GROUP.BB', 'ZT.REPORT.TJ', 'ZT.RANK.CHANNEL.BB', 'ZT.RANK.CHANNEL.DF', 'ZT.RANK.STAFF.BB', 'ZT.RANK.STAFF.DF'].includes(item.codeType) &&
                field.field === 'reportName' &&
                item.teamRoleCode === 'ZT_DIRECTOR' &&
                this.currentRole.roleCode === 'ZT_DIRECTOR'
            )
            return flag
        },
        getCustomerConfig(type) {
            const menuIdList = ['ZT.REPORT.DF', 'ZT.REPORT.SF', 'ZT.REPORT.FF']
            if (type === 'ZT.REPORT.TJ' && this.currentRole.roleCode === 'ZT_MEMBER') {
                let config = getConfig(type)
                config.fieldList.splice(2, 1)
                return config
            }
            if (menuIdList.includes(type) && this.currentRole.roleCode === 'ZT_MEMBER') {
                let config = getConfig(type)
                config.fieldList.splice(3, 1)
                return config
            }
            return getConfig(type)
        },
        getCustomerTagColor(classList, value) {
            return getTagColor(classList, value)
        },
        //修改标签
        tagChange() {
            this.$emit('tagChange', true)
        },
        //收藏
        handleCollection(item) {
            this.$emit('collect', item)
        },
        //客户详情
        goDetail(item) {
            this.$emit('goDetail', item)
        },
        // 重新报备
        recommendAgain(item) {
            this.$emit('recommendAgain', item)
        },
        //报备
        recommend(item) {
            this.$emit('recommend', item)
        },
        // 报备客户
        report(item) {
            this.$emit('report', item)
        },
        // 打电话
        call(item) {
            const itemData = this.getCustomerConfig(item.codeType)
                .fieldList.flat(Infinity)
                .find(x => x.name === '手机号码')
            const tel = item[itemData.field]
            if (tel) {
                this.$emit('call', tel)
            }
        },
        beforeClose() {},
        //手动滑出操作按钮
        openCell(event, index) {
            event.stopPropagation()
            if (this.$refs['swipeCell' + index][0].offset) {
                this.$refs['swipeCell' + index][0].close()
                return
            }
            this.$refs['swipeCell' + index][0].open('right')
        },
        // 操作
        clickOperate(type, item) {
            this.$emit('operate', {
                type,
                item
            })
        },
        clickField(field, item) {
            this.$emit('clickField', {
                field,
                item
            })
        }
    }
}
</script>

<style lang="less" scoped>
.customer-list {
    .customer-item {
        // padding: 15px;
        .common-flex();
        background: #ffffff;
        margin-bottom: 6px;
        align-items: stretch;
        .van-checkbox {
            flex-shrink: 0;
            flex-grow: 0;
        }
        .iconfont.iconqueding {
            color: @theme-color;
            font-size: 18px;
        }

        .iconfont.iconweixuanzhong1 {
            background: #ffffff;
            font-size: 18px;
            color: #e5e5e5;
        }
        .item-content {
            flex-shrink: 1;
            width: 100%;
        }
        .item-right {
            position: absolute;
            right: 15px;
            top: 15px;
            text-align: right;
            width: 25px;
            height: 25px;
        }
        .action-item {
            .common-flex-center();
            width: 50px;
            height: 100%;
            color: #ffffff;
            border-radius: 0 4px 4px 0;
        }
        .top-container {
            padding: 15px;
            flex: 1;
            .section-header {
                .common-flex-between();
                margin-bottom: 2px;
                .section-header-left {
                    .common-flex();
                    .name {
                        font-size: 16px;
                        color: @header-text-color;
                        line-height: 16px;
                        font-weight: 500;
                        margin-right: 8px;
                    }
                    .tag-list {
                        .common-flex();
                        .tag-item {
                            .common-flex-center();
                            min-width: 45px;
                            height: 18px;
                            font-size: 11px;
                            //color: @theme-color;
                            line-height: 11px;
                            font-weight: 500;
                            margin-right: 6px;
                            padding: 0 6px;
                            border-radius: 2px;
                        }
                    }
                }
                .section-header-right {
                    .collect-container {
                        align-self: start;
                        .icon-collect {
                            width: 18px;
                            height: 18px;
                        }
                    }
                }
            }
            .section-body {
                .common-flex();
                flex-wrap: wrap;
                .field-section {
                    .common-flex();
                    font-size: 13px;
                    line-height: 13px;
                    font-weight: 400;
                    margin-top: 12px;
                    margin-right: 48px;
                    width: 100%;

                    &.no-wrap {
                        justify-content: space-between;
                        width: 100%;
                        margin-right: 0;
                    }
                    .sub-field-section {
                        display: flex;
                        &:last-child {
                            margin-right: 30px;
                        }
                    }
                }
                .w-50 {
                    width: 50%;
                    margin-right: 0;
                }
                .field-name {
                    color: #999999;
                }
                .field-content {
                    color: @header-text-color;
                }
            }
            .section-footer {
                .common-flex-between();
                .button-section {
                    margin-top: 12px;
                }
                .count-date {
                    margin-top: 12px;
                    width: 100%;
                    .common-flex();
                    align-items: flex-end;
                    justify-content: flex-end;
                    font-size: 13px;
                    color: #999999;
                    line-height: 20px;
                    font-weight: 400;
                    .date-strong {
                        font-size: 24px;
                        color: #ff7282;
                        line-height: 24px;
                        font-weight: bold;
                        padding: 0 4px;
                    }
                }
                .recommend-again {
                    margin-top: 12px;
                    .common-flex();
                    align-self: flex-end;
                    margin-bottom: 5px;
                    .iconfont {
                        margin-right: 4px;
                        font-size: 15px;
                        color: @header-text-color;
                    }
                    span {
                        font-size: 13px;
                        line-height: 13px;
                        color: @header-text-color;
                    }
                }
            }
        }
        .top-containe-wrap {
            display: flex;
            .avatar {
                margin: 15px 0 0 15px;
            }
            &.is-avatar {
                .top-container {
                    padding-left: 10px;
                    .section-body {
                        .sub-field-section {
                            &:last-child {
                                margin-right: 0;
                            }
                        }
                    }
                }
            }
        }
        .bottom-container {
            .action-list {
                .common-flex-between();
                position: relative;
                .action-button {
                    .common-flex-center();
                    position: relative;
                    width: 100%;
                    height: 45px;
                    font-size: 13px;
                    color: @header-text-color;
                    line-height: 13px;
                    font-weight: 400;
                    border-top: 1px solid #f4f4f4;
                    .iconfont {
                        padding-right: 5px;
                    }
                    &::before {
                        position: absolute;
                        left: 0;
                        top: 16px;
                        content: '';
                        width: 1px;
                        height: 13px;
                        background: #eaeaea;
                    }
                    &:first-child {
                        &::before {
                            width: 0;
                        }
                    }
                }
            }
        }
        .took-info {
            padding: 0 10px;
            margin-bottom: 12px;
            margin-left: 15px;
            width: calc(100% - 50px);
            height: 32px;
            background: #f5f7f9;
            border-radius: 4px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            .tag-item {
                .common-flex-center();
                min-width: 45px;
                height: 18px;
                font-size: 11px;
                color: @theme-color;
                line-height: 11px;
                font-weight: 500;
                margin-right: 6px;
                padding: 0 6px;
                border-radius: 2px;
            }
            .name {
                margin-right: 16px;
                flex: 1;
                font-size: 13px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #333333;
                line-height: 13px;
            }
            .date {
                font-size: 13px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #999999;
                line-height: 13px;
            }
        }
    }
}
</style>
