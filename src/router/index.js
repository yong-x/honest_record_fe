import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import User from '../components/user/User.vue'
import Power from '../components/power/Power.vue'
import Role from '../components/power/Role.vue'
import AccuseType  from '../components/setting/AccuseType.vue'
import ProblemType  from '../components/setting/ProblemType.vue'
import ProblemField  from '../components/setting/ProblemField.vue'
import Department  from '../components/setting/Department.vue'
Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { path: '/home', component: Home ,
	children: [
		{ path: '/', component: Welcome},
		{ path: '/user', component: User},
		{ path: '/power', component: Power},
		{ path: '/role', component: Role},
		{ path: '/accuse_type', component: AccuseType},
		{ path: '/problem_type', component: ProblemType},
		{ path: '/problem_field', component: ProblemField},
		{ path: '/department', component: Department},
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
