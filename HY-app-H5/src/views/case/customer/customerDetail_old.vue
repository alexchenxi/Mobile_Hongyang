<template>
  <div class="common-page">
    <nav class="common-page-top">
      <top-bar
        :back="true"
        title="客户详情"
      >
        <div
          v-if="abandon"
          slot="append-suffix"
          v-code="['ST.CUSTOMER.BUTTON', 'ST.CUSTOMER.BUTTON.ABANDON']"
          class="give-up"
          @click="getGiveReason()"
        >
          <img
            class="drop-img"
            :src="$baseImgUrl + '/case/customer/abandon.png'"
          >
        </div>
      </top-bar>
    </nav>
    <main
      class="common-page-container"
      :style="{ height: isShowFooter || (scramble && currentRole.roleCode === 'ST_SALES') ? pageMiddleWithButtonHeight : pageContainerHeight }"
    >
      <div
        v-if="showTip"
        class="tip"
      >
        <span class="iconfont icontishi2" />
        完善客户资料，有助于更加了解客户信息！
        <span
          class="close"
          @click="hideTip()"
        >×</span>
      </div>
      <div class="info">
        <div class="info-left">
          <div class="line">
            <span class="name van-ellipsis">{{ baseInfo.customerName }}</span>
            <span class="channel-tag common-tag-0">{{ baseInfo.firstChannelName }}</span>
          </div>
          <div
            class="line tel"
            @click="handleCall"
          >
            <span class="iconfont icondianhua" />
            {{ baseInfo.customerPhone | hidePhone(canEdit, 'ST.CUSTOMER.BUTTON.SHOWTEL') }}
          </div>
          <div
            v-if="isVisit"
            class="line1 space-between"
          >
            <div>
              <span class="label">二级渠道：</span>
              {{ baseInfo.secondChannelName }}
            </div>
            <div>
              <span class="label">联名客户：</span>
              {{ baseInfo.jointNumber || 0 }}个
              <i
                v-if="baseInfo.status !== 40 || baseInfo.status !== 50"
                class="iconfont iconbianji icon-edit"
                @click="editJointCustomers"
              />
            </div>
          </div>
          <div
            v-if="baseInfo.lastFollowingTime && !isVisit"
            class="line1 space-between"
          >
            <div>
              <span class="label">最后跟进：</span>
              {{ baseInfo.lastFollowingTime }}
            </div>
            <div>
              <span class="label">跟进次数：</span>
              {{ baseInfo.totalFollowingCount }}次
            </div>
          </div>
          <div
            v-if="isVisit"
            class="line1 space-between"
          >
            <div>
              <span class="label">到访次数：</span>
              {{ baseInfo.totalVisitCount }}次
            </div>
            <div>
              <span class="label">跟进次数：</span>
              {{ baseInfo.totalFollowingCount }}次
            </div>
          </div>
        </div>
        <div
          v-if="menuId !== 'ST.CUSTOMER.PUBLIC' && baseInfo.buttonStatus && baseInfo.buttonStatus.canCollected"
          v-code="['ST.CUSTOMER.BUTTON', 'ST.CUSTOMER.BUTTON.FAV']"
          class="info-right"
        >
          <div
            class="right-icon"
            @click="handleCollection"
          >
            <img
              v-if="baseInfo.isCollected"
              :src="$baseImgUrl + '/case/customer/icon-collect-on.png'"
            >
            <span
              v-else
              class="iconfont iconshoucang"
            />
            <p
              v-if="baseInfo.isCollected"
              class="collect-text"
            >
              已收藏
            </p>
            <p
              v-else
              class="collect-text"
            >
              收藏
            </p>
          </div>
        </div>
      </div>
      <div class="info-buttom">
        <!-- <SettingTag class="button-section" v-code="['ST.CUSTOMER.BUTTON', 'ST.CUSTOMER.BUTTON.TAG']"
		 :type="1" :item="baseInfo" :data="baseInfo.customerDesc" /> -->
        <SettingTagUpdate
          v-code="['ST.CUSTOMER.BUTTON', 'ST.CUSTOMER.BUTTON.TAG']"
          :item="baseInfo"
          :data="depictTagName"
        />
        <div
          v-if="isVisit"
          class="complete"
        >
          <span class="label">资料完成：</span>
          <span class="per">{{ baseInfo.fullfilePercent }}%</span>
        </div>
      </div>
      <!-- 为客户设置描摹 -->
      <div
        v-if="isVisit"
        class="customer-level"
      >
        <div class="title-section">
          <div class="title">
            客户等级
          </div>
          <div class="tips">
            更改客户级别需更新下方信息
          </div>
        </div>
        <div class="level-section">
          <span
            v-for="item in levelArray"
            :key="item.value"
            class="level"
            :class="item.disabled ? 'disabled' : item.value === baseInfo.customerLevel ? 'active' : 'common-tag-blue'"
            @click="changeLevel(item)"
          >
            {{ item.label }}
          </span>
        </div>
      </div>
      <div class="split" />
      <van-tabs
        v-model="tabIndex"
        :class="[isVisit ? '' : 'no-tab']"
        @click="clickTab"
      >
        <van-tab
          v-if="isVisit"
          title="基本信息"
        >
          <van-loading
            v-if="showLoading"
            type="spinner"
          />
          <CustomerForm
            v-show="!showLoading && tabIndex === 0"
            ref="form1"
            tip="基本信息里的"
            :form-data="formData"
            @error="tabIndex = 0"
            @postData="postDataOne"
          />
        </van-tab>
        <van-tab
          v-if="isVisit"
          title="购房意向"
        >
          <van-loading
            v-if="showLoading1"
            type="spinner"
          />
          <CustomerForm
            v-show="!showLoading1 && tabIndex === 1"
            ref="form2"
            tip="购房意向里的"
            :form-data="formData1"
            @error="tabIndex = 1"
            @postData="postDataTwo"
          />
        </van-tab>
        <van-tab title="时间轴">
          <CustomerTimeline
            :start-case-record="startCaseRecord"
            :data="timeData"
            @switchChange="switchChange"
          />
        </van-tab>
        <van-tab
          v-if="baseInfo.status === 20 || baseInfo.status === 30 || baseInfo.status === 40 || baseInfo.status === 50"
          class="transform"
          title="交易单据"
        >
          <van-collapse v-model="activeNames">
            <van-collapse-item
              v-if="tradeList.noDealList.length"
              title="未成交"
              name="1"
            >
              <CaseCustomer :list="tradeList.noDealList" />
            </van-collapse-item>
            <van-collapse-item
              v-if="tradeList.dealList.length"
              title="已成交"
              name="2"
            >
              <CaseCustomer :list="tradeList.dealList" />
            </van-collapse-item>
            <van-empty
              v-if="!tradeList.noDealList.length && !tradeList.dealList.length"
              class="custom-image"
              :image="$baseImgUrl + '/no-data.png'"
              description="暂无数据~"
            />
          </van-collapse>
        </van-tab>
      </van-tabs>
    </main>
    <footer v-if="isShowFooter && showFixedFooter">
      <div
        class="fix-bottom common-fix-bottom"
        :style="{ paddingBottom: bottomSafe }"
      >
        <div
          v-if="canEdit"
          v-code="['ST.CUSTOMER.BUTTON', 'ST.CUSTOMER.BUTTON.FOLLOW']"
          class="btn"
          @click.stop="followCustomer()"
        >
          跟客
        </div>
        <div
          v-if="canEdit && isVisit"
          v-code="['ST.CUSTOMER.BUTTON', 'ST.CUSTOMER.BUTTON.EDIT']"
          class="btn save"
          @click="submitData"
        >
          保存
        </div>
      </div>
    </footer>
    <footer v-if="scramble && currentRole.roleCode === 'ST_SALES'">
      <div
        class="fix-bottom common-fix-bottom"
        :style="{ paddingBottom: bottomSafe }"
      >
        <div
          class="btn save"
          @click="grabCustomer"
        >
          我要抢客
        </div>
      </div>
    </footer>
    <van-overlay :show="showGivePop">
      <div class="give-pop">
        <div class="title">
          请填写弃客原因
        </div>
        <div class="content">
          <div class="pop-container">
            <div class="form-item">
              <div class="label">
                弃客原因：
              </div>
              <div class="form-content">
                <div
                  v-for="item in reasonOption"
                  :key="item.code"
                  :class="['check-button', reason === item.code ? 'checked' : '']"
                  @click="checkReason(item)"
                >
                  {{ item.info }}
                </div>
              </div>
            </div>
            <div
              v-if="reason === '23' || reason === '16'"
              class="form-item"
            >
              <div class="label">
                其他原因：
              </div>
              <van-field
                v-model="remark"
                rows="3"
                autosize
                type="textarea"
                maxlength="20"
                placeholder="请输入原因"
                show-word-limit
              />
            </div>
          </div>
          <div class="btn">
            <span @click="cancelGivePop">取消</span>
            <span
              class="confirm"
              @click="giveUpCust()"
            >确定</span>
          </div>
        </div>
      </div>
    </van-overlay>
    <van-popup
      v-model="showGrabCustomer"
      round
    >
      <div class="grab-customer">
        <div class="content">
          <img
            class="status-image"
            :src="$baseImgUrl + `/case/customer/${grabSuccess ? 'icon-success' : 'icon-fail'}.png`"
            alt=""
          >
          <div class="status-text">
            {{ grabSuccess ? '恭喜您，抢客成功！' : '对不起，抢客失败！' }}
          </div>
          <div class="message-box">
            {{ grabSuccess ? '请及时完善客户信息，' : '不要灰心，下次继续加油哦！' }}
            <span
              v-if="grabSuccess"
              class="btn-text"
              @click="showGrabCustomer = false"
            >马上跟客</span>
          </div>
        </div>
        <div class="button-area">
          <van-button
            v-if="grabSuccess"
            round
            block
            type="save"
            @click="continueGrabCustomer"
          >
            继续抢客
          </van-button>
          <van-button
            v-else
            round
            block
            type="save"
            @click="continueGrabCustomer"
          >
            我知道了
          </van-button>
        </div>
      </div>
    </van-popup>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import TopBar from '@c/TopBar'
