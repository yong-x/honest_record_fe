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
				<el-col :span="5">
					<el-input
					v-model="queryInfo.userId"
					placeholder="请输入教工号">
					</el-input>
				</el-col>
				<el-col :span="5">
					<el-input
					v-model="queryInfo.userName"
					placeholder="请输入姓名">
					</el-input>
				</el-col>
				<el-col :span="5">
					<el-select v-model="queryInfo.rId" placeholder="请选择角色">
					    <el-option 	label="所有" value="-1"></el-option>
						<el-option v-for="role in roleList" :key="role.rid" :label="role.rname" :value="role.rid"></el-option>					    
					</el-select>					
				</el-col>
				<el-col :span="5">
					<el-select v-model="queryInfo.checkState" placeholder="请选择审核状态">
					    <el-option 	label="所有" value="-1"></el-option>
					    <el-option	label="未审核" value="0"></el-option>
					    <el-option	label="已审核" value="1"></el-option>
					  </el-select>					
				</el-col>				
				<el-col :span="4">
					<el-button type="primary" round @click="handleSearch">搜索</el-button>
					<el-button type="success" round>添加</el-button>
				</el-col>
			</el-row>
			<!-- 表格内容区 -->
			<el-table
			    :data="userList"
			    style="width: 100%"
			    :default-sort = "{prop: 'userId', order: 'descending'}"
				stripe
				border
			    >
			    <el-table-column
			      type="index"
			      label="序号">
			    </el-table-column>
				<el-table-column
			      prop="userId"
			      label="教职工号"
			      sortable
			      width="120">
			    </el-table-column>
			    <el-table-column
			      prop="userName"
			      label="姓名"
			      sortable
			      width="80">
				 
			    </el-table-column>
				<el-table-column
				  prop="gender"
				  label="性别"
				  width="80">
				  <template v-slot="scope">
				  	{{scope.row.gender==0?'男':'女'}}
				  </template>
				</el-table-column>
				<el-table-column
				  prop="createTime"
				  label="创建时间"
				  sortable>
				</el-table-column>
				<el-table-column
				  prop="createTime"
				  label="修改时间"
				  sortable>
				  </el-table-column>
				  <el-table-column
				    prop="role.rname"
				    label="角色"				   
				    width="80">				   
				  </el-table-column>				
				<el-table-column
			      prop="checkState"
			      label="审核状态">
				  <template v-slot="scope">
					  <el-tag :type="scope.row.checkState==1?'success':'warning'">{{scope.row.checkState==1?'已审核':'未审核'}}</el-tag>
				  </template>
			    </el-table-column>
				<el-table-column			      
			      label="操作">
				  <template v-slot="scope">
				  	<el-button type="primary" size="mini" icon="el-icon-edit"></el-button>				  	
				  	<el-button type="danger" size="mini" icon="el-icon-delete"></el-button>				  	
				  </template>
			    </el-table-column>				
			  </el-table>
			
			
			
		</el-card>
			<!-- 分页区 -->
			<el-pagination
			      @size-change="handleSizeChange"
			      @current-change="handleCurrentChange"
			      :current-page="queryInfo.pageNum"
			      :page-sizes="[3, 5, 10, 15]"
			      :page-size="queryInfo.pageSize"
			      layout="total, sizes, prev, pager, next, jumper"
			      :total="total">
			</el-pagination>
	</div>
</template>

<script>
	export default {
		data(){
			return {
				queryInfo: {
					pageNum: 1,
					pageSize: 5,
					userId: '',
					userName: '',
					checkState: '',
					rId: ''
				},
				userList:[],
				roleList: [],
				total: 0 
				
			}
		},
		created() {
			this.$http.get(`/role/query`).then(res=>{
				console.log('res.data=>',res.data)
				if(res.data.code!=0){
					this.$message.error(res.data.message)
				}else{
					this.roleList = res.data.data
				}
			})			
			this.doSearch()
		},
		methods: {
			async doSearch(){
				console.log(this.queryInfo)				
				const {data: res} = await this.$http.get(`/faculty/query`,{params: this.queryInfo});
				console.log('res=>',res)				
				if(res.code===0){
					this.userList = res.data.facultyList
					this.total = res.data.total
				}else{
					this.$message.error(res.message)
				}				
			},
			handleSearch(){ //点击查询时
				this.queryInfo.pageSize = 5
				this.queryInfo.pageNum = 1
				this.doSearch()	
			},
			handleSizeChange(val) { //页面大小改变时
			    console.log(`每页 ${val} 条`)
				this.queryInfo.pageSize = val
				this.queryInfo.pageNum = 1
				this.doSearch()
			},
			handleCurrentChange(val) { //页号改变时
				console.log(`当前页: ${val}`)
			    this.queryInfo.pageNum = val
				this.doSearch()
			}
		}		
	}
</script>

<style>
</style>
