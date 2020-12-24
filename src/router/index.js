import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import User from '../components/User.vue'
Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { path: '/home', component: Home ,
	children: [
		{ path: '/', component: Welcome},
		{ path: '/user', component: User}
	]
  }
]

const router = new VueRouter({
  routes
})

// 路由导航守卫，在进入某些页面之前需要检查是否登录
router.beforeEach((to, from, next) => {
	console.log('to.path===>',to.path)
  
  //登录时直接放行
  if(to.path === '/login'){
	  return next()	  
  }
  //检查sessionStorage中token，即是否登录
  let token = window.sessionStorage.getItem('token')  
 
  console.log('路由导航守卫检查用户' , token)
  
  if(!token){ 	//还没有登录，则跳转登录页		
  	return next('/login')					 
  }	else {  	//已经登录，直接放行
    return next();
  }
})


export default router
