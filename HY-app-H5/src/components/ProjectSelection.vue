<template>
    <div>
        <div class="project" :class="whiteColor ? 'whiteColor' : ''" @click="openPicker">
            <span class="iconfont icondingwei"></span>
            <span class="project-name">{{ projectName }}</span>
            <img :src="$baseImgUrl + '/case/home/icon-arrow-down.png'" />
        </div>
        <van-popup v-model="showPicker" position="bottom">
            <van-picker
                show-toolbar
                title="请选择项目"
                value-key="orgName"
                :columns="projectArray"
                ref="projectPicker"
                @confirm="confirmPicker"
                @cancel="showPicker = false"
                v-model="projectId"
                key="projectIdIndexList"
            />
        </van-popup>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import API from '@/request/api/caseSystem/home'
export default {
    name: 'ProjectSelection',
    props: {
        data: {
            type: Array,
            default: [],
        },
        whiteColor: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            projectArray: [],
            showPicker: false,
            defaultIndex: 0,
        }
    },
    methods: {
        openPicker() {
            this.showPicker = true
            if (this.projectIdIndexList.length) {
                this.$nextTick(() => {
                    this.$refs.projectPicker.setIndexes(this.projectIdIndexList)
                })
            }
        },
        confirmPicker(valueList, indexList) {
            const obj = {
                projectId: this.projectArray[indexList[0]]?.children[indexList[1]]?.orgCode,
                projectName: valueList[1],
            }
            this.$store.dispatch('other/setProject', obj)
            this.$store.dispatch('other/setProjectListIndex', indexList)
            this.showPicker = false
        },
    },
    created() {
        let params = {
            roleCode: this.currentRole.roleCode,
        }

        API.projectList2Api(params).then((data) => {
            this.projectArray = data.map((item) => {
                return {
                    ...item,
                    children: item.projectOrgVoList,
                }
            })

            const formatProjectIds = {
                projectId: this.projectArray[0]?.children[0]?.orgCode,
                projectName: this.projectArray[0]?.children[0]?.orgName,
            }

            if (this.defaultIndex < 0 || !this.projectId) {
                this.$store.dispatch('other/setProject', formatProjectIds)
            }
        })
    },
    computed: { ...mapGetters(['projectName', 'projectId', 'projectIdIndexList', 'currentRole']) },
}
</script>
<style scoped lang="less">
.project {
    display: flex;
    align-items: center;
    line-height: 18px;
    padding: 13px 0;
    .icondingwei {
        font-size: 18px;
        margin-right: 6.5px;
        color: @theme-color;
    }
    .project-name {
        font-family: PingFangSC-Medium, PingFang SC;
        font-size: 18px;
        font-weight: 700;
    }
    &.whiteColor {
        color: #fff;
    }
    &.whiteColor .icondingwei {
        color: #fff;
    }
    img {
        width: 8.5px;
        margin-left: 6px;
    }
}
</style>
