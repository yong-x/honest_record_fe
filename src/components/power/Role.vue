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
			<!-- 添加区域 -->
			<!-- 权限验证组件，只有具有某个actionPath 的角色用户才显示其子组件 -->
			<Authorized :actionPath="['/role/add']">
				<el-row>
					<el-col>
						<el-button type="success" round @click="addRoleDialogVisible = true">添加角色</el-button>
					</el-col>
				</el-row>
			</Authorized>

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
						<el-row  v-for="(power,index) in props.row.powerList" :key="power.pId" :class="[index===0?'border-top':'','border-bottom']">
							<el-col :span="4" :class="['border-right','vcenter']">
								<el-tag type="success">{{power.pName}}</el-tag>
								<i class="el-icon-caret-right"></i>							
							</el-col>
							<el-col :span="4" v-for="(cpower,cindex) in power.children" :key="cpower.pId">
								<el-tag type="warning">{{cpower.pName}}</el-tag>
							</el-col>
						</el-row>
						<!-- <pre>{{props.row.powerList}}</pre> -->
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
				  prop="rName"
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
					<!-- <el-button type="primary" size="mini" icon="el-icon-edit">编辑</el-button> -->				  	
					<el-button type="primary" size="mini" icon="el-icon-setting" @click="updateRolePower(scope.row.rId,scope.row.powerList)">修改角色权限</el-button>
					<el-button type="danger"  size="mini" icon="el-icon-delete" :disabled="scope.row.rId<=3?true:false" @click="deleteRole(scope.row.rId)">删除角色</el-button>
				  </template>
				</el-table-column>
			</el-table>
		</el-card>
		<!-- 修改角色权限对话框 -->
		<el-dialog
		title="分配角色权限" 
		:visible.sync="setRolePowerDialogVisible"
		width="50%"
		center
		@close="">
			<el-tree
			  :data="powerList"
			  show-checkbox
			  default-expand-all
			  node-key="pId"
			  ref="treeRef"
			  highlight-current
			  :props="treeProps"
			  :default-checked-keys="checkedKeys">
			</el-tree>
			<div slot="footer" class="dialog-footer">
			<el-button @click="setRolePowerDialogVisible = false">取 消</el-button>
			<el-button type="primary" @click="handleSubmitUpdateRolePower()">确 定</el-button>
			</div>
		</el-dialog>
		<!-- 添加角色对话框 -->
		<el-dialog
		title="添加角色" 
		:visible.sync="addRoleDialogVisible"
		width="50%"
		center
		@close="resetForm('addRoleFormRef')">
			
			<el-form :model="addRoleForm" :rules="addRoleFormRules" ref="addRoleFormRef">
			  <el-form-item label="角色名称" prop="rName" label-width="100px">
			    <el-input v-model="addRoleForm.rName" clearable></el-input>
			  </el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="addRoleDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="handleSubmitAddRole">确 定</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		data(){
			return {
				roleList:[], //当前内容区所有角色列表
				setRolePowerDialogVisible: false, //修改角色权限对话框可见性
				powerList: [],//树形控件中完整权限列表
				treeProps: { //树形组件绑定属性
					children: 'children',
					label: 'pName'
				},
				checkedKeys: [], //树形组件中默认选中的权限列表的key
				editingRid: '', //树形控件中正在被编辑权限的角色的id
				addRoleDialogVisible: false, //添加角色对话框可见性
				addRoleForm: {
					rName: ''
				},
				addRoleFormRules: {
					rName: [
					    { required: true, message: '请输入角色名称', trigger: 'blur' }
					]
				}
			}
		},
		created() {
			
			this.doSearch()
			console.log(this)
		},
		methods: {
			isShow(){
				
				return true
			},
			
			async doSearch(){
				const {data: res} = await this.$http.get(`/role/query`);
				console.log('res=>',res)
				
				if(res.code===0){
					this.roleList = res.data
				}else{
					this.$message.error(res.message)
				}
			},
			async updateRolePower(rid,powerlist){ //点击修改角色权限按钮时				
				const {data: res} = await this.$http.get(`/power/query/all`);
				console.log('res=>',res)
				this.editingRid = rid
				if(res.code===0){
					this.powerList = res.data
				}else{
					this.$message.error(res.message)
				}
				this.checkedKeys = this.getCheckedKeys(powerlist)
				this.setRolePowerDialogVisible = true
			},
			getCheckedKeys(powerlist){ //获取所有二级权限的pId
				let defkeys = []
				powerlist.forEach(parentpower=>{
					parentpower.children.forEach(power=>{
						defkeys.push(power.pId)
					})
				})
				return defkeys
			},
			async handleSubmitUpdateRolePower(){ //树形控件提交更新角色权限时
				//获取当前被选中的二级权限的 pId 列表
				let keys = this.$refs.treeRef.getCheckedKeys();
				let rid = this.editingRid
				const {data: res} = await this.$http.put(`/rolePower/update/${rid}`,keys)
				if(res.code===0){
					this.setRolePowerDialogVisible = false
					//this.$message.success('更新成功')
					//this.queryInfo.pageNum = 1
					this.doSearch()
				}else{
					this.$message.error(res.message)
				}
			},
			resetForm(formRef) { //重置表单
			        this.$refs[formRef].resetFields();
			},
			handleSubmitAddRole(){ //添加角色表单提交时
				this.$refs.addRoleFormRef.validate( async valid=>{
					if(!valid){
						console.log('error submit!!');
						return false;
					}
					var {data: res} = await this.$http.post('/role/add',this.addRoleForm)					
					console.log(res)					
					if(res.code!==0){ //服务器返回错误信息
						this.$message.error(res.message)
						return
					}else{						
						this.addRoleDialogVisible = false
						this.$message.success('添加角色成功，可以分配权限了')						
						this.doSearch()
					}
				})
			},
			deleteRole(rid){ //点击删除角色时
				this.$confirm('确定删除该角色吗?', '提示', {
					          confirmButtonText: '确定',
					          cancelButtonText: '取消',
					          type: 'warning'
					        }).then(async () => { //点击确定时回调
					          
							  const {data: res} = await this.$http.delete(`/role/delete/${rid}`)
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

<style lang="less" scoped>
	.el-tag {
		margin: 8px;
	}
	.border-top {
		border-top: 1px solid gray;
	}
	.border-bottom {
		border-bottom: 1px solid gray;
	}
	.border-right {
		border-right: 1px solid gray;
	}
	.vcenter { //水平和垂直居中对齐
		display: flex;
		justify-content: center;
		align-items: center;
	}
	
</style>
