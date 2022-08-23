<template>
  <div>
    <van-form
      ref="form"
      validate-trigger="onSubmit"
      input-align="right"
      :show-error-message="false"
      @submit="onSubmit"
      @failed="onFailed"
    >
      <div
        v-for="(item, index) in formData"
        :key="item.id"
        class="form-item"
      >
        <!-- 文本输入框 -->
        <van-field
          v-if="item.type === 'TEXT'"
          v-model="item.itemValues[0].code"
          :readonly="readonly"
          :required="item.required"
          maxlength="20"
          :name="item.key"
          :label="item.name"
          :placeholder="'请输入' + item.name"
          :rules="item.required ? [{ required: true, message: '请输入' + tip + item.name }] : []"
        />
        <!-- 允许输入数字，调起带符号的纯数字键盘 -->
        <van-field
          v-if="item.type === 'NUMBER'"
          v-model="item.itemValues[0].code"
          :readonly="readonly"
          :required="item.required"
          :rules="item.required ? [{ required: true, message: '请输入' + tip + item.name }] : []"
          maxlength="20"
          type="number"
          :placeholder="'请输入' + item.name"
          :name="item.key"
          :label="item.name"
        />
        <!--日期 -->
        <van-field
          v-if="item.type === 'DATE'"
          :required="item.required"
          :rules="item.required ? [{ required: true, message: '请选择' + tip + item.name }] : []"
          is-link
          readonly
          :name="item.key"
          :label="item.name"
          :value="item.itemValues[0] && item.itemValues[0].code"
          placeholder="请选择年月日"
          @click="showTimePop(index)"
        />
        <!-- 单选框 -->
        <van-field
          v-if="item.type === 'RADIO'"
          :required="item.required"
          :rules="item.required ? [{ required: true, message: '请选择' + tip + item.name }] : []"
          name="radio"
          :label="item.name"
          @click="selectIndex = index"
        >
          <template #input>
            <van-radio-group
              v-model="item.itemValues[0].code"
              :disabled="readonly"
              direction="horizontal"
              :name="item.key"
              @change="changeRadio"
            >
              <van-radio
                v-for="(subItem, subIndex) in item.optionalValueSet"
                :key="subIndex"
                :name="subItem.code"
              >
                {{ subItem.name }}
              </van-radio>
            </van-radio-group>
          </template>
        </van-field>
        <!-- 下拉框 -->
        <van-field
          v-if="item.type === 'SELECT' || item.type === 'ADDRESS'"
          :required="item.required"
          :rules="item.required ? [{ required: true, message: '请选择' + tip + item.name }] : []"
          is-link
          readonly
          clickable
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
          :readonly="readonly"
          class="textarea-style"
          :required="item.required"
          rows="2"
          autosize
          :label="item.name"
          type="textarea"
          maxlength="50"
          :placeholder="'请输入' + item.name"
          show-word-limit
          :rules="item.required ? [{ required: true, message: '请输入' + tip + item.name }] : []"
        />
        <!-- 多选下拉框 -->
        <van-field
          v-if="item.type === 'MULTISELECT'"
          :required="item.required"
          :rules="item.required ? [{ required: true, message: '请选择' + tip + item.name }] : []"
          is-link
          readonly
          clickable
          :value="getValue(item, 'name')"
          :label="item.name"
          :placeholder="'请选择' + item.name"
          @click="showCheckPop(index)"
        />
        <!-- 手机号特殊处理 -->
        <van-field
          v-if="item.type === 'TEL' && !item.hidden"
          v-model="item.itemValues[0].code"
          :readonly="readonly || item.readonly"
          :required="item.required"
          :rules="
            item.required
              ? [
                { required: true, message: '请输入' + tip + item.name + (index + 1) },
                { validator, message: item.name + (index + 1) + '格式错误',key: index }
              ]
              : []
          "
          type="tel"
          :placeholder="'请输入' + item.name + (index + 1)"
          :name="item.name"
          :label="item.name + (index + 1)"
          maxlength="11"
        >
          <template #right-icon>
            <span
              v-if="!readonly && index === 0 && (formData[1].hidden || formData[2].hidden) && !item.itemValues[0].code.includes('*')"
              class="iconfont iconjia"
              @click="changeTel(0, index)"
            />
            <span
              v-if="!(readonly || item.readonly) && index !== 0"
              class="iconfont iconjian"
              @click.stop="changeTel(1, index)"
            />
          </template>
        </van-field>
      </div>
    </van-form>
    <van-popup
      v-if="formData[selectIndex]"
      v-model="showDate"
      position="bottom"
    >
      <van-datetime-picker
        v-model="selectTime"
        :formatter="formatter"
        type="date"
        :min-date="minDate"
        title="请选择年月日"
        @confirm="confirmTime"
        @cancel="showDate = false"
      />
    </van-popup>
    <van-popup
      v-if="formData[selectIndex]"
      v-model="showPicker"
      position="bottom"
    >
      <van-picker
        :ref="'picker' + selectIndex"
        show-toolbar
        :title="'请选择' + (formData[selectIndex] && formData && formData[selectIndex].name)"
        :value-key="formData[selectIndex].type === 'ADDRESS' ? 'name' : 'code'"
        :columns="formData[selectIndex].optionalValueSet"
        @confirm="confirmPicker"
        @cancel="showPicker = false"
        @change="changeColumns"
      >
        <template #option="item">
          {{ item.name }}
        </template>
      </van-picker>
    </van-popup>
    <van-popup
      v-if="formData[selectIndex]"
      v-model="showCheckbox"
      position="bottom"
    >
      <div class="van-picker__toolbar">
        <button
          type="button"
          class="van-picker__cancel"
          @click="showCheckbox = false"
        >
          取消
        </button>
        <div class="van-ellipsis van-picker__title">
          请选择{{ formData[selectIndex] && formData[selectIndex].name }}
        </div>
        <button
          type="button"
          class="van-picker__confirm"
          @click="confirmCheckBox"
        >
          确认
        </button>
      </div>
      <van-checkbox-group
        v-if="formData[selectIndex]"
        v-model="checkboxData"
      >
        <van-cell-group>
          <van-cell
            v-for="(subItem, subIndex) in formData[selectIndex].optionalValueSet"
            :key="subIndex"
            clickable
            :title="subItem.name"
            @click="toggle(subIndex)"
          >
            <template #right-icon>
              <van-checkbox
                ref="checkboxes"
                :name="subItem.code"
              />
            </template>
          </van-cell>
        </van-cell-group>
      </van-checkbox-group>
    </van-popup>
  </div>
