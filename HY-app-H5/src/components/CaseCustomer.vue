<template>
	<div class="customer-list">
		<components :is="componentsName" ref="checkBoxGroup" v-model="checkList" @change="checkChange">
			<div v-for="item in list" :key="item[checkField]" class="customer-item" @click="goDetail(item)">
				<template v-if="code">
					<div class="item-content">
						<section class="top-containe-wrap"
							:class="getCustomerConfig(item.codeType).showAvatar ? 'is-avatar' : ''">
<!--							<div class="avatar customerStep">-->
<!--								{{ customerStepMap[item.customerStep] }}-->
<!--							</div>-->
                            <van-image
                                v-if="!getCustomerConfig(item.codeType).noShowAvatar && currentRole.roleCode.includes('ST_')"
                                class="avatar" round width="44px" height="44px" fit="cover"
                                :src="$baseImgUrl + '/case/customer/client-level-'+ (item.customerLevel || 'default') +'.png'" />
							<div class="top-container">
								<div class="section-header">
									<div class="section-header-left">
										<div class="name">
											{{ item[getCustomerConfig(item.codeType).nameField] }}
										</div>
										<div class="tag-list">
											<template v-for="(tag, index) in getCustomerConfig(item.codeType).tagList">
                                                <div v-if="tag.type === 'customerStep'"
                                                     :key="index"
                                                     :class="['tag-item', item.customerStep == '2' ? 'common-tag-green' : 'common-tag-orange']"
                                                >
                                                    {{ item.customerStep == '2' ? '首访' : '复访' }}
                                                </div>
                                                <div v-if="tag.type === 'channel' && item[tag.field]" :key="index"
                                                     :class="['tag-item', 'common-tag-channel']">
                                                    {{ item[tag.field] }}
                                                </div>
												<div v-if="tag.type === 'loseReason' && tag.field !== 'loseReason' && item[tag.field]"
													:key="index" :class="['tag-item', 'common-tag-'+ index]">
													{{ item[tag.field] }}
												</div>

											</template>
										</div>
									</div>
								</div>
                                <div class="section-body">
                                    <div class="field-section">
                                        <div class="field-name">
                                            手机号：
                                        </div>
                                        <div class="field-content">
                                            {{ item.customerTel || '--' }}
                                        </div>
                                    </div>
                                </div>
								<div class="section-body">
									<div class="field-section">
										<div class="field-name">
											随行人数：
										</div>
										<div class="field-content">
											{{ item.companionNumber || '--' }}
										</div>
									</div>
								</div>
								<div class="section-body">
									<div class="field-section">
										<div class="field-name">
											最新到访时间：
										</div>
										<div class="field-content">
											{{ item.lastVisitDate || '--' }}
										</div>
									</div>
								</div>
								<div class="section-body" v-if="!!item.receptionTimeLong">
									<div class="field-section">
										<div class="field-name">
											接待时长：
										</div>
										<div class="field-content">
											{{ item.receptionTimeLong + '分钟' || '--' }}
										</div>
									</div>
								</div>
							</div>
						</section>
						<div v-if="getCustomerConfig(item.codeType).bottomInfo && item[getCustomerConfig(item.codeType).bottomInfo.actionType]"
							class="took-info">
							<div class="tag-item common-tag-blue">
								{{ item[getCustomerConfig(item.codeType).bottomInfo.actionType] }}
							</div>
							<p class="name van-ellipsis">
								{{ item[getCustomerConfig(item.codeType).bottomInfo.textField] }}
							</p>
							<span class="date">{{ item[getCustomerConfig(item.codeType).bottomInfo.dateField] }}</span>
						</div>
						<div v-if="item.canEdit" class="bottom-container">
							<div class="action-list">
								<div v-if="getCustomerConfig(item.codeType).actions && getCustomerConfig(item.codeType).actions.reception && ((item.isFirstVisit && !item.finishReception) || !item.isFirstVisit)"
									class="action-button" @click.stop="reception(item)">
									<span class="iconfont iconwanchengjiedai" />
									完成接待
								</div>

