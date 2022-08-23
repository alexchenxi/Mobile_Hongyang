<template>
    <div class="check-button">
        <div v-if="needCheckAll" :class="['check-item', checkAll ? 'active' : '', fixedWidth ? 'fixedWidth' : '']" @click="handleChange(0)">全部</div>
        <div :class="['check-item', item.checked ? 'active' : '', fixedWidth ? 'fixedWidth' : '']" v-for="item in dataList" :key="item.value" @click="handleChange(item.value, item)">
            {{ item.label }}
        </div>
    </div>
</template>

<script>
export default {
    name: 'CheckButton',
    props: {
        value: {
            type: Array | String | Number
        },
        list: {
            type: Array
        },
        fixedWidth: {
            type: Boolean,
            default: true
        },
        checkType: {
            type: String,
            default: 'checkbox'
        },
        needCheckAll: {
            type: Boolean,
            default: true
        },
        // 默认值
        defaultValue: {
            type: Array | Number | String
        }
    },
    watch: {
        list: {
            handler(newVal, oldVal) {
                if (newVal) {
                    this.dataList = this.$utils.deepCopy(newVal).map(item => {
                        return {
                            label: item.label,
                            value: item.value,
                            checked: item.checked
                        }
                    })
                }
            },
            deep: true,
            immediate: true
        },
        value(val) {
            if (!val || val.length === 0) {
                Object.assign(this.$data, this.$options.data())
                this.dataList = this.$utils.deepCopy(this.list).map(item => {
                    return {
                        label: item.label,
                        value: item.value,
                        checked: false
                    }
                })
            }
        }
    },
    created() {},
    mounted() {
        this.setDefaultValue()
        if (this.checkAll) {
            this.$emit('input', [])
        }
    },
    data() {
        return {
            dataList: [],
            checkList: [],
            checkAll: true
        }
    },
    methods: {
        setDefaultValue() {
            this.$nextTick(() => {
                if (this.defaultValue && this.checkType === 'checkbox' && this.defaultValue.length > 0) {
                    this.defaultValue.map(item => {
                        this.dataList.find(k => k.value === item).checked = true
                    })
                } else if (this.defaultValue && this.checkType === 'radio') {
                    this.dataList.find(k => k.value === this.defaultValue).checked = true
                }
                this.checkList = this.dataList.filter(v => {
                    return v.checked
                })
                let list = this.checkList.map(v => {
                    return v.value
                })
                if (this.checkType === 'checkbox') {
                    this.$emit('input', list)
                } else {
                    this.$emit('input', list[0])
                }
            })
        },
        handleChange(id, item) {
            if (item) {
                this.checkAll = false
                if (this.checkType === 'radio') {
                    this.dataList.map(v => {
                        v.checked = false
                    })
                    item.checked = true
                } else {
                    item.checked = !item.checked
                }

                if(item.label === '所有状态' && item.checked) {
                    this.dataList.forEach(v => {
                       if (v.label !== '所有状态') {
                           v.checked = false
                       }
                    })
                }else {
                    this.dataList.forEach(v => {
                        if (v.label === '所有状态') {
                            v.checked = false
                        }
                    })
                }

                this.checkList = this.dataList.filter(v => {
                    return v.checked
                })
            } else {
                this.checkAll = true
                this.dataList.map(item => {
                    item.checked = false
                })
                this.checkList = []
            }
            let list = this.checkList.map(v => {
                return v.value
            })
            if (this.checkType === 'checkbox') {
                this.$emit('input', list)
                this.$emit('change', this.checkList)
            } else {
                this.$emit('input', list[0])
                this.$emit('change', this.checkList[0])
            }
        },
        resetData() {
            this.checkList = []
            this.dataList.map(item => {
                item.checked = false
            })
            if ((this.checkType === 'checkbox' && this.defaultValue && this.defaultValue.length > 0) || (this.checkType === 'radio' && this.defaultValue)) {
                this.setDefaultValue()
            } else {
                this.$emit('input', this.checkType === 'checkbox' ? [] : null)
            }
        },
        clearData() {
            this.checkList = []
            this.dataList.map(item => {
                item.checked = false
            })
            this.$emit('input', this.checkType === 'checkbox' ? [] : null)
        }
    }
}
</script>

<style scoped lang="less">
.check-button {
    .common-flex();
    flex-wrap: wrap;
    .check-item {
        .common-flex-center();
        width: auto;
        padding: 0 15px;
        height: 36px;
        background: #f9fafa;
        margin: 0 8px 10px 0;
        border-radius: 18px;
        font-size: 12px;
        color: #333333;
        cursor: pointer;
        &.active {
            background: rgba(219, 8, 38, 0.1);
            color: @theme-color;
        }
        &.fixedWidth {
            min-width: 78px;
            padding: 0 4px;
        }
    }
}
</style>
