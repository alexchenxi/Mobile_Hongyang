<template>
    <div class="common-page">
        <TopBar :title="type === 'add' ? '添加联名客户' : '修改联名客户'" />
        <main class="common-page-container" :style="{ height: pageContainerHeight }">
            <section class="customer-container">
                <van-form ref="form" validate-trigger="onSubmit" input-align="right" :show-error-message="false"
                          @submit="onSubmit" @failed="onFailed">
                    <div v-for="(item, index) in baseInfoData" :key="item.id" class="form-item">
                        <!-- 文本输入框 -->
                        <van-field
                            v-if="item.type === 'TEXT'"
                            v-model.trim="item.itemValues[0].code"
                            :required="item.required"
                            maxlength="18"
                            :name="item.key"
                            :label="item.name"
                            :placeholder="'请输入' + item.name"
                            :rules="item.required ? [{ required: true, message: '请输入' + item.name }] : []"
                        />
                        <!-- 允许输入数字，调起带符号的纯数字键盘 -->
                        <van-field
                            v-if="item.type === 'NUMBER'"
                            v-model="item.itemValues[0].code"
                            :required="item.required"
                            :rules="item.required ? [{ required: true, message: '请输入' + item.name }] : []"
                            maxlength="11"
                            type="number"
                            :readonly="item.readonly || false"
                            :placeholder="'请输入' + item.name"
                            :name="item.key"
                            :label="item.name"
                        />
                        <!-- 单选框 -->
                        <van-field
                            v-if="item.type === 'RADIO'"
                            :required="item.required"
                            :rules="item.required ? [{ required: true, message: '请选择' + item.name }] : []"
                            name="radio"
                            :label="item.name"
                            @click="selectIndex = index"
                        >
                            <template #input>
                                <van-radio-group v-model="item.itemValues[0].code" direction="horizontal"
                                                 :name="item.key" @change="changeRadio">
                                    <van-radio v-for="(subItem, subIndex) in item.optionalValueSet" :key="subIndex"
                                               :name="subItem.code">
                                        {{ subItem.name }}
                                    </van-radio>
                                </van-radio-group>
                            </template>
                        </van-field>
                        <!-- 下拉框 -->
                        <van-field
                            v-if="item.type === 'SELECT' || item.type === 'ADDRESS'"
                            :required="item.required"
                            :rules="item.required ? [{ required: true, message: '请选择' + item.name }] : []"
                            is-link
                            clickable
                            readonly
                            label-width="6.4em"
                            name="picker"
                            :value="getSelectValues(item)"
                            :label="item.name"
                            :placeholder="'请选择' + item.name"
                            @click="showPickerPop(index)"
                        />
                        <!-- 多行文本输入框 -->
                        <van-field
                            v-if="item.type === 'MULTITEXT' || item.type === 'ADDRESS1'"
                            v-model="item.itemValues[0].code"
                            class="textarea-style"
                            :required="item.required"
                            rows="2"
                            autosize
                            :label="item.name"
                            type="textarea"
                            maxlength="50"
                            :placeholder="'请输入' + item.name"
                            show-word-limit
                            :rules="item.required ? [{ required: true, message: '请输入' + item.name }] : []"
                        />
                    </div>
                </van-form>
            </section>
        </main>
        <div class="common-fix-bottom" :style="{ paddingBottom: bottomSafe }">
            <van-button round block type="save" native-type="submit" @click="saveInfo">保存</van-button>
        </div>
        <van-popup v-if="baseInfoData[selectIndex]" v-model="showPicker" position="bottom">
            <van-picker
                :ref="'picker' + selectIndex"
                show-toolbar
                :title="'请选择' + (baseInfoData[selectIndex] && baseInfoData && baseInfoData[selectIndex].name)"
                :value-key="baseInfoData[selectIndex].type === 'ADDRESS' ? 'name' : 'code'"
                :columns="baseInfoData[selectIndex].optionalValueSet"
                @confirm="confirmPicker"
                @cancel="showPicker = false"
            >
                <template #option="item">
                    {{ item.name }}
                </template>
            </van-picker>
        </van-popup>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import TopBar from '@c/TopBar'
