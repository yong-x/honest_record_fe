import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/fonts/iconfont.css' //导入第三方阿里字体图标样式文件
import './assets/css/global.css' //全局样式表，对所有组件生效

import axios from 'axios' //向后台进行数据请求的模块
axios.defaults.baseURL = 'http://localhost:8088' //后台接口根路径

//请求拦截器，在所有向后端请求数据的请求头中加入 token , 以便后端进行权限验证
axios.interceptors.request.use(config => {
	console.log(config)
	config.headers.Authorization = window.sessionStorage.getItem('token')
	return config
})



Vue.prototype.$http = axios 


Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
