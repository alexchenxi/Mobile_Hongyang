<template>
    <div class="timeline">
        <div class="case-record" v-if="startCaseRecord">
            <van-switch class="switch" v-model="caseRecord" size="20" active-color="#F1B44F" @change="switchChange" />
            开启{{ isSelfChannelRole ? '案场' : '渠道' }}跟进记录
        </div>
        <div v-for="(item, index) in data" :key="index" class="timeline-section">
            <!--<div class="section-title">-->
            <!--{{ item.year }}-->
            <!--</div>-->
            <template v-for="(child, childIndex) in item.contentList">
                    <!--   需要展开收起添加 v-show="child.show"             -->
<!--                <div v-show="child.show" :key="childIndex" class="timeline-item">-->
                <div :key="childIndex" class="timeline-item">
                    <div class="timeline-item-line"></div>
                    <div v-if="child.source === 0 " class="timeline-item-dot"></div>
                    <div v-else-if="child.source === 2" class="timeline-item-dot timeline-item-dot-orange"></div>
                    <div v-else class="timeline-item-dot"></div>
                    <div class="timeline-item-time">
                        <span class="date">{{ child.date.split('.').join('-') }}</span>
                        <span class="time">{{ child.time }}</span>
                    </div>
                    <div class="timeline-item-wrapper">
                        <div class="timeline-item-title">
                            <span :style="{ color: child.color }" class="title-fw">{{ child.title }}</span>
                            <span v-if="child.label" class="title-tag">{{ child.label }}</span>
                            <span v-if="child.source>-1&&child.source<3" class="title-tag" style="color:#f1ae59">{{child.source===2?'自渠跟进':'案场跟进' }}</span>
                        </div>
                        <div class="timeline-item-content">
                            <div v-for="(content, contentIndex) in child.content" :key="contentIndex"
                                 class="timeline-content-item">
                                <span class="item-label">{{ content.label }}：</span>
                                <template v-if="content.mediaType === 'attachment'">
                                    <template v-for="(obj, attachmentIndex) in JSON.parse(content.content)">
                                        <div :key="attachmentIndex" class="attachment-list">
                                            <template v-if="obj.type === 'image'">
                                                <img class="item-image" :src="obj.file" />
                                            </template>
                                            <template v-if="obj.type !== 'image'">
                                                <span class="item-content">
                                                    {{ obj.name }}
                                                </span>
                                            </template>
                                        </div>
                                    </template>
                                </template>
                                <span v-if="content.mediaType !== 'attachment'"
                                      class="item-content item-content1" v-html="content.content.replace(/\n|\\n/g, '</br>')"></span>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
        </div>
            <!--  需要展开收起请打开注释即可      -->
<!--        <span v-if="showExpand" class="collapse" @click="toggle">-->
<!--            {{ isExpand ? '收起' : '展开详细信息' }}-->
<!--            <van-icon class="icon-arrow" :name="isExpand ? 'arrow-up' : 'arrow-down'" />-->
<!--        </span>-->
    </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
    props: {
        data: {
            type: Array,
            default: () => []
        },
        startCaseRecord: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        ...mapGetters(['currentRole']),
        isSelfChannelRole() {
            const selfChannelRoleList = ['ZT_DIRECTOR', 'ZT_MANAGER', 'ZT_MEMBER']
            return selfChannelRoleList.includes(this.currentRole.roleCode) ? true : false
        }
    },
    data() {
        return {
            isExpand: false,
            showExpand: true,
            caseRecord: false
        }
    },
    watch: {
        isExpand() {
            this.formatTimelineData()
        },
        data: {
            handler(newVal) {
                this.formatTimelineData()
                if (newVal.length === 0) {
                    this.showExpand = false
                }
            },
            deep: true
        }
    },
    methods: {
        toggle() {
            this.isExpand = !this.isExpand
        },
        formatTimelineData() {
            this.data.map((child) => {
                child.contentList.map((item) => {
                    if (this.isExpand) {
                        item.show = true
                    } else {
                        item.show = item.category ? false : true
                    }
                })
            })
        },
        switchChange(val) {
            this.isExpand = false
            this.$emit('switchChange', val)
        }
    }
}
</script>

<style lang="less" scoped>
.timeline {
    padding: 18px 15px;

    .case-record {
        display: flex;
        align-items: center;
        font-size: 12px;
        padding-bottom: 21px;

        .switch {
            margin-right: 8px;
        }
    }

    .timeline-section {
        margin-bottom: 7px;

        .section-title {
            font-size: 19px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #333333;
            line-height: 19px;
            margin-bottom: 17px;
            width: 63px;
            text-align: right;
        }
    }

    .timeline-item {
        position: relative;
        padding-bottom: 16px;
        min-height: 50px;

        .timeline-item-line {
            position: absolute;
            left: 83px;
            height: 100%;
            border-left: 3px solid #eeeff0;
        }

        &:last-child {
            .timeline-item-line {
                min-height: 26px;
            }
        }

        .timeline-item-dot {
            position: absolute;
            left: 80px;
            width: 9px;
            height: 9px;
            border-radius: 50%;
            background: @theme-color;
        }
        .timeline-item-dot-orange {
            background: #F19026;
        }
        .timeline-item-dot-blue {
            background: @blue-color;
        }

        .timeline-item-time {
            position: absolute;
            left: 0;
            top: -4px;
            display: inline-flex;
            flex-direction: column;
            align-items: flex-end;
            width: 73px;

            .date {
                font-weight: 500;
                color: @header-text-color;
                margin-bottom: 5px;
                white-space: nowrap;
            }

            .time {
                font-weight: 400;
                color: @info-color;
            }
        }

        .timeline-item-wrapper {
            position: relative;
            padding-left: 104px;
            top: -4px;

            .timeline-item-title {
                display: inline-flex;
                align-items: center;
                font-size: 16px;
                font-weight: 500;
                color: @header-text-color;
                line-height: 16px;
                margin-bottom: 16px;
                .title-fw {
                    font-weight: bold;
                }
                .title-tag {
                    font-size: 11px;
                    line-height: 11px;
                    color: @theme-color;
                    font-weight: 400;
                    padding: 4px 6px;
                    background: rgba(219, 8, 38, 0.1);
                    margin-left: 6px;
                }
            }

            .timeline-item-content {
                .timeline-content-item {
                    .common-flex();
                    align-items: flex-start;
                    margin-bottom: 10px;
                    font-size: 14px;
                    line-height: 16px;
                    flex-wrap: wrap;

                    .item-label {
                        flex-shrink: 0;
                        font-weight: 400;
                        color: @info-color;
                    }

                    .item-content {
                        font-weight: 400;
                        color: @header-text-color;
                    }

                    .item-image {
                        width: 80px;
                    }

                    .attachment-list {
                        .common-flex();
                        flex-wrap: wrap;
                    }
                }
            }
        }
    }

    .collapse {
        color: @theme-color;
        display: flex;
        align-items: center;
        justify-content: center;

        .icon-arrow {
            margin-left: 3px;
        }
    }
}
</style>