<!-- 								<div v-if="
                    item.codeType != 'ST.CUSTOMER.UNBLANK' && getCustomerConfig(item.codeType).actions && getCustomerConfig(item.codeType).actions.information && item.isFirstVisit && !item.finishCustomerInfo && !item.voluntary
                  " class="action-button" @click.stop="goDetail(item)">
									<span class="iconfont iconwanshanxinxi" />
									完善资料
								</div> -->

								<div v-if="item.codeType === 'ST.CUSTOMER.UNBLANK'" class="action-button"
									@click.stop="finishCustomerInfo(item)">
									<span class="iconfont iconbaiban" />
									信息完善
								</div>

								<div v-if="getCustomerConfig(item.codeType).actions && getCustomerConfig(item.codeType).actions.sign && item.checkSign"
									class="action-button" @click.stop="sign(item)">
									<span class="iconfont iconqianming" />
									在线签名
								</div>

								<div v-if="getCustomerConfig(item.codeType).actions && getCustomerConfig(item.codeType).actions.call"
									class="action-button" @click.stop="call(item)">
									<span class="iconfont icondianhua1" />
									打电话
								</div>

								<div v-if="getCustomerConfig(item.codeType).actions && getCustomerConfig(item.codeType).actions.register && item.canRegister"
									class="action-button" @click.stop="caseRegistration(item)">
									<span class="iconfont iconanchangdengji" />
									销售登记
								</div>

							</div>
						</div>
					</div>
				</template>
				<template v-else>
                    <!-- 只针对于分配页面-跟进中客户            -->
                    <template v-if="item.codeType == 2">
                        <van-checkbox v-if="checkBox && componentsName==='van-checkbox-group'" :name="item[checkField]" :disabled="item.receptionStatus === 1 ? false : true">
                            <template #icon="props">
                                <span class="iconfont" :class="props.checked && item.receptionStatus === 1 ? 'iconqueding' : 'iconweixuanzhong1'" />
                            </template>
                        </van-checkbox>
                        <van-radio v-if="checkBox && componentsName === 'van-radio-group'" :name="item[checkField]">
                            <template #icon="props">
                                <span class="iconfont" :class="props.checked ? 'iconqueding' : 'iconweixuanzhong1'" />
                            </template>
                        </van-radio>
                    </template>

                    <template v-else>
                        <van-checkbox v-if="checkBox && componentsName==='van-checkbox-group'" :name="item[checkField]">
                            <template #icon="props">
                                <span class="iconfont" :class="props.checked ? 'iconqueding' : 'iconweixuanzhong1'" />
                            </template>
                        </van-checkbox>
                        <van-radio v-if="checkBox && componentsName === 'van-radio-group'" :name="item[checkField]">
                            <template #icon="props">
                                <span class="iconfont" :class="props.checked ? 'iconqueding' : 'iconweixuanzhong1'" />
                            </template>
                        </van-radio>
                    </template>
					<div class="item-content">
						<section class="top-containe-wrap"
							:class="getCustomerConfig(item.codeType).showAvatar ? 'is-avatar' : ''">
							<!--                            <van-image-->
							<!--                                v-if="getCustomerConfig(item.codeType).showAvatar"-->
							<!--                                class="avatar"-->
							<!--                                round-->
							<!--                                width="44px"-->
							<!--                                height="44px"-->
							<!--                                fit="cover"-->
							<!--                                :src="item[getCustomerConfig(item.codeType).avatarField] || $baseImgUrl + '/default-avatar.png'"-->
							<!--                            />-->
							<!-- 客户等级展示 目前只针对于案场   -->
							<van-image
								v-if="!getCustomerConfig(item.codeType).noShowAvatar && currentRole.roleCode.includes('ST_')"
								class="avatar" round width="44px" height="44px" fit="cover"
								:src="$baseImgUrl + '/case/customer/client-level-'+ (item.customerLevel || 'default') +'.png'" />
							<div class="top-container">
								<div v-if="item.codeType === 'ST.HOME.FOLLOWALERT.VISITTODO' && item.voluntary"
									class="reception-help">
									<span>义务</span>
								</div>
								<div class="section-header">
									<div class="section-header-left">
										<div class="name">
											{{ item[getCustomerConfig(item.codeType).nameField] }}
										</div>
										<div class="tag-list">
											<template v-for="(tag, index) in getCustomerConfig(item.codeType).tagList">
												<!--                                                <div v-if="tag.type === 'level' && item[tag.field] && !clientTabType" :key="index" :class="['tag-item', 'common-tag-' + item[tag.field]]">{{ item[tag.field] }}级</div>-->
												<div v-if="tag.type === 'channel' && item[tag.field]" :key="index"
													:class="['tag-item', 'common-tag-channel']">
													{{ item[item.menuId==='ST.CUSTOMER.TOTAL' || $route.query.dataType === 'ST.CUSTOMER.TOTAL' ? 'firstChannelName': tag.field] }}
												</div>
                                                <div v-if="tag.type === 'loseReason' && item[tag.field]" :key="index"
                                                     :class="['tag-item', 'common-tag-channel']">
                                                    {{ item[item.menuId==='ST.CUSTOMER.TOTAL' || $route.query.dataType === 'ST.CUSTOMER.TOTAL' ? 'loseReason':tag.field] }}
                                                </div>
                                                <div v-if="tag.type === 'CloseReason' || item.djtype"
                                                     :key="index" :class="['tag-item', 'common-tag-'+ index]">
                                                    {{ item[tag.field] || `新增${item.djtype}`}}
                                                </div>
												<div v-if="tag.type === 'error' && item[tag.field]" :key="index"
													class="tag-item common-tag-red">
													{{ item[tag.field] }}
												</div>
												<div v-if="tag.type === 'isVisit' && item[tag.field]" :key="index"
													class="tag-item common-tag-orange">
													{{ tag.tagList[item[tag.field]] }}
												</div>
												<div v-if="tag.type === 'visit' && item.isFirstVisit !== null"
													:key="index"
													:class="['tag-item', item[tag.field] ? 'common-tag-green' : 'common-tag-orange']">
													{{ item[tag.field] ? '首访' : '复访' }}
												</div>
                                                <div v-if="tag.type === 'customerStep'"
                                                     :key="index"
                                                     :class="['tag-item', item.customerStep == '2' ? 'common-tag-green' : 'common-tag-orange']"
                                                >
                                                    {{ item.customerStep == '2' ? '首访' : '复访' }}
                                                </div>
												<div v-if="tag.type === 'status' && tag.field" :key="index"
													:class="['tag-item', tag.class]">
													{{ tag.field }}
												</div>
												<div v-if="tag.type === 'statusField' && !tag.field" :key="index"
													:class="['tag-item', getCustomerStatus(item.status).class]">
													{{ getCustomerStatus(item.status).name }}
												</div>
												<div v-if="tag.type === 'tookType'" :key="index"
													class="tag-item common-tag-blue">
													{{ item[tag.field] === 1 ? '线上拓客' : '官网获客' }}
												</div>
                                                <div
                                                    v-if="tag.type === 'auditStatus' && (item[tag.field] === 1 || item[tag.field] === 0 || item[tag.field] === 2)"
                                                    :key="index"
                                                    :class="['tag-item', 'tag-item-ml', item[tag.field] == 1 ? 'common-tag-red' : 'common-tag-gray' ]"
                                                >
                                                    {{ item[tag.field] == 1 ? '同意' : '不同意' }}
                                                </div>
												<!-- 预约客户列表展示  -->
												<div v-if="tag.type === 'appointmentType'" :key="index"
													class="tag-item common-tag-orange">
													{{ item[tag.field] == 1 ? '楼盘' : '特惠好房' }}
												</div>
											</template>
                                            <div v-if="item.codeType == 2 && item.receptionStatus === 0"
                                                 class="tag-item common-tag-blue">
                                                接待中
                                            </div>
										</div>
									</div>
									<div v-if="(getCustomerConfig(item.codeType).actions && getCustomerConfig(item.codeType).actions.collect) || (item.menuType && item.menuType === 'ST.CUSTOMER.FAV')"
										class="section-header-right">
										<div v-code="['ST.CUSTOMER.BUTTON', 'ST.CUSTOMER.BUTTON.FAV']"
											class="collect-container" @click.stop="handleCollection(item)">
											<img v-if="item.isFav || item.isFav2" class="icon-collect"
												:src="$baseImgUrl + '/case/customer/icon-collect-on.png'">
											<img v-else class="icon-collect"
												:src="$baseImgUrl + '/case/customer/icon-collect.png'">
										</div>
									</div>
								</div>
								<div class="section-body">
									<template v-for="(field, index) in getCustomerConfig(item.codeType).fieldList">
										<div :key="index"
											:class="[(['1','2','3','TO-DO-CENTER','SUPPLEMENTARY-CARD', 'ZT.RANK.GROUP.BB'].includes(item.codeType) ? 'field-section-to-do' : 'field-section'), (['bills', 'takelook'].includes(getCustomerConfig(item.codeType).type) ? 'average' : ''),(field.name==='预计签约时间' ? 'field-name common-area':'field-name')]">
											<div class="field-name">
												{{ field.name }}：
											</div>
											<div v-if="field.name.includes('手机号码')" class="field-content">
												{{ item[field.field] || '--' | hidePhone(item.canEdit, 'ST.CUSTOMER.BUTTON.SHOWTEL') }}
												<span v-if="field.unit">{{ field.unit }}</span>
											</div>
											<div v-if="field.type === 'price'" class="field-content">
												<span class="strong">{{ numFormat(item[field.field]) || '--' }}</span>
												<span v-if="field.unit" class="unit">{{ field.unit }}</span>
											</div>
											<div v-if="!field.name.includes('手机号码') && field.type !== 'price'"
												:class="['field-content', field.field === 'relateCustomerName' ? 'van-ellipsis' : '']">
												{{ item[field.field] || '--' }}
												<span v-if="field.unit">{{ field.unit }}</span>
											</div>
										</div>
									</template>
                                    <template v-if="item.auditStatus">
                                        <div class="field-name" style="margin-top: 10px; font-size: 13px;">审批意见：</div>
                                        <div class="field-content" style="margin-top: 10px; font-size: 13px;">{{ item.auditAdvice ||  '--' }}</div>
                                    </template>
									<!-- 自定义字段start -->

									<!-- 到访未完善列表，有需要独立判断的首访/复访时间 -->
									<template v-if="$route.query.menuId === 'ST.HOME.OVERALERT.OVERACCESS' || $route.query.dataType === 'ST.HOME.OVERALERT.OVERACCESS'">
										<div class="field-section" v-if="item.isFirstVisit">
											<div class="field-name">首访时间：</div>
											<div class="field-content">{{ item.firstVisitDate}}</div>
										</div>
										<div class="field-section" v-else>
											<div class="field-name">复访时间：</div>
											<div class="field-content">{{ item.lastVisitTime}}</div>
										</div>
									</template>

									<!-- 问询待到访列表 -->
									<template v-if="$route.query.menuId === 'ST.HOME.FOLLOWALERT.TOARRIVE' || $route.query.dataType === 'ST.HOME.FOLLOWALERT.TOARRIVE'">
										<div class="field-section">
											<div class="field-name">预约到访时间：</div>
											<div class="field-content">{{ $utils.timeFormat(item.reserveVisitDate,1)}}</div>
										</div>
									</template>

									<!-- 自定义字段end -->
								</div>
								<div v-if="getCustomerConfig(item.codeType).actions" class="section-footer">
									<!-- <SettingTag
                                        v-if="item.canEdit && getCustomerConfig(item.codeType).actions && getCustomerConfig(item.codeType).actions.setTag"
                                        v-code="['ST.CUSTOMER.BUTTON', 'ST.CUSTOMER.BUTTON.TAG']"
                                        class="button-section"
                                        :type="1"
                                        :item="item"
                                        :data="item.customerDesc"
                                        @change="tagChange"
                                    /> -->
									<SettingTagUpdate
										v-if="item.canEdit && getCustomerConfig(item.codeType).actions && getCustomerConfig(item.codeType).actions.setTag"
										v-code="['ST.CUSTOMER.BUTTON', 'ST.CUSTOMER.BUTTON.TAG']" :item="item"
										:data="item.tagName" class="button-section" @change="tagChange" />
									<div v-if="getCustomerConfig(item.codeType).overdueDeadlineDays && (item[getCustomerConfig(item.codeType).overdueDeadlineDays.field] || item[getCustomerConfig(item.codeType).overdueDeadlineDays.field] === 0)"
										class="count-date">
										<span
											v-if="item[getCustomerConfig(item.codeType).overdueDeadlineDays.field] <= 0"
											>
											<span
												class="date-strong">1</span>
											{{item[getCustomerConfig(item.codeType).overdueDeadlineUnit.field] }}将流失
										</span>
										<span v-else>
											<span
												class="date-strong">{{ item[getCustomerConfig(item.codeType).overdueDeadlineDays.field] }}</span>
											{{ item[getCustomerConfig(item.codeType).overdueDeadlineUnit.field] }}将流失
										</span>
									</div>
									<div v-if="getCustomerConfig(item.codeType).overdueDays && item[getCustomerConfig(item.codeType).overdueDays.field] !== null"
										class="count-date" :style="{justifyContent: item.completeFirstVisit !== null ? 'flex-start' : 'flex-end'}">
										已逾期
										<span
											class="date-strong">{{ item[getCustomerConfig(item.codeType).overdueDays.field] }}</span>
										天
									</div>
									<div v-if="getCustomerConfig(item.codeType).isVisit && item[getCustomerConfig(item.codeType).isVisit.field] !== null"
										class="count-date visit-style" >
										已到访
										<span
											class="date-strong">{{ item[getCustomerConfig(item.codeType).isVisit.field] }}</span>
										次
									</div>
									<!-- 是否完善资料 -->
									<div :style="getCustomerConfig(item.codeType).overdueDays && item[getCustomerConfig(item.codeType).overdueDays.field] !== null?'':'width:100%'" v-if="getCustomerConfig(item.codeType).actions.showComplete&& currentRole.roleCode !== 'ST_SALES'&&(item.completeFirstVisit===4||item.completeFirstVisit===0||item.completeFirstVisit===1)"
										class="count-date complete-style" >
										{{ completeFirstVisitMap[item.completeFirstVisit] }}
									</div>
								</div>

							</div>
						</section>
						<div v-if="getCustomerConfig(item.codeType).bottomInfo && item[getCustomerConfig(item.codeType).bottomInfo.actionType]"
							class="took-info">
							<div class="tag-item common-tag-blue">
								{{ item[getCustomerConfig(item.codeType).bottomInfo.actionType] }}
							</div>
							<p class="name van-ellipsis">
								{{ item[getCustomerConfig(item.codeType).bottomInfo.textField] }}
							</p>
							<span class="date">{{ item[getCustomerConfig(item.codeType).bottomInfo.dateField] }}</span>
						</div>
						<div v-if="item.canEdit || item.codeType === 'ST.HOME.FOLLOWALERT.YYKH'" class="bottom-container">
							<div class="action-list">
								<!--                                <div-->
								<!--                                    v-if="getCustomerConfig(item.codeType).actions.reception && ((item.isFirstVisit && !item.finishReception) || !item.isFirstVisit)"-->
								<!--                                    class="action-button"-->
								<!--                                    @click.stop="reception(item)"-->
								<!--                                >-->
								<!--                                    <span class="iconfont iconwanchengjiedai"></span>-->
								<!--                                    完成接待-->
								<!--                                </div>-->
