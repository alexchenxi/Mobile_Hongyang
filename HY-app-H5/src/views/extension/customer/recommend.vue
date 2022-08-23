<template>
  <div class="common-page">
    <top-bar
      :back="true"
      title="报备"
    />
    <main
      class="common-page-middle common-form-style"
      :style="{ height: pageMiddleHeight }"
    >
      <van-form
        ref="form"
        class="form"
        validate-trigger="onSubmit"
        @submit="onSubmit"
        @failed="onFailed"
      >
        <van-field
          v-model="projectName"
          input-align="right"
          readonly
          required
          label="意向楼盘"
          placeholder="请输入意向楼盘"
        />
        <van-field
          input-align="right"
          name="radio"
          label="报备类型"
          :disabled="formDisabled"
        >
          <template #input>
            <van-radio-group
              v-model="radio"
              direction="horizontal"
              :disabled="formDisabled"
              @change="changeTaskType"
            >
              <van-radio name="1">
                普通报备
              </van-radio>
              <van-radio name="2">
                任务报备
              </van-radio>
            </van-radio-group>
          </template>
        </van-field>
        <van-field
          v-if="radio == 2"
          input-align="right"
          required
          is-link
          readonly
          clickable
          name="picker"
          :value="taskName"
          label="任务名称"
          placeholder="请选择任务"
          @click="taskPicker = true"
        />
        <van-field
          :disabled="formDisabled"
          input-align="right"
          required
          is-link
          readonly
          clickable
          name="picker"
          :value="form.channel2Name"
          label="拓客方式"
          placeholder="请选择拓客方式"
          @click="clickTokerPicker()"
        />
        <div class="main-title">
          <div class="left">
            报备客户
            <span
              v-if="!formDisabled"
              class="tip"
            >同时最多报备5名客户</span>
          </div>
          <div
            v-if="!formDisabled && form.customerList.length <= 4"
            class="right"
            @click="addCustomerList"
          >
            <span>＋</span>
            添加客户
          </div>
        </div>
        <div
          v-for="(item, index) in form.customerList"
          :key="index"
          class="customer-list"
        >
          <div class="main-title">
            客户{{ index + 1 }}
            <div
              v-if="form.customerList && form.customerList.length > 1"
              class="delete"
              @click="deleteCust(index)"
            >
              <span />
            </div>
          </div>
          <van-field
            v-model="item.customerName"
            :disabled="formDisabled"
            input-align="right"
            required
            label="姓名"
            maxlength="20"
            :rules="[
              { required: true, message: '' },
              { pattern: /^[\u0391-\uFFE5A-Za-z]+$/, message: '支持输入汉字、字母' }
            ]"
            placeholder="请输入姓名"
          />
          <van-field
            v-model="item.customerTel"
            :disabled="formDisabled"
            input-align="right"
            type="tel"
            maxlength="11"
            required
            label="手机号码"
            placeholder="请输入手机号码"
            :rules="[
              { required: true, message: '' },
              { pattern: /^1[3456789]\d{9}$/, message: '手机号码格式错误' }
            ]"
          />
          <van-field
            v-model="item.customerRemark"
            class="textarea-style"
            input-align="left"
            label="备注"
            maxlength="50"
            show-word-limit
            rows="2"
            autosize
            type="textarea"
            placeholder="请输入备注信息"
          />
        </div>
      </van-form>
    </main>
    <van-popup
      v-model="tokerPicker"
      position="bottom"
    >
      <van-picker
        show-toolbar
        title="请选择拓客方式"
        value-key="channelName"
        :columns="channelTypeList"
        @confirm="confirmPicker"
        @cancel="tokerPicker = false"
      />
    </van-popup>
    <van-popup
      v-model="taskPicker"
      position="bottom"
    >
      <van-picker
        show-toolbar
        title="请选择任务"
        value-key="name"
        :columns="taskList"
        @confirm="confirmTaskPicker"
        @cancel="taskPicker = false"
      />
    </van-popup>
     <div class="fixed-wrap">
         <div
             class="common-fix-bottom"
             :style="{ paddingBottom: bottomSafe }"
         >
             <van-button
                 round
                 block
                 type="save"
                 @click="submitData"
             >
                 立即报备
             </van-button>
         </div>
     </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import TopBar from '@c/TopBar'
