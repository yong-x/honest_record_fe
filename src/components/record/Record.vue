<template>
	<div>
		<!-- 面包屑导航区 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
		  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
		  <el-breadcrumb-item>系统管理</el-breadcrumb-item>
		  <el-breadcrumb-item>档案列表</el-breadcrumb-item>		  
		</el-breadcrumb>
		<!-- 卡片视图内容区 -->
		<el-card class="box-card">
			<!-- 输入框及搜索、添加区域 -->
			<el-row :gutter="20">
				<el-col :span="4">
					<el-input
					v-model="queryInfo.accusedUserId"
					placeholder="被举报人职工号"
					clearable>
					</el-input>
				</el-col>
				<el-col :span="4">
					<el-input
					v-model="queryInfo.dealerUserId"
					placeholder="受理人职工号"
					clearable>
					</el-input>
				</el-col>
				<el-col :span="4">
					<el-select v-model="queryInfo.ptId" placeholder="请选择问题分类">
					    <el-option 	label="所有" value="-1"></el-option>
						<el-option v-for="problemType in problemTypeList" :key="problemType.ptId" :label="problemType.ptName" :value="problemType.ptId"></el-option>					    
					</el-select>
				</el-col>
				<el-col :span="4">
					<el-select v-model="queryInfo.pfId" placeholder="请选择问题领域">
					    <el-option 	label="所有" value="-1"></el-option>
						<el-option v-for="problemField in problemFieldList" :key="problemField.pfId" :label="problemField.pfName" :value="problemField.pfId"></el-option>					    
					</el-select>					
				</el-col>
				<el-col :span="4">
					<el-select v-model="queryInfo.atId" placeholder="请选择举报类型">
					    <el-option 	label="所有" value="-1"></el-option>
						<el-option v-for="accuseType in accuseTypeList" :key="accuseType.atId" :label="accuseType.atName" :value="accuseType.atId"></el-option>					    
					</el-select>					
				</el-col>
				<el-col :span="4">
					<el-select v-model="queryInfo.checkState" placeholder="请选择审核状态">
					    <el-option 	label="所有" value="-1"></el-option>
					    <el-option	label="未审核" value="0"></el-option>
					    <el-option	label="已审核" value="1"></el-option>
					  </el-select>					
				</el-col>
			</el-row>
			<el-row :gutter="10">
				<el-col :span="6">
					<el-date-picker
					      v-model="accuseDateRange"
					      type="daterange"
					      range-separator="至"
					      start-placeholder="举报起始日期"
					      end-placeholder="举报截止日期">
					    </el-date-picker>
				</el-col>
				<el-col :span="6">
					<el-date-picker
					      v-model="dealDateRange"						  
					      type="daterange"
					      range-separator="至"
					      start-placeholder="受理起始日期"
					      end-placeholder="受理截止日期">
					    </el-date-picker>
				</el-col>
					
				<el-col :span="5">
					<el-button type="warning" round @click="">重置</el-button>
					<el-button type="primary" round @click="handleSearch">搜索</el-button>
					<el-button type="success" round @click="addDialogVisible=true">添加</el-button>
				</el-col>
			</el-row>
			<!-- 表格内容区 -->
			<el-table
			    :data="accusationList"
			    style="width: 100%"
				stripe
				border
			    >
				<el-table-column
			      prop="aId"
			      label="档案编号"
			      sortable
			      width="100">
			    </el-table-column>
				<el-table-column
			      prop="accusedUserId"
			      label="被举报人工号"
			      sortable
			      width="120">
			    </el-table-column>
				<el-table-column
			      prop="faculty.userName"
			      label="被举报人姓名"
			      sortable
			      width="120">
			    </el-table-column>
				<el-table-column
			      prop="problemType.ptName"
			      label="问题分类"
			      width="120">
			    </el-table-column>
				<el-table-column
			      prop="problemField.pfName"
			      label="问题领域"
			      width="120">
			    </el-table-column>
				<el-table-column
				  prop="accuseType.atName"
				  label="举报类型"
				  width="120">
				</el-table-column>
				<el-table-column
				  prop="dealerFaculty.userId"
				  label="受理人工号"
				  width="100">
				</el-table-column>
				<el-table-column
				  prop="dealerFaculty.userName"
				  label="受理人姓名"
				  width="100">
				</el-table-column>
				<el-table-column
				  prop="accuseDate"
				  label="举报时间"
				  sortable
				  width="150">
				</el-table-column>
				<el-table-column
				  prop="dealDate"
				  label="受理时间"
				  sortable
				  width="150">
				</el-table-column>
				<el-table-column
				    prop="checkState"
				    label="审核状态"
					width="100">
				    <template v-slot="scope">
				  	  <el-tag :type="scope.row.checkState==1?'success':'warning'">{{scope.row.checkState==1?'已审核':'未审核'}}</el-tag>
				    </template>
				</el-table-column>
				<el-table-column
				    label="操作">
				    <template v-slot="scope">
				    	<el-button type="primary" size="mini" icon="el-icon-edit" @click="clickEdit(scope.row.dId)"></el-button>				  	
				    	<el-button type="danger" size="mini" icon="el-icon-delete" @click="clickDelete(scope.row.dId)"></el-button>				  	
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
		
		
	</div>
	
