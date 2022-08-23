<template>
    <div>
        <div class="project" :class="whiteColor ? 'whiteColor' : ''" @click="showPicker = true">
            <span class="iconfont icondingwei"></span>
            <span class="project-name">{{ projectName }}</span>
            <img :src="$baseImgUrl +  '/case/home/icon-arrow-down.png'" />
        </div>
        <van-popup v-model="showPicker" round position="bottom">
            <van-cascader v-model="currentId" title="请选择项目" :options="projectArray" :field-names="fieldNames" active-color="#0F58F1" @close="showPicker = false" @finish="onFinish" />
        </van-popup>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import API from '@/request/api/manageSystem/home'
export default {
    name: 'ProjectSelection',
    props: {
        whiteColor: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            projectArray: [],
            showPicker: false,
            fieldNames: {
                text: 'name',
                value: 'id',
                children: 'childList'
            },
            currentId: ''
        }
    },
    computed: { ...mapGetters(['projectName', 'projectId', 'projectLevel', 'projectIdList']) },
    created() {
        this.getProjectList()
    },
    methods: {
        onFinish({ value, selectedOptions, tabIndex }) {
            let obj = {
                projectLevel: selectedOptions[selectedOptions.length - 1].level,
                projectIdList: selectedOptions[selectedOptions.length - 1].idList,
                projectName: selectedOptions[selectedOptions.length - 1].type === 'all' ? selectedOptions[selectedOptions.length - 1].name.split('-')[0] : selectedOptions[selectedOptions.length - 1].name,
                projectId: selectedOptions[selectedOptions.length - 1].id
            }
            this.$store.dispatch('other/setProjectList', obj)
            this.showPicker = false
        },
        async getProjectList() {
            const result = await API.managerProjectList()
            if (result.length === 0) {
                this.$store.dispatch('other/setProjectList', {})
                return
            }
            this.projectArray = result
            this.formatListData()
            if (!this.projectIdList || this.projectIdList.length === 0) {
                let obj = {
                    projectLevel: 1,
                    projectIdList: result[0].idList,
                    projectName: result[0].name,
                    projectId: result[0].id
                }
                this.$store.dispatch('other/setProjectList', obj)
                this.currentId = result[0].id
            } else {
                this.currentId = this.projectId
            }
        },
        formatListData() {
            this.projectArray.map(company => {
                let list = []
                company.type = 'member'
                company.type = 1
                company.childList.map(area => {
                    area.type = 'member'
                    area.level = 2
                    list = list.concat(area.childList)
                    let _list = []
                    area.childList.map(prj => {
                        prj.type = 'member'
                        prj.level = 3
                        _list = _list.concat(prj)
                        prj.idList = [prj.id]
                    })
                    area.idList = _list.map(j => j.id)
                    area.childList.unshift({
                        id: area.id + 'all',
                        name: area.name + '-全部项目',
                        idList: area.idList,
                        type: 'all',
                        level: 2
                    })
                })
                company.idList = list.map(k => k.id)
                company.childList.unshift({
                    id: company.id + 'all',
                    name: company.name + '-全部区域',
                    idList: company.idList,
                    type: 'all',
                    level: 1
                })
            })
        },
        closePop() {
            this.showPicker = false
        }
    }
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
