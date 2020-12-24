<template>
	<div> 
		<!-- 面包屑导航区 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
		  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
		  <el-breadcrumb-item>用户管理</el-breadcrumb-item>
		  <el-breadcrumb-item>用户列表</el-breadcrumb-item>		  
		</el-breadcrumb>
		<!-- 卡片视图内容区 -->
		<el-card class="box-card">		  		    			
			<!-- 输入框及搜索、添加区域 -->
			<el-row :gutter="20">
				<el-col :span="6">
					<el-input
					placeholder="请输入教工号">
					</el-input>
				</el-col>
				<el-col :span="6">
					<el-input
					placeholder="请输入姓名">
					</el-input>
				</el-col>
				<el-col :span="6">
					<el-button type="primary" round>搜索</el-button>
					<el-button type="success" round>添加</el-button>
				</el-col>
				<el-col :span="6">
					
				</el-col>
			</el-row>
			<!-- 表格内容区 -->
			
			
			
		</el-card>

	</div>
</template>

<script>
	export default {
		data(){
			return {
				watchVideoState: '再看第P44级'
			}
		}
	}
</script>

<style>
</style>