import CommonApi from '@/request/api/commonApi'
import API from '@/request/api/caseSystem/customer'
export default {
    name: 'jointCustomers',
    components: {
        TopBar
    },
    computed: { ...mapGetters(['projectId', 'currentRole', 'keepAliveList']) },
    mounted() {
        this.type = this.$route.query.type
        this.customerId = this.$route.query.customerId
        this.oppId = this.$route.query.oppId

        if (this.type === 'edit') {
            this.item = JSON.parse(this.$route.query.formatItem)

            this.baseInfoData.forEach(item => {
                if (this.item[item.key]) {
                    if (item.key === 'address') {
                        item.itemValues[0].code =  this.item[item.key].split(',')
                    }else if (item.type === 'SELECT') {
                        item.itemValues[0].code = [this.item[item.key]]
                    }else if (item.key === 'tel' && this.type === 'edit') {
                        item.itemValues[0].code = this.item[item.key]
                        item.readonly = 'readonly'
                    }else {
                        item.itemValues[0].code = this.item[item.key]
                    }
                }
            })
        }

        // 如果缓存里面有获取省市区的数据就不用再调接口
        if (localStorage.getItem('addressData')) {
            this.baseInfoData[6].optionalValueSet = JSON.parse(localStorage.getItem('addressData'))
            return
        }
        this.getDataSourece()
    },
    data() {
        return {
            selectIndex: 0,
            type: 'add',
            customerId: '',
            oppId: '',
            showPicker: false,
            addressData: [],
            item: {},
            baseInfoData: [
                {
                    isDefault: true,
                    itemId: null,
                    itemValues: [{ code: '', name: null }],
                    key: 'name',
                    name: '姓名',
                    oldItemValues: null,
                    optionalValueSet: [],
                    required: true,
                    type: 'TEXT'
                },
                {
                    isDefault: true,
                    itemId: null,
                    itemValues: [{ code: '男', name: null }],
                    key: 'gender',
                    name: '性别',
                    oldItemValues: null,
                    optionalValueSet: [
                        { id: '男', itemId: null, code: '男', name: '男' },
                        { id: '女', itemId: null, code: '女', name: '女' }
                    ],
                    required: true,
                    type: 'RADIO'
                },
                {
                    hidden: false,
                    isDefault: true,
                    itemId: null,
                    itemValues: [{ code: '', name: null }],
                    key: 'tel',
                    name: '电话',
                    oldItemValues: null,
                    optionalValueSet: [],
                    required: true,
                    type: 'NUMBER'
                },
                {
                    isDefault: false,
                    itemId: null,
                    itemValues: [{ code: '', name: '' }],
                    key: 'relationType',
                    name: '与主客户关系',
                    oldItemValues: null,
                    optionalValueSet: [
                        {
                            code: '0',
                            name: '夫妻'

                        },
                        {
                            code: '1',
                            name: '子女'
                        }
                    ],
                    required: false,
                    type: 'SELECT'
                },
                {
                    isDefault: false,
                    itemId: null,
                    itemValues: [{ code: '', name: '' }],
                    key: 'idType',
                    name: '证件类型',
                    oldItemValues: null,
                    optionalValueSet: [
                        {
                            code: '0',
                            name: '身份证'
                        },
                        {
                            code: '1',
                            name: '营业执照'
                        },
                        {
                            code: '2',
                            name: '港澳台通行证'
                        }
                    ],
                    required: false,
                    type: 'SELECT'
                },
                {
                    isDefault: true,
                    itemId: null,
                    itemValues: [{ code: '', name: null }],
                    key: 'idNo',
                    name: '证件号码',
                    oldItemValues: null,
                    optionalValueSet: [],
                    required: false,
                    type: 'TEXT'
                },
                {
                    isDefault: false,
                    itemId: '',
                    itemValues: [{ code: '', name: '' }],
                    key: 'address',
                    name: '家庭住址',
                    oldItemValues: null,
                    optionalValueSet: [{ code: '', name: '' }],
                    required: false,
                    type: 'ADDRESS'
                },
                {
                    isDefault: false,
                    itemId: '',
                    itemValues: [{ code: '', name: '' }],
                    key: 'addressDetail',
                    name: '详细住址',
                    optionalValueSet: [{ code: '', name: '' }],
                    required: false,
                    type: 'ADDRESS1'
                }
            ]
        }
    },
    methods: {
        saveInfo() {
            this.$refs['form'].submit()
        },
        //调取配置的接口获取数据源
        getDataSourece() {
            this.$utils.loading()
            return new Promise(resolve => {
                if (this.addressData.length > 0) {
                    resolve()
                }
                CommonApi.areaListApi({
                    parentId: ''
                }).then(data => {
                    this.$toast.clear()
                    localStorage.setItem('addressData', JSON.stringify(data))
                    this.addressData = data
                    this.baseInfoData[6].optionalValueSet = data
                    resolve()
                })
            })
        },
        //单选改变赋值
        changeRadio(value) {
            //设置selectIndex之后才能获取到当前数据源加了延迟
            setTimeout(() => {
                var selectData = this.baseInfoData[this.selectIndex]
                selectData.optionalValueSet.map(item => {
                    if (item.code === value) {
                        selectData.itemValues[0].code = item.code
                        selectData.itemValues[0].name = item.code
                    }
                })
                this.$forceUpdate()
            }, 0)
        },
        // 下拉框值显示
        getSelectValues(data) {
            let value = []
            if (data.itemValues && data.itemValues[0] && data.itemValues[0].code && data.itemValues[0].code.length > 0) {
                if (data.type === 'ADDRESS') {
                    data.itemValues[0].code.map(item => {
                        value.push(item)
                    })
                } else if (data.itemValues[0].code.length > 1) {
                    let options = this.$utils.deepCopy(data.optionalValueSet)
                    let list = this.formatOptions(options, [])
                    data.itemValues[0].code.map(item => {
                        list.map(option => {
                            if (item === option.code) {
                                value.push(option.name)
                            }
                        })
                    })
                } else {
                    data.itemValues[0].code.map(item => {
                        data.optionalValueSet.map(option => {
                            if (item === option.code) {
                                value.push(option.name)
                            }
                        })
                    })
                }
            }
            return value.join(',')
        },
        formatOptions(data, list) {
            data.map(item => {
                list.push(item)
                if (item.children && item.children.length > 0) {
                    this.formatOptions(item.children, list)
                }
            })
            return list
        },
        showPickerPop(activeIndex) {
            this.showPicker = true
            this.selectIndex = activeIndex
            var data = this.baseInfoData[this.selectIndex].itemValues[0]
            this.$nextTick(() => {
                if (data) {
                    //根据是不是数组来判断是不是多级联动
                    if (data.code.constructor === Array) {
                        this.baseInfoData[this.selectIndex].itemValues &&
                        this.baseInfoData[this.selectIndex].itemValues[0].code.map((item, index) => {
                            this.$refs['picker' + activeIndex].setColumnValue(index, item)
                        })
                    } else {
                        this.$refs['picker' + activeIndex].setColumnValue(0, data.code)
                    }
                }
            })
        },
        //picker改变赋值
        confirmPicker(value) {
            //根据value是否是数组判断是是1级联动还是多级联动
            var selectData = this.baseInfoData[this.selectIndex]
            if (value.constructor === Array) {
                selectData.itemValues[0].name = []
                selectData.itemValues[0].code = value
            } else {
                selectData.itemValues[0].code = value.code.split('  ')
                selectData.itemValues[0].code = value.code.split('  ')
            }
            this.showPicker = false
        },
        onSubmit(result) {
            let obj = {}
            this.baseInfoData.forEach(item => {
                let code = item.itemValues[0].code
                obj[item.key] = Array.isArray(code) ? code.join() : code
            })
            if(!obj.name) {
                this.$toast('姓名不能为空')
                return
            }
            if(obj.tel && obj.tel.length !== 11) {
                this.$toast('请输入11位手机号码')
                return
            }
            if(obj?.idType === '0' && !obj?.idNo) {
                this.$toast('请输入证件号码')
                return
            }
            if (obj?.idType === '0' && obj?.idNo.length !== 18) {
                this.$toast('请输入正确的证件号码')
                return
            }

            const sort = localStorage.getItem('addJointCustomer')
            const reqParmas = {
                ...obj,
                customerId: this.customerId,
                oppId: this.oppId,
                projectId: this.projectId,
                sort: sort ? sort + 1 : 1
            }

            if (this.type === 'edit') {
                reqParmas.id = this.item?.id
            }

            if (result.errors) {
                this.$toast('请将表单信息填写完整')
            } else {
                API.addJointCustomer(reqParmas).then(res => {
                    // 保存上一次的序号
                    localStorage.setItem('addJointCustomer', reqParmas.sort)
                    this.$toast(`${this.type === 'edit' ? '更新' : '新增'}联名客户成功`)
                    this.$router.go(-1)
                })
            }
        },
        onFailed(errorInfo) {
            this.$toast(errorInfo.errors[0].message)
        }
    },
    watch: {}
}
</script>
<style scoped lang="less">
/deep/ .head-container {
    .head-c {
        position: absolute;
        width: 100%;
        z-index: 1;
    }

    .head-l,
    .head-r {
        position: relative;
        z-index: 2;
    }
}

/deep/ .common-fix-bottom {
    padding: 0 18px;
}
</style>