<!-- 								<div v-if="
                    item.codeType != 'ST.CUSTOMER.UNBLANK' && getCustomerConfig(item.codeType).actions && getCustomerConfig(item.codeType).actions.information && item.isFirstVisit && !item.finishCustomerInfo && !item.voluntary
                  " class="action-button" @click.stop="goDetail(item)">
									<span class="iconfont iconwanshanxinxi" />
									完善资料
								</div> -->

								<div v-if="item.codeType === 'ST.CUSTOMER.UNBLANK'" class="action-button"
									@click.stop="finishCustomerInfo(item)">
									<span class="iconfont iconbaiban" />
									信息完善
								</div>

								<div v-if="getCustomerConfig(item.codeType).actions && getCustomerConfig(item.codeType).actions.sign && item.checkSign"
									class="action-button" @click.stop="sign(item)">
									<span class="iconfont iconqianming" />
									在线签名
								</div>
                                <template>
                                    <template v-if="item.codeType === 'ST.HOME.FOLLOWALERT.YYKH' && currentRole.roleCode === 'ST_SALES'">
                                        <div
                                             class="action-button" @click.stop="call(item)">
                                            <span class="iconfont icondianhua1" />
                                            打电话
                                        </div>
                                    </template>
                                    <template v-else>
                                        <div v-if="getCustomerConfig(item.codeType).actions && getCustomerConfig(item.codeType).actions.call"
                                             class="action-button" @click.stop="call(item)">
                                            <span class="iconfont icondianhua1" />
                                            打电话
                                        </div>
                                    </template>
                                </template>

								<template v-if="item.menuId === 'ST.HOME.FOLLOWALERT.FINISHRECEPTION' || item.dataType === 'ST.HOME.FOLLOWALERT.FINISHRECEPTION'">
									<div v-if="item.completeFirstVisit === 4" class="action-button"
										@click.stop="reception(item)">
										<span class="iconfont iconwanchengjiedai" />
										完成接待
									</div>

									<div v-if="item.completeFirstVisit ===0||item.completeFirstVisit ===1"
										class="action-button" @click.stop="goDetail(item)">
										<span class="iconfont iconwanshanxinxi" />
										完善资料
									</div>
								</template>
								<template v-if="item.menuId === 'ST.HOME.OVERALERT.OVERACCESS' || item.dataType === 'ST.HOME.OVERALERT.OVERACCESS'">
									<div v-if="item.completeFirstVisit === 4" class="action-button"
										@click.stop="reception(item)">
										<span class="iconfont iconwanchengjiedai" />
										完成接待
									</div>

									<div v-if="item.completeFirstVisit ===0||item.completeFirstVisit ===1"
										class="action-button" @click.stop="goDetail(item)">
										<span class="iconfont iconwanshanxinxi" />
										完善资料
									</div>
								</template>


								<div v-if="getCustomerConfig(item.codeType).actions && getCustomerConfig(item.codeType).actions.register && item.canRegister"
									class="action-button" @click.stop="caseRegistration(item)">
									<span class="iconfont iconanchangdengji" />
									销售登记
								</div>
								<div v-if="item.codeType === 'ST.HOME.FOLLOWALERT.YYKH' && currentRole.roleCode === 'ST_SALES'" class="action-button"
									@click.stop="changeStatus(item,2)">
									无效
								</div>
								<div v-if="
                                    item.codeType === 'ST.HOME.FOLLOWALERT.YYKH' && currentRole.roleCode === 'ST_SALES'
                                " class="action-button" @click.stop="changeStatus(item,1)">
									有效
								</div>
							</div>
						</div>

						<div v-if="getCustomerConfig(item.codeType).isShowTip&&item.oldFirstChannelName&&item.firstChannelName!==item.oldFirstChannelName" class="tip-style">查询日期内客户一级渠道为{{item.oldFirstChannelName}}，当前归属于{{item.firstChannelName}}</div>
					</div>
				</template>
			</div>
		</components>
	</div>