</template>
<script>
import { commonMethods } from 'movit-utils'
export default {
    name: 'CustomerForm',
    props: {
        formData: {
            type: Array,
            default: () => []
        },
        tip: {
            type: String,
            default: ''
        },
        readonly: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            minDate:new Date(1960, 0, 1),
            selectIndex: 0,
            showDate: false,
            selectTime: '',
            showPicker: false,
            showCheckbox: false,
            checkboxData: []
        }
    },
    computed: {},
    created() {},
    methods: {
        //改变手机号
        changeTel(type, index) {
            if (type === 1) {
                if (this.formData[index].key === 'tel2' && !this.formData[index + 1].hidden) {
                    let object = JSON.parse(JSON.stringify(this.formData[index + 1]))
                    object.key = 'tel2'
                    this.formData[index] = object
                    this.formData[index + 1].itemValues[0].code = ''
                    this.formData[index + 1].hidden = true
                    this.formData[index + 1].required = false
                } else {
                    this.formData[index].itemValues[0].code = ''
                    this.formData[index].hidden = true
                    this.formData[index].required = false
                }
            } else {
                //添加手机号判断是增加第二个还是第三个
                if (this.formData[index + 1].hidden) {
                    this.formData[index + 1].hidden = false
                    this.formData[index + 1].required = true
                } else {
                    this.formData[index + 2].hidden = false
                    this.formData[index + 2].required = true
                }
            }
            this.$forceUpdate()
        },
        validator(val,item) {
            if (item.key > 0) {
                return /1\d{10}/.test(val)
            }else {
                return val.length === 11
            }
        },
        //增加多选点击区域
        toggle(index) {
            this.$refs.checkboxes[index].toggle()
        },
        onFailed(errorInfo) {
            this.$toast(errorInfo.errors[0].message)
        },
        changeColumns(picker, values,index){
            if(index===0){
                this.formData[this.selectIndex].optionalValueSet.map((item)=>{
                    if(item.code===values[0]){
                        picker.setColumnValues(1, item.children||[{code:''}]);

                    }
                })
            }
       },
        showPickerPop(activeIndex) {
            if (this.readonly) {
                return
            }
            this.showPicker = true
            this.selectIndex = activeIndex
            var data = this.formData[this.selectIndex].itemValues[0]
            this.$nextTick(() => {
                if (data) {
                    //根据是不是数组来判断是不是多级联动
                    if (data.code.constructor === Array) {
                        this.formData[this.selectIndex].itemValues &&
                            this.formData[this.selectIndex].itemValues[0].code.map((item, index) => {
                                this.$refs['picker' + activeIndex].setColumnValue(index, item)
                            })
                    } else {
                        this.$refs['picker' + activeIndex].setColumnValue(0, data.code)
                    }
                }
            })
        },
        //时间选择器 时间格式特使处理
        showTimePop(index) {
            if (this.readonly) {
                return
            }
            var data = JSON.parse(JSON.stringify(this.formData))
            if (data[index].itemValues[0].code) {
                this.selectTime = commonMethods.DateToStamp(data[index].itemValues[0].code)
            }
            this.selectIndex = index
            this.showDate = true
        },
        //多选获取选中值
        showCheckPop(index) {
            if (this.readonly) {
                return
            }
            this.selectIndex = index
            this.checkboxData = this.getValue(this.formData[index], 'code')
            this.showCheckbox = true
            this.$forceUpdate()
        },
        confirmTime(time) {
            this.formData[this.selectIndex].itemValues[0].code = commonMethods.DateToString(time)
            this.showDate = false
            this.$forceUpdate()
        },
        //picker改变赋值
        confirmPicker(value) {
            //根据value是否是数组判断是是1级联动还是多级联动
            var selectData = this.formData[this.selectIndex]
            if (value.constructor === Array) {
                selectData.itemValues[0].name = []
                selectData.itemValues[0].code = value
            } else {
                selectData.itemValues[0].code = value.code.split('  ')
                selectData.itemValues[0].code = value.code.split('  ')
            }
            this.showPicker = false
        },
        //单选改变赋值
        changeRadio(value) {
            //设置selectIndex之后才能获取到当前数据源加了延迟
            setTimeout(() => {
                var selectData = this.formData[this.selectIndex]
                selectData.optionalValueSet.map(item => {
                    if (item.code === value) {
                        selectData.itemValues[0].code = item.code
                        selectData.itemValues[0].name = item.code
                    }
                })
                this.$forceUpdate()
            }, 0)
        },
        //多选的值处理
        getValue(item, type) {
            var checkboxData = []
            item.itemValues &&
                item.itemValues.map(subItem => {
                    checkboxData.push(subItem['code'])
                })
            if (type === 'code') {
                return checkboxData
            } else {
                let nameList = []
                checkboxData.map(value => {
                    item.optionalValueSet.map(option => {
                        if (value === option.code) {
                            nameList.push(option.name)
                        }
                    })
                })
                return nameList.join(',')
            }
        },
        confirmCheckBox() {
            var selectData = this.formData[this.selectIndex]
            var checkArray = []
            this.checkboxData.map(item => {
                var data = selectData.optionalValueSet.filter(subItem => subItem.code === item)
                checkArray = checkArray.concat(data)
            })
            selectData.itemValues = checkArray
            this.$forceUpdate()
            this.showCheckbox = false
        },
        formatter(type, val) {
            if (type === 'year') {
                return val + '年'
            }
            if (type === 'month') {
                return val + '月'
            }
            if (type === 'day') {
                return val + '日'
            }
            return val
        },
        //提交表单
        onSubmit(result) {
            if (result.errors) {
                this.$toast('请将表单信息填写完整')
                this.$emit('error')
            } else {
                this.$emit('postData')
            }
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
        }
    }
}
</script>
<style scoped lang="less">
.split {
    margin-left: 15px;
    height: 0.6px;
    background: #eeeeee;
}

.van-checkbox-group {
    max-height: 244px;
    overflow-y: auto;
    padding-bottom: 20px;
}

.van-form {
    padding: 9px 0;
    .iconjia {
        color: @theme-color;
    }
    .iconjian {
        color: #ff7282;
    }
    .form-item {
        padding-left: 15px;
    }
    .van-cell {
        border-bottom: 1px solid #f4f4f4;
        padding-left: 0;
    }
    .van-cell--required::before {
        left: -7px;
    }
}
.textarea-style {
    display: block;
    /deep/ .van-field__control--right {
        text-align: left;
        margin-top: 5px;
    }
}
</style>
