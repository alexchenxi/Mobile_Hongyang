/**
 * @author Lenovo
 * @date 2020/11/11 21:52
 * @desc 公众封装方法
 */
import $store from '../store'
import MD5 from 'md5'
import { Toast, Dialog, ImagePreview } from 'vant'

// 判断当前环境
const getDevice = () => {
    const u = navigator.userAgent
    const isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1
    const isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)

    let device
    if (isAndroid) {
        device = 2
    }
    if (isiOS) {
        device = 1
    }
    return device
}

// 对象深度拷贝
const deepCopy = (data) => {
    if (typeof data !== 'object') {
        return data
    }
    return JSON.parse(JSON.stringify(data))
}
// 时间拼接
const spliceTime = (data) => {
    if (Array.isArray(data)) {
        if (data.length === 2) {
            return [`${data[0]} 00:00:00`, `${data[1]} 23:59:59`]
        }
    } else {
        return `${data} 00:00:00`
    }
}
// loading框封装
const loading = (message = '加载中...') => {
    Toast.loading({
        message,
        duration: 0,
        forbidClick: true,
        loadingType: 'spinner',
    })
}
// Dialog的confirm提示封装
const confirm = (message) => {
    return Dialog.confirm({
        title: '提示',
        message,
        asyncClose: true,
    })
}
// map对象转数组
const mapToArray = (map) => {
    let arr = [...map]
    let returnArr = []
    for (let item of arr) {
        returnArr.push({
            label: item[1],
            value: item[0],
        })
    }
    return returnArr
}
// 预览图片数组
const previewImageList = (list, index) => {
    ImagePreview({
        images: list,
        startPosition: index,
    })
}
// 获取url参数
const getUrlQuery = (url) => {
    let temp1 = url.split('?')
    let pram = temp1[1]
    let keyValue = pram.split('&')
    let obj = {}
    for (let i = 0; i < keyValue.length; i++) {
        let item = keyValue[i].split('=')
        let key = item[0]
        let value = item[1]
        obj[key] = value
    }
    return obj
}
// 加密
const md5 = (str, salt = 'YgDp20@)') => {
    return MD5(str + salt)
}
// 隐藏手机号
const hidePhone = (value) => {
    let start = value.substring(0, 3),
        end = value.substring(7)
    return start + '****' + end
}

// 日期处理
const timeFormat = (str, type) => {
    //type 1 到日 2 到秒
    if (type === 1) {
        return str.substring(0, 10)
    }
}
// 添加水印
const drawWatermark = (id, text = '测试') => {
    let clientWidth = document.body.clientWidth
    let clientHeight = document.body.clientHeight
    let canvas = document.getElementById(id)
    if (!canvas) {
        return
    }
    canvas.height = clientHeight
    canvas.width = clientWidth
    let context = canvas.getContext('2d')
    context.font = '12px Microsoft YaHei'
    let textWidth = context.measureText(text).width
    for (let i = -clientWidth / 2; i < clientWidth * 2; i = i + (textWidth - 70)) {
        for (let j = 0; j < clientHeight * 2; j = j + 80) {
            context.rotate((-20 * Math.PI) / 200)
            context.fillStyle = 'RGBA(51,51,51,0.3)'
            // context.fillText(text, i, j);
            textPrewrap(context, text, i, j, 20, 118, 3)
            context.setTransform(1, 0, 0, 1, 0, 0)
        }
    }
}
// 文字自动换行
function textPrewrap(ctx, content, drawX, drawY, lineHeight, lineMaxWidth, lineNum) {
    var drawTxt = '' // 当前绘制的内容
    var drawLine = 1 // 第几行开始绘制
    var drawIndex = 0 // 当前绘制内容的索引

    // 判断内容是否可以一行绘制完毕
    if (ctx.measureText(content).width <= lineMaxWidth) {
        ctx.fillText(content.substring(drawIndex, i), drawX, drawY)
    } else {
        for (var i = 0; i < content.length; i++) {
            drawTxt += content[i]
            if (ctx.measureText(drawTxt).width >= lineMaxWidth) {
                if (drawLine >= lineNum) {
                    ctx.fillText(content.substring(drawIndex, i) + '..', drawX, drawY)
                    break
                } else {
                    ctx.fillText(content.substring(drawIndex, i + 1), drawX, drawY)
                    drawIndex = i + 1
                    drawLine += 1
                    drawY += lineHeight
                    drawTxt = ''
                }
            } else {
                // 内容绘制完毕，但是剩下的内容宽度不到lineMaxWidth
                if (i === content.length - 1) {
                    ctx.fillText(content.substring(drawIndex), drawX, drawY)
                }
            }
        }
    }
}

const inputHandle = () => {
    let flag = false
    let pageBackNormFunc
    document.body.addEventListener('focusin', () => {
        // 软键盘弹起事件
        flag = true
        pageBackNormFunc && clearTimeout(pageBackNormFunc)
        console.log('软键盘弹起')
    })
    document.body.addEventListener('focusout', () => {
        // 软键盘关闭事件
        if (flag) {
            console.log('软键盘关闭1')
            pageBackNormFunc = setTimeout(function () {
                console.log('软键盘关闭')
                // 当键盘收起的时候让页面回到原始位置
                window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
            }, 200)
        }
        flag = false
    })
}
const formatDate = (val) => {
    let start = val[0] ? new Date(val[0]).getMonth() + 1 + '/' + new Date(val[0]).getDate() + '/' : null
    let end = val[1] ? new Date(val[1]).getMonth() + 1 + '/' + new Date(val[1]).getDate() + '/' : null
    return [start, end]
}
// 元转万元
const formatNumber = (num) => {
    num = Number(num)
    if (num == 0) {
        return num + ''
    } else if (num > 1 && num < 10000) {
        return num + ''
    } else {
        return (num / 10000).toFixed()
    }
}
// 累加求和
const getScore = (list, key) => {
    let totle = 0
    for (let i = 0; i < list.length; i++) {
        totle += Number(list[i][key])
    }
    return totle
}
export default function (Vue) {
    //添加全局API
    Vue.prototype.$utils = {
        loading,
        confirm,
        getDevice,
        deepCopy,
        mapToArray,
        spliceTime,
        previewImageList,
        md5,
        hidePhone,
        getUrlQuery,
        timeFormat,
        drawWatermark,
        inputHandle,
        formatDate,
        formatNumber,
        getScore,
    }
}
