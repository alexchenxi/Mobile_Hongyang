/**
 * 全局自定义指令
 */
import Vue from 'vue'
import store from '@/store'
/**
 * 防抖
 *  @param {?Number|300} time - 间隔时间
 *  @param {Function} fn - 执行事件
 *  @param {?String|"click"} event - 事件类型 例："click"
 *  @param {Array} binding.value - [fn,event,time]
 *  例：<el-button v-debounce="[reset,`click`,300]">刷新</el-button>
 *  传递参数：<el-button v-debounce="[()=>reset(param)]">刷新</el-button>
 */
Vue.directive('debounce', {
   inserted: function (el, binding) {
      let timer
      let [fn, event = 'click', time = 300] = binding.value
      el.addEventListener(event, () => {
         if (timer) {
            clearTimeout(timer)
         }
         timer = setTimeout(() => {
            fn()
         }, time)
      })
   }
})

/**
 * 按钮权限控制指令
 *  @param {?String} buttonCode - 按钮code 例："ZT.HOME.BUTTON"
 *  @param {?String} code - 具体code 例："ZT.HOME.BUTTON.CREATETASK"
 *  传递参数：<el-button v-code="['ZT.HOME.BUTTON','ZT.HOME.BUTTON.CREATETASK']">刷新</el-button>
 */
function changeCode(el, binding) {
   let [buttonCode, code] = binding.value
   let codeList = store.getters.menuActive.childrenList
   let codes = []
   if (codeList.length && codeList.filter(x => x.code === buttonCode).length &&  codeList.filter(x => x.code === buttonCode)[0].childrenList) {
      codes =  codeList.filter(x => x.code === buttonCode)[0].childrenList.map(x => x.code)
   }
   if (!codes.includes(code)) {
      if (!store.getters.codes.includes(code)) {
         el.style.display = "none"
      } else {
         el.style.display = ""
      }
   } else {
      el.style.display = ""
   }
}
Vue.directive('code', {
   bind: function (el, binding) {
      changeCode(el, binding)
   }
})

