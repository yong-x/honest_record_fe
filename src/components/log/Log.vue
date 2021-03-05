<template>
	<div> 
		<!-- 面包屑导航区 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
		  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
		  <el-breadcrumb-item>日志管理</el-breadcrumb-item>
		  <el-breadcrumb-item>日志列表</el-breadcrumb-item>		  
		</el-breadcrumb>
		<!-- 卡片视图内容区 -->
		<el-card class="box-card">		  		    			
			<!-- 输入框及搜索区域 -->
			<el-row :gutter="20">
				<el-col :span="5">
					<el-input
					v-model="queryInfo.operatoerUserId"
					placeholder="请输入操作员编号"
					clearable>
					</el-input>
				</el-col>
				<el-col :span="5">
					<el-select v-model="queryInfo.operatorName" placeholder="请选择操作类型">
					    <el-option 	label="所有" value="所有"></el-option>
					    <el-option	label="用户登录" value="用户登录"></el-option>
					    <el-option	label="添加廉洁档案" value="添加廉洁档案"></el-option>
					    <el-option	label="更新廉洁档案" value="更新廉洁档案"></el-option>
					    <el-option	label="删除廉洁档案" value="删除廉洁档案"></el-option>
					  </el-select>
				</el-col>
				<el-col :span="6">					
						<el-date-picker
						      v-model="optDateRange"
						      type="daterange"
							  value-format="yyyy-MM-dd HH:mm:ss"
						      range-separator="至"
						      start-placeholder="操作起始日期"
						      end-placeholder="操作截止日期">
						    </el-date-picker>
				</el-col>
				<el-col :span="4">
					<el-button type="primary" round @click="handleSearch">搜索</el-button>
				</el-col>
			</el-row>
			<!-- 表格内容区 -->
			<el-table
			    :data="logList"
			    style="width: 100%"			    
				stripe
				border
			    >
			    <el-table-column
			      type="index"
			      label="序号">
			    </el-table-column>
				
				
				<el-table-column
			      prop="lId"
			      label="日志编号"
			      sortable
			      width="100">
			    </el-table-column>
				<el-table-column
			      prop="operatorName"
			      label="日志操作类型"
			      sortable
			      width="200">
			    </el-table-column>			    
				<el-table-column
				  prop="operatorTime"
				  label="操作时间"
				  sortable
				  width="200">
				</el-table-column>
				<el-table-column
				  prop="operatoerUserId"
				  label="操作用户编号"
				  sortable
				  width="120">
				</el-table-column>
				<el-table-column
				  prop="hostIp"
				  label="操作主机ip地址"
				  sortable
				  width="200">
				</el-table-column>
				
				<el-table-column			      
			      label="操作">
				  <template v-slot="scope">
				  	<el-button v-if="scope.row.operatorName!='用户登录'" type="primary" size="mini" icon="el-icon-edit" @click="clickEdit(scope.row.logType,scope.row.operatorName)"></el-button>				  	
				  	<el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteLog(scope.row.lId)"></el-button>				  	
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
		<!-- 日志详情对话框 -->
		<!-- 修改廉洁档案 -->
		<el-dialog 
		:title="editDialogTitle" 
		:visible.sync="editDialogVisible"
		width="50%"
		center
		@close="resetForm('editFormRef')">
			<el-form :model="editForm" :rules="addAndEditFormRules" ref="editFormRef">
				<el-form-item label="档案编号" :label-width="labelWidth">
					<el-input v-model="editForm.aId" readonly></el-input>
				</el-form-item>
				<el-form-item label="职工号" prop="accusedUserId" :label-width="labelWidth">
					<el-input v-model="editForm.accusedUserId" readonly></el-input>
				</el-form-item>
				<el-form-item label="问题分类" prop="ptId" :label-width="labelWidth">
				  <el-select v-model="editForm.ptId" placeholder="请选则问题分类">			     
					<el-option v-for="problemType in problemTypeList" :key="problemType.ptId" :label="problemType.ptName" :value="problemType.ptId"></el-option>
				  </el-select>
				</el-form-item>
				<el-form-item label="问题领域" prop="pfId" :label-width="labelWidth">
				  <el-select v-model="editForm.pfId" placeholder="请选则问题领域">			     
					<el-option v-for="problemField in problemFieldList" :key="problemField.pfId" :label="problemField.pfName" :value="problemField.pfId"></el-option>
				  </el-select>
				</el-form-item>
				<el-form-item label="举报类型" prop="atId" :label-width="labelWidth">
				  <el-select v-model="editForm.atId" placeholder="请选择举报类型">
				  	<el-option v-for="accuseType in accuseTypeList" :key="accuseType.atId" :label="accuseType.atName" :value="accuseType.atId"></el-option>					    
				  </el-select>
				</el-form-item>
				<el-form-item label="受理人职工号" prop="dealerUserId" :label-width="labelWidth">
					<el-input v-model="editForm.dealerUserId" clearable></el-input>
				</el-form-item>
				<el-form-item label="举报时间" prop="accuseDate" :label-width="labelWidth">
					<el-date-picker v-model.string="editForm.accuseDate" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择举报时间"></el-date-picker>
				</el-form-item>
				<el-form-item label="受理时间" prop="dealDate" :label-width="labelWidth">
					<el-date-picker v-model.string="editForm.dealDate" value-format="yyyy-MM-dd HH:mm:ss" type="datetime"  placeholder="选择受理时间"></el-date-picker>
				</el-form-item>
				<el-form-item label="审核状态" :label-width="labelWidth">
					<el-tooltip :content="editForm.checkState===0?'未审核':'已审核'" placement="right">
						<el-switch
							v-model.number="editForm.checkState"
							active-color="#13ce66"
							inactive-color="#ff4949"					
							:active-value="1"
							:inactive-value="0">
						</el-switch>
					</el-tooltip>
				</el-form-item>
				<el-form-item label="删除状态" :label-width="labelWidth">
					<el-tooltip :content="editForm.deleted===0?'未删除':'已删除'" placement="right">
						<el-switch
							v-model.number="editForm.deleted"
							active-color="#13ce66"
							inactive-color="#ff4949"					
							:active-value="1"
							:inactive-value="0">
						</el-switch>
					</el-tooltip>
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
			var validateUserId = async (rule, value, callback) => {
					console.log('rule=>',rule)			       
					const {data: res} = await this.$http.get(`/faculty/query/${value}`);
			        console.log('res=>',res)	
					if(res.code===0){ 
			   //      	if(res.data!=null){ //该用户存在，验证通过
						// 	if(rule.field=='accusedUserId'){
						// 		this.addForm.accusedUserName = res.data.userName
						// 	}else if(rule.field=='dealerUserId'){
						// 		this.addForm.dealerUserName = res.data.userName
						// 	}
						// 	return callback();
						// }else{
						// 	if(rule.field=='accusedUserId'){
						// 		this.addForm.accusedUserName = null
						// 	}else if(rule.field=='dealerUserId'){
						// 		this.addForm.dealerUserName = null
						// 	}
						// 	return callback(new Error('该用户不存在'));
						// }												
			        }else {
						callback(new Error(res.message));			        	
			        }	
			};
			return {
				queryInfo: { //查询档案信息参数对象
					pageNum: 1,
					pageSize: 5,
					operatoerUserId: '',//操作人编号
					operatorName:'', //操作名称
					optDateStart: '',//操作开始时间
					optDateEnd: '' //操作结束时间
				},
				optDateRange: [],

				problemTypeList:[],//所有问题分类列表
				problemFieldList:[], //所有问题领域列表
				accuseTypeList:[], //所有举报类型列表


				logList:[], //表格内容区日志列表
				total: 0,
				addDialogVisible: false, //添加用户对话框是否显示
				labelWidth: '100px',
				
				editDialogVisible: false ,//更新对话框是否显示
				editDialogTitle: '', //编辑对话框的标题
				editForm: {} ,//编辑表单对象
				addAndEditFormRules: { //添加和编辑表单绑定的验证规则对象
					accusedUserId: [
						{ required: true, message: '请输入用户职工号', trigger: 'blur' },
						{ validator: validateUserId, trigger: 'blur' }
					],
					dealerUserId: [
						{ required: true, message: '请输入受理人职工号', trigger: 'blur' },
						{ validator: validateUserId, trigger: 'blur' }
					],
					ptId: [
						{ required: true, message: '请选择问题分类', trigger: 'change' }
					],
					pfId: [
						{ required: true, message: '请选择问题领域', trigger: 'change' }
					],
					atId: [
						{ required: true, message: '请选择举报类型', trigger: 'change' }
					],
					accuseDate: [
						{ required: true, message: '请选择举报时间', trigger: 'change' }
					],
					dealDate: [
						{ required: true, message: '请选择受理时间', trigger: 'change' }
					]
				}
								
				
			}
		},
		watch: {
			optDateRange(newVal){
				this.queryInfo.optDateStart = newVal[0]
				this.queryInfo.optDateEnd = newVal[1]
			}
		},
		async created() {
			//初始化需要用到的列表对象
			const {data: res1} = await this.$http.get(`/problemType/query`)
			this.problemTypeList = res1.data
			const {data: res2} = await this.$http.get(`/problemField/query`)
			this.problemFieldList = res2.data
			const {data: res3} = await this.$http.get(`/accuseType/query`)
			this.accuseTypeList = res3.data
			
			this.doSearch() //初始化第一页内容
		},
		methods: {
			async doSearch(){
				console.log(this.queryInfo)				
				const {data: res} = await this.$http.get(`/log/query`,{params: this.queryInfo});
				console.log('res=>',res)				
				console.log('res=>',res)
				if(res.code===0){
					this.logList = res.data.logList
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
			async clickEdit(id,operatorName){ //点击编辑按钮时
				console.log(id+' + '+operatorName)
				this.editDialogTitle='所'+operatorName.substr(0,2)+'的廉洁档案信息'
				const {data: res} = await this.$http.get(`/accusation/query/${id}`);
				console.log('query by aId res=>',res)
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
					const {data: res} = await this.$http.put(`/accusation/update`,this.editForm)
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
			deleteLog(id){ //点击删除按钮时
				this.$confirm('确定删除该条日志吗?', '提示', {
				          confirmButtonText: '确定',
				          cancelButtonText: '取消',
				          type: 'warning'
				        }).then(async () => { //点击确定时回调
				          
						  const {data: res} = await this.$http.delete(`/log/delete/${id}`)
						  if(res.code===0){
						  	this.$message.success('删除成功')						  
						  	this.doSearch()
						  }else{
						  	this.$message.error(res.message)
						  }
				        }).catch(() => { //点击取消和点击右上角关闭时 回调
						  this.$message.info('已取消删除')
				});
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
			}
			
		}		
	}
</script>

<style>
</style>