</template>
<script>
	// import SettingTag from '@/components/SettingTag'
	import SettingTagUpdate from '@/components/SettingTagUpdate'
	import {
		mapGetters
	} from 'vuex'
	import {
		getConfig,
		getCustomerStatus
	} from '@/config/caseCustomerConfig'
	import {
		commonMethods
	} from 'movit-utils'
	export default {
		name: 'CaseCustomer',
		components: {
			SettingTagUpdate,
		},
		props: {
			list: {
				type: Array,
				default () {
					return []
				},
			},
			checkBox: {
				type: Boolean,
				default: false,
			},
			checkAll: {
				type: Boolean,
				default: false,
			},
			checkField: {
				type: String,
				default: 'clientId',
			},
			code: {
				type: String,
				default: '',
			},
			clientTabType: {
				type: String,
				default: '',
			},
			componentsName: {
				type: String,
				default: 'van-checkbox-group',
			}
		},
		data() {
			return {
				customerList: [],
				checkList: [],
				customerStepMap: {
					'2': "首访",
					'3': "复访",
				},
                completeFirstVisitMap: {
				    '0' : '未完成接待 未完善资料',
				    '1' : '未完善信息',
				    '4' : '未完成接待',
                }
			}
		},
		computed: {
			...mapGetters(['currentRole'])
		},
		watch: {
			checkAll(val) {
				if (val) {
					this.$refs.checkBoxGroup.toggleAll(true)
				} else {
					this.$refs.checkBoxGroup.toggleAll()
				}
			},
			list() {
				if (this.checkAll) {
					this.$nextTick(() => {
						this.$refs.checkBoxGroup.toggleAll(true)
					})
				}
			},
		},
		methods: {
			getCustomerConfig(type) {
				let config = ''
				// //白板列表 判断  非置业顾问角色才能展示置业顾问字段
				// if (this.currentRole.roleCode !== 'ST_SALES' && this.$route.fullPath === '/case/whiteboardCustomer') {
				// 	config = JSON.parse(JSON.stringify(getConfig(type)))
				// 	config.fieldList.splice(0, 0, {
				// 		name: '置业顾问',
				// 		field: 'staffName',
				// 	})
				// } else {
				// 	config = getConfig(type)
				// }
				config = getConfig(type)
				return config
			},
			getCustomerStatus(status, menuId = 'ST.CUSTOMER.INPUT') {
				return getCustomerStatus(menuId, status)
			},
			checkChange() {
				this.$emit('change', this.checkList)
			},
			//收藏
			handleCollection(item) {
				this.$emit('collect', item)
			},
			//修改标签
			tagChange() {
				this.$emit('tagChange', true)
			},
			//客户详情
			goDetail(item) {
				this.$emit('goDetail', item)
			},
			//完成接待
			reception(item) {
				this.$emit('reception', item)
			},
			//完善信息
			finishCustomerInfo(item) {
				this.$emit('finishCustomerInfo', item)
			},
			//签名
			sign(item) {
				this.$emit('sign', item)
			},
			// 销售登记
			caseRegistration(item) {
				this.$emit('caseRegistration', item)
			},
			changeStatus(item, type) {
				this.$emit('changeStatus', item, type)
			},
			// 打电话
            call(item) {
				const itemData = this.getCustomerConfig(item.codeType).fieldList.find((x) => x.name === '手机号码')
				const tel = item[itemData.field]
				if (tel) {
					this.$emit('call', tel)
				}
			},
			//千分位
			numFormat(num) {
				return commonMethods.NumFormat(num)
			},
		},
	}
