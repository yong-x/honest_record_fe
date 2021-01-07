<template>			
		<el-container class="home-container">
			<!-- 头部区 -->
			<el-header>
				<div>
					<span>高校廉洁档案管理及分析决策系统</span>
				</div>
				<el-button type="infor" @click="logout">退出</el-button>
			</el-header>
			<!-- 主体区 -->
			<el-container >
				<!-- 侧边栏 -->
				<el-aside :width="isCollapse?'64px':'200px'">
					<div class="toggle-bar" @click="toggleMenuCollapse">|||</div>
					<el-menu					      
					      class="el-menu-vertical-demo"					      
					      background-color="#333744"
					      text-color="#fff"
					      active-text-color="#409eff"
						  :unique-opened="true"
						  :collapse="isCollapse"
						  :collapse-transition="false"
						  :router="true"
						  :default-active="getActivePath">
					    
						<!-- 菜单模板 -->
						<!-- 一级菜单 -->	
						<el-submenu v-for="(menu,index) in menuList" :key="menu.id" :index="menu.id">					        
					    	<!-- 一级菜单模板 -->
							<template slot="title">
					          <i :class="menu.icon"></i>
					          <span>{{menu.name}}</span>
					        </template>
								<!-- 二级菜单 -->
								<el-menu-item v-for="(submeun,subindex) in menu.children" :key="submeun.id" :index="submeun.path">
									<!-- 二级菜单模板 -->
									<template slot="title">
									  <i :class="submeun.icon"></i>
									  <span>{{submeun.name}}</span>
									</template>
								</el-menu-item>	
					    </el-submenu>																	   		      
					    </el-menu>				
				</el-aside>
				<!-- 内容区 -->
				<el-main>
					<!-- 路由占位符，本组件的子组件将会被渲染 -->
					<router-view></router-view>
				</el-main>
			</el-container>
		</el-container>	
</template>

<script>
	export default {
		data(){
			return {		
				menuList: [ //菜单列表
					{
						id: '1',
						name: '用户管理',
						icon: 'iconfont icon-qunzu',						
						children: [
							{id: '101',name: '用户列表',icon: 'iconfont icon-042fangkuai',path: '/user'}							
						]
					},
					{
						id: '2',
						name: '档案管理',
						icon: 'iconfont icon-danganjianying',
						children: [
							{id: '201',name: '档案列表',icon: 'iconfont icon-042fangkuai',path: '/record'}
						]
					},
					{
						id: '3',
						name: '分析报告',
						icon: 'iconfont icon-fenxi',
						children: [
							{id: '301',name: '案件统计',icon: 'iconfont icon-042fangkuai',path: '/analysis'}
						]
					},
					{
						id: '4',
						name: '权限管理',
						icon: 'iconfont icon-quanxian',
						children: [
							{id: '401',name: '权限列表',icon: 'iconfont icon-042fangkuai',path: '/power'},
							{id: '402',name: '角色列表',icon: 'iconfont icon-042fangkuai',path:'/role'}
						]
					},
					{
						id: '5',
						name: '系统管理',
						icon: 'iconfont icon-xitong',
						children: [
							{id: '501',name: '举报类型',icon: 'iconfont icon-042fangkuai',path:'/accuse_type'},
							{id: '502',name: '问题分类',icon: 'iconfont icon-042fangkuai',path: '/problem_type'},
							{id: '503',name: '问题领域',icon: 'iconfont icon-042fangkuai',path: '/problem_field'},
							{id: '504',name: '部门列表',icon: 'iconfont icon-042fangkuai',path: '/department'}
						]
					},
					{
						id: '6',
						name: '通知公告',
						icon: 'iconfont icon-tongzhi',
						children: [
							{id: '601',name: '通知列表',icon: 'iconfont icon-042fangkuai',path: '/notice'}							
						]
					},
					{
						id: '7',
						name: '日志管理',
						icon: 'iconfont icon-rizhi',
						children: [
							{id: '701',name: '登录日志',icon: 'iconfont icon-042fangkuai',path: '/loginlog'},							
							{id: '702',name: '操作日志',icon: 'iconfont icon-042fangkuai',path: '/operatelog'}							
						]
					}
				],
				isCollapse: true
				
			}
		},
		
		
		methods: {
			logout(){
				window.sessionStorage.clear()
				this.$router.push('/login')
			},
			toggleMenuCollapse(){
				this.isCollapse = !this.isCollapse
			}			
		},
		computed: {
			getActivePath(){ //根据路由变化渲染当前激活的二级菜单
				console.log(this.$router)
				return this.$route.path
			}
		}
	}
</script>

<style lang="less" scoped>
	.home-container {
		height: 100%;
		
		.el-header {
			background-color: #373d41;
			display: flex;
			justify-content: space-between;
			align-items: center;
			color: #fff;
			font-size: 24px;
			font-weight: bold;
		}
		.el-aside {
			background-color: #333744;
			.el-menu {
				border-right: none;
			}
		}
		.el-main {
			background-color: #eaedf1;
		}
		.iconfont  {
			margin-right: 10px;
		}
		.toggle-bar {
			background-color: #4a5064;
			font-size: 10px;
			line-height: 24px;
			color: #fff;
			text-align: center;
			letter-spacing: 0.2em;
			cursor: pointer;
		}
		
	}
		
</style>
