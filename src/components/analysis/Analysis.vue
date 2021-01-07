<template>
	<div>
		<!-- 面包屑导航区 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
		  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
		  <el-breadcrumb-item>案件统计</el-breadcrumb-item>
		  <el-breadcrumb-item>档案分析</el-breadcrumb-item>		  
		</el-breadcrumb>
		<el-select v-model="dateRange" placeholder="请选择统计时间" @change="timeChange">
			<el-option  label="近1个月" value="onemonth" ></el-option>
			<el-option  label="近1年" value="oneyear"></el-option>
			<el-option  label="近5年" value="fiveyears"></el-option>
		</el-select>
		<el-button style="margin-left: 15px;" type="primary" round @click="handleAnalysisReport">生成分析报告</el-button>
		<a id="download" style="display: none;" class='download' href='http://localhost:8088/analysis/download' title="分析报告下载"></a>

		
		<el-row class="chartContent">
			<el-col :span="12">
				<div id="myChart" style="width: 800px;height:600px;"></div>
			</el-col>
			<el-col :span="12">
				<el-row>
					<el-col :span="12">
						<div id="ptChart" style="width: 400px;height:400px;"></div>
					</el-col>
					<el-col :span="12">
						<div id="pfChart" style="width: 400px;height:400px;"></div>
					</el-col>
				</el-row>
				<el-row>
					<el-col :offset="6" :span="12">
						<div id="atChart" style="width: 400px;height:400px;"></div>
					</el-col>
				</el-row>
			</el-col>
		</el-row>
		
		
		
	</div>
</template>

