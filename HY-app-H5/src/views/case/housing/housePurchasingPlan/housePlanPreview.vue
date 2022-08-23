<template>
  <div class="common-page">
    <top-bar
      class="tab-bar"
      :class="isShowWhiteBar ? 'bar-bg' : ''"
      :needWhite="!isShowWhiteBar"
      :back="true"
      title="置业计划书详情"
    ></top-bar>
    <div
      class="common-page-middle"
      :style="{height: planBookInfo.allowShare ? pageContentWithButtonHeight : pageWithoutTabHeight}"
      @scroll="scroll($event)"
    >
      <div ref="imageBox" class="content">
        <div class="page-title">置业计划书详情</div>
        <section class="top-info">
          <p class="label opacity5">标准总价(元)</p>
          <p class="total-price">{{baseInfo.totalPrice}}</p>
          <p class="label opacity5">标准单价(元/㎡)</p>
          <p class="unit-price">{{baseInfo.unitPrice}}</p>
          <div class="project-info">
            <div class="item">
              <p>{{projectName}}</p>
              <p class="opacity5">项目名称</p>
            </div>
            <div class="item house">
              <p>{{baseInfo.houseInfo}}</p>
              <p class="opacity5">房源</p>
            </div>
            <div class="item">
              <p>{{baseInfo.area}}㎡</p>
              <p class="opacity5">建筑面积</p>
            </div>
          </div>
        </section>
        <!-- 付款方式 -->
        <section class="box-wrap" v-for="item in baseInfo.paymentList" :key="item.name">
          <div class="title">
            <span class="title-bar"></span>
            <span class="name">{{item.name}}</span>
          </div>
          <div class="box">
            <van-cell
              :title="x.text"
              :value="x.value"
              v-for="x in item.discountInfo"
              :key="x.text+x.value"
              :class="x.color"
            />
            <div class="split-bar">
              <div class="bar"></div>
              <div class="bar"></div>
            </div>
          </div>
          <div class="box">
            <template v-for="x in item.paymentDetail">
              <van-cell :title="x.text" :value="x.value" :key="x.text+x.value" v-if="x.show" />
            </template>
            <div class="split-bar">
              <div class="bar"></div>
              <div class="bar"></div>
            </div>
          </div>
          <div class="box">
            <table class="table" cellspacing="10">
              <thead>
                <tr>
                  <th class="align-left">费用名称</th>
                  <th class="align-right">付款金额(元)</th>
                  <th class="align-left">截止时间</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(y,idx) in item.paymentInfo" :key="y.name">
                  <td class="align-left">{{y.name}}</td>
                  <td class="align-right">{{item.repayments[idx]}}</td>
                  <td class="align-left">{{y.date}}</td>
                </tr>
              </tbody>
            </table>
            <p class="tip" v-if="item.currentPayment === 1 && item.loanTypeId === 1">每月还款金额递减{{item.decreaseInterest}}元</p>
          </div>
        </section>
        <!-- 其它费用 -->
        <section class="box-wrap" v-if="otherMoney.length">
          <div class="title">
            <span class="title-bar"></span>
            <span class="name">其他费用</span>
          </div>
          <div class="box">
            <div class="box-item" v-for="y in otherMoney" :key="y.computedTypeId">
                  <div class="box-title">{{y.name}}</div>
                  <div class="box-content">
                      <van-row gutter="20" class="table-header">
                          <van-col span="6">计算方式</van-col>
                          <van-col span="12">费用(元)</van-col>
                          <van-col span="6">收取周期</van-col>
                      </van-row>
                      <van-row gutter="20" class="table-body">
                          <van-col span="6">{{y.computedType}}</van-col>
                          <van-col span="12">{{y.totalCost}}</van-col>
                          <van-col span="6">{{y.chargeCycle}}</van-col>
                      </van-row>
                  </div>
              </div>
          </div>
        </section>
        <!-- 备注 -->
        <section class="box-wrap" v-if="baseInfo.remark">
          <div class="title">
            <span class="title-bar"></span>
            <span class="name">备注</span>
          </div>
          <div class="box">{{baseInfo.remark}}</div>
        </section>
      </div>
    </div>
    <div class="common-fix-bottom" :style="{paddingBottom: bottomSafe}" v-if="planBookInfo.allowShare">
      <van-button
        round
        block
        type="save"
        class="share-btn"
        native-type="submit"
        @click="shareUrl"
      >分享</van-button>
      <van-button round block type="save" native-type="submit" @click="saveImage">保存图片</van-button>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import TopBar from '@c/TopBar'
