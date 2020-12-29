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
					placeholder="请输入教工号"
					clearable>
					</el-input>
				</el-col>
				<el-col :span="5">
					<el-input
					v-model="queryInfo.userName"
					placeholder="请输入姓名"
					clearable>
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
					<el-button type="success" round @click="addDialogVisible=true">添加</el-button>
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
				  	<el-button type="primary" size="mini" icon="el-icon-edit" @click="editUser(scope.row.userId)"></el-button>				  	
				  	<el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteUser(scope.row.userId)"></el-button>				  	
				  </template>
			    </el-table-column>				
			  </el-table>
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
		</el-card>
		<!-- 添加用户对话框 -->
		<el-dialog 
		title="添加用户" 
		:visible.sync="addDialogVisible"
		width="50%"
		center
		@close="resetForm('addUserFromRef')">
		  <el-form :model="addUserFrom" :rules="addUserFromRules" ref="addUserFromRef">
		    <el-form-item label="姓名" prop="userName" :label-width="labelWidth">
		      <el-input v-model="addUserFrom.userName" clearable></el-input>
		    </el-form-item>
			<el-form-item label="性别" prop="gender" :label-width="labelWidth">
			    <el-radio-group v-model="addUserFrom.gender">
			      <el-radio label="0">男</el-radio>
			      <el-radio label="1">女</el-radio>
			    </el-radio-group>
			</el-form-item>
			<el-form-item label="身份证号" prop="idCard" :label-width="labelWidth">
			  <el-input v-model="addUserFrom.idCard" clearable></el-input>
			</el-form-item>
			<el-form-item label="密码" prop="password" :label-width="labelWidth">
		      <el-input v-model="addUserFrom.password" clearable type="password"></el-input>
		    </el-form-item>												
			<el-form-item label="联系电话" prop="phone" :label-width="labelWidth">
			  <el-input v-model="addUserFrom.phone" clearable></el-input>
			</el-form-item>
			<el-form-item label="职务" prop="position" :label-width="labelWidth">
			  <el-input v-model="addUserFrom.position" clearable></el-input>
			</el-form-item>
			<el-form-item label="参加工作年份" prop="workStartTime" :label-width="labelWidth">
			  <el-input v-model.number="addUserFrom.workStartTime" clearable></el-input>
			</el-form-item>
			<el-form-item label="在职状态" prop="workState" :label-width="labelWidth">			  
			  <el-radio-group v-model="addUserFrom.workState">
			    <el-radio label="0">在职</el-radio>
			    <el-radio label="1">离职</el-radio>
			  </el-radio-group>
			</el-form-item>
			<el-form-item label="所属部门" prop="dId" :label-width="labelWidth">
			  <el-select v-model="addUserFrom.dId" placeholder="请选择部门">			     
			  	 <el-option v-for="department in departmentList" :key="department.did" :label="department.dname" :value="department.did"></el-option>					    
			  </el-select>
			</el-form-item>
			<el-form-item label="角色" prop="rId" :label-width="labelWidth">			  
			  <el-select v-model="addUserFrom.rId" placeholder="请选择角色">			     
			  	<el-option v-for="role in roleList" :key="role.rid" :label="role.rname" :value="role.rid"></el-option>					    
			  </el-select>
			</el-form-item>
		  </el-form>
		  <div slot="footer" class="dialog-footer">
		    <el-button @click="addDialogVisible = false">取 消</el-button>
		    <el-button type="primary" @click="handleSubmitAddUser">确 定</el-button>
		  </div>
		</el-dialog>
		<!-- 修改用户对话框 -->
		<el-dialog 
		title="编辑用户" 
		:visible.sync="updateDialogVisible"
		width="50%"
		center
		@close="resetForm('updateUserFormRef')">
		  <el-form :model="updateUserForm" :rules="updateUserFormRules" ref="updateUserFormRef">
		    <el-form-item label="姓名" prop="userName" :label-width="labelWidth">
		      <el-input v-model="updateUserForm.userName" clearable></el-input>
		    </el-form-item>
			<el-form-item label="性别" prop="gender" :label-width="labelWidth">
			    <el-radio-group v-model.number="updateUserForm.gender">
			      <el-radio :label="0">男</el-radio>
			      <el-radio :label="1">女</el-radio>
			    </el-radio-group>
			</el-form-item>
			<el-form-item label="身份证号" prop="idCard" :label-width="labelWidth">
			  <el-input v-model="updateUserForm.idCard" clearable></el-input>
			</el-form-item>
			<el-form-item label="密码" prop="password" :label-width="labelWidth">
		      <el-input v-model="updateUserForm.password" clearable type="password"></el-input>
		    </el-form-item>												
			<el-form-item label="联系电话" prop="phone" :label-width="labelWidth">
			  <el-input v-model="updateUserForm.phone" clearable></el-input>
			</el-form-item>
			<el-form-item label="职务" prop="position" :label-width="labelWidth">
			  <el-input v-model="updateUserForm.position" clearable></el-input>
			</el-form-item>
			<el-form-item label="参加工作年份" prop="workStartTime" :label-width="labelWidth">
			  <el-input v-model.number="updateUserForm.workStartTime" clearable></el-input>
			</el-form-item>
			<el-form-item label="在职状态" prop="workState" :label-width="labelWidth">			  
			  <el-radio-group v-model.number ="updateUserForm.workState">
			    <el-radio :label="0">在职</el-radio>
			    <el-radio :label="1">离职</el-radio>
			  </el-radio-group>
			</el-form-item>
			<el-form-item label="所属部门" prop="dId" :label-width="labelWidth">
			  <el-select v-model="updateUserForm.dId" placeholder="请选择部门">			     
			  	 <el-option v-for="department in departmentList" :key="department.did" :label="department.dname" :value="department.did"></el-option>					    
			  </el-select>
			</el-form-item>
			<el-form-item label="角色" prop="rId" :label-width="labelWidth">			  
			  <el-select v-model="updateUserForm.rId" placeholder="请选择角色">			     
			  	<el-option v-for="role in roleList" :key="role.rid" :label="role.rname" :value="role.rid"></el-option>					    
			  </el-select>
			</el-form-item>
			<el-form-item label="审核状态" :label-width="labelWidth">			  
				<el-tooltip :content="updateUserForm.checkState===0?'未审核':'已审核'" placement="right">
					<el-switch
						v-model.number="updateUserForm.checkState"
						active-color="#13ce66"
						inactive-color="#ff4949"					
						:active-value="1"
						:inactive-value="0">
					</el-switch>
				</el-tooltip>
			</el-form-item>
		  </el-form>
		  <div slot="footer" class="dialog-footer">
		    <el-button @click="updateDialogVisible = false">取 消</el-button>
		    <el-button type="primary" @click="handleSubmitUpdateUser">确 定</el-button>
		  </div>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		data(){
			return {
				queryInfo: { //查询用户信息参数对象
					pageNum: 1,
					pageSize: 5,
					userId: '',
					userName: '',
					checkState: '',
					rId: ''
				},
				userList:[], //表格内容区用户列表
				roleList: [], //所有可选角色列表
				departmentList: [], //所有可选部门列表
				total: 0,
				addDialogVisible: false, //添加用户对话框是否显示
				addUserFrom: { //添加用户表单对象
					userName: '',
					password: '',
					gender: '0',
					idCard: '',
					phone: '',
					workStartTime: '',
					workState: '0',
					dId: '',
					rId: ''
				},
				labelWidth: '100px',
				addUserFromRules: { //添加用户表单验证规则对象
					userName: [
					    { required: true, message: '请输入用户姓名', trigger: 'blur' }
					],
					password: [
					    { required: true, message: '请输入密码', trigger: 'blur' },
						{ min: 6, max: 18, message: '密码长度为6到18个字符', trigger: 'blur' }
					],
					idCard: [
					    { required: true, message: '请输入身份证号', trigger: 'blur' },
						{ min: 18, max: 18, message: '身份证长度为18位', trigger: 'blur' }
					],
					workStartTime: [						
						{ type: 'number', message: '年份必须为数字值'}
					]
					
				},
				updateDialogVisible: false ,//修改用户对话框是否显示
				updateUserForm: {}, //更新用户表单									
				updateUserFormRules: { //更新用户表单验证规则对象
					userName: [
					    { required: true, message: '请输入用户姓名', trigger: 'blur' }
					],
					password: [
					    { required: true, message: '请输入密码', trigger: 'blur' },
						{ min: 6, max: 18, message: '密码长度为6到18个字符', trigger: 'blur' }
					],
					idCard: [
					    { required: true, message: '请输入身份证号', trigger: 'blur' },
						{ min: 18, max: 18, message: '身份证长度为18位', trigger: 'blur' }
					],
					workStartTime: [						
						{ type: 'number', message: '年份必须为数字值'}
					]
					
				}
			}
		},
		created() {
			this.$http.get(`/role/query`).then(res=>{ //查询所有角色初始化角色列表
				console.log('res.data=>',res.data)
				if(res.data.code!=0){
					this.$message.error(res.data.message)
				}else{
					this.roleList = res.data.data
				}
			})
			this.$http.get(`/department/query`).then(res=>{ //查询所有部门初始化部门列表
				console.log('res.data=>',res.data)
				if(res.data.code!=0){
					this.$message.error(res.data.message)
				}else{
					this.departmentList = res.data.data
				}
			})
			this.doSearch() //初始化第一页内容
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
			},
			resetForm(formRef) { //重置表单
			        this.$refs[formRef].resetFields();
			},
			handleSubmitAddUser(){ //添加用户表单提交
				console.log(this.addUserFrom)
				
				this.$refs.addUserFromRef.validate(async (valid) => {
				    if(!valid){
						console.log('error submit!!');
						return false;
					}
					var {data: res} = await this.$http.post('/faculty/add',this.addUserFrom)					
					console.log(res)					
					if(res.code!==0){ //服务器返回错误信息
						this.$message.error(res.message)
						return
					}else{						
						this.addDialogVisible = false
						this.$message.success('添加用户成功')
						this.queryInfo.pageNum = 1
						this.doSearch()
					}					
				});
			},
			async editUser(userId){ //点击编辑用户按钮时
				console.log(userId)
				const {data: res} = await this.$http.get(`/faculty/query/${userId}`);
				console.log('query by userId res=>',res)
				if(res.code===0){
					this.updateUserForm = res.data
				}else{
					this.$message.error(res.message)
				}	
				this.updateDialogVisible=true
			},
			handleSubmitUpdateUser(){ //更新用户表单提交
				console.log(this.updateUserForm)
				this.$refs.updateUserFormRef.validate(async (valid) => {
					if(!valid){
						console.log('error submit!!');
						return false;
					}
					const {data: res} = await this.$http.put(`/faculty/update`,this.updateUserForm)
					if(res.code===0){
						this.updateDialogVisible = false
						this.$message.success('更新成功')
						this.queryInfo.pageNum = 1
						this.doSearch()
					}else{
						this.$message.error(res.message)
					}
				})
			},
			deleteUser(userid){
				this.$confirm('确定删除该用户吗?', '提示', {
				          confirmButtonText: '确定',
				          cancelButtonText: '取消',
				          type: 'warning'
				        }).then(async () => { //点击确定时回调
				          
						  const {data: res} = await this.$http.delete(`/faculty/delete/${userid}`)
						  if(res.code===0){
						  	this.$message.success('删除成功')						  
						  	this.doSearch()
						  }else{
						  	this.$message.error(res.message)
						  }
				        }).catch(() => { //点击取消和点击右上角关闭时 回调
						  this.$message.info('已取消删除')
				        });
			}
		}		
	}
</script>

<style>
</style>