</template>

<script>
	export default {
		data(){
			return {
				queryInfo: {
					pageNum: 1,
					pageSize: 4,
					accusedUserId: '',//被举报人职工号
					dealerUserId: '',//档案受理人职工号
					ptId: '',//问题分类
					pfId: '' ,//问题领域
					atId: '',//举报类型
					checkState: '',//审核状态
					accuseDateStart: '',
					accuseDateEnd: '',
					dealDateStart: '',
					dealDateEnd: ''
				},
				accuseDateRange:'' ,//举报时间范围
				dealDateRange:'',//受理时间范围
				
				problemTypeList:[],//所有问题分类列表
				problemFieldList:[], //所有问题领域列表
				accuseTypeList:[], //所有举报类型列表

				accusationList:[], //当前显示的内容列表
				
				total: 0, //全部查询总条数
				labelWidth: '150px',
				addDialogVisible: false, //添加对话框是否显示
				addForm: {},	//添加表单对象			
				addAndEditFormRules: { //添加和编辑表单绑定的验证规则对象
					dName: [
						{ required: true, message: '请输入部门名称', trigger: 'blur' }
					]
				},
				editDialogVisible: false ,//更新对话框是否显示
				editForm: {} //编辑表单对象
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
			
			this.doSearch() //初始化第一页内容列表
		},
		
		methods:{
			async doSearch(){
				console.log(this.queryInfo)				
				const {data: res} = await this.$http.get(`/accusation/query`,{params: this.queryInfo});
				console.log('res=>',res)
				if(res.code===0){
					this.accusationList = res.data.accusationList
					this.total = res.data.total
				}else{
					this.$message.error(res.message)
				}
			},
			DateFormat(date){ //格式化时间为字符串
				var y = date.getFullYear();
				    var M = date.getMonth() + 1;
				    var d = date.getDate();
				    var H = date.getHours();
				    var m = date.getMinutes();
				    var s = date.getSeconds();
				    return y + '-' + (M < 10 ? ('0' + M) : M) + '-' + (d < 10 ? ('0' + d) : d) + " " + (H < 10 ? ('0' + H) : H) + ":" + (m < 10 ? ('0' + m) : m) + ":" + (s < 10 ? ('0' + s) : s);
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
					var {data: res} = await this.$http.post('/department/add',this.addForm)
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
				const {data: res} = await this.$http.get(`/department/query/${id}`);
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
					const {data: res} = await this.$http.put(`/department/update`,this.editForm)
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
				this.$confirm('确定删除该部门吗?', '提示', {
				          confirmButtonText: '确定',
				          cancelButtonText: '取消',
				          type: 'warning'
				        }).then(async () => { //点击确定时回调
				          
						  const {data: res} = await this.$http.delete(`/department/delete/${id}`)
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
		},
		watch: {
			accuseDateRange(newVal){
				this.queryInfo.accuseDateStart = this.DateFormat(newVal[0])
				this.queryInfo.accuseDateEnd = this.DateFormat(newVal[1])
			},
			dealDateRange(newVal){
				this.queryInfo.dealDateStart = this.DateFormat(newVal[0])
				this.queryInfo.dealDateEnd = this.DateFormat(newVal[1])
			}
		}
	}
</script>

<style lang="less" scoped>
	.el-row {
		margin-bottom: 5px !important;
	}
</style>
