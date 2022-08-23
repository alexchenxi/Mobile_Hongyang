/**
 * 公共数据文件
 */
export const commonData = {
    // 客户状态
    customerStatus: new Map([
        ['10', '未到访'],
        ['20', '到访'],
        ['40', '认筹'],
        ['50', '认购'],
        ['60', '签约']
    ]),
    customerType: new Map([
        ['0', '将流失客户'],
        ['21', '到访待处理'],
        ['22', '今日待回访'],
        ['91', '逾期未到访'],
        ['92', '首访未完善'],
        ['93', '逾期未跟进'],
        ['94', '逾期未认购'],
        ['95', '逾期未签约']
    ]),
    // 客户来源
    customerSource: new Map([
        ['C04', '销售登记'],
        ['C01', '全民营销']
    ]),
    // 渠道来源
    channelList: new Map([
        ['C04', '销售登记'],
        ['C05', '自然来访'],
        ['C03', '行销自拓'],
        ['C01', '全民营销'],
        ['C02', '中介分销']
    ]),
    // 客户等级
    customerLevel: new Map([
        ['A', 'A级'],
        ['B', 'B级'],
        ['C', 'C级'],
        ['D', 'D级'],
        ['E', 'E级']
    ]),
    // 客户列表排序
    sortOptions: new Map([
        [1, '最新报备'],
        [2, '最早报备'],
        [3, '最新更新'],
        [4, '最早更新']
    ]),
    // 客户类型
    customerTypeList: new Map([
        [1, '未到访保护期将到期'],
        [2, '跟进保护期将到期'],
        [3, '到访保护期将到期']
    ]),
    // 客户搜索描述文字
    customerSearchPalceholer: new Map([
        ['50', '请输入客户姓名/手机号'],
        ['60', '请输入客户姓名/手机号'],
        ['2', '请输入任务标题'],
        ['6', '请输入关键人姓名/手机号'],
        ['7', '请输入小蜜蜂姓名/手机号'],
        ['beeCustomer', '请输入客户姓名/手机号'],
        ['keyCustomer', '请输入客户姓名/手机号'],
        ['bill-0', '请输入客户姓名/手机号'],
        ['bill-1', '请输入客户姓名/手机号'],
        ['bill-2', '请输入客户姓名/手机号'],
        ['takelook', '请输入客户姓名/手机号'],
        ['customerNotPhone', '请输入用户名称'],
        ['customerPhone', '请输入用户名称/手机号'],
        ['agentPhone', '请输入下线经纪人的姓名/手机号']
    ]),
    // 任务状态
    taskStatus: new Map([
        [
            1,
            {
                name: '未开始',
                code: 'ZT.HOME.TASK.TOSTARTED',
                tagClass: 'common-tag-gray',
                progressColor: '#FF7282',
                textColor: '#999999'
            }
        ],
        [
            0,
            {
                name: '进行中',
                code: 'ZT.HOME.TASK.UNDERGOING',
                tagClass: 'common-tag-orange',
                progressColor: '#4FC0E8',
                textColor: '#47CFAE'
            }
        ],
        [
            2,
            {
                name: '已结束',
                code: 'ZT.HOME.TASK.OVER',
                tagClass: 'common-tag-light-green',
                progressColor: '#4FC0E8',
                textColor: '#FF7282'
            }
        ]
    ]),
    // 任务状态
    taskListStatus: new Map([
        [
            1,
            {
                name: '未开始',
                code: 'ZT.HOME.TASK.TOSTARTED',
                tagClass: 'common-tag-gray',
                progressColor: '#FF7282',
                textColor: '#999999'
            }
        ],
        [
            0,
            {
                name: '进行中',
                code: 'ZT.HOME.TASK.UNDERGOING',
                tagClass: 'common-tag-orange',
                progressColor: '#4FC0E8',
                textColor: '#47CFAE'
            }
        ],
        [
            2,
            {
                name: '结束未完成',
                code: 'ZT.HOME.TASK.UNFINISHED',
                tagClass: 'common-tag-red',
                progressColor: '#4FC0E8',
                textColor: '#4FC0E8'
            }
        ],
        [
            3,
            {
                name: '结束已完成',
                code: 'ZT.HOME.TASK.FINISHED',
                tagClass: 'common-tag-light-green',
                progressColor: '#4FC0E8',
                textColor: '#FF7282'
            }
        ]
    ]),
    // 客户状态筛选状态
    customerFilterList: new Map([
        ['ST.CUSTOMER.UNVISIT', '未到访'],
        ['ST.CUSTOMER.FOLLOWING', '案场接待'],
        ['ST.CUSTOMER.OVERDUE', '逾期'],
        ['ST.CUSTOMER.PUBLIC', '公客'],
        ['ST.CUSTOMER.LOST', '弃客']
    ]),
    // 自渠客户状态
    extensionCustomerStatus: new Map([
        [
            10,
            {
                name: '已报备',
                tagClass: 'common-tag-orange',
                dateName: '报备时间'
            }
        ],
        [
            20,
            {
                name: '已到访',
                tagClass: 'common-tag-orange',
                dateName: '到访时间'
            }
        ],
        [
            30,
            {
                name: '已认筹',
                tagClass: 'common-tag-orange',
                dateName: '认筹时间'
            }
        ],
        [
            40,
            {
                name: '已认购',
                tagClass: 'common-tag-orange',
                dateName: '认购时间'
            }
        ],
        [
            50,
            {
                name: '已签约',
                tagClass: 'common-tag-red',
                dateName: '签约时间'
            }
        ],
        [
            -1,
            {
                name: '已失效',
                tagClass: 'common-housing-gray',
                dateName: '失效时间'
            }
        ]
    ]),
    configData: [
        {
            storageText: 'caseCustomerSearchHistory',
            path: '/case/customerSearchResult'
        },
        {
            storageText: 'extensionCustomerSearchHistory',
            path: '/extension/customerSearchResult'
        },
        {
            storageText: 'extensionTaskSearchHistory',
            path: '/extension/taskSearchResult'
        },
        {
            storageText: 'keyAndBeeCustomerSearchHistory',
            path: '/my/myCustomerSearchResult'
        },
        {
            storageText: 'keyAndBeePersonSearchHistory',
            path: '/my/keyAndBeeSearchResult'
        },
        {
            storageText: 'billSearchHistory',
            path: '/case/billSearchResult'
        },
        {
            storageText: 'takeLookSearchResult',
            path: '/my/takelook/searchResult'
        },
        {
            storageText: 'tookSearchResult',
            path: '/case/customerTookSearchResult'
        },
        {
            storageText: 'agentSearchResult',
            path: '/my/searchResult'
        }
    ],
    // 成员管理查看权限
    teamViewRoleList: ['ZT_MANAGER', 'ZT_DIRECTOR', 'ST_DIRECTOR', 'ST_MANAGER'],
    // 房源状态
    housingStatus: new Map([
        [
            '销控',
            {
                name: '销控',
                tagClass: 'common-housing-light-gray'
            }
        ],
        [
            '待售',
            {
                name: '待售',
                tagClass: 'common-housing-white'
            }
        ],
        [
            '预约',
            {
                name: '预约',
                tagClass: 'common-housing-green'
            }
        ],
        [
            '预留',
            {
                name: '预留',
                tagClass: 'common-housing-yellow'
            }
        ],
        [
            '小订',
            {
                name: '小订',
                tagClass: 'common-housing-orange'
            }
        ],
        [
            '认购',
            {
                name: '认购',
                tagClass: 'common-housing-red'
            }
        ],
        [
            '签约',
            {
                name: '签约',
                tagClass: 'common-housing-purple'
            }
        ],
        [
            '已售',
            {
                name: '已售',
                tagClass: 'common-housing-orange'
            }
        ],
        [
            '非售',
            {
                name: '非售',
                tagClass: 'common-housing-black'
            }
        ],
        [
            '可销控',
            {
                name: '可销控',
                tagClass: 'common-housing-white'
            }
        ],
        [
            '不可销控',
            {
                name: '不可销控',
                tagClass: 'common-housing-light-gray'
            }
        ],
        [
            '预销控',
            {
                name: '预销控',
                tagClass: 'common-housing-skyblue'
            }
        ]
    ]),
    salesHousingStatus: new Map([
        [
            '未售',
            {
                name: '未售',
                tagClass: 'common-housing-white'
            }
        ],
        [
            '已售',
            {
                name: '已售',
                tagClass: 'common-housing-orange'
            }
        ]
    ]),
    // 自渠用户类型
    extensionUserType: new Map([
        [0, '自渠专员'],
        [1, '关键人'],
        [2, '小蜜蜂']
    ]),
    // 案场客户时间轴
    customerTimeline: new Map([
        ['ST.HOME.FOLLOWALERT.LOSING', 16],
        ['ST.HOME.FOLLOWALERT.VISITTODO', 16],
        ['ST.HOME.FOLLOWALERT.TOVISIT', 16],
        ['ST.HOME.FOLLOWALERT.TOARRIVE', 16],
        ['ST.HOME.FOLLOWALERT.FINISHRECEPTION', 16],
        ['ST.CUSTOMER.FOLLOWING', 16],
        ['ST.CUSTOMER.NOVISIT', 4],
        ['ST.HOME.OVERALERT.OVERACCESS', 32],
        ['ST.HOME.OVERALERT.OVERVISIT', 32],
        ['ST.HOME.OVERALERT.OVERFOLLOW', 32],
        ['ST.HOME.OVERALERT.OVERORDER', 32],
        ['ST.HOME.OVERALERT.OVERCONTRACT', 32],
        ['ST.CUSTOMER.OVERDUE', 32],
        ['ST.CUSTOMER.PUBLIC', 64],
        ['ST.CUSTOMER.LOST', 128],
        ['ST.CUSTOMER.NOVISITASSIGN', 4],
        ['ST.CUSTOMER.INPUT', 8],
        ['ST.HOME.FOLLOWALERT.TOFOLLOWUP', 16],
        ['ST.HOME.ACQK.JDZKH', 16],
        ['ST.CUSTOMER.TOTAL', 16],
        ['ST.HOME.ACQK.GJKH', 16],
        ['AC.STAT.YGJ', 16],
        ['AC.STAT.YJF', 16],
        ['AC.STAT.SFL', 16],
        ['AC.STAT.FFL', 16],
        ['ZT.RANK.VISIT', 16],
        ['ZT.RANK.GROUP.DF', 16],
        ['ZT.RANK.GROUP.BB', 16],
        ['ZT.RANK.STAFF.DF', 16],
        ['ZT.RANK.STAFF.BB', 16]
    ])
}