import html2canvas from 'html2canvas'
import APICOMMON from '@/request/api/commonApi'
import { commonMethods } from 'movit-utils'
import API from '@/request/api/my'
import moment from 'moment'
const DISCOUNTINFO = [
  {
    text: '折扣公式',
    value: '',
    field: 'formula'
  },
  {
    text: '折后单价',
    value: '',
    color: 'blue',
    field: 'discountUnitPrice',
    unit: '元'
  },
  {
    text: '折后总价',
    value: '',
    color: 'blue',
    field: 'discountTotalPrice',
    unit: '元'
  }
]
const PAYMENTINFO = [
  {
    text: '首付款比例',
    value: '',
    field: 'paymentRatio',
    unit: '%'
  },
  {
    text: '首付款金额',
    value: '',
    field: 'paymentPrice',
    unit: '元'
  },
  {
    text: '付款类型',
    value: '',
    field: 'paymentType'
  },
  {
    text: '付款方式',
    value: '',
    field: 'paymentMethods'
  },
  {
    text: '贷款类型',
    value: '',
    field: 'loanType'
  },
  {
    text: '期限',
    value: '',
    field: 'timeLimit',
    unit: '年'
  },
  {
    text: '商贷金额',
    value: '',
    field: 'businessPrice',
    unit: '元'
  },
  {
    text: '商贷利率',
    value: '',
    field: 'businessRatio'
  },
  {
    text: '公积金贷款金额',
    value: '',
    field: 'accumulationPrice',
    unit: '元'
  },
  {
    text: '贷款利率',
    value: '',
    field: 'accumulationRatio'
  },
  {
    text: '支付利息',
    value: '',
    field: 'interest',
    unit: '元'
  },
  {
    text: '还款总额',
    value: '',
    field: 'totalRepayment',
    unit: '元'
  }
]
export default {
  name: 'housePlanPreview',
  components: {
    TopBar
  },
  computed: { ...mapGetters(['tabData', 'projectName', 'user', 'device', 'currentRole', 'projectId']) },
  data() {
    return {
      isShowWhiteBar: false,
      imgUrl: '',
      baseInfo: {
        paymentList: []
      },
      otherMoney: [],
      periodName: ['第一期', '第二期', '第三期', '第四期', '第五期', '第六期', '第七期', '第八期', '第九期', '第十期', '第十一期', '第十二期'],
      planBookInfo: {}
    }
  },
  created() {
    this.planBookProjectSettingInfo()
    const data = this.$utils.deepCopy(this.$route.params.plan)
    this.handleData(data)
    this.otherMoney = data.chargeList
    this.baseInfo = data
  },
  methods: {
    scroll(e) {
      this.isShowWhiteBar = e.srcElement.scrollTop > 0 ? true : false
    },
    handleData(data) {
      for (let item of data.paymentList) {
        this.toNumber(item)
        //   首付款金额
        item.paymentPrice = this.numFormat((item.discountTotalPriceOrigin * item.paymentRatio) / 100)
        // 折扣信息
        let discountInfo = this.$utils.deepCopy(DISCOUNTINFO)
        discountInfo.map(value => {
          value.value = value.unit ? `${item[value.field]}${value.unit}` : item[value.field]
        })
        item.discountInfo = discountInfo

        // 自定义付款
        if (item.currentPayment === 2) {
          item.repayments = []
          for (let x of item.paymentInfo) {
            x.date = this.addDate(data.subscriptionDate, Number(x.date), x.unit)
            item.repayments.push(x.price)
          }
        }
        // 按揭付款
        if (item.currentPayment === 1) {
          item.paymentInfo = this.periodName.map(x => {
            return { name: x }
          })
          item.paymentInfo.unshift({
            name: '首期款',
            date: this.addDate(item.subscriptionDate, Number(item.paymentEndDate), item.paymentEndDateUnit)
          })
          let totalInterest = 0 // 总利息
          // 等额本金
          if (item.loanTypeId === 1) {
            let businessRepayments = this.equalPrincipal(item.businessPriceOrigin, item.timeLimit, item.businessRatio)
            let providentRepayments = this.equalPrincipal(item.accumulationPriceOrigin, item.timeLimit, item.accumulationRatio)
            let businessDecrease = this.getDecreaseInterest(item.businessPriceOrigin, item.timeLimit, item.businessRatio)
            let providentDecrease = this.getDecreaseInterest(item.accumulationPriceOrigin, item.timeLimit, item.accumulationRatio)
            let businessTotalInterest = this.equalPrincipalInterest(item.businessPriceOrigin, item.timeLimit, item.businessRatio)
            let providentTotalInterest = this.equalPrincipalInterest(item.accumulationPriceOrigin, item.timeLimit, item.accumulationRatio)
            // 商贷
            if (item.paymentMethodsId === 1) {
              item.repayments = businessRepayments
              item.decreaseInterest = businessDecrease
              totalInterest = businessTotalInterest
            }
            // 公积金贷
            if (item.paymentMethodsId === 2) {
              item.repayments = providentRepayments
              item.decreaseInterest = providentDecrease
              totalInterest = providentTotalInterest
            }
            // 组合贷
            if (item.paymentMethodsId === 3) {
              item.repayments = businessRepayments.map((v, i) => {
                return v + providentRepayments[i]
              })
              totalInterest = businessTotalInterest + providentTotalInterest
              item.decreaseInterest = businessDecrease + providentDecrease
            }
            // 递减利息
            item.decreaseInterest = this.numFormat(item.decreaseInterest.toFixed(2))
          }
          //   等额本息
          if (item.loanTypeId === 2) {
            let businessMoney = this.equalInterest(item.businessPriceOrigin, item.timeLimit, item.businessRatio)
            let providentMoney = this.equalInterest(item.accumulationPriceOrigin, item.timeLimit, item.accumulationRatio)
            let businessInterest = this.calcEqualInterest(item.businessPriceOrigin, item.timeLimit, item.businessRatio)
            let providentInterest = this.calcEqualInterest(item.accumulationPriceOrigin, item.timeLimit, item.accumulationRatio)
            let money = 0 // 每月还款额
            // 商贷
            if (item.paymentMethodsId === 1) {
              money = businessMoney
              totalInterest = businessInterest
            }
            // 公积金贷
            if (item.paymentMethodsId === 2) {
              money = providentMoney
              totalInterest = providentInterest
            }
            // 组合贷
            if (item.paymentMethodsId === 3) {
              money = businessMoney + providentMoney
              totalInterest = businessInterest + providentInterest
            }
            item.repayments = new Array(12).fill(Number(money.toFixed(2)))
          }
          // 总利息
          item.interest = this.numFormat(totalInterest.toFixed(2))
          // 总还款额
          item.totalRepayment = this.numFormat((item.discountTotalPriceOrigin + totalInterest).toFixed(2))
          // 首期款
          item.repayments.unshift(item.paymentPrice)
        }

        // 付款信息
        let paymentDetail = this.$utils.deepCopy(PAYMENTINFO)
        paymentDetail.map(value => {
          value.show = false
          value.value = value.unit ? `${item[value.field]}${value.unit}` : item[value.field]
          //   自定义付款
          if (item.currentPayment === 2 && ['paymentType', 'paymentMethods'].includes(value.field)) {
            value.show = true
          }
          //   按揭付款
          if (item.currentPayment === 1) {
            value.show = true
            // 商业贷款
            if (item.paymentMethodsId === 1 && ['accumulationPrice', 'accumulationRatio'].includes(value.field)) {
              value.show = false
            }
            // 公积金贷款
            if (item.paymentMethodsId === 2 && ['businessRatio', 'businessPrice'].includes(value.field)) {
              value.show = false
            }
          }
        })
        item.paymentDetail = paymentDetail
      }
    },
    toNumber(item) {
      item.paymentRatio = Number(item.paymentRatio)
      item.businessRatio = Number(item.businessRatio)
      item.accumulationRatio = Number(item.accumulationRatio)
      item.discountTotalPriceOrigin = Number(item.discountTotalPriceOrigin)
      item.businessPriceOrigin = Number(item.businessPriceOrigin)
      item.accumulationPriceOrigin = Number(item.accumulationPriceOrigin)
      item.timeLimit = Number(item.timeLimit)
    },
    /**
     * 等额本金计算第一年还款金额
     * year 贷款年限
     * quota 贷款总额
     * rate 贷款利率
     */
    equalPrincipal(quota, year, rate) {
      let repayments = []
      // 每月还款额=每月还款本金+每月还款利息。
      // 贷款本金余额=贷款总额-已还款月数*每月还款本金
      // 每月还款本金 = 贷款总额/贷款月数
      let perMonthPrincipal = quota / (year * 12)
      // 贷款月利率=年利率/12
      let monthRate = rate / 100 / 12
      // 每月还款利息 = 贷款本金余额*贷款月利率
      // 第一个月还款利息
      let perMonthInterest = quota * monthRate
      let firstMoney = perMonthPrincipal + perMonthInterest
      // 每月递减利息
      let decreaseInterest = perMonthPrincipal * monthRate
      repayments.push(Number(firstMoney.toFixed(2)))
      this.getNextTotalRepayment(firstMoney, decreaseInterest, 11, repayments)
      return repayments
    },
    // 每月递减利息
    getDecreaseInterest(quota, year, rate) {
      // 每月还款本金 = 贷款总额/贷款月数
      let perMonthPrincipal = quota / (year * 12)
      // 贷款月利率=年利率/12
      let monthRate = rate / 100 / 12
      // 每月递减利息
      return perMonthPrincipal * monthRate
    },
    // 获取等额本金每月还款额
    getNextTotalRepayment(firstMoney, decreaseInterest, i, repayments) {
      if (i === 0) {
        return
      }
      firstMoney = firstMoney - decreaseInterest
      i--
      repayments.push(Number(firstMoney.toFixed(2)))
      return this.getNextTotalRepayment(firstMoney, decreaseInterest, i, repayments)
    },
    // 等额本息
    equalInterest(quota, year, rate) {
      // 等额本息每月还款金额 = 〔贷款本金×月利率×(1+月利率)^ 还款月数〕÷〔(1+月利率)^还款月数-1
      // 贷款月利率=年利率/12
      let monthRate = rate / 100 / 12
      let totalMonth = year * 12
      return (quota * monthRate * Math.pow(1 + monthRate, totalMonth)) / (Math.pow(1 + monthRate, totalMonth) - 1)
    },
    // 计算等额本息利息
    calcEqualInterest(quota, year, rate) {
      // 贷款月利率=年利率/12
      let monthRate = rate / 100 / 12
      let totalMonth = year * 12
      return (totalMonth * quota * monthRate * Math.pow(1 + monthRate, totalMonth)) / (Math.pow(1 + monthRate, totalMonth) - 1) - quota
    },
    // 计算等额本金利息
    equalPrincipalInterest(quota, year, rate) {
      let monthRate = rate / 100 / 12
      let totalMonth = year * 12
      return ((totalMonth + 1) * quota * monthRate) / 2
    },
    async saveImage() {
      if (!this.imgUrl) {
        this.imgUrl = await this.createImage()
      }
      this.$appMethods.DownloadImage(this.device, this.imgUrl)
    },
    // 生成图片
    async createImage() {
      return new Promise((resolve, reject) => {
        let canvasID = this.$refs['imageBox']
        let that = this
        let a = document.createElement('a')
        html2canvas(canvasID, {
          scale: 2 //按比例增加分辨率
        }).then(canvas => {
          let dom = document.body.appendChild(canvas)
          dom.style.display = 'none'
          a.style.display = 'none'
          document.body.removeChild(dom)
          let blob = that.dataURLToBlob(dom.toDataURL('image/png'))
          var data = new FormData()
          // 装载图片数据
          data.append('file', blob, new Date().getTime() + '.png')
          APICOMMON.uploadFile(data).then(res => {
            return resolve(res)
          })
        })
      })
    },
    // 分享
    async shareUrl() {
      if (!this.imgUrl) {
        this.imgUrl = await this.createImage()
      }
      const el = document.createElement('textarea')
      el.value = this.imgUrl
      el.setAttribute('readonly', '')
      el.style.position = 'absolute'
      el.style.left = '-9999px'
      document.body.appendChild(el)
      const selected = document.getSelection().rangeCount > 0 ? document.getSelection().getRangeAt(0) : false
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      if (selected) {
        document.getSelection().removeAllRanges()
        document.getSelection().addRange(selected)
      }
      this.$toast('复制成功')
    },
    //图片格式转换方法
    dataURLToBlob(dataurl) {
      let arr = dataurl.split(',')
      let mime = arr[0].match(/:(.*?);/)[1]
      let bstr = atob(arr[1])
      let n = bstr.length
      let u8arr = new Uint8Array(n)
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      return new Blob([u8arr], { type: mime })
    },
    // 计算增加后的日期
    addDate(date, day, type) {
      let str = ''
      switch (type) {
        case '天':
          str = 'days'
          break
        case '月':
          str = 'months'
          break
        case '周':
          str = 'weeks'
          break
      }
      return moment(date)
        .add(day, str)
        .format('YYYY.MM.DD')
    },
    //分割数字
    numFormat(num) {
        num = num.toString()
        let reg = num.indexOf('.') > -1 ? /(\d)(?=(\d{3})+\.)/g : /(\d)(?=(\d{3})+$)/g
        return num.replace(reg, '$1,')
    },
    async planBookProjectSettingInfo() {
        let params = {
            projectId: this.projectId
        }
        const result = await API.planBookProjectSettingInfo(params)
        this.planBookInfo = result
    }
  }
}
</script>
<style scoped lang="less">
.tab-bar {
  position: fixed;
  width: 100%;
  z-index: 999;
  padding: 0;
  background-image: url('@{baseImgUrl}/case/reception-record/right-top-bg.png'),
      linear-gradient(315deg, #5f95fa 0%, #4183ff 100%) #ffffff;
    background-position: right top, left 253px, center center;
    background-repeat: no-repeat, no-repeat, no-repeat;
    background-size: 200px 253px, 130px 214px, 100% 100%;
  /deep/ .head-container {
      width: auto;
      padding-left: 12px;
      padding-right: 12px;
  }
  &.bar-bg {
    background: #fff;
  }
}
.common-page-middle {
  margin-top: -100px;
  padding-top: 100px;
  .content {
    width: 100%;
    background-image: url('@{baseImgUrl}/case/reception-record/right-top-bg.png'), url('@{baseImgUrl}/case/reception-record/left-bottom-bg.png'),
      linear-gradient(315deg, #5f95fa 0%, #4183ff 100%);
    background-position: right top, left 253px, center center;
    background-repeat: no-repeat, no-repeat, no-repeat;
    background-size: 200px 253px, 130px 214px, 100% 100%;
    .page-title {
        text-align: center;
        font-size: 18px;
        color: #ffffff;
        .common-flex-center();
        height: @top-bar-height;
        position: relative;
        z-index: -1;
    }
    .top-info {
      padding-top: calc(@top-bar-height + 14px);
      color: #fff;
      text-align: center;
      .project-info {
        margin-top: 20px;
        display: flex;
        text-align: left;
        .item {
          flex: 1;
          padding-left: 15px;
          border-right: 1px solid rgba(255, 255, 255, 0.2);
          &.house {
            flex: 1.5;
          }
          &:last-child {
            border-right: none;
          }
        }
      }
    }
    .label {
      font-size: 14px;
    }
    .total-price {
      margin-top: 5px;
      margin-bottom: 17px;
      font-size: 30px;
      font-family: DINAlternate-Bold, DINAlternate;
      font-weight: bold;
    }
    .unit-price {
      margin-top: 6px;
      font-size: 18px;
      font-family: DINAlternate-Bold, DINAlternate;
      font-weight: bold;
    }
    .box-wrap {
      padding: 0 15px 15px 15px;
      .box {
        position: relative;
        margin-bottom: 15px;
        padding: 10px 15px 15px;
        background: #ffffff;
        border-radius: 12px;
        min-height: 50px;
        /deep/ .van-cell {
          padding: 7px 0;
          &.blue .van-cell__value {
            color: @theme-color;
          }
        }
        /deep/ .van-cell::after {
          border-bottom: none;
        }
        /deep/ .van-cell__title span {
          font-size: 13px;
          color: #999999;
        }
        /deep/ .van-cell__value {
          color: #333333;
          font-size: 13px;
        }
        .split-bar {
          position: absolute;
          z-index: 2;
          bottom: -36px;
          display: flex;
          justify-content: space-between;
          width: calc(100% - 30px);
          .bar {
            width: 20px;
            height: 56px;
            background: url('@{baseImgUrl}/case/house-purchasing-plan/split-bar.png') no-repeat;
            background-size: 100% 100%;
          }
        }
        .box-item {
            padding-bottom: 18px;
            margin-bottom: 10px;
            border-bottom: 1px solid #EEEEEE;
            &:last-child {
                border-bottom: none;
            }
            .box-title {
                font-size: 15px;
                font-family: PingFangSC-Medium, PingFang SC;
                font-weight: 500;
                color: #333333;
                line-height: 15px;
                padding: 8px 0 18px;
            }
            .table-header {
                padding-bottom: 18px;
                .van-col {
                    font-size: 15px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    color: #999999;
                    line-height: 15px;
                    &:nth-child(2) {
                        text-align: right;
                    }
                }
            }
            .table-body {
                .van-col {
                    .common-flex();
                    font-size: 13px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    color: #333333;
                    &:nth-child(2) {
                        text-align: right;
                    }
                    &.van-col--12 {
                        justify-content: flex-end;
                    }
                }
            }
        }
      }
    }
    .title {
      font-size: 16px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #ffffff;
      line-height: 47px;
      position: relative;
      .title-bar {
        position: absolute;
        top: 15px;
        display: inline-block;
        background: #fff;
        width: 4px;
        height: 16px;
        border-radius: 4px 0px 5px 0px;
      }
      .name {
        margin-left: 10px;
      }
    }
  }
}
.share-btn {
  margin-right: 10px;
  background: @light-green;
}
.opacity5 {
  opacity: 0.5;
}
.align-left {
  text-align: left;
}
.align-right {
  text-align: right;
}
.table {
  border-collapse: collapse;
  width: 100%;
  margin-top: 12px;
  th,
  td {
    padding: 0 7px;
  }
  thead tr th {
    height: 30px;
    font-size: 15px;
    font-family: PingFangSC-Regular, PingFang SC;
    color: #999999;
  }
  tbody tr td {
    height: 38px;
    display: table-cell;
    vertical-align: middle;
    font-size: 13px;
    color: #333;
  }
}
.tip {
  text-align: center;
  line-height: 35px;
  color: @theme-color;
}
</style>
