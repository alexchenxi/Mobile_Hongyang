<template>
    <div class="team-filter">
        <van-tree-select :items="staffSalesList" :active-id.sync="activeId" :main-active-index.sync="activeIndex" @click-item="handleSelectStaffSales" @click-nav="handleSelectStaffGroup" />
    </div>
</template>

<script>
export default {
    props: {
        value: Object,
        list: Array,
        showAll: {
            type: Boolean,
            default: true,
        },
        leftAllName: {
            type: String,
            default: '全部团队'
        },
        rightAllName: {
            type: String,
            default: '全部'
        }
    },
    name: 'TeamFilter',
    data() {
        return {
            staffSalesList: [],
            activeId: [],
            activeIndex: 0,
            selectedList: [],
            name: ''
        }
    },
    watch: {
        list: {
            handler(newVal, oldVal) {
                this.formatData(newVal)
            },
            deep: true,
        },
        value(newVal, oldVal) {
            if(Object.keys(newVal).length === 0) {
                this.activeId = []
                this.activeIndex = 0
            }
        }
    },
    mounted() {},
    methods: {
        formatData(data) {
            let list = this.$utils.deepCopy(data)
            this.staffSalesList = list.map((item) => {
                item.text = item.groupName
                item.children = item.members.map((member) => {
                    member.text = member.userName
                    member.id = item.groupId + member.userId
                    member.groupName = item.groupName
                    return member
                })
                return item
            })
            if (this.showAll) {
                let allGroupId = '0'
                let childrenList = this.staffSalesList
                    .map((item) => {
                        return item.children
                    })
                    .flat()
                let _childrenList = this.$utils.deepCopy(childrenList)
                _childrenList.map((item) => {
                    item.id = allGroupId + item.userId
                    item.groupId = allGroupId
                    item.groupName = this.leftAllName
                })
                //添加全部团队
                this.staffSalesList.unshift({
                    text: this.leftAllName,
                    children: _childrenList,
                    groupName: this.leftAllName,
                    groupId: allGroupId,
                })
                //团队添加全部选项
                this.staffSalesList.map((item) => {
                    item.children.unshift({
                        text: this.rightAllName,
                        id: item.groupId,
                        groupId: item.groupId,
                        groupName: item.groupName,
                        userName: this.rightAllName
                    })
                })
            }
        },
        handleSelectStaffSales(data) {
            if (data.id === data.groupId) {
                this.staffSalesList[this.activeIndex].children.map((item) => {
                    if (item.id !== item.groupId) {
                        this.activeId = this.removeAttrFromArray(item.id, this.activeId)
                    }
                })
            } else {
                this.staffSalesList[this.activeIndex].children.map((item) => {
                    if (item.id === item.groupId) {
                        this.activeId = this.removeAttrFromArray(item.id, this.activeId)
                    }
                })
            }
            //判断是否点击全部团队里的全部
            if (data.groupId !== '0') {
                this.activeId = this.removeAttrFromArray('0', this.activeId)
            }
            let childrenList = this.staffSalesList
                .map((item) => {
                    return item.children
                })
                .flat()
            let _activeId = this.$utils.deepCopy(this.activeId)
            let _staffSalesList = this.$utils.deepCopy(this.staffSalesList)
            let checkList = _activeId.map((item) => {
                let child = childrenList.find((child => {
                    return child.id === item
                }))
                return child
            })
            let _selectedList = checkList.map(item => {
                let arr = []
                if(item.id === item.groupId) {
                    let _arr = _staffSalesList.find(group => {
                        return group.groupId === item.id
                    }).children
                    arr = _arr.splice(1, _arr.length).map(member => {
                        return member.userId
                    })
                } else {
                    arr = item.userId
                }
                return arr
            }).flat()
            let _name = checkList.map(item => {
                let arr = []
                arr = item.groupName + '·' + item.userName
                return arr
            })
            this.name = _name.length > 0 ? _name.join(',') : this.leftAllName + '·' + this.rightAllName
            this.selectedList = [...new Set(_selectedList)]
            let checkData = {
                list: this.selectedList,
                name: this.name
            }
            this.$emit('change', checkData)
            this.$emit('input', checkData)
        },
        handleSelectStaffGroup(index) {},
        removeAttrFromArray(attr, arr) {
            let index = arr.indexOf(attr)
            if (index > -1) {
                arr.splice(index, 1)
            }
            return arr
        }
    },
}
</script>

<style scoped lang="less">
</style>