</script>
<style lang="less" scoped>
	.customer-list {
		.customer-item {
			// padding: 15px;
			.common-flex();
			background: #ffffff;
			margin-bottom: 6px;
			align-items: stretch;

			.van-checkbox,
			.van-radio {
				flex-shrink: 0;
				flex-grow: 0;
				padding-left: 15px;

				/deep/ .van-checkbox__icon .van-icon {
					width: 18px;
					height: 18px;
				}

				/deep/ .van-checkbox__icon--checked .van-icon {
					font-size: 12px;
					line-height: 18px;
				}
			}

			.item-content {
				flex-shrink: 1;
				width: 100%;
			}

			.top-container {
				padding: 15px;
				flex: 1;

				.reception-help {
					width: 72px;
					height: 72px;
					border-radius: 50%;
					background: rgba(95, 149, 250, 0.1);
					display: flex;
					align-items: flex-end;
					justify-content: center;
					font-size: 12px;
					line-height: 24px;
					font-weight: 500;
					color: #5f95fa;
					transform: rotate(45deg);
					position: absolute;
					right: -36px;
					top: -36px;

					span {
						padding-bottom: 4px;
					}
				}

				.section-header {
                    position: relative;
                    .common-flex-between();
					margin-bottom: 2px;

					.section-header-left {
						.common-flex();

						.name {
                            flex: 1;
							font-size: 16px;
							color: @header-text-color;
							line-height: 16px;
							font-weight: 500;
							margin-right: 8px;
						}

						.tag-list {
							.common-flex();
							.tag-item {
								.common-flex-center();
								min-width: 45px;
								height: 18px;
								font-size: 11px;
								color: @theme-color;
								line-height: 11px;
								font-weight: 500;
								margin-right: 6px;
								padding: 0 6px;
								border-radius: 2px;
							}
                            .tag-item-ml {
                                position: absolute;
                                right: 0;
                                //margin-left: 230px;
                            }
						}
					}

					.section-header-right {
						.collect-container {
							padding: 0 0 0 8px;
							align-self: start;

							.icon-collect {
								width: 18px;
								height: 18px;
							}
						}
					}
				}

				.section-body {
					.common-flex();
					flex-wrap: wrap;

					.field-section {
						.common-flex();
						align-items: flex-start;
						font-size: 13px;
						line-height: 13px;
						font-weight: 400;
						margin-top: 12px;
						margin-right: 40px;

						&.average {
							margin-right: 0;
							width: 50%;
						}

						&:last-child {
							margin-right: 0;
						}

					}
                    .field-name {
                        color: #999999;
                        flex-shrink: 0;
                    }

                    .field-content {
                        color: @header-text-color;
                        word-break: break-all;

                        .strong {
                            font-size: 16px;
                            font-weight: bold;
                            font-family: DINAlternate-Bold, DINAlternate;
                        }

                        .unit {
                            font-size: 13px;
                            color: #999999;
                            margin-left: 2px;
                        }
                    }
					.field-section-to-do {
						.common-flex();
						width: 100%;
						align-items: flex-start;
						font-size: 13px;
						line-height: 13px;
						font-weight: 400;
						margin-top: 12px;

						&.average {
							margin-right: 0;
							width: 50%;
						}

						.field-name {
							color: #999999;
							flex-shrink: 0;
						}

						.field-content {
							color: @header-text-color;
							word-break: break-all;

							.strong {
								font-size: 16px;
								font-weight: bold;
								font-family: DINAlternate-Bold, DINAlternate;
							}

							.unit {
								font-size: 13px;
								color: #999999;
								margin-left: 2px;
							}
						}
					}
				}

				.section-footer {
					display: flex;
					align-content: center;
					justify-content: space-between;

					.button-section {
						margin-top: 12px;
					}

					.count-date {
						margin-top: 12px;
						width: 100%;
						.common-flex();
						align-items: flex-end;
						justify-content: flex-end;
						font-size: 13px;
						color: #999999;
						line-height: 20px;
						font-weight: 400;
						&.visit-style{
							margin-top:-20px
						}
						&.complete-style{
							min-width: 100px;
							color: #ff7282;
						}
						.date-strong {
							font-size: 24px;
							color: #ff7282;
							line-height: 24px;
							font-weight: bold;
							padding: 0 4px;
						}

						.date-red {
							font-size: 18px;
							color: #ff7282;
						}
					}
				}
			}

			.bottom-container {
				.action-list {
					.common-flex-between();
					position: relative;

					.action-button {
						.common-flex-center();
						position: relative;
						width: 100%;
						height: 44px;
						font-size: 13px;
						color: @header-text-color;
						line-height: 13px;
						font-weight: 400;
						border-top: 1px solid #eaeaea;

						.iconfont {
							padding-right: 5px;
							font-size: 15px;
						}

						&::before {
							position: absolute;
							left: 0;
							top: 16px;
							content: '';
							width: 1px;
							height: 13px;
							background: #eaeaea;
						}

						&:first-child {
							&::before {
								width: 0;
							}
						}
					}
				}
			}

			.top-containe-wrap {
				display: flex;

				.avatar {
					margin: 15px 0 0 15px;
				}

				.customerStep {
					width: 44px;
					height: 44px;
					border-radius: 50%;
					line-height: 44px;
					text-align: center;
					color: #ffffff;
					background: @theme-color;
				}

				&.is-avatar {
					.top-container {
						padding-left: 10px;

						.section-body {
							.field-section {
								margin-right: 13px;

								&:last-child {
									margin-right: 0;
								}

								&:nth-of-type(even) {
									margin-right: 0;
								}

								&:first-child {
									// flex: 1;
								}
							}
						}
					}
				}
			}

			.took-info {
				padding: 0 10px;
				margin-bottom: 12px;
				margin-left: 15px;
				width: calc(100% - 50px);
				height: 32px;
				background: #f5f7f9;
				border-radius: 4px;
				display: flex;
				justify-content: space-between;
				align-items: center;

				.tag-item {
					.common-flex-center();
					min-width: 45px;
					height: 18px;
					font-size: 11px;
					color: @theme-color;
					line-height: 11px;
					font-weight: 500;
					margin-right: 6px;
					padding: 0 6px;
					border-radius: 2px;
				}

				.name {
					margin-right: 16px;
					flex: 1;
					font-size: 13px;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #333333;
					line-height: 13px;
				}

				.date {
					font-size: 13px;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #999999;
					line-height: 13px;
				}
			}
		}
		.tip-style{
			font-size: 10px;
            font-family: PingFangSC-Regular, PingFang SC;
            color: #fab55f;
            line-height: 18px;
			padding:6px;
            background: rgba(250, 181, 95, 0.1);
            margin:0 15px 15px;
		}
	}

	.iconfont.iconqueding {
		color: @theme-color;
		font-size: 18px;
	}

	.iconfont.iconweixuanzhong1 {
		background: #ffffff;
		font-size: 18px;
		color: #e5e5e5;
	}
</style>