// 获取客户来源
export function getCustomerSource(type) {
    return commonData.customerSource.get(type) || ''
}

// 获取客户等级
export function getCustomLevel(type) {
    return commonData.customerLevel.get(type) || ''
}

// 获取客户状态
export function getCustomStatus(type) {
    return commonData.customerStatus.get(type) || ''
}

// 获取客户状态
export function getCustomType(type) {
    return commonData.customerType.get(type) || ''
}

// 获取客户搜索描述文字
export function getSearchPlaceholder(type) {
    return commonData.customerSearchPalceholer.get(type) || ''
}

// 获取任务tab状态标签
export function getTaskStatus(type) {
    return commonData.taskStatus.get(type) || ''
}

// 获取任务列表状态标签
export function getTaskListStatus(type) {
    return commonData.taskListStatus.get(type) || ''
}

// 获取自渠客户状态标签
export function getExtensionCustomerStatus(type) {
    return commonData.extensionCustomerStatus.get(type) || ''
}

// 获取分配的客户状态标签
export function getAssignCustomerStatus(type) {
    return commonData.customerFilterList.get(type) || ''
}

// 获取分配的客户状态标签
export function getHousingStatus(type) {
    return commonData.housingStatus.get(type) || ''
}

// 获取销售顾问及主管房源状态标签
export function getConsultantHousingStatus(type) {
    return commonData.salesHousingStatus.get(type) || ''
}

// 获取自渠状态
export function getExtensionUserType(type) {
    return commonData.extensionUserType.get(type) || ''
}

// 获取案场客户时间轴类型
export function getCustomerTimelineType(code) {
    return commonData.customerTimeline.get(code) || ''
}