<script>
	
	import * as echarts from 'echarts'
	export default {
		
		data(){
			
			return {
				myChart: {}, //总数趋势图
				ptChart: {}, //问题类型饼图
				pfChart: {}, //问题领域饼图
				atChart: {}, //举报类型饼图
				
				myChartOption: {},
				ptChartOption: {},
				pfChartOption: {},
				atChartOption: {},
				
				dateRange:'onemonth',
				pieRadius: 80 //饼图半径大小
			}
		},
		methods: {
			async timeChange(){
				//1、请求折线图数据
				const {data: res} = await this.$http.get(`/analysis/lineChart?dateRange=${this.dateRange}`);
				console.log(res)
				this.myChartOption.series[0].data =res.data.seriesData
				this.myChartOption.xAxis.data = res.data.xAxis
				this.myChart.setOption(this.myChartOption); //设置数据
	
				//2、请求饼图数据
				const {data: res1} = await this.$http.get(`/analysis/pieChart?dateRange=${this.dateRange}`);
				console.log(res1)				
				this.ptChartOption.series[0].data =res1.data.ptChartData				
				this.ptChart.setOption(this.ptChartOption);//设置数据
				this.pfChartOption.series[0].data =res1.data.pfChartData				
				this.pfChart.setOption(this.pfChartOption);//设置数据
				this.atChartOption.series[0].data =res1.data.atChartData				
				this.atChart.setOption(this.atChartOption);//设置数据
			},
			async handleAnalysisReport(){
				//console.log("this.myChart=>",this.ReportObject.content)
				const res = await this.$http.post(`/analysis/report`,this.ReportObject);
																			
				if(res.data.code!==0){ //服务器返回错误信息
					return this.$message.error('生成失败')
				}else{
					document.getElementById("download").click()
				}
			}
			
		},
		computed:{
			ReportObject(){ //要生成报告的 对象
				
				let reportObject={
					title: '',  //生成文档的标题
					content: '', //生成文档内容主体
					lineImg: this.myChart.getDataURL(), //折线图 base64编码字符串
					ptChartImg: this.ptChart.getDataURL(), //ptChart 饼图base64编码字符串
					pfChartImg: this.pfChart.getDataURL(), //pfChart 饼图base64编码字符串
					atChartImg: this.atChart.getDataURL() //atChart 饼图base64编码字符串
				}
				
				//标题
				reportObject.title=(this.dateRange=='onemonth'?'近一个月':(this.dateRange=='oneyear'?'近一年':'近5年')) +'廉洁问题案件分析报告'
				
				
				
				//1、折线图数据描述内容
				let Xdate = this.myChartOption.xAxis.data
				let Ydate = this.myChartOption.series[0].data
				reportObject.content = this.dateRange=='onemonth'?'近一个月以来，':(this.dateRange=='oneyear'?'近一年以来，':'近5年以来，')
				let sum=0
				Ydate.forEach(e=>sum+=e)
				reportObject.content+='发生的有关廉洁问题案件总数为'+sum+'起。'
				reportObject.content+=Xdate[0]+'的案件数量为'+Ydate[0]+'起，'
				reportObject.content+=Xdate[parseInt(Xdate.length/2)]+'的案件数量为'+Ydate[parseInt(Xdate.length/2)]+'起，'
				reportObject.content+=Xdate[Xdate.length-1]+'的案件数量为'+Ydate[Xdate.length-1]+'起。'
				let maxIndex = Ydate.findIndex(e=>e==Math.max(...Ydate))
				let minIndex = Ydate.findIndex(e=>e==Math.min(...Ydate))
				reportObject.content+='案件数量最大值出现的时间是'+Xdate[maxIndex]+'，案件数量为'+Ydate[maxIndex]+'起，'
				reportObject.content+='案件数量最小值出现的时间是'+Xdate[minIndex]+'，案件数量为'+Ydate[minIndex]+'起。具体案件总数趋势如图一所示。'	
				//2、ptChart饼图数据描述内容
				let ptChartData = this.ptChartOption.series[0].data
				//console.log('ptChartData=>',ptChartData)
				let count=0
				let temArr = ptChartData.map(e=>e.value)
				maxIndex = temArr.findIndex(e=>e==Math.max(...temArr))
				reportObject.content+='从所涉及的问题类型上看，出现问题类型最多的是'+ptChartData[maxIndex].name+'，案件数量共有'+ptChartData[maxIndex].value+'起。'
				reportObject.content+='这一问题类型需要加强管理。具体各个问题类型占比如图二所示。'
				//3、pfChart饼图数据描述内容
				let pfChartData = this.pfChartOption.series[0].data				
				count=0
				temArr = pfChartData.map(e=>e.value)
				maxIndex = temArr.findIndex(e=>e==Math.max(...temArr))
				reportObject.content+='从所涉及的问题领域上看，出现最多问题的邻域是'+pfChartData[maxIndex].name+'，案件数量共有'+pfChartData[maxIndex].value+'起。'
				reportObject.content+='这一问题领域需要加强监督。具体各个问题领域占比如图三所示。'
				//3、atChart饼图数据描述内容
				let atChartData = this.atChartOption.series[0].data				
				count=0
				temArr = atChartData.map(e=>e.value)
				maxIndex = temArr.findIndex(e=>e==Math.max(...temArr))
				reportObject.content+='从所涉及的举报类型上看，出现最多举报类型的是'+atChartData[maxIndex].name+'，案件数量共有'+atChartData[maxIndex].value+'起。'
				reportObject.content+='这一举报类型在所有举报类型中影响最大。具体各个举报类型占比如图四所示。'
				
				
				
				return reportObject
			}
		},
		//必须在mounted生命周期中创建图表，因为此时所有dom节点已经创建和渲染完毕
		async mounted() {
			this.myChart = echarts.init(document.getElementById('myChart'));
			this.ptChart = echarts.init(document.getElementById('ptChart'));
			this.pfChart = echarts.init(document.getElementById('pfChart'));
			this.atChart = echarts.init(document.getElementById('atChart'));
			
			this.myChartOption = {
			    title: {
			        text: '举报总数趋势图'
			    },
			    tooltip: {},
			    legend: {
			        data:['举报总数']
			    },
			    xAxis: {
			        data: []
			    },
			    yAxis: {},
			    series: [{
					name: '举报总数',
					type: 'line',
					data:[]
				}]
			};
			this.ptChartOption = {
			    title: {
			        text: '问题类型占比图'
			    },
			    tooltip: {},			    
			    series: [{
					name: '问题类型',
					type: 'pie',
					radius: this.pieRadius,
					data:[
						{name: 'xx',value: 10},
						{name: 'yy',value: 20},
						{name: 'zz',value: 30}
					]
				}]
			};
			this.pfChartOption = {
			    title: {
			        text: '问题领域占比图'
			    },
			    tooltip: {},			    
			    series: [{
					name: '问题领域',
					type: 'pie',
					radius: this.pieRadius,
					data:[
						{name: 'xx',value: 10},
						{name: 'yy',value: 20},
						{name: 'zz',value: 30}
					]
				}]
			};
			this.atChartOption = {
			    title: {
			        text: '举报类型占比图'
			    },
			    tooltip: {},			    
			    series: [{
					name: '举报类型',
					type: 'pie',
					radius: this.pieRadius,
					data:[
						{name: 'xx',value: 10},
						{name: 'yy',value: 20},
						{name: 'zz',value: 30}
					]
				}]
			};
			
			this.timeChange()
		},
		//不能在created生命周期创建图表，因为此时创建虚拟dom，真实节点还没有创建和渲染完毕
		created() {
			
		}
	}
</script>

<style lang="less" scoped>
	.chartContent {
		margin-top: 20px;
	}
</style>
