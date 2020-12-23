import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/fonts/iconfont.css' //导入第三方阿里字体图标样式文件
import './assets/css/global.css' //全局样式表，对所有组件生效

import axios from 'axios' //向后台进行数据请求的模块
axios.defaults.baseURL = 'http://localhost:8088' //后台接口根路径
Vue.prototype.$http = axios 


Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