import CustomerForm from '@/components/CustomerForm'
import CustomerTimeline from '@/components/CustomerTimeline'
import CommonApi from '@/request/api/commonApi'
import API from '@/request/api/caseSystem/customer'
import { commonData, getCustomerTimelineType } from '@/config/commonData'
import CaseCustomer from '@c/CaseCustomer'
import SettingTagUpdate from '@/components/SettingTagUpdate'
export default {
    name: 'Customer',
    components: {
        TopBar,
        CustomerForm,
        CustomerTimeline,
        SettingTagUpdate,
        CaseCustomer
    },
    data() {
        return {
            tabIndex: 0,
            reason: '',
            remark: '',
            reasonOption: [],
            showLoading1: false,
            showLoading: false,
            showTip: true,
            levelArray: [],
            showGivePop: false,
            reason: '',
            remark: null,
            baseInfo: {},
            formData: [],
            formData1: [],
            startCaseRecord: false,
            isStartCaseRecord: true,
            timeData: [],
            tradeList: {},
            addressData: [],
            giveUpReason: '弃客原因',
            // 是否到访 true 到访 false 未到访
            isVisit: false,
            canEdit: false,
            // 是否展示底部区域
            isShowFooter: true,
            // 抢客弹窗
            showGrabCustomer: false,
            grabSuccess: true,
            scramble: false,
            abandon: false,
            collect: false,
            // 是否展示手机号
            isShowPhone: false,
            tradeList: {
                dealList: [],
                noDealList: []
            },
            activeNames: ['1', '2'],
            depictId: '',
            depictTagListId: '',
            depictTagName: '',
            depictTagList: []
        }
    },
    async created() {
        this.getBaseData()
        this.depictGetTagOnCustomer()
        this.levelArray = this.$utils.mapToArray(commonData.customerLevel)
        if (localStorage.getItem('customerDetailTip') === 'false') {
            this.showTip = false
        }
        //收藏客户返回到原先的tab
        if (this.$route.query.activeTab) {
            sessionStorage.setItem('customerCollect', this.$route.query.activeTab)
        }
        if (this.currentRole.roleCode === 'ST_SALES') {
            this.startCaseRecord = true
        }
    },
    computed: {
        ...mapGetters(['projectId', 'currentRole', 'device', 'codes']),
        menuId() {
            return this.$route.query.menuId
        }
    },
    methods: {
        async getBaseData() {
            var param = {
                oppId: this.$route.query.oppId,
                clueId: this.$route.query.clueId || '',
                roleCode: this.currentRole.roleCode
            }
            this.baseInfo = await API.customerInfoApi(param)
            this.baseInfo.oppId = this.$route.query.oppId
            this.baseInfo.clueId = this.$route.query.clueId || ''
            this.buttonStatusConfig()
            if (this.isVisit) {
                this.getFormData()
                this.getCustomerPurpose()
            } else {
                this.getTimeLineData()
            }
            // 根据客户状态判断只能选择某些等级
            let canLevelArr = [this.baseInfo.customerLevel]
            if (this.baseInfo.status === 20) {
                canLevelArr = canLevelArr.concat(['A', 'B', 'C', 'D'])
            }
            if (this.baseInfo.status === 30) {
                canLevelArr = canLevelArr.concat(['A', 'B'])
            }
            if (this.baseInfo.status === 40 || this.baseInfo.status === 50) {
                canLevelArr = canLevelArr.concat(['A'])
            }
            for (let elem of this.levelArray) {
                elem.disabled = true
                if (canLevelArr.includes(elem.value)) {
                    elem.disabled = false
                }
            }
        },
        buttonStatusConfig() {
            this.scramble = this.baseInfo.buttonStatus.scramble
            this.isVisit = !this.baseInfo.buttonStatus.noVisited
            this.canEdit = this.baseInfo.buttonStatus.canEdit
            this.abandon = this.baseInfo.buttonStatus.abandon
            this.isShowFooter = this.canEdit && (this.codes.includes('ST.CUSTOMER.BUTTON.FOLLOW') || (this.codes.includes('ST.CUSTOMER.BUTTON.EDIT') && this.isVisit))
            // 是自己客户或有后台权限
            this.isShowPhone = this.canEdit || this.codes.includes('ST.CUSTOMER.BUTTON.SHOWTEL')
        },
        //收藏
        async handleCollection() {
            let params = {
                clientId: this.baseInfo.clientId,
                doFav: !this.baseInfo.isCollected
            }
            let result = await API.changeClientFav(params)
            if (result) {
                this.baseInfo.isCollected = !this.baseInfo.isCollected
                let message = this.baseInfo.isCollected ? '标记成功' : '取消标记'
                this.$toast(message)
            }
        },

        //tab点击
        clickTab() {
            if ((this.isVisit && this.tabIndex == 2) || (!this.isVisit && this.tabIndex == 0)) {
                this.getTimeLineData()
            } else if ((this.isVisit && this.tabIndex == 3) || (!this.isVisit && this.tabIndex == 1)) {
                this.getTradeFormList()
            }
        },
        // 获取已经绑定的标签
        depictGetTagOnCustomer() {
            var params = {
                clientId: this.$route.query.clientId
            }
            API.getTagOnCustomer(params).then(res => {
                let depictTagList = res
                this.depictTagList = depictTagList
                for (let index in depictTagList) {
                    let depictTagListId = depictTagList[index].tagId
                    let depictTagName = depictTagList[index].tagName
                    this.depictTagName = depictTagName
                    this.depictId = depictTagListId
                    this.$emit('change', this.depictTagName)
                }
            })
        },
        // 修改标签
        tagChange(val) {
            this.$emit('tagChange', true)
        },
        //获取时间轴
        getTimeLineData() {
            let params = {
                type: getCustomerTimelineType(this.$route.query.menuId),
                sourceList: this.isStartCaseRecord ? [] : [0, 1]
            }
            if (this.$route.query.oppId) {
                params.oppId = this.$route.query.oppId
            } else {
                params.clueId = this.$route.query.clueId
            }
            console.log(params)
            API.getTimelinesApi(params).then(data => {
                this.timeData = data
                this.$forceUpdate()
            })
        },
        //获取单据
        getTradeFormList() {
            var param = {
                oppId: this.$route.query.oppId
            }
            API.getTradeFormList(param).then(data => {
                data.dealList.map(item => {
                    item.codeType = 'ST.TRADEFORM.DEAL.' + item.tradeType
                })
                data.noDealList.map(item => {
                    item.codeType = 'ST.TRADEFORM.NODEAL.' + item.tradeType
                })
                this.tradeList = data
            })
        },
        //调取配置的接口获取数据源
        getDataSourece() {
            this.$utils.loading()
            return new Promise((resolve, reject) => {
                if (this.addressData.length > 0) {
                    resolve()
                }
                CommonApi.areaListApi({
                    parentId: ''
                }).then(data => {
                    this.$toast.clear()
                    this.addressData = data
                    resolve()
                })
            })
        },
        followCustomer(item) {
            this.$router
                .push({
                    path: '/case/customerFollow',
                    query: {
                        oppId: this.$route.query.oppId,
                        clueId: this.$route.query.clueId || ''
                    }
                })
                .catch(() => {})
        },
        //获取弃客原因下拉
        getGiveReason() {
            this.showGivePop = true
            if (this.reasonOption.length > 1) return
            API.abandonReason({
                clientId: this.baseInfo.clientId
            }).then(data => {
                data &&
                    data.map(item => {
                        item.text = item.label
                    })
                this.reasonOption = this.reasonOption.concat(data)
            })
        },
        changeReason(value) {
            this.giveUpReason = value
        },
        //弃客
        giveUpCust() {
            if (!this.reason) {
                this.$toast('请选择放弃原因')
                return
            }
            if ((this.reason === '23' || this.reason === '16') && !this.remark.trim()) {
                this.$toast('请填写放弃原因')
                return
            }
            let params = {
                clientIdList: [this.baseInfo.clientId],
                abandonReasonCode: this.reason,
                remark: this.remark,
                projectId: this.projectId
            }
            API.abandonApi(params).then(data => {
                this.$toast('操作成功')
                this.showGivePop = false
                setTimeout(() => {
                    this.$router.go(-1)
                }, 500)
            })
        },
        cancelGivePop() {
            this.showGivePop = false
            this.remark = ''
            this.reason = ''
            this.giveUpReason = '弃客原因'
        },
        //改变意向等级
        changeLevel(item) {
            if (item.disabled) {
                return
            }
            this.$utils.loading()
            this.baseInfo.customerLevel = item.value
            this.getFormData(1)
            this.getCustomerPurpose()
            this.$forceUpdate() //				API.updateLevelApi({
            //					oppId: this.$route.query.oppId,
            //					level: item.value
            //				}).then((data) => {
            //					this.$toast.clear()
            //
            //				}, () => {
            //					this.$toast.clear()
            //				})
        },
        //获取基本信息表单数据
        getFormData(type) {
            this.showLoading = true
            API.customerFormApi({
                oppId: this.$route.query.oppId,
                level: this.baseInfo.customerLevel
            }).then(async data => {
                this.$toast.clear()
                this.showLoading = false
                data.itemInfos.map(item => {
                    item.oldItemValues = this.$utils.deepCopy(item.itemValues)
                })
                let addressTypeList = data.itemInfos.filter(item => {
                    return item.type === 'ADDRESS'
                })
                if (addressTypeList.length > 0) {
                    await this.getDataSourece()
                    this.dealFormData(data.itemInfos, type, 'formData')
                } else {
                    this.dealFormData(data.itemInfos, type, 'formData')
                }
            })
        },
        //获取购房意向
        getCustomerPurpose(type) {
            this.showLoading1 = true
            API.customerPurposeApi({
                oppId: this.$route.query.oppId,
                level: this.baseInfo.customerLevel
            }).then(data => {
                this.$toast.clear()
                this.showLoading1 = false
                data.itemInfos.map(item => {
                    item.oldItemValues = this.$utils.deepCopy(item.itemValues)
                })
                this.dealFormData(data.itemInfos, type, 'formData1')
            })
        },
        //表单数据处理 主要是手机号和地址，还有初始化的空数据
        dealFormData(formData, type, str) {
            var telArray = []
            var formData1 = JSON.parse(JSON.stringify(formData))
            //地址是需要push数据的会改变原来数组序值，需要计算下
            var addressIndex = 0
            formData.map((item, index) => {
                index = index * 1 + addressIndex
                item.hidden = false
                if (item.key === 'tel') {
                    item.readonly = true
                }
                //调整手机号顺序保证从表单第一个依次展示
                if (item.key.indexOf('tel') > -1) {
                    item.hidden = item.itemValues[0].code ? false : true
                    item.type = 'TEL'
                    item.required = item.hidden ? false : true
                    item.name = item.name.replace(/\d+/g, '')
                    telArray.push(item)
                    if (!item.hidden) {
                        item.readonly = true
                    }
                }
                //如果是地址 手动拆分成下拉和多行文本
                if (item.type === 'ADDRESS') {
                    var object = JSON.parse(JSON.stringify(item))
                    object.name = '详细地址'
                    object.type = 'ADDRESS1'
                    if (item.itemValues.length === 0) {
                        formData1[index].itemValues[0] = {
                            name: [],
                            code: []
                        }
                        object.itemValues[0] = {
                            name: '',
                            code: ''
                        }
                    } else {
                        formData1[index].itemValues[0].name = object.itemValues[0].code.slice(0, 3)
                        formData1[index].itemValues[0].code = object.itemValues[0].code.slice(0, 3)
                        object.itemValues[0].name = object.itemValues[0].code[3]
                        object.itemValues[0].code = object.itemValues[0].code[3]
                    }
                    formData1[index].optionalValueSet = this.addressData
                    formData1.splice(index + 1, 0, object)
                    addressIndex += 1
                }
            })
            telArray = telArray.sort((item, item1) => {
                if (item.key < item1.key) return -1
            })
            if (!this.isShowPhone) {
                telArray.forEach(item => {
                    item.itemValues[0].code = item.itemValues[0]?.code ? this.$utils.hidePhone(item.itemValues[0].code) : ''
                })
            }
            //把原先的手机号过滤掉
            formData1 = formData1.filter(item => item.key.indexOf('tel') === -1)
            formData1 = telArray.concat(formData1)
            //对初始化数据值为空的做处理，不然会有问题
            formData1.map(item => {
                item.itemValues = item.itemValues || []
                if (item.type != 'MULTISELECT' && item.itemValues.length === 0) {
                    item.itemValues.push({
                        code: '',
                        name: ''
                    })
                }
                if (item.type === 'DATE') {
                    item.itemValues[0].code = item.itemValues[0].code.split(' ')[0]
                }
            })
            if (type === 1) {
                formData1.map(outerItem => {
                    this.formData.map((item, index) => {
                        if (outerItem.key === item.key) {
                            item.required = outerItem.required
                        }
                    })
                })
            } else {
                this[str] = formData1
            }
        },
        //判断手机号是否重复
        checkTelRepeat(formData) {
            let telList = formData.filter(item => {
                return item.name === '电话' && item.required
            })
            if (telList.length > 1) {
                let obj = {}
                for (let i in telList) {
                    if (obj[telList[i].itemValues[0].code]) return true
                    obj[telList[i].itemValues[0].code] = true
                }
            }
            return false
        },
        //触发提交事件
        submitData() {
            this.$refs['form1'].$refs.form.submit()
        },
        dealPostForm(formData) {
            var flag = true
            formData.map((item, index) => {
                if (item.type === 'TEL') {
                    item.type = 'TEXT'
                }
                if (item.type === 'ADDRESS') {
                    item.optionalValueSet = []
                    item.itemValues[0].code.push(formData[index + 1].itemValues[0].code)
                }
                if (item.type === 'NUMBER') {
                    item.itemValues[0].code = item.itemValues[0].code * 1
                }
                if(item.type==='DATE'&& item.itemValues[0].code){
                   item.itemValues[0].code=item.itemValues[0].code+' 00:00'
                }
            })
            formData = formData.filter(item => item.type !== 'ADDRESS1')
            return formData
        },
        //提交表单
        postDataOne() {
            if (!this.$refs['form2']) this.tabIndex = 1
            setTimeout(() => {
                this.$refs['form2'].$refs.form.submit()
            }, 100)
        },
        postDataTwo() {
            var formData = JSON.parse(JSON.stringify(this.formData))
            var formData1 = JSON.parse(JSON.stringify(this.formData1))
            let checkTel = this.checkTelRepeat(formData)
            let checkTel1 = this.checkTelRepeat(formData1)
            if (checkTel || checkTel1) {
                this.$toast('电话号码重复')
                flag = false
                return
            }
            // 处理传参的电话name值
            formData.forEach((item,index) => {
                if (item.key.includes('tel')) {
                    item.name = item.name + item.key.replace(/[^0-9]/ig,"")
                }
            })
            this.$utils.loading()
            API.updateDetailAndPurpose({
                customerId: this.baseInfo.customerId,
                level: this.baseInfo.customerLevel,
                oppId: this.$route.query.oppId,
                projectId: this.projectId,
                details: this.dealPostForm(formData),
                purposes: this.dealPostForm(formData1)
            }).then(
                data => {
                    this.$toast('保存成功')
                    this.getBaseData()
                },
                () => {
                    // this.$toast.clear()
                }
            )
        },
        //电话
        async handleCall() {
            let params = {
                id: this.baseInfo.clientId
            }
            await API.customerCall(params)
            let tel = this.baseInfo.customerPhone
            if (!this.isShowPhone) {
                tel = this.$utils.hidePhone(this.baseInfo.customerPhone)
            }
            this.$appMethods.SendPhone(this.device, tel)
        },
        //选择弃客原因
        checkReason(item) {
            this.reason = item.code
        },
        //抢客
        grabCustomer() {
            let params = {
                clientId: this.baseInfo.clientId
            }
            this.$utils.loading()
            API.scrambleClient(params).then(res => {
                this.$toast.clear()
                this.grabSuccess = res.result
                this.showGrabCustomer = true
                this.getBaseData()
            })
        },
        cancelGrabCustomer() {
            this.showGrabCustomer = false
        },
        // 修改联名客户
        editJointCustomers() {
            this.$router
                .push({
                    path: '/case/jointCustomers',
                    query: {
                        menuId: 'ST.CUSTOMER.PUBLIC',
                        customerId: this.baseInfo.customerId,
                        oppId: this.$route.query.oppId
                    }
                })
        },
        //继续抢客
        continueGrabCustomer() {
            this.$router.go(-1)
        },
        // 隐藏tip
        hideTip() {
            localStorage.setItem('customerDetailTip', false)
            this.showTip = false
        },
        goTradeDetail(val) {
            this.$router
                .push({
                    path: '/case/documentDetail',
                    query: {
                        oppId: this.baseInfo.oppId,
                        type: val.tradeType,
                        id: val.formId
                    }
                })
                .catch(() => {})
        },
        switchChange(val) {
            console.log('val', val)
            this.isStartCaseRecord = val
            this.getTimeLineData()
        }
    }
}
</script>
<style scoped lang="less">
.common-page {
    .common-page-top {
        background: #ffffff;
        .header {
            .give-up {
                position: absolute;
                right: 0;
                .drop-img {
                    width: 20px;
                    height: 20px;
                }
            }
        }
    }
    .common-page-container {
        .tip {
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            color: #fab55f;
            line-height: 14px;
            height: 36px;
            line-height: 36px;
            background: rgba(250, 181, 95, 0.1);
            margin-bottom: 18px;
            .iconfont {
                margin: 0px 4px 0 15px;
            }
            .close {
                font-size: 16px;
                margin-right: 15px;
                float: right;
                color: #fab55f;
                width: 50px;
                text-align: right;
            }
        }
        .info {
            position: relative;
            .common-flex-between();
            align-items: flex-start;
            padding: 0 15px;
            .info-left {
                flex-grow: 1;
                margin-right: 20px;
            }
            .info-right {
                flex-shrink: 0;
                width: 40px;
                margin-top: 9px;
                .right-icon {
                    .common-flex-center();
                    flex-direction: column;
                    img {
                        width: 24px;
                    }
                    .collect-text {
                        font-size: 13px;
                        color: #999999;
                        line-height: 13px;
                        font-weight: 400;
                        margin-top: 6px;
                    }
                    span {
                        font-size: 24px;
                    }
                }
            }
            .line {
                display: flex;
                align-items: center;
                margin-bottom: 15px;
                .name {
                    font-size: 18px;
                    line-height: 18px;
                    font-family: PingFangSC-Medium, PingFang SC;
                    font-weight: 600;
                    color: #333333;
                    margin-right: 8px;
                }
                .source {
                    max-width: 92px;
                    padding: 0 10px;
                    line-height: 19px;
                    font-size: 10px;
                    font-family: PingFangSC-Medium, PingFang SC;
                    font-weight: 600;
                    background: rgba(95, 149, 250, 0.1);
                    color: #5f95fa;
                    flex-shrink: 0;
                }
                &.tel {
                    font-size: 18px;
                    line-height: 18px;
                    font-family: DINAlternate-Bold, DINAlternate;
                    font-weight: bold;
                    .iconfont {
                        color: @theme-color;
                        font-size: 16px;
                        margin-right: 2px;
                    }
                }
                .channel-tag {
                    .common-flex-center();
                    min-width: 45px;
                    height: 18px;
                    font-size: 11px;
                    color: @theme-color;
                    line-height: 11px;
                    font-weight: 500;
                    margin-right: 6px;
                    padding: 0 6px;
                }
            }
            .line1 {
                display: flex;
                align-items: center;
                margin-bottom: 12px;
                font-size: 13px;
                line-height: 13px;
                color: #333;
                &.space-between {
                    justify-content: space-between;
                }
                .level {
                    padding: 2px 10px;
                    font-size: 10px;
                    font-family: PingFangSC-Medium, PingFang SC;
                    color: #999;
                    background: #f6f6f6;
                    margin-right: 6px;
                    &.active {
                        color: #47cfae;
                        font-weight: 600;
                        background: rgba(71, 207, 174, 0.09);
                    }
                }
                .label {
                    font-size: 13px;
                    line-height: 13px;
                    color: #999;
                }
                .icon-edit {
                    position: absolute;
                    right: 57px;
                    color: #DB0826;
                    font-size: 14px;
                }
                .progress {
                    display: inline-block;
                    position: relative;
                    width: 230px;
                    height: 2px;
                    background: #f5f5f5;
                    border-radius: 2px;
                    margin-right: 13px;
                    .active-line {
                        position: absolute;
                        left: 0;
                        top: -1px;
                        height: 4px;
                        background: linear-gradient(270deg, #4183ff 0%, #4fc0e8 100%);
                        border-radius: 2px;
                    }
                }
                .per {
                    font-size: 15px;
                    font-family: DINAlternate-Bold, DINAlternate;
                    font-weight: bold;
                    color: #999999;
                }
            }
        }
        .info-buttom {
            padding: 3px 15px 15px;
            .common-flex-between();
            .setting-tag {
                .setting-tag-button {
                    .common-flex-center();
                    font-size: 12px;
                    line-height: 12px;
                    color: @header-text-color;
                    border-radius: 15px;
                    padding: 9px 15px 9px 9px;
                    background: #eff9fd;
                    .icon-tag {
                        width: 12px;
                        height: 12px;
                        margin-right: 4px;
                    }
                    .iconiconrightarrow {
                        font-size: 8px;
                        margin-left: 5px;
                    }
                    .edit-icon {
                        width: 12px;
                        height: 12px;
                        font-size: 12px;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        border-radius: 50%;
                        background: @light-green;
                        color: #fff;
                        margin-right: 4px;
                    }
                }
            }
            .complete {
                .label {
                    font-size: 12px;
                    line-height: 12px;
                    color: #999999;
                    font-weight: 400;
                }
                .per {
                    font-size: 15px;
                    line-height: 15px;
                    color: @header-text-color;
                    font-weight: bold;
                }
            }
        }

        .customer-level {
            border-top: 10px solid #f0f4fa;
            padding: 15px;
            .title-section {
                .common-flex();
                padding: 3px 0 15px;
                .title {
                    font-size: 16px;
                    line-height: 16px;
                    color: @header-text-color;
                    font-weight: 500;
                }
                .tips {
                    font-size: 12px;
                    line-height: 12px;
                    color: #ff7282;
                    font-weight: 400;
                    margin-left: 10px;
                }
            }
            .level-section {
                .common-flex-between();
                .level {
                    .common-flex-center();
                    width: 80px;
                    height: 30px;
                    font-size: 13px;
                    margin-right: 9px;
                    border-radius: 2px;
                    &:last-child {
                        margin-right: 0;
                    }
                    &.disabled {
                        background: #f5f5f5;
                        color: #cccccc;
                    }
                    &.active {
                        color: #fff;
                        background: @theme-color;
                    }
                }
            }
        }
        .split {
            height: 10px;
            background: #f0f4fa;
        }
    }
    .van-tabs {
        // padding-bottom: 80px;
        .van-loading.van-loading--spinner {
            text-align: center;
            margin-top: 70px;
        }
    }
    .no-tab {
        /deep/ .van-tab {
            justify-content: flex-start;
            padding: 18px 15px 10px;
            height: auto;
            font-size: 16px;
            color: @header-text-color;
            font-weight: 500;
            line-height: 16px;
        }
        /deep/ .van-tabs__line {
            display: none;
        }
        /deep/ .van-tabs__wrap {
            display: none;
        }
    }
    .fix-bottom {
        position: fixed;
        bottom: 0;
        // width: 100%;
        // box-sizing: border-box;
        // padding: 8px 15px 20px;
        background: #ffffff;
        box-shadow: 0px -2px 4px 0px rgba(0, 0, 0, 0.04);
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0;
        margin: 15px;
        height: unset;
        border-radius: 22px;
        overflow: hidden;
        .btn {
            flex: 1;
            padding: 12px 0;
            background: #f1ae59;
            font-size: 16px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 600;
            color: #ffffff;
            text-align: center;
            &.save {
                background: @theme-color;
            }
        }
    }
    .give-pop {
        background: #fff;
        margin: 55% auto 0;
        width: 345px;
        border-radius: 8px;
        .pop-container {
            padding: 24px 18px 0 18px;
            .form-item {
                margin-bottom: 24px;
                &:first-child {
                    margin-bottom: 14px;
                }
            }
            .label {
                font-size: 14px;
                color: @header-text-color;
                font-weight: 400;
                margin-bottom: 15px;
            }
            .form-content {
                .common-flex();
                flex-wrap: wrap;
                .check-button {
                    .common-flex-center();
                    height: 30px;
                    font-size: 13px;
                    line-height: 13px;
                    color: #999999;
                    padding: 0 17px;
                    background: rgba(153, 153, 153, 0.09);
                    border-radius: 15px;
                    margin: 0 10px 10px 0;
                    &.checked {
                        background: rgba(219, 8, 38, 0.08);
                        color: @theme-color;
                        font-weight: 500;
                    }
                }
            }
            .van-cell {
                border: 1px solid #dddddd;
                border-radius: 4px;
            }
        }
        .title {
            padding: 21px 0;
            text-align: center;
            font-size: 18px;
            line-height: 18px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: @header-text-color;
            border-bottom: 1px solid #eeeeee;
        }
        .btn {
            width: 100%;
            color: @header-text-color;
            font-size: 16px;
            display: flex;
            align-items: center;
            border-top: 1px solid #eaeaea;
            & > span {
                height: 50px;
                width: 50%;
                line-height: 50px;
                text-align: center;
                border-radius: 0px 0px 0px 8px;
            }
            .confirm {
                background: @theme-color;
                border-radius: 0px 0px 8px 0px;
                color: #fff;
            }
        }
    }
    .grab-customer {
        width: 315px;
        border-radius: 8px;
        .content {
            width: 100%;
            text-align: center;
            padding: 50px 0;
            .status-image {
                width: 74px;
                height: 90px;
            }
            .status-text {
                font-size: 18px;
                line-height: 18px;
                color: @header-text-color;
                font-weight: 500;
                margin: 30px 0 20px 0;
            }
            .message-box {
                font-size: 14px;
                line-height: 14px;
                color: #999999;
                font-weight: 400;
                .btn-text {
                    color: @theme-color;
                    font-weight: 500;
                }
            }
        }
        .button-area {
            padding: 0 30px 30px;
        }
    }
}

/deep/ .van-popup {
    border-radius: 8px;
}

.no-deal {
    border-bottom: 1px solid #eee;
}

/deep/.no-deal .customer-item .top-container .section-header .section-header-left .tag-list .tag-item {
    background: rgba(255, 114, 130, 0.1);
    color: #ff7282;
}

/deep/ .van-popup {
    border-radius: 8px;
}
/deep/ .van-collapse-item__content {
    padding: 0;
}
</style>
