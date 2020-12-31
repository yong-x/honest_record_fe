<template>
	<div>
		<!-- 面包屑导航区 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
		  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
		  <el-breadcrumb-item>系统管理</el-breadcrumb-item>
		  <el-breadcrumb-item>问题分类</el-breadcrumb-item>		  
		</el-breadcrumb>
		<!-- 卡片视图内容区 -->
		<el-card class="box-card">
			<!-- 输入框及搜索、添加区域 -->
			<el-row :gutter="20">
				<el-col :span="5">
					<el-input
					v-model="queryInfo.ptName"
					placeholder="请输入问题分类名称"
					clearable>
					</el-input>
				</el-col>
				<el-col :span="4">
					<el-button type="primary" round @click="handleSearch">搜索</el-button>
					<el-button type="success" round @click="addDialogVisible=true">添加</el-button>
				</el-col>
			</el-row>
			<!-- 表格内容区 -->
			<el-table
			    :data="problemTypeList"
			    style="width: 100%"
				stripe
				border
			    >
			    <el-table-column
			      type="index"
			      label="序号">
			    </el-table-column>
				<el-table-column
			      prop="ptId"
			      label="问题分类编号"
			      sortable
			      width="120">
			    </el-table-column>
				<el-table-column
			      prop="ptName"
			      label="问题分类名称"
			      sortable
			      width="120">
			    </el-table-column>
				<el-table-column
				  prop="createTime"
				  label="创建时间"
				  sortable
				  width="240">
				</el-table-column>
				<el-table-column
				  prop="updateTime"
				  label="修改时间"
				  sortable
				  width="240">
				  </el-table-column>
				  <el-table-column
				    label="操作">
				    <template v-slot="scope">
				    	<el-button type="primary" size="mini" icon="el-icon-edit" @click="clickEdit(scope.row.ptId)"></el-button>				  	
				    	<el-button type="danger" size="mini" icon="el-icon-delete" @click="clickDelete(scope.row.ptId)"></el-button>				  	
				    </template>
				  </el-table-column>
			</el-table>
			<!-- 分页区 -->
			<el-pagination
			      @size-change="handleSizeChange"
			      @current-change="handleCurrentChange"
			      :current-page="queryInfo.pageNum"
			      :page-size="queryInfo.pageSize"
			      layout="total, prev, pager, next, jumper"
			      :total="total">
			</el-pagination>
		</el-card>
		<!-- 添加对话框 -->
		<el-dialog 
		title="添加问题分类" 
		:visible.sync="addDialogVisible"
		width="50%"
		center
		@close="resetForm('addFormRef')">
			<el-form :model="addForm" :rules="addAndEditFormRules" ref="addFormRef">
				<el-form-item label="问题分类名称" prop="ptName" :label-width="labelWidth">
					<el-input v-model="addForm.ptName" clearable></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
			  <el-button @click="addDialogVisible = false">取 消</el-button>
			  <el-button type="primary" @click="handleSubmitAdd">确 定</el-button>
			</div>
		</el-dialog>
		<!-- 编辑对话框 -->
		<el-dialog 
		title="修改问题分类信息" 
		:visible.sync="editDialogVisible"
		width="50%"
		center
		@close="resetForm('editFormRef')">
			<el-form :model="editForm" :rules="addAndEditFormRules" ref="editFormRef">
				<el-form-item label="问题分类名称" prop="ptName" :label-width="labelWidth">
					<el-input v-model="editForm.ptName" clearable></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
			  <el-button @click="editDialogVisible = false">取 消</el-button>
			  <el-button type="primary" @click="handleSubmitEdit">确 定</el-button>
			</div>
		</el-dialog>
	</div>
	
</template>

<script>
	export default {
		data(){
			return {
				queryInfo: {
					pageNum: 1,
					pageSize: 4,
					ptName: ''
				},
				problemTypeList:[], //当前显示的内容列表
				total: 0, //全部查询总条数
				labelWidth: '150px',
				addDialogVisible: false, //添加对话框是否显示
				addForm: {},	//添加表单对象			
				addAndEditFormRules: { //添加和编辑表单绑定的验证规则对象
					ptName: [
						{ required: true, message: '请输入问题分类名称', trigger: 'blur' }
					]
				},
				editDialogVisible: false ,//更新对话框是否显示
				editForm: {} //编辑表单对象
			}
		},
		created() {
			this.doSearch()
		},
		methods:{
			async doSearch(){
				console.log(this.queryInfo)				
				const {data: res} = await this.$http.get(`/problemType/query`,{params: this.queryInfo});
				console.log('res=>',res)
				if(res.code===0){
					this.problemTypeList = res.data.problemTypeList
					this.total = res.data.total
				}else{
					this.$message.error(res.message)
				}				
			},
			resetForm(formRef) { //重置表单
			        this.$refs[formRef].resetFields();
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
			handleSearch(){ //点击查询时
				this.queryInfo.pageSize = 4
				this.queryInfo.pageNum = 1
				this.doSearch()
			},
			handleSubmitAdd(){ //添加表单点击确定时
				this.$refs.addFormRef.validate(async valid=>{
					if(!valid) return console.log('error commit!')
					var {data: res} = await this.$http.post('/problemType/add',this.addForm)
					console.log(res)
					if(res.code!==0){ //服务器返回错误信息
						this.$message.error(res.message)
						return
					}else{
						this.addDialogVisible = false
						this.$message.success('添加成功')
						this.queryInfo.pageNum = 1
						this.doSearch()
					}
				})
			},
			async clickEdit(id){ //点击编辑按钮时
				const {data: res} = await this.$http.get(`/problemType/query/${id}`);
				console.log('query by userId res=>',res)
				if(res.code===0){
					this.editForm = res.data
				}else{
					this.$message.error(res.message)
				}
				this.editDialogVisible = true
			},
			handleSubmitEdit(){ //编辑表单点击确定时
				this.$refs.editFormRef.validate(async valid=>{
					if(!valid) return console.log('error commit!')
					const {data: res} = await this.$http.put(`/problemType/update`,this.editForm)
					if(res.code===0){
						this.editDialogVisible = false
						this.$message.success('更新成功')
						this.queryInfo.pageNum = 1
						this.doSearch()
					}else{
						this.$message.error(res.message)
					}
				})
			},
			clickDelete(id){ //点击删除按钮时
				this.$confirm('确定删除该问题分类吗?', '提示', {
				          confirmButtonText: '确定',
				          cancelButtonText: '取消',
				          type: 'warning'
				        }).then(async () => { //点击确定时回调
				          
						  const {data: res} = await this.$http.delete(`/problemType/delete/${id}`)
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
