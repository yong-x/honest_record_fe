<template>
	<div>
		<!-- 面包屑导航区 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
		  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
		  <el-breadcrumb-item>权限管理</el-breadcrumb-item>
		  <el-breadcrumb-item>权限列表</el-breadcrumb-item>
		</el-breadcrumb>
		<!-- 卡片视图内容区 -->
		<el-card class="box-card">
			<!-- 输入框及搜索、添加区域 -->
			<el-row :gutter="20">
				<el-col :span="5">
					<el-input
					v-model="queryInfo.pName"
					placeholder="请输入权限名称"
					clearable>
					</el-input>
				</el-col>
				<el-col :span="4">
					<el-button type="primary" round @click="handleSearch">搜索</el-button>
				</el-col>
			</el-row>
			<!-- 表格内容区 -->
			<el-table
			    :data="powerList"
			    style="width: 100%"
			    :default-sort = "{prop: 'pId', order: 'asccending'}"
				stripe
				border
			    >
			    <el-table-column
			      type="index"
			      label="序号">
			    </el-table-column>
				<el-table-column
			      prop="pId"
			      label="权限编号"
			      sortable
			      width="120">
			    </el-table-column>
				<el-table-column
			      prop="pName"
			      label="权限名称"
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
				    label="权限等级"
				    width="240">
						<template v-slot="scope">
							<el-tag :type="scope.row.ppId!=null?'success':'warning'">{{scope.row.ppId!=null?'二级':'一级'}}</el-tag>
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
					pageSize: 8,
					pName: ''
				},
				powerList:[],
				total: 0
			}
		},
		created() {
			this.doSearch()
		},
		methods:{
			async doSearch(){
				console.log(this.queryInfo)				
				const {data: res} = await this.$http.get(`/power/query`,{params: this.queryInfo});
				console.log('res=>',res)
				if(res.code===0){
					this.powerList = res.data.powerList
					this.total = res.data.total
				}else{
					this.$message.error(res.message)
				}				
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
				this.queryInfo.pageSize = 8
				this.queryInfo.pageNum = 1
				this.doSearch()
			}
		}
	}
</script>

<style>
</style>
