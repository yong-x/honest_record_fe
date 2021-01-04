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
