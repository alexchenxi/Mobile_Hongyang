/**
 * @author jinming
 * @date 2020/11/10 11:20
 * @desc px转化rem配置文件
 */
import vConsole from 'vconsole'

// 开启调试模式
// if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'dev') {
// new vConsole()
// }

function setRem() {
    // 当前页面宽度相对于 750 宽的缩放比例，可根据自己需要修改。
    const scale = document.documentElement.clientWidth / 375
    // 设置页面根节点字体大小
    document.documentElement.style.fontSize = scale * 15 + 'px'
}

setRem()
window.addEventListener('resize', setRem)
