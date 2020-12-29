<template>
	<div>
		<!-- 面包屑导航区 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
		  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
		  <el-breadcrumb-item>权限管理</el-breadcrumb-item>
		  <el-breadcrumb-item>角色列表</el-breadcrumb-item>
		</el-breadcrumb>
		
		<!-- 卡片视图内容区 -->
		<el-card class="box-card">		  		    			
			<!-- 输入框及搜索、添加区域 -->
			
			<!-- 表格内容区 -->
			<el-table
			    :data="roleList"
			    style="width: 100%"
			    :default-sort = "{prop: 'pId', order: 'asccending'}"
				stripe
				border
			    >
				<el-table-column type="expand">
				    <template slot-scope="props">
						<pre>{{props.row.powerList}}</pre>
					</template>
				</el-table-column>
			    <el-table-column
			      type="index"
			      label="序号">
			    </el-table-column>
				<el-table-column
			      prop="rId"
			      label="角色编号"
			      sortable
			      width="120">
			    </el-table-column>
				<el-table-column
				  prop="rname"
				  label="角色名称"
				  width="150">
				</el-table-column>
				<el-table-column
				  prop="createTime"
				  label="创建时间"
				  width="180">
				</el-table-column>
				<el-table-column
				  prop="updateTime"
				  label="修改时间"
				  width="180">
				</el-table-column>
				<el-table-column
				  label="操作">
				  <template v-slot="scope">
				  	
					<el-button type="primary" size="mini" icon="el-icon-edit">修改角色权限</el-button>
					<el-button type="danger"  size="mini" icon="el-icon-delete" :disabled="scope.row.rId<=2?true:false">删除角色</el-button>				  	
				  </template>
				</el-table-column>
			</el-table>
		</el-card>
	</div>
</template>

<script>
	export default {
		data(){
			return {
				queryInfo: {
					pageNum: 1,
					pageSize: 8
				},
				roleList:[],
				total: 0
			}
		},
		created() {
			this.doSearch()
		},
		methods: {
			async doSearch(){
				console.log(this.queryInfo)
				const {data: res} = await this.$http.get(`/role/query`);
				console.log('res=>',res)
				if(res.code===0){
					this.roleList = res.data
					this.total = res.data.total
				}else{
					this.$message.error(res.message)
				}
			}
		}
	}
</script>

<style>
</style>