import commonApi from '@/request/api/commonApi'
import API from '@/request/api/selfExtension/customer'
import BeeAPI from '@/request/api/selfExtension/keyAndBee'
export default {
    name: 'ExtensionRecommend',
    components: {
        TopBar
    },
    data() {
        return {
            tokerPicker: false,
            form: {
                customerList: [
                    {
                        customerTel: '',
                        customerName: '',
                        customerRemark: ''
                    }
                ],
                x: '',
                y: ''
            },
            taskPicker: false,
            channelTypeList: [],
            showTask: true,
            radio: '2',
            taskList: [],
            taskName: '',
            flag: false,
            // 表单禁用
            formDisabled: false
        }
    },
    computed: { ...mapGetters(['projectName', 'user', 'projectId', 'device']) },
    created() {
        // 报备必须授权定位
        this.getLocation()
        this.getChannelType()
        // 从已获电客户跳转过来
        if (this.$route.query.fromType === 'took') {
            this.formDisabled = true
            const { name, tel, type, typeName } = this.$route.query.data
            this.form.customerList[0].customerName = name
            this.form.customerList[0].customerTel = tel
            this.form.channel2Name = typeName
            this.form.channel2 = type === 1 ? 'C0320' : 'C0321'
        }
        if (this.radio === '2' && this.taskList.length === 0) {
            this.getTaskList()
        }
    },
    methods: {
        //   获取定位，报备截客
        getLocation() {
            return new Promise((resolve, reject) => {
                this.$appMethods.startLocation(this.device).then(
                    res => {
                        if (res.lon) {
                            this.form.x = res.lon
                            this.form.y = res.lat
                            resolve()
                        } else {
                            reject()
                        }
                    },
                    () => {
                        reject()
                    }
                )
            })
        },
        confirmPicker(e) {
            this.form.channel2Name = e.channelName
            this.form.channel2 = e.channelCode
            this.tokerPicker = false
        },
        changeTaskType() {
            this.form.channel2Name = ''
            this.form.channel2 = ''
            this.form.taskId = ''
            this.taskName = ''
            if (this.radio === '2' && this.taskList.length === 0) {
                this.getTaskList()
            }
            this.$forceUpdate()
        },
        clickTokerPicker() {
            if (this.formDisabled) {
                return
            }
            this.radio == 1
            this.tokerPicker = true
        },
        confirmTaskPicker(e) {
            if (!e) {
                return
            }
            this.form.channel2Name = e.channelTypeName
            this.form.channel2 = e.channelType
            this.form.taskId = e.id
            this.taskName = e.name
            this.taskPicker = false
        },
        //删除客户
        deleteCust(index) {
            this.$dialog
                .confirm({
                    title: '删除客户',
                    message: '是否确认删除该客户'
                })
                .then(() => {
                    this.form.customerList.splice(index, 1)
                })
                .catch(() => {
                    // on cancel
                })
        },
        //增加
        addCustomerList() {
            this.form.customerList.push({
                customerTel: '',
                customerName: ''
            })
        },
        //获取拓客方式
        getChannelType() {
            commonApi.channelTypeListApi().then(res => {
                this.channelTypeList = res
                const channelType=this.$route.query.channelType
                if (this.$route.query.channelType) {
                  let array=res.filter((item)=>item.channelCode===channelType)
                  if(array.length>0){
                    this.form.channel2Name =array[0].channelName
                    this.form.channel2 = array[0].channelCode
                    this.getTaskList()
                  }
                }
            })
        },
        //获取任务列表
        getTaskList() {
            commonApi
                .myTaskApi({
                    projectId: this.projectId,
                    longitude: this.form.x,
                    latitude: this.form.y
                })
                .then(res => {
                    res = res.filter(item => item.isAllowed)
                    if (res.length === 0) {
                        this.radio = '1'
                        this.$toast('当前无任务可以选择')
                    } else {
                        this.taskList = res || []
                        const taskName=this.$route.query.taskName
                        if (taskName) {
                          let array=res.filter((item)=>item.name===taskName)
                          if(array.length>0){
                             this.form.taskId = array[0].id
                              this.taskName = taskName
                          }

                            //  this.taskName =this.$route.query.taskName
                        }
                    }
                })
        },
        onFailed(err) {
            console.log(err)
        },
        submitData() {
            if (this.radio === '2' && !this.form.taskId) {
                this.$toast('请选择任务')
                return
            }
            if (!this.form.channel2) {
                this.$toast('请选择拓客方式')
                return
            }
            this.getLocation().then(
                () => {
                    this.$refs.form.submit()
                },
                () => {
                    this.$toast('未开启定位无法报备')
                }
            )
            setTimeout(() => {
                if (!this.form.x || !this.form.y) {
                    this.$toast('请打开定位')
                }
            }, 50)
        },
        onSubmit() {
            const tels = this.form.customerList.map(value => value.customerTel)
            const telsSet = new Set(tels)
            if (!this.form.x || !this.form.y) {
                this.$toast('请打开定位')
                return
            }
            if (telsSet.size != tels.length) {
                this.$toast('存在重复手机号,请重新输入')
                return
            }
            this.form.projectId = this.projectId
            if (this.radio === '1') this.form.taskId = ''
            if (this.flag) {
                return
            }
            this.$utils.loading()
            this.flag = true
            // 关键人和小蜜蜂报备用不同的接口
            if (this.user.roleCode === 'ZT_KEYMAN' || this.user.roleCode === 'ZT_BEEMAN') {
                this.form.latitude = this.form.y
                this.form.longitude = this.form.x
                BeeAPI.customerRecApi(this.form)
                    .then(() => {
                        this.recommendSuccess()
                    })
                    .catch(() => {
                        this.flag = false
                    })
            } else {
                // 潜客id
                if (this.$route.query.id) {
                    this.form.latentCustomerId = this.$route.query.id
                }
                API.customerRecApi(this.form)
                    .then(() => {
                        this.recommendSuccess()
                    })
                    .catch(() => {
                        this.flag = false
                    })
            }
        },
        recommendSuccess() {
            this.flag = false
            this.$toast('报备成功')
            this.form = {
                customerList: [
                    {
                        customerTel: '',
                        customerName: ''
                    }
                ]
            }
            this.radio = '1'
            this.taskName = ''
            setTimeout(() => {
                this.$router.go(-1)
            }, 500)
        }
    }
}
</script>
<style scoped lang="less">
.main-title {
    padding: 16px 15px 16px 15px;
    padding-bottom: 0;
    font-size: 15px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 600;
    color: #333;
    display: flex;
    justify-content: space-between;
    .left {
        font-size: 16px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 600;
        color: #333333;
        .tip {
            font-size: 12px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #ff7282;
            line-height: 12px;
        }
    }
}

.main-title .delete {
    width: 18px;
    height: 18px;
    text-align: center;
    line-height: 18px;
    background: #eb6877;
    border-radius: 50%;
    color: #fff;
    font-size: 19px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.main-title .delete span {
    width: 8px;
    height: 1px;
    background: #fff;
    border-radius: 1px;
}

.main-title .right {
    display: flex;
    align-items: center;
    font-size: 13px;
    color: #db0826;
    & > span {
        font-size: 22px;
        line-height: 1;
    }
}

.customer-list {
    margin: 10px 15px;
    background: #f8f8f8;
    border-radius: 4px;
    .main-title {
        border-bottom: 1px solid #eee;
        padding: 16px 15px;
    }
    .van-cell--required::before {
        left: 8px;
    }
    .van-cell {
        padding: 16px 15px;
        background: #f8f8f8;
    }
    /deep/ .van-field__error-message {
        text-align: right;
    }
}
.fixed-wrap {
    width: 100%;
    overflow: hidden;
    position: relative;
    .common-fix-bottom {
        z-index: 999;
        transform: translateZ(1px);
    }
}
.form {
    margin-bottom: 100px;
}
</style>
