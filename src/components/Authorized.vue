<template >
	<!-- 本组件仅仅用来进行权限验证，验证通过则显示子组件，验证不通过则不显示 -->
	<div>
		<slot v-if="isShow"></slot>	
	</div>

</template>

<script>
	export default {
	  props: {
	    actionPath: { //显示当前组件所需要的权限数组
	      type: Array, 
	      required: true
	    }
	  },
	  computed: {
		  isShow(){ //根据用户是否具有显示该组件的权限，决定是否显示该组件
			//return this.authority.length>0?true:false
			const actionPaths = window.sessionStorage.getItem('actionPaths').split(',')
			return actionPaths.some(item => this.actionPath.includes(item))>0?true:false;//当前拥有的权限 是 显示当前组件所需要权限 的父集
		  }
	  }
	};
</script>

<style>
</style>
